const TelegramBot = require('node-telegram-bot-api');
const { spawn } = require('child_process');
const path = require('path');
const https = require('https');
const fs = require('fs');
const crypto = require('crypto');

const SUPABASE_URL = 'https://fwkgxhgovwyuxwbjevmg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3a2d4aGdvdnd5dXh3Ympldm1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5ODc4MjEsImV4cCI6MjA2NTU2MzgyMX0.W4wJ_LndkkYAnobnu2pThsQEWUfj6vl4-8AdaVYocZw';

async function insertEvidence(evidence) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/evidences`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(evidence)
  });
  if (!res.ok) {
    throw new Error(`Failed to insert evidence: ${res.status} ${await res.text()}`);
  }
  return await res.json();
}

// replace the value below with the Telegram token you receive from @BotFather
const token = '8012154849:AAGazym-JNiaA_ebQ3vK0LsNQccZJpsoP0Q';

// Path to the compiled Rust prover executable
// Adjust this path if your project structure or target directory is different.
const proverExecutablePath = path.resolve(__dirname, 'tlsn', 'target', 'release', 'examples', 'attestation_prove');
const presenterExecutablePath = path.resolve(__dirname, 'tlsn', 'target', 'release', 'examples', 'attestation_present');

// Create a bot that uses 'polling' to fetch new updates
// Proxy configuration removed as we are calling the prover directly.
const bot = new TelegramBot(token, { polling: false });

// Variable to keep track of the last processed update_id for getUpdates polling
let updateOffset = 0;

// Function to make direct HTTPS calls to Telegram API
async function fetchDirectly(methodName, httpMethod = 'GET', params = {}) {
    return new Promise((resolve, reject) => {
        let urlPath = `/bot${token}/${methodName}`;
        const options = {
            hostname: 'api.telegram.org',
            port: 443,
            path: urlPath,
            method: httpMethod,
            headers: {}
        };

        let postData = '';
        if (httpMethod === 'POST' && Object.keys(params).length > 0) {
            postData = JSON.stringify(params);
            options.headers['Content-Type'] = 'application/json';
            options.headers['Content-Length'] = Buffer.byteLength(postData);
        } else if (httpMethod === 'GET' && Object.keys(params).length > 0) {
            const queryParams = new URLSearchParams(params).toString();
            options.path += `?${queryParams}`;
        }

        console.log(`Direct API call: ${httpMethod} https://${options.hostname}${options.path}`);

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    if (jsonData.ok) {
                        resolve(jsonData);
                    } else {
                        console.error(`Error in direct API call to ${methodName}:`, jsonData);
                        reject(new Error(jsonData.description || `API call to ${methodName} failed with status ${res.statusCode}`));
                    }
                } catch (e) {
                    console.error(`Failed to parse JSON from direct API call to ${methodName}:`, e.message, "Data:", data);
                    reject(new Error(`Failed to parse JSON from ${methodName}: ${e.message}`));
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Problem with direct API request to ${methodName}:`, e.message);
            reject(e);
        });

        if (httpMethod === 'POST' && postData) {
            req.write(postData);
        }
        req.end();
    });
}

// Function to invoke the Rust presenter to generate a presentation
async function invokePresenter(attestationPath, secretsPath, presentationOutputPath) {
    const presenterArgs = [
        '--attestation-path', attestationPath,
        '--secrets-path', secretsPath,
        '--output-path', presentationOutputPath
    ];

    console.log(`Invoking presenter: ${presenterExecutablePath} ${presenterArgs.join(' ')}`);

    return new Promise((resolve, reject) => {
        const presenterProcess = spawn(presenterExecutablePath, presenterArgs, {
            env: { ...process.env } // Presenter might not need special env vars like prover
        });

        let stdoutData = '';
        let stderrData = '';

        presenterProcess.stdout.on('data', (data) => {
            stdoutData += data.toString();
        });

        presenterProcess.stderr.on('data', (data) => {
            stderrData += data.toString();
        });

        presenterProcess.on('close', (code) => {
            console.log(`Presenter STDOUT for ${attestationPath}:\n${stdoutData}`);
            console.log(`Presenter STDERR for ${attestationPath}:\n${stderrData}`);
            if (code === 0) {
                console.log(`Presentation generated successfully: ${presentationOutputPath}`);
                resolve(presentationOutputPath);
            } else {
                console.error(`Presenter process for ${attestationPath} exited with code ${code}`);
                reject(new Error(`Presenter process exited with code ${code}. STDERR: ${stderrData}`));
            }
        });

        presenterProcess.on('error', (err) => {
            console.error('Failed to start presenter process:', err);
            reject(err);
        });
    });
}

// Function to invoke the Rust prover for a given Telegram API method and parameters
async function invokeTelegramProver(methodName, httpMethod = 'GET', params = {}, outputPrefix = null) {
    const targetUri = `https://api.telegram.org/bot${token}/${methodName}`;
    const requestBody = (httpMethod === 'POST' && Object.keys(params).length > 0) ? JSON.stringify(params) : '';
    const headers = [];
    if (httpMethod === 'POST' && requestBody) {
        headers.push('Content-Type: application/json');
    }

    const proverArgs = [
        '--target-uri', targetUri,
        '--http-method', httpMethod,
    ];
    if (requestBody) {
        proverArgs.push('--request-body', requestBody);
    }
    if (headers.length > 0) {
        proverArgs.push('--headers', headers.join(','));
    }
    if (outputPrefix) {
        proverArgs.push('--output-prefix', outputPrefix);
    } else {
        // Default prefix if none provided, ensuring some uniqueness
        proverArgs.push('--output-prefix', `notarization_${methodName}_${Date.now()}`);
    }

    console.log(`Invoking prover: ${proverExecutablePath} ${proverArgs.join(' ')}`);

    return new Promise((resolve, reject) => {
        const proverProcess = spawn(proverExecutablePath, proverArgs, {
            env: {
                ...process.env,
                'NOTARY_HOST': '127.0.0.1',
                'NOTARY_PORT': '8000',
                'RUST_LOG': 'info,tlsn_prover=debug,tls_client_async=debug,mpc_aio=debug,tlsn_core=debug,hyper=info,rustls=info'
            }
        });

        let stdoutData = '';
        let stderrData = '';

        proverProcess.stdout.on('data', (data) => {
            stdoutData += data.toString();
        });

        proverProcess.stderr.on('data', (data) => {
            stderrData += data.toString();
        });

        proverProcess.on('close', (code) => {
            console.log(`Prover STDOUT for ${methodName} (${outputPrefix}):\n${stdoutData}`);
            console.log(`Prover STDERR for ${methodName} (${outputPrefix}):\n${stderrData}`);
            if (code === 0) {
                try {
                    const jsonResponse = JSON.parse(stdoutData);
                    resolve(jsonResponse);
                } catch (e) {
                    console.error('Failed to parse prover stdout JSON:', e.message);
                    reject(new Error('Failed to parse prover stdout JSON: ' + stdoutData));
                }
            } else {
                console.error(`Prover process for ${methodName} (${outputPrefix}) exited with code ${code}`);
                reject(new Error(`Prover process exited with code ${code}. STDERR: ${stderrData}`));
            }
        });

        proverProcess.on('error', (err) => {
            console.error('Failed to start prover process:', err);
            reject(err);
        });
    });
}

// Function to handle a single update from Telegram
function handleUpdate(update) {
    if (update.message) {
        const msg = update.message;
        const chatId = msg.chat.id;
        console.log('Received message:', msg);

        // Echo command logic
        const echoMatch = msg.text ? msg.text.match(/\/echo (.+)/) : null;
        if (echoMatch) {
            const resp = echoMatch[1];
            bot.sendMessage(chatId, resp)
                .then(sentMessage => {
                    console.log('Echo message sent successfully:', sentMessage.text);
                })
                .catch(error => {
                    console.error('Error sending echo message directly:', error.message);
                });
        } else if (msg.text) { // Generic message handler, avoid double-replying for /echo
            bot.sendMessage(chatId, 'Received your message.') // Updated ack message text
                .then(sentMessage => {
                    console.log('Acknowledgement message sent successfully.');
                })
                .catch(error => {
                    console.error('Error sending acknowledgement message directly:', error.message);
                });
        }
    } else {
        // Handle other update types if necessary (e.g., inline queries, callback queries)
        console.log('Received non-message update:', update);
    }
}

// Function to continuously poll for updates
async function startPollingUpdates() {
    console.log('Starting to poll for updates (peek-then-prove strategy)...');
    while (true) {
        try {
            // Step 1: Peek at updates directly to check for messages
            // console.log(`Peeking for updates with offset: ${updateOffset}`); // Optional debug log
            const peekResponse = await fetchDirectly('getUpdates', 'GET', { offset: updateOffset, timeout: 10, limit: 1 });

            let updatesToProcess = [];
            let processWithProver = false;

            if (peekResponse.ok && peekResponse.result.length > 0) {
                for (const update of peekResponse.result) {
                    if (update.message) {
                        processWithProver = true;
                        break; // Found a message, no need to check further in this batch for the flag
                    }
                }

                if (processWithProver) {
                    console.log('Message(s) detected in peek. Fetching with prover for notarization...');
                    const outputPrefix = `getUpdates_msg_notarized_${Date.now()}`;
                    // Fetch the same batch of updates (using the same updateOffset) with the prover
                    const proverResponse = await invokeTelegramProver('getUpdates', 'GET', { offset: updateOffset, timeout: 30, limit: 1 }, outputPrefix);

                    if (proverResponse.ok && proverResponse.result.length > 0) {
                        updatesToProcess = proverResponse.result;
                        // console.log(`Prover fetched ${updatesToProcess.length} update(s) for processing.`);
                        
                        // Generate presentation for the attestation
                        const attestationPath = `${outputPrefix}.attestation.tlsn`;
                        const secretsPath = `${outputPrefix}.secrets.tlsn`; // Assuming .json, adjust if it's .txt or other
                        const presentationOutputPath = `${outputPrefix}.presentation`;

                        try {
                            const generatedPresentationPath = await invokePresenter(attestationPath, secretsPath, presentationOutputPath);
                            console.log(`Presentation generation successful: ${generatedPresentationPath}`);

                            // --- Insert Evidence to Supabase ---
                            try {
                                // Read the presentation file as a buffer and store as base64
                                const rawproof = fs.readFileSync(generatedPresentationPath).toString('base64');
                                // Use the first message in updatesToProcess as the summary source
                                const msg = updatesToProcess && updatesToProcess[0] && updatesToProcess[0].message ? updatesToProcess[0].message : null;
                                let messageSummary = {};
                                if (msg) {
                                    if (msg.forward_from) messageSummary.forward_from = msg.forward_from;
                                    if (msg.forward_sender_name) messageSummary.forward_sender_name = msg.forward_sender_name;
                                    if (msg.forward_origin) messageSummary.forward_origin = msg.forward_origin;
                                    if (msg.forward_date) messageSummary.forward_date = msg.forward_date;
                                    if (msg.text) messageSummary.text = msg.text;
                                }
                                // Generate a random evidenceid
                                const evidenceid = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
                                // Insert evidence
                                insertEvidence({ evidenceid, messagedata: messageSummary, rawproof })
                                    .then(res => console.log('Evidence inserted:', res))
                                    .catch(err => console.error('Failed to insert evidence:', err));
                            } catch (e) {
                                console.error('Error preparing or inserting evidence:', e);
                            }

                            // Send the presentation file back to the user only if it's a forwarded message
                            if (updatesToProcess.length > 0 && updatesToProcess[0].message) {
                                const msg = updatesToProcess[0].message; // Get the message object
                                const chatId = msg.chat.id;

                                // Check if the message is a forwarded message
                                if (msg.forward_from || msg.forward_sender_name) {
                                    try {
                                        await bot.sendDocument(chatId, generatedPresentationPath, { caption: "Here is the notarization presentation for your message." });
                                        console.log(`Presentation file sent successfully to chat ${chatId} for ${outputPrefix} because it was a forwarded message.`);
                                        // Send claim link to user
                                        await bot.sendMessage(chatId, `View your claim: https://goblow.it/claims/flow/${evidenceid}`);
                                    } catch (sendError) {
                                        console.error(`Failed to send presentation file for ${outputPrefix} to chat ${chatId}:`, sendError.message);
                                    }
                                } else {
                                    // Message is not a forward, so don't send the presentation.
                                    // The 'handleUpdate' function will later send the "To prove a message you must forward it..." message.
                                    console.log(`Presentation for ${outputPrefix} was not sent to chat ${chatId} because the message (ID: ${msg.message_id}) was not a forwarded message.`);
                                }
                            } else {
                                console.error(`Could not determine chatId to send presentation for ${outputPrefix}. Updates:`, updatesToProcess);
                            }
                        } catch (presenterError) {
                            console.error(`Failed to generate presentation for ${outputPrefix}:`, presenterError.message);
                            // Decide if this failure should prevent message processing or just be logged
                        }

                    } else if (!proverResponse.ok) {
                        console.error('Error fetching updates with prover (after peek):', proverResponse);
                        // If prover call fails, we don't process this batch and will retry the peek in the next loop.
                        // updateOffset remains unchanged for this iteration.
                        updatesToProcess = []; // Ensure no processing
                    } else {
                        // Prover returned ok:false or empty result, even though peek had messages.
                        console.warn('Prover returned no updates or error, though peek indicated messages. Offset:', updateOffset, 'Prover Response:', proverResponse);
                        updatesToProcess = [];
                    }
                } else {
                    // No messages in the peeked batch. We still need to advance the offset.
                    // console.log('No messages in peeked updates. Advancing offset.');
                    updateOffset = peekResponse.result[peekResponse.result.length - 1].update_id + 1;
                    updatesToProcess = []; // Ensure no processing
                }
            } else if (!peekResponse.ok) {
                console.error('Error peeking for updates (direct call):', peekResponse);
                // updateOffset remains unchanged. Loop will retry.
            }
            // If peekResponse.ok is true but result is empty, loop continues, offset unchanged, effectively a long poll.

            // Process the updates (either from prover or none if no messages/error)
            if (updatesToProcess.length > 0) {
                for (const update of updatesToProcess) {
                    handleUpdate(update); // handleUpdate itself checks for update.message
                    updateOffset = update.update_id + 1; // Update offset based on processed (proven) updates
                }
            }

        } catch (error) {
            console.error('Error in polling loop:', error.message, error.stack);
            // Delay before retrying the entire loop after an unexpected error
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
        // Delay between polling attempts (whether successful or resulted in error handling above)
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

// Main execution
(async () => {
    try {
        console.log('Fetching bot info on startup (direct call)...');
        const botInfo = await fetchDirectly('getMe'); // Using direct call, no params for getMe
        // fetchDirectly resolves with the full {ok: true, result: ...} object or rejects on error
        console.log('Bot Info:', botInfo.result);
        // Start polling for updates after successful getMe
        startPollingUpdates();
    } catch (error) {
        console.error('Error calling getMe on startup, cannot start polling:', error.message);
    }
})();
