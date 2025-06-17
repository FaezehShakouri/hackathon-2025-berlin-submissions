import streamlit as st
import os
import sys
from PIL import Image
import qrcode
from shamir_mnemonic import generate_mnemonics, combine_mnemonics
from mnemonic import Mnemonic
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization
import secrets
import io
import time
import pyperclip

# Set page configuration
st.set_page_config(
    page_title="Social Recovery System",
    page_icon="🔐",
    layout="wide"
)

# Custom CSS
st.markdown("""
    <style>
    .main {
        padding: 2rem;
    }
    .stButton>button {
        width: 100%;
        margin-top: 1rem;
    }
    .success-message {
        padding: 1rem;
        background-color: #d4edda;
        color: #155724;
        border-radius: 0.25rem;
        margin: 1rem 0;
    }
    </style>
""", unsafe_allow_html=True)

def main():
    st.title("🔐 Social Recovery System")

    # Sidebar for navigation - add the new Guardian Perspective option
    page = st.sidebar.selectbox(
        "Choose a Process",
        ["Setup", "Guardian Perspective", "Recovery"]  # Added Guardian Perspective between Setup and Recovery
    )

    if page == "Setup":
        setup_process()
    elif page == "Guardian Perspective":
        guardian_perspective()  # Call the new guardian_perspective function
    else:
        recovery_process()

def setup_process():
    st.header("Setup Process")
    
    # Initialize session states
    if 'shares_generated' not in st.session_state:
        st.session_state.shares_generated = False
    if 'generated_shares' not in st.session_state:
        st.session_state.generated_shares = []
    if 'share_confirmations' not in st.session_state:
        st.session_state.share_confirmations = {}
    if 'passphrase' not in st.session_state:
        st.session_state.passphrase = None
    if 'seed_phrase' not in st.session_state:
        st.session_state.seed_phrase = None
    if 'seed_generated' not in st.session_state:
        st.session_state.seed_generated = False
    if 'step1_completed' not in st.session_state:
        st.session_state.step1_completed = False
    if 'step2_completed' not in st.session_state:
        st.session_state.step2_completed = False
    if 'step3_completed' not in st.session_state:
        st.session_state.step3_completed = False
    if 'zk_verified' not in st.session_state:
        st.session_state.zk_verified = False
    if 'zk_button_clicked' not in st.session_state:
        st.session_state.zk_button_clicked = False
    
    # Step 1: Seed Phrase Generation/Input
    st.subheader("Step 1: Seed Phrase")
    seed_choice = st.radio(
        "Would you like to generate a new seed phrase or use an existing one?",
        ["Generate New", "Use Existing"]
    )

    if seed_choice == "Generate New":
        if not st.session_state.seed_generated:
            if st.button("Generate New Seed Phrase", key="generate_new_seed_phrase"):
                mnemo = Mnemonic("english")
                st.session_state.seed_phrase = mnemo.generate(strength=128)
                st.session_state.seed_generated = True
                st.rerun()
        
        if st.session_state.seed_generated and st.session_state.seed_phrase:
            st.code(st.session_state.seed_phrase, language="text")
            st.warning("⚠️ This is your seed phrase - don't show it to anyone!")
            if st.button("Confirm Seed Phrase", key="confirm_seed_phrase"):
                st.session_state.step1_completed = True
                st.rerun()
    else:
        seed_input = st.text_input("Enter your existing seed phrase:", type="password")
        if seed_input:
            st.session_state.seed_phrase = seed_input
            if st.button("Confirm Seed Phrase", key="confirm_existing_seed_phrase"):
                st.session_state.step1_completed = True
                st.rerun()

    # Only show Step 2 if Step 1 is completed
    if st.session_state.step1_completed:
        st.subheader("Step 2: Identity Verification")
        
        if not st.session_state.zk_verified:
            col1, col2 = st.columns([3, 1])
            with col1:
                st.info("🔍 Please complete the ZK Proof of face (Identity verification) process to verify your identity")
            with col2:
                if st.button("Perform ZK Proof of face (Identity verification)", key="perform_zk_button"):
                    st.session_state.zk_button_clicked = True
                    with st.spinner("Processing ZK Proof of face (Identity verification)..."):
                        time.sleep(2)  # Simulate processing time
                        st.session_state.zk_verified = True
                        st.session_state.step2_completed = True
                        st.rerun()
        
        # Only show success message and Step 3 if ZK is verified and button was clicked
        if st.session_state.zk_verified and st.session_state.zk_button_clicked:
            st.success("✅ ZK Proof of face (Identity verification) successful!")
            
            # Only show Step 3 if Step 2 is completed
            st.subheader("Step 3: Configure Shares")
            col1, col2 = st.columns(2)
            with col1:
                threshold = st.number_input("Number of shares needed for recovery", min_value=2, max_value=10, value=2)
            with col2:
                total_shares = st.number_input("Total number of shares to generate", min_value=threshold, max_value=10, value=3)
            
            if st.button("Confirm Share Configuration", key="confirm_share_configuration"):
                st.session_state.step3_completed = True
                st.session_state.threshold = threshold
                st.session_state.total_shares = total_shares
                st.rerun()

            # Only show Step 4 if Step 3 is completed
            if st.session_state.step3_completed:
                # Step 6: Generate Shares (only show after verification is completed)
                st.subheader("Step 4: Generate Shares")
                
                # Check if we have a valid seed phrase
                if not st.session_state.seed_phrase:
                    st.error("⚠️ Please enter or generate a seed phrase in Step 1 first")
                    return
                
                if not st.session_state.get('shares_generated', False):
                    if st.button("Generate Shares", key="generate_shares_btn"):
                        try:
                            # Validate seed phrase
                            if not Mnemonic("english").check(st.session_state.seed_phrase):
                                st.error("⚠️ Invalid seed phrase. Please check your seed phrase in Step 1")
                                return
                                
                            # Generate passphrase and store it
                            st.session_state.passphrase = secrets.token_hex(32)
                            
                            # Generate Shamir shares
                            groups = generate_mnemonics(
                                group_threshold=1,
                                groups=[(threshold, total_shares)],
                                master_secret=bytes.fromhex(Mnemonic("english").to_entropy(st.session_state.seed_phrase).hex()),
                                passphrase=st.session_state.passphrase.encode()
                            )
                            
                            # Store shares in session state
                            st.session_state.generated_shares = groups[0]
                            st.session_state.shares_generated = True
                            
                            # Initialize confirmations
                            st.session_state.share_confirmations = {f"share_{i+1}": False for i in range(len(groups[0]))}
                            
                            st.info("✅ Shares generated successfully!")
                            st.rerun()
                            
                        except Exception as e:
                            st.error(f"Error generating shares: {str(e)}")
                            st.error("Please make sure you have entered a valid seed phrase in Step 1")
                else:
                    # Display shares only if they've been generated
                    if st.session_state.shares_generated and len(st.session_state.generated_shares) > 0:
                        st.subheader("Generated Shares")
                        
                        # Display each share
                        for i, share in enumerate(st.session_state.generated_shares, 1):
                            with st.expander(f"Share {i}", expanded=True):
                                # Initialize visibility state for this share if not exists
                                share_visibility_key = f"show_share_{i}"
                                if share_visibility_key not in st.session_state:
                                    st.session_state[share_visibility_key] = False
                                
                                # Add button to toggle share visibility with dynamic text
                                if st.button("Show Share in Words" if not st.session_state[share_visibility_key] else "Hide Share in Words", key=f"toggle_share_{i}"):
                                    st.session_state[share_visibility_key] = not st.session_state[share_visibility_key]
                                
                                # Show either blurred or clear share
                                if st.session_state[share_visibility_key]:
                                    col1, col2 = st.columns([4, 1])
                                    with col1:
                                        st.code(share, language="text")
                                    with col2:
                                        if st.button("Copy to Clipboard", key=f"copy_button_{i}"):
                                            st.write("Copied!")
                                            pyperclip.copy(share)
                                else:
                                    st.markdown(f'<div style="font-family: monospace; padding: 10px; background-color: rgb(246, 246, 246); filter: blur(5px);">{share}</div>', unsafe_allow_html=True)
                                
                                # Create two columns for QR and share buttons
                                qr_col, share_col = st.columns([1, 1])
                                
                                with qr_col:
                                    # Create a more compact layout with custom CSS to reduce spacing
                                    st.markdown("""
                                    <style>
                                    .compact-layout {
                                        display: flex;
                                        align-items: flex-start;
                                        gap: 5px;  /* Very small gap between QR and buttons */
                                    }
                                    .qr-code {
                                        flex: 0 0 auto;
                                        width: 150px;
                                    }
                                    .share-buttons {
                                        flex: 1;
                                        padding-top: 0px;  /* Remove top padding */
                                    }
                                    .stMarkdown p {
                                        margin-bottom: 5px;  /* Reduce paragraph margin */
                                    }
                                    </style>
                                    """, unsafe_allow_html=True)
                                    
                                    # Create QR code
                                    qr = qrcode.QRCode(
                                        version=1,
                                        error_correction=qrcode.constants.ERROR_CORRECT_L,
                                        box_size=5,
                                        border=2,
                                    )
                                    qr.add_data(share)
                                    qr.make(fit=True)
                                    qr_image = qr.make_image(fill_color="black", back_color="white")
                                    
                                    # Convert PIL image to bytes
                                    img_byte_arr = io.BytesIO()
                                    qr_image.save(img_byte_arr, format='PNG')
                                    img_byte_arr = img_byte_arr.getvalue()
                                    
                                    # Create a container for the compact layout
                                    st.markdown('<div class="compact-layout">', unsafe_allow_html=True)
                                    
                                    # Use columns with minimal spacing
                                    qr_col, buttons_col = st.columns([1, 1], gap="small")
                                    
                                    with qr_col:
                                        # Display QR code with caption
                                        st.image(img_byte_arr, caption=f"QR Code for Share {i}", width=150)
                                    
                                    with buttons_col:
                                        st.write("Share via:")
                                        # WhatsApp share button
                                        whatsapp_url = f"https://wa.me/?text={share}"
                                        st.markdown(f'<a href="{whatsapp_url}" target="_blank"><button style="background-color: #25D366; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; width: 100%; margin-bottom: 8px;"><img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" style="height: 20px; vertical-align: middle; margin-right: 8px;">WhatsApp</button></a>', unsafe_allow_html=True)
                                        
                                        # Signal share button
                                        signal_url = f"https://signal.me/#p/{share}"
                                        st.markdown(f'<a href="{signal_url}" target="_blank"><button style="background-color: #3A76F0; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; width: 100%; margin-bottom: 8px;"><svg style="height: 20px; vertical-align: middle; margin-right: 8px;" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-6h2v2h-2zm0-8h2v6h-2z"/></svg>Signal</button></a>', unsafe_allow_html=True)
                                        
                                        # Telegram share button
                                        telegram_url = f"https://t.me/share/url?url={share}"
                                        st.markdown(f'<a href="{telegram_url}" target="_blank"><button style="background-color: #0088cc; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; width: 100%;"><img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" style="height: 20px; vertical-align: middle; margin-right: 8px;">Telegram</button></a>', unsafe_allow_html=True)
                                    
                                    st.markdown('</div>', unsafe_allow_html=True)
                                
                                # Add some spacing
                                st.write("")
                                
                                # Confirmation checkbox and status message
                                share_key = f"share_{i}"
                                confirmed = st.checkbox(
                                    "I confirm that I have securely shared this share with a guardian",
                                    key=f"checkbox_{share_key}",
                                    value=st.session_state.share_confirmations.get(share_key, False)
                                )
                                
                                # Update confirmation status
                                st.session_state.share_confirmations[share_key] = confirmed
                                
                                # Use info message type for consistency
                                if confirmed:
                                    st.info(f"✅ Share {i} has been confirmed as shared")
                                else:
                                    st.info(f"ℹ️ Please confirm when you have shared Share {i}")

                            # Check if all shares are confirmed
                            all_confirmed = all(st.session_state.share_confirmations.values())
                            if all_confirmed:
                                st.info("🎉 All shares have been confirmed as shared!")

                                # Step 5: Information display
                                st.subheader("Step 5: Information to remember")

                                # Add final summary
                                st.write("📝 Please note down your setup configuration:")

                                # Add Share Distribution section
                                st.write("\n👥 Share Distribution:")
                                for i in range(st.session_state.total_shares):
                                    st.write(f"• Share {i+1} → Note down to which guardian you have sent it")

                                # Add Recovery Configuration section
                                st.write("\n📋 Recovery Configuration:")
                                st.write(f"• Total Shares: {st.session_state.total_shares}")
                                st.write(f"• Shares needed for recovery: {st.session_state.threshold}")

                                st.write("\n✅ Setup process completed successfully! 🎉")
                            else:
                                st.info("ℹ️ Please confirm all shares before proceeding")

def recovery_process():
    st.header("Recovery Process")
    
    # Initialize recovery session states
    if 'shares_collected_check' not in st.session_state:
        st.session_state.shares_collected_check = False
    if 'zk_verified' not in st.session_state:
        st.session_state.zk_verified = False
    if 'zk_button_clicked' not in st.session_state:
        st.session_state.zk_button_clicked = False
    if 'shares_collected' not in st.session_state:
        st.session_state.shares_collected = False
    if 'collected_shares' not in st.session_state:
        st.session_state.collected_shares = []
    if 'recovery_passphrase' not in st.session_state:
        st.session_state.recovery_passphrase = None
    if 'recovered_seed' not in st.session_state:
        st.session_state.recovered_seed = None
    
    # Step 1: Share Collection Check
    st.subheader("Step 1: Share Collection Check")
    
    st.info("🔍 Before proceeding with the recovery process, please confirm if you have collected the necessary shares from your guardians.")
    
    shares_ready = st.checkbox(
        "✅ I confirm that I have collected all necessary shares from my guardians",
        key="shares_collected_checkbox",
        value=st.session_state.shares_collected_check
    )
    
    if shares_ready:
        st.session_state.shares_collected_check = True
        
        # Step 2: Identity Verification
        st.subheader("Step 2: Identity Verification")
        
        if not st.session_state.zk_verified or not st.session_state.zk_button_clicked:
            col1, col2 = st.columns([3, 1])
            with col1:
                st.info("🔍 Please complete the ZK Proof of face (Identity verification) process to verify your identity")
            with col2:
                if st.button("Perform ZK Proof of face (Identity verification)", key="perform_zk_button"):
                    st.session_state.zk_button_clicked = True
                    # Simulate ZK process
                    with st.spinner("Processing ZK Proof of face (Identity verification)..."):
                        time.sleep(2)  # Simulate processing time
                        st.session_state.zk_verified = True
                        st.rerun()
        
        # Only show Step 3 if ZK is verified AND button was clicked
        if st.session_state.zk_verified and st.session_state.zk_button_clicked:
            st.success("✅ ZK Proof of face (Identity verification) successful!")
            
            # Step 3: Share Input
            st.subheader("Step 3: How many shares do you need or have")
            
            # Initialize session state for threshold if not exists
            if 'recovery_threshold' not in st.session_state:
                st.session_state.recovery_threshold = 3
            
            threshold = st.number_input(
                "Number of shares needed for recovery", 
                min_value=2, max_value=10, 
                value=st.session_state.recovery_threshold,
                key="recovery_threshold_input"
            )
            
            # Update session state threshold
            st.session_state.recovery_threshold = threshold
            
            # Create input fields for shares
            shares = []
            for i in range(threshold):
                share = st.text_input(
                    f"Enter Share {i+1}", 
                    key=f"recovery_share_{i}",
                    help="Enter the share text or scan QR code"
                )
                if share:
                    shares.append(share)
            
            # Show progress
            if shares:
                progress = len(shares) / threshold
                st.progress(progress)
                st.write(f"Collected {len(shares)} of {threshold} required shares")

            # Recovery step
            if len(shares) >= threshold:
                st.success("✅ Required number of shares collected!")
                
                if st.button("Recover Seed Phrase"):
                    try:
                        # Attempt to recover the seed phrase using the shares
                        recovered_entropy = combine_mnemonics(shares)
                        recovered_seed = Mnemonic("english").to_mnemonic(recovered_entropy)
                        
                        st.session_state.recovered_seed = recovered_seed
                        st.success("🎉 Recovery successful!")
                        
                        # Display the recovered seed phrase in a secure way
                        st.warning("⚠️ Your recovered seed phrase (keep this secure!):")
                        st.code(recovered_seed, language="text")
                        
                        # Add option to clear sensitive data
                        if st.button("Clear Recovery Data", key="clear_recovery_data"):
                            # Reset all session states
                            st.session_state.zk_verified = False
                            st.session_state.zk_button_clicked = False
                            st.session_state.shares_collected = False
                            st.session_state.shares_collected_check = False
                            st.session_state.collected_shares = []
                            st.session_state.recovery_passphrase = None
                            st.session_state.recovered_seed = None
                            st.rerun()
                            
                    except Exception as e:
                        st.error(f"Recovery failed. Please check your shares and try again. Error: {str(e)}")
            else:
                st.warning("⚠️ Please provide the required number of shares to proceed with recovery")
    else:
        # Reset states if checkbox is unchecked
        st.session_state.shares_collected_check = False
        st.session_state.zk_verified = False
        st.session_state.zk_button_clicked = False

# Add this new function after the main function
def guardian_perspective():
    st.header("Guardian Perspective")
    
    # Custom CSS for centered headings and image positioning
    st.markdown("""
        <style>
        .centered-header {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            width: 300px;
            margin-left: 60px;
        }
        .stImage {
            text-align: center;
            margin: 0 auto;
            display: block;
            padding-left: 60px;
        }
        .space-above {
            margin-top: 50px;
        }
        </style>
    """, unsafe_allow_html=True)
    
    # Container for content
    container = st.container()
    
    with container:
        # Create columns with adjusted ratios
        _, col2, _ = st.columns([1.7, 1, 1.3])
        
        # Step 1: WhatsApp Message Picture
        with col2:
            st.markdown('<p class="centered-header">Step 1: WhatsApp Message</p>', unsafe_allow_html=True)
            try:
                # Use absolute path to ensure image is found
                whatsapp_image_path = os.path.join(os.path.dirname(__file__), "Guardian Chat.png")
                if os.path.exists(whatsapp_image_path):
                    whatsapp_image = Image.open(whatsapp_image_path)
                    st.image(whatsapp_image, width=300)
                else:
                    st.error(f"Image file not found at: {whatsapp_image_path}")
            except Exception as e:
                st.error(f"Error loading WhatsApp message image: {str(e)}")
        
        st.markdown("<br><br>", unsafe_allow_html=True)
        
        # Step 2: Google Wallet Picture
        _, col2, _ = st.columns([1.7, 1, 1.3])
        with col2:
            st.markdown('<p class="centered-header space-above">Step 2: Google Wallet</p>', unsafe_allow_html=True)
            try:
                # Use absolute path to ensure image is found
                wallet_image_path = os.path.join(os.path.dirname(__file__), "QR code -wihtout my name.png")
                if os.path.exists(wallet_image_path):
                    wallet_image = Image.open(wallet_image_path)
                    st.image(wallet_image, width=300)
                else:
                    st.error(f"Image file not found at: {wallet_image_path}")
            except Exception as e:
                st.error(f"Error loading Google Wallet image: {str(e)}")

if __name__ == "__main__":
    main() 
