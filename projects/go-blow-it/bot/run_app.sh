#!/bin/bash

# This script builds and runs the necessary components for the Telegram attestation bot.

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Build Rust Crates ---
echo "Building Rust crates... (This may take a while)"
# Navigate to the Rust project directory and build the necessary packages.
# We build notary-server and tlsn-examples which contains the prove, verify, and present binaries.
(cd tlsn && cargo build --release -p notary-server)
(cd tlsn && cargo build --example attestation_prove --release)
(cd tlsn && cargo build --example attestation_present --release)
(cd tlsn && cargo build --example attestation_verify --release)

echo "Rust crates built successfully."

# --- Start Notary Server ---
echo "Starting notary server in the background..."
# Start the server and redirect its output to a log file.
(cd tlsn &&  NS_PORT=8000 ./target/release/notary-server > notary.log 2>&1 &)
NOTARY_PID=$!

# Add a trap to kill the notary server on script exit (including Ctrl+C).
trap 'echo "Attempting to stop notary server with pkill -f..."; pkill -f "notary-server" || echo "Notary server not found by pkill -f or already stopped."' EXIT

# Give the server a moment to start up.
sleep 3
echo "Notary server started with PID: $NOTARY_PID. Logs are in tlsn/notary.log"

# --- Run the Telegram Bot ---
echo "Starting the Telegram bot..."
node bot.js

echo "Bot has stopped."
