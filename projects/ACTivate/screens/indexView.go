package screens

import (
	"context"
	"encoding/hex"
	"fmt"
	"log"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/dialog"
	"fyne.io/fyne/v2/widget"

	beelite "github.com/Solar-Punk-Ltd/bee-lite"
	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"

	// "github.com/ethereum/go-ethereum/crypto" // Temporarily commented out
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/ethersphere/bee/v2/pkg/api"
	"github.com/ethersphere/bee/v2/pkg/transaction" // For transaction.Service, though might be nil
)

const (
	TestnetChainID         = 11155111
	TestnetNetworkID       = uint64(10)
	MainnetChainID         = 100
	MainnetNetworkID       = uint64(1)
	NativeTokenSymbol      = "xDAI"
	SwarmTokenSymbol       = "xBZZ"
	defaultRPC             = "wss://gnosis-mainnet.g.alchemy.com/v2/YtM4LIorMJrGNRWkvAOFWSKTDzhNsCMz"
	defaultTestRPC         = "https://eth-sepolia.g.alchemy.com/v2/atcICv4EFi9hXKew1D4LvnH36cm5-96S"
	defaultWelcomeMsg      = "Welcome from ACTivate!"
	defaultPassword        = "defaultpassword"
	defaultNatAddress      = ""
	defaultSwapEnable      = true
	dataContractAddressHex = "0x242A2174fa8d8586a784aBdB4fF03C3181E96bee"
	infoLogLevel           = "3"
	defaultDepth           = "21"
	defaultAmount          = "500000000"
	defaultImmutable       = true
	passwordPrefKey        = "password"
	welcomeMessagePrefKey  = "welcomeMessage"
	swapEnablePrefKey      = "swapEnable"
	natAddressPrefKey      = "natAddress"
	rpcEndpointPrefKey     = "rpcEndpoint"
	selectedStampPrefKey   = "selected_stamp"
	batchPrefKey           = "batch"
	uploadsPrefKey         = "uploads"
	overlayAddrPrefKey     = "overlayAddress"
	eglrefPrefKey          = "eglref"
	historyRefPrefKey      = "historyRef"
)

var (
	MainnetBootnodes = []string{
		"/dnsaddr/mainnet.ethswarm.org",
	}

	TestnetBootnodes = []string{
		"/dnsaddr/testnet.ethswarm.org",
	}
)

type logger struct{}

func (*logger) Write(p []byte) (int, error) {
	log.Println(string(p))
	return len(p), nil
}

func (*logger) Log(s string) {
	log.Println(s)
}

type index struct {
	fyne.Window
	app        fyne.App
	view       *fyne.Container
	content    *fyne.Container
	intro      *widget.Label
	progress   dialog.Dialog
	bl         *beelite.Beelite
	logger     *logger
	nodeConfig *nodeConfig

	ethClient            *ethclient.Client
	contractSvc          DataContractInterface
	dataContractABI      abi.ABI // Store the parsed ABI here
	eventLogSubscription ethereum.Subscription
	eventMessageLabel    *widget.Label
}

func (i *index) initContract(txService transaction.Service) {
	rpcEndpoint := defaultRPC
	var err error
	i.ethClient, err = ethclient.DialContext(context.Background(), rpcEndpoint)
	if err != nil {
		i.logger.Log(fmt.Sprintf("Failed to connect to Ethereum client via %s: %v", rpcEndpoint, err))
	}

	i.dataContractABI, err = ParseContractABI()
	if err != nil {
		i.logger.Log(fmt.Sprintf("Failed to parse data contract ABI JSON: %v", err))
		i.showError(err)
	}

	dataContractAddr := common.HexToAddress(dataContractAddressHex)

	if i.dataContractABI.Events != nil { // Check if ABI was parsed and has events
		i.contractSvc = NewDataContract(
			i.bl.OverlayEthAddress(),
			dataContractAddr,
			i.dataContractABI,
			txService,
			true, // setGasLimit
		)
	} else {
		i.logger.Log("Data contract ABI not parsed or no events found, contractSvc not initialized.")
	}

	// Initialize UI elements for events
	i.eventMessageLabel = widget.NewLabel("Initializing event listener...")
	i.eventMessageLabel.Wrapping = fyne.TextWrapWord
	i.eventMessageLabel.Alignment = fyne.TextAlignCenter
}

func Make(a fyne.App, w fyne.Window) fyne.CanvasObject {
	i := &index{
		Window:     w,
		app:        a,
		intro:      widget.NewLabel("ACTivate"),
		logger:     &logger{},
		nodeConfig: &nodeConfig{},
	}
	i.intro.Wrapping = fyne.TextWrapWord
	i.printAppInfo()

	i.nodeConfig.isKeyStoreMem = a.Driver().Device().IsBrowser()
	if i.nodeConfig.isKeyStoreMem {
		i.logger.Log("Running in browser, using in-memory keystore")
	} else {
		i.nodeConfig.path = a.Storage().RootURI().Path()
		i.logger.Log("App datadir path: " + i.nodeConfig.path)
	}

	i.nodeConfig.welcomeMessage = defaultWelcomeMsg
	i.nodeConfig.password = defaultPassword
	i.nodeConfig.natAddress = defaultNatAddress
	i.nodeConfig.rpcEndpoint = defaultRPC
	i.nodeConfig.swapEnable = defaultSwapEnable

	i.view = container.NewBorder(container.NewVBox(i.intro), nil, nil, nil, container.NewStack(i.showStartView(false)))
	i.view.Refresh()
	return i.view
}

func (i *index) start(path, password, welcomeMessage, natAddress, rpcEndpoint string, swapEnable bool) {
	if password == "" {
		i.showError(fmt.Errorf("password cannot be blank"))
		return
	}
	i.showProgressWithMessage("Starting Bee")

	err := i.initSwarm(path, welcomeMessage, password, natAddress, rpcEndpoint, swapEnable)
	i.hideProgress()
	if err != nil {
		if i.bl != nil {
			i.showErrorWithAddr(i.bl.OverlayEthAddress(), err)
		} else {
			i.showError(err)
		}
		return
	}

	i.initContract(i.bl.TransactionService())

	if swapEnable {
		if i.bl.BeeNodeMode() != api.LightMode {
			i.showError(fmt.Errorf("swap is enabled but the current node mode is: %s", i.bl.BeeNodeMode()))
			return
		}
	} else if i.bl.BeeNodeMode() != api.UltraLightMode {
		i.showError(fmt.Errorf("swap disabled but the current node mode is: %s", i.bl.BeeNodeMode()))
		return
	}

	i.setPreference(welcomeMessagePrefKey, welcomeMessage)
	i.setPreference(swapEnablePrefKey, swapEnable)
	i.setPreference(natAddressPrefKey, natAddress)
	i.setPreference(rpcEndpointPrefKey, rpcEndpoint)
	i.loadMenuView()
	i.intro.SetText("")
	i.intro.Hide()
}

func (i *index) initSwarm(dataDir, welcomeMessage, password, natAddress, rpcEndpoint string, swapEnable bool) error {
	i.logger.Log(welcomeMessage)

	// isMainnet := rpcEndpoint == defaultRPC
	isMainnet := true
	networkID := MainnetNetworkID
	if !isMainnet {
		networkID = TestnetNetworkID
	}

	lo := &beelite.LiteOptions{
		FullNodeMode:             false,
		BootnodeMode:             false,
		Bootnodes:                MainnetBootnodes,
		DataDir:                  dataDir,
		WelcomeMessage:           welcomeMessage,
		BlockchainRpcEndpoint:    rpcEndpoint,
		SwapInitialDeposit:       "0",
		PaymentThreshold:         "100000000",
		SwapEnable:               swapEnable,
		ChequebookEnable:         true,
		UsePostageSnapshot:       false,
		Mainnet:                  isMainnet,
		NetworkID:                networkID,
		NATAddr:                  natAddress,
		CacheCapacity:            32 * 1024 * 1024,
		DBOpenFilesLimit:         50,
		DBWriteBufferSize:        32 * 1024 * 1024,
		DBBlockCacheCapacity:     32 * 1024 * 1024,
		DBDisableSeeksCompaction: false,
		RetrievalCaching:         true,
	}

	bl, err := beelite.Start(lo, password, infoLogLevel)
	if err != nil {
		return err
	}

	i.setPreference(passwordPrefKey, password)
	i.setPreference(overlayAddrPrefKey, bl.OverlayEthAddress().String())
	i.bl = bl
	return err
}

func (i *index) loadMenuView() {
	// only show certain views if the node mode is NOT ultra-light
	ultraLightMode := i.bl.BeeNodeMode() == api.UltraLightMode
	infoCard := i.showInfoCard(ultraLightMode)

	menuContent := container.NewVBox(infoCard)

	granteeList := i.showGranteeCard()
	menuContent.Add(granteeList)

	// Add the send transaction button
	sendTxButton := i.sendTransactionButton()
	menuContent.Add(sendTxButton)

	downloadCard := i.showDownloadCard()
	menuContent.Add(downloadCard)

	if i.eventMessageLabel != nil {
		menuContent.Add(i.eventMessageLabel)
	} else {
		// Fallback, though it should be initialized in Make
		i.logger.Log("eventMessageLabel is nil in loadMenuView")
		menuContent.Add(widget.NewLabel("Event display not initialized."))
	}

	i.setupDataContractSubscription()

	i.content.Objects = []fyne.CanvasObject{container.NewBorder(
		nil,
		nil,
		nil,
		nil,
		container.NewScroll(menuContent)),
	}
	i.content.Refresh()
}

func (i *index) setupDataContractSubscription() {
	if i.eventLogSubscription != nil {
		i.eventLogSubscription.Unsubscribe() // Unsubscribe from previous if any
	}

	logs := make(chan types.Log)
	var err error

	// Use a new context for the subscription goroutine, or manage it with the app's lifecycle
	subCtx, cancelSubCtx := context.WithCancel(context.Background())
	i.Window.SetOnClosed(func() { // Ensure cancellation when window closes
		cancelSubCtx()
	})

	i.eventLogSubscription, err = i.contractSvc.SubscribeDataSentToTarget(subCtx, i.ethClient, logs)
	if err != nil {
		errMsg := fmt.Sprintf("Failed to subscribe to DataSentToTarget: %v", err)
		i.logger.Log(errMsg)
		if i.eventMessageLabel != nil {
			i.eventMessageLabel.SetText(errMsg)
		}
		cancelSubCtx() // Cancel context if subscription fails
		return
	}

	i.logger.Log("Successfully subscribed to DataSentToTarget events.")
	if i.eventMessageLabel != nil {
		i.eventMessageLabel.SetText("Subscribed. Waiting for 'DataSentToTarget' events...")
	}

	go func() {
		defer func() {
			if i.eventLogSubscription != nil {
				i.eventLogSubscription.Unsubscribe()
			}
			cancelSubCtx() // Ensure context is cancelled when goroutine exits
			i.logger.Log("Event listener goroutine stopped.")
		}()

		for {
			select {
			case <-subCtx.Done():
				i.logger.Log("Event listener context cancelled. Unsubscribing.")
				return
			case err := <-i.eventLogSubscription.Err():
				errMsg := fmt.Sprintf("Event subscription error: %v", err)
				i.logger.Log(errMsg)
				if i.eventMessageLabel != nil {
					i.eventMessageLabel.SetText("Subscription error. Check logs.")
				}
				// Depending on the error, you might want to attempt to resubscribe.
				// For now, we stop listening on error.
				return
			case vLog := <-logs:
				i.logger.Log(fmt.Sprintf("Received log: Block %d, TxHash %s, Topics %d, Data %d bytes", vLog.BlockNumber, vLog.TxHash.Hex(), len(vLog.Topics), len(vLog.Data)))

				eventName := "DataSentToTarget"
				eventAbi, ok := i.dataContractABI.Events[eventName]
				if !ok {
					i.logger.Log(fmt.Sprintf("Event %s not found in ABI. Cannot parse.", eventName))
					continue
				}

				// Check if this log is indeed for DataSentToTarget based on Topic[0]
				if len(vLog.Topics) == 0 || vLog.Topics[0] != eventAbi.ID {
					i.logger.Log(fmt.Sprintf("Received log does not match %s event signature. Skipping. Log Topic0: %s, Expected: %s", eventName, vLog.Topics[0].Hex(), eventAbi.ID.Hex()))
					continue
				}
				i.logger.Log(fmt.Sprintf("Processing '%s' event...", eventName))

				var targetAddr common.Address
				var ownerBytes []byte
				var actRefBytes []byte
				var topicString string

				// Unpack indexed fields from Topics
				topicIdx := 1 // Topics[0] is the event signature itself
				for _, input := range eventAbi.Inputs {
					if input.Indexed {
						if topicIdx < len(vLog.Topics) {
							if input.Name == "target" { // Assuming 'target' is the name in ABI
								targetAddr = common.BytesToAddress(vLog.Topics[topicIdx].Bytes())
							}
							// Add other indexed fields here if any, by checking input.Name or type
							topicIdx++
						} else {
							i.logger.Log(fmt.Sprintf("Warning: Mismatch count for indexed ABI inputs and log topics for event %s.", eventName))
							break
						}
					}
				}

				// Prepare to unpack non-indexed fields from Data
				var nonIndexedArgs abi.Arguments
				for _, input := range eventAbi.Inputs {
					if !input.Indexed {
						nonIndexedArgs = append(nonIndexedArgs, input)
					}
				}

				if len(nonIndexedArgs) > 0 {
					unpackedData, err := nonIndexedArgs.Unpack(vLog.Data)
					if err != nil {
						i.logger.Log(fmt.Sprintf("Failed to unpack non-indexed data for event %s: %v", eventName, err))
					} else {
						// Debug: Log the unpacked data structure
						i.logger.Log(fmt.Sprintf("Unpacked data count: %d", len(unpackedData)))
						for idx, data := range unpackedData {
							i.logger.Log(fmt.Sprintf("Unpacked data[%d]: %T = %v", idx, data, data))
						}

						// Debug: Log the argument names and types
						for idx, arg := range nonIndexedArgs {
							i.logger.Log(fmt.Sprintf("Arg[%d]: Name='%s', Type='%s'", idx, arg.Name, arg.Type.String()))
						}

						// Assign to variables based on the order of non-indexed args in ABI
						// The ABI shows: owner (bytes32), actref (bytes32), topic (string)
						currentUnpackedIdx := 0
						for _, arg := range nonIndexedArgs {
							if currentUnpackedIdx >= len(unpackedData) {
								break
							}
							switch arg.Name { // Match the actual ABI field names
							case "owner":
								if val, ok := unpackedData[currentUnpackedIdx].([32]byte); ok {
									ownerBytes = val[:]
								} else if val, ok := unpackedData[currentUnpackedIdx].([]byte); ok {
									ownerBytes = val
								}
							case "actref": // Note: ABI uses "actref" not "actRef"
								if val, ok := unpackedData[currentUnpackedIdx].([32]byte); ok {
									actRefBytes = val[:]
								} else if val, ok := unpackedData[currentUnpackedIdx].([]byte); ok {
									actRefBytes = val
								}
							case "topic":
								if val, ok := unpackedData[currentUnpackedIdx].(string); ok {
									topicString = val
								}
							}
							currentUnpackedIdx++
						}
					}
				}

				parsedMsg := fmt.Sprintf("'DataSentToTarget' Event! Block: %d.", vLog.BlockNumber)
				if targetAddr != (common.Address{}) {
					parsedMsg += fmt.Sprintf(" Target: %s.", targetAddr.Hex())
				}
				if len(ownerBytes) > 0 {
					parsedMsg += fmt.Sprintf(" Owner: 0x%x.", ownerBytes)
				}
				if len(actRefBytes) > 0 {
					parsedMsg += fmt.Sprintf(" ActRef: 0x%x.", actRefBytes)
				}
				if topicString != "" {
					parsedMsg += fmt.Sprintf(" Topic: '%s'.", topicString)
				}

				i.logger.Log("Formatted event message: " + parsedMsg)
				if i.eventMessageLabel != nil {
					i.eventMessageLabel.SetText(parsedMsg)
				}

				// TODO: Temporarily commented out decryption - uncomment when needed
				/*
					// Decrypt the data before storing it using a placeholder private key
					encryptionUtils := &EncryptionUtils{}

					// Placeholder private key (hex encoded) - replace with actual private key in production
					placeholderPrivateKeyHex := "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

					// Parse the private key
					privateKeyBytes, err := hex.DecodeString(placeholderPrivateKeyHex)
					if err != nil {
						i.logger.Log(fmt.Sprintf("Failed to decode placeholder private key: %v", err))
					} else {
						// Convert to ECDSA private key
						privateKey, err := crypto.ToECDSA(privateKeyBytes)
						if err != nil {
							i.logger.Log(fmt.Sprintf("Failed to convert to ECDSA private key: %v", err))
						} else {
							// Print the corresponding public key
							publicKeyBytes := crypto.FromECDSAPub(&privateKey.PublicKey)
							publicKeyHex := hex.EncodeToString(publicKeyBytes)
							i.logger.Log(fmt.Sprintf("Placeholder private key's public key: %s", publicKeyHex))

							// Attempt to decrypt the data
							var decryptedOwnerBytes []byte
							var decryptedActRefBytes []byte
							var decryptedTopicString string

							// Decrypt owner bytes
							if len(ownerBytes) > 0 {
								decryptedOwner, err := encryptionUtils.DecryptData(ownerBytes, privateKey)
								if err != nil {
									i.logger.Log(fmt.Sprintf("Failed to decrypt owner data, using original: %v", err))
									decryptedOwnerBytes = ownerBytes
								} else {
									decryptedOwnerBytes = decryptedOwner
									i.logger.Log("Successfully decrypted owner data")
								}
							} else {
								decryptedOwnerBytes = ownerBytes
							}

							// Decrypt actRef bytes
							if len(actRefBytes) > 0 {
								decryptedActRef, err := encryptionUtils.DecryptData(actRefBytes, privateKey)
								if err != nil {
									i.logger.Log(fmt.Sprintf("Failed to decrypt actRef data, using original: %v", err))
									decryptedActRefBytes = actRefBytes
								} else {
									decryptedActRefBytes = decryptedActRef
									i.logger.Log("Successfully decrypted actRef data")
								}
							} else {
								decryptedActRefBytes = actRefBytes
							}

							// Decrypt topic string
							if topicString != "" {
								decryptedTopic, err := encryptionUtils.DecryptData([]byte(topicString), privateKey)
								if err != nil {
									i.logger.Log(fmt.Sprintf("Failed to decrypt topic data, using original: %v", err))
									decryptedTopicString = topicString
								} else {
									decryptedTopicString = string(decryptedTopic)
									i.logger.Log("Successfully decrypted topic data")
								}
							} else {
								decryptedTopicString = topicString
							}

							// Use decrypted data for storage
							ownerBytes = decryptedOwnerBytes
							actRefBytes = decryptedActRefBytes
							topicString = decryptedTopicString
						}
					}
				*/

				i.logger.Log("Using raw event data without decryption") // Parse the modified topic data (publicKey + 32-byte hex string)
				if len(topicString) >= 194 {                            // 130 chars (public key) + 64 chars (32-byte hex) = 194 chars
					// Extract the public key (first 130 characters if it starts with 04, otherwise first 128)
					var extractedPublicKey string
					var extracted32ByteHex string

					if len(topicString) >= 130 && topicString[:2] == "04" {
						// Uncompressed public key format (130 chars)
						extractedPublicKey = topicString[:130]
						if len(topicString) >= 194 {
							extracted32ByteHex = topicString[130:194]
						} else {
							extracted32ByteHex = topicString[130:]
						}
					} else if len(topicString) >= 128 {
						// Compressed public key or other format (128 chars)
						extractedPublicKey = topicString[:128]
						if len(topicString) >= 192 {
							extracted32ByteHex = topicString[128:192]
						} else {
							extracted32ByteHex = topicString[128:]
						}
					}

					i.logger.Log(fmt.Sprintf("Extracted from topic - PublicKey: %s", extractedPublicKey))
					i.logger.Log(fmt.Sprintf("Extracted from topic - 32ByteHex: %s", extracted32ByteHex))

					// Store both parts separately
					i.setPreference("eventPublicKey", extractedPublicKey)
					i.setPreference("event32ByteHex", extracted32ByteHex)
				} else {
					i.logger.Log(fmt.Sprintf("Topic string too short (%d chars) to contain publicKey + 32-byte hex", len(topicString)))
				}

				// use setPreference to store the owner, actRef, and topic
				i.setPreference("eventOwner", hex.EncodeToString(ownerBytes))
				i.setPreference("eventActRef", hex.EncodeToString(actRefBytes))
				i.setPreference("eventTopic", topicString)
				i.logger.Log("Stored owner, actRef, and topic in preferences.")
				i.logger.Log("Event processing complete.")

			}
		}
	}()
}

func (i *index) sendTransactionButton() *widget.Button {
	button := widget.NewButton("Send Transaction", func() {
		if i.contractSvc == nil {
			i.showError(fmt.Errorf("contract service not initialized"))
			return
		}

		// Initialize encryption utils
		encryptionUtils := &EncryptionUtils{}

		// Create input form for transaction parameters
		targetEntry := widget.NewEntry()
		targetEntry.SetPlaceHolder("Target address (0x...)")
		targetEntry.SetText("0x1234567890123456789012345678901234567890")

		ownerEntry := widget.NewEntry()
		ownerEntry.SetPlaceHolder("Owner address (0x...)")
		ownerEntry.SetText("0x1234567890123456789012345678901234567890")

		actRefEntry := widget.NewEntry()
		actRefEntry.SetPlaceHolder("ACT reference (hex string)")
		actRefEntry.SetText("14b4fe81bf1445c429a236cf74aecaa6cc915f1f461e333d4c83091b114012e0")

		topicEntry := widget.NewEntry()
		topicEntry.SetPlaceHolder("Topic")
		topicEntry.SetText("example-topic")

		// Add public key input with default value
		publicKeyEntry := widget.NewEntry()
		publicKeyEntry.SetPlaceHolder("ECDSA Public Key (hex format)")
		publicKeyEntry.SetText(encryptionUtils.GetDefaultPublicKey())

		// Add button to generate new key pair
		generateKeyButton := widget.NewButton("Generate New Key Pair", func() {
			publicKeyHex, _, err := encryptionUtils.GenerateKeyPair()
			if err != nil {
				i.showError(fmt.Errorf("failed to generate key pair: %w", err))
				return
			}
			publicKeyEntry.SetText(publicKeyHex)
			dialog.ShowInformation("Key Generated", "New ECDSA key pair generated successfully!", i.Window)
		})

		// Create encryption checkbox
		encryptDataCheck := widget.NewCheck("Encrypt transaction data", nil)
		encryptDataCheck.SetChecked(true)

		form := &widget.Form{
			Items: []*widget.FormItem{
				widget.NewFormItem("Target Address", targetEntry),
				widget.NewFormItem("Owner Data", ownerEntry),
				widget.NewFormItem("ACT Reference", actRefEntry),
				widget.NewFormItem("Topic", topicEntry),
				widget.NewFormItem("", encryptDataCheck),
				widget.NewFormItem("Public Key", container.NewBorder(nil, generateKeyButton, nil, nil, publicKeyEntry)),
			},
		}

		// Create custom dialog with form
		d := dialog.NewCustomConfirm("Send Transaction", "Send", "Cancel", form, func(confirm bool) {
			if !confirm {
				return
			}

			// Validate target address
			if !common.IsHexAddress(targetEntry.Text) {
				i.showError(fmt.Errorf("invalid target address"))
				return
			}

			// Validate owner address
			if !common.IsHexAddress(ownerEntry.Text) {
				i.showError(fmt.Errorf("invalid owner address"))
				return
			}

			// Validate ACT reference as hex string
			actRefData := actRefEntry.Text
			if len(actRefData) > 2 && actRefData[:2] == "0x" {
				actRefData = actRefData[2:] // Remove 0x prefix if present
			}
			if len(actRefData)%2 != 0 {
				i.showError(fmt.Errorf("ACT reference must be valid hex string (even number of characters)"))
				return
			}
			// Validate hex format
			if _, err := hex.DecodeString(actRefData); err != nil {
				i.showError(fmt.Errorf("ACT reference must be valid hex string: %w", err))
				return
			}

			// Show progress dialog
			i.showProgressWithMessage("Processing and sending transaction...")

			target := common.HexToAddress(targetEntry.Text)
			ownerAddr := common.HexToAddress(ownerEntry.Text) // Owner as address
			actRefData = actRefEntry.Text                     // ACT ref as hex string
			// topicData := topicEntry.Text // Not used since we create custom topic data

			// Process ACT reference hex string
			if len(actRefData) > 2 && actRefData[:2] == "0x" {
				actRefData = actRefData[2:] // Remove 0x prefix if present
			}
			actRefBytes, err := hex.DecodeString(actRefData)
			if err != nil {
				i.showError(fmt.Errorf("failed to decode ACT reference hex: %w", err))
				return
			}

			go func() {
				defer i.hideProgress()

				var owner, actRef []byte
				var topic string
				var encryptionInfo string

				// TODO: Temporarily commented out encryption - uncomment when needed
				/*
					// Apply encryption if enabled
					if encryptDataCheck.Checked {
						// Parse public key from hex
						publicKey, err := encryptionUtils.ParsePublicKeyFromHex(publicKeyEntry.Text)
						if err != nil {
							i.showError(fmt.Errorf("invalid public key: %w", err))
							return
						}

						// Encrypt owner address bytes directly
						encryptedOwnerBytes, err := encryptionUtils.EncryptData(ownerAddr.Bytes(), publicKey)
						if err != nil {
							i.showError(fmt.Errorf("failed to encrypt owner address: %w", err))
							return
						}

						// Encrypt ACT reference bytes directly (same size output)
						encryptedActRefBytes, err := encryptionUtils.EncryptData(actRefBytes, publicKey)
						if err != nil {
							i.showError(fmt.Errorf("failed to encrypt ACT reference: %w", err))
							return
						}

						// Encrypt topic
						encryptedTopicBytes, err := encryptionUtils.EncryptData([]byte(topicData), publicKey)
						if err != nil {
							i.showError(fmt.Errorf("failed to encrypt topic: %w", err))
							return
						}

						// Use encrypted data directly
						owner = encryptedOwnerBytes
						actRef = encryptedActRefBytes
						topic = string(encryptedTopicBytes)

						// Log the sizes for verification
						i.logger.Log(fmt.Sprintf("Original actRef: %d bytes, Encrypted: %d bytes", len(actRefBytes), len(encryptedActRefBytes)))
						encryptionInfo = "encrypted"
					} else {
				*/
				// Use plain data
				owner = ownerAddr.Bytes() // Address as 20 bytes
				actRef = actRefBytes      // Hex decoded bytes

				// Create modified topic data: concatenate placeholder public key + 32-byte hex string
				placeholderPublicKey := "04b753ee0222be7e1de96416b8074c095d9bda96f58cd3f942cd60911853533afa46964b640fa6a2480686656cfefca846a7facd7abbb33d437ef4384659273098"

				// CHANGE BEFORE SENDING TRANSACTION
				placeholder32ByteHex := "b12c1997de882193ff595660cd9bbb6d7908bae89634e390014b746ed3aac272"
				topic = placeholderPublicKey + placeholder32ByteHex
				i.logger.Log(fmt.Sprintf("Modified topic data: publicKey(%d chars) + 32byteHex(%d chars) = %d total chars", len(placeholderPublicKey), len(placeholder32ByteHex), len(topic)))

				i.logger.Log("Transaction data sent without encryption")
				// }

				ctx := context.Background()
				receipt, err := i.contractSvc.SendDataToTarget(ctx, target, owner, actRef, topic)
				if err != nil {
					i.showError(fmt.Errorf("failed to send transaction: %w", err))
					return
				}

				// Show success message with transaction hash and encryption info
				successMsg := fmt.Sprintf("Transaction sent successfully!\nTransaction Hash: %s\nBlock Number: %d\n\nEncryption: %s",
					receipt.TxHash.Hex(), receipt.BlockNumber.Uint64(), encryptionInfo)

				dialog.ShowInformation("Transaction Success", successMsg, i.Window)
				i.logger.Log(fmt.Sprintf("Transaction successful: %s (%s)", receipt.TxHash.Hex(), encryptionInfo))
			}()
		}, i.Window)

		d.Resize(fyne.NewSize(600, 400))
		d.Show()
	})

	button.Importance = widget.HighImportance
	return button
}
