mod libs;
mod types;

use dep::aztec::macros::aztec;

// NFT template taken from the NOIR NFT Contract TUTORIAL and started to modify for Private Lottery NFTs
#[aztec]
pub contract NFT {
    use crate::types::nft_note::{NFTNote, PartialNFTNote};
    use dep::authwit::auth::{
        assert_current_call_valid_authwit, assert_current_call_valid_authwit_public,
        compute_authwit_nullifier,
    };
    use dep::aztec::{
        macros::{
            events::event,
            functions::{initializer, internal, private, public, utility, view},
            storage::storage,
        },
        messages::logs::note::encode_and_encrypt_note,
        note::{constants::MAX_NOTES_PER_PAGE, note_interface::NoteProperties},
        prelude::{
            AztecAddress, Map, NoteGetterOptions, NoteViewerOptions, PrivateContext, PrivateSet,
            PublicContext, PublicImmutable, PublicMutable,
        },
        protocol_types::traits::Serialize,
        protocol_types::traits::Packable,
        protocol_types::traits::Deserialize,
        utils::comparison::Comparator,
    };
    use dep::compressed_string::FieldCompressedString;
    use aztec::protocol_types::traits::ToField;
    use std::meta::derive;
    
    
    #[derive(Serialize)]
    #[event]
    struct NFTTransfer {
        from: AztecAddress,
        to: AztecAddress,
        token_id: Field,
    }

   #[derive(Packable, Serialize, Deserialize)]
    pub struct TokenValues {
        first_ball: u8,
        second_ball: u8,
    }

    #[storage]
    struct Storage<Context> {
        // The symbol of the NFT
        symbol: PublicImmutable<FieldCompressedString, Context>,
        // The name of the NFT
        name: PublicImmutable<FieldCompressedString, Context>,
        // The admin of the contract
        admin: PublicMutable<AztecAddress, Context>,
        // Contains the NFTs owned by each address in private.
        private_nfts: Map<AztecAddress, PrivateSet<NFTNote, Context>, Context>,
        // A map from token ID to a boolean indicating if the NFT is already claimed.
        current_token_id: PublicMutable<u8, Context>,
        // A map from token ID to the public owner of the NFT.
        public_owners: Map<Field, PublicMutable<AztecAddress, Context>, Context>,
        // A mapping of the TokenIds to the values provided
        token_values: Map<u8, PublicMutable<TokenValues, Context>, Context>,
    }

    #[public]
    #[initializer]
    fn constructor(admin: AztecAddress, name: str<31>, symbol: str<31>) {
        assert(!admin.is_zero(), "invalid admin");
        storage.admin.write(admin);
        storage.name.initialize(FieldCompressedString::from_string(name));
        storage.symbol.initialize(FieldCompressedString::from_string(symbol));
        storage.current_token_id.write(1);
    }

    #[public]
    fn set_admin(new_admin: AztecAddress) {
        assert(storage.admin.read().eq(context.msg_sender()), "caller is not an admin");
        storage.admin.write(new_admin);
    }

    #[public]
    #[view]
    fn public_get_current_token_id()->u8{
       storage.current_token_id.read()
    }

    #[private]
    #[view]
    fn private_get_current_token_id()->u8{
       storage.current_token_id.read()
    }


    //code brokey >:/
    #[private]
    fn mint_ticket_in_private(first_ball: u8, second_ball: u8) {
        //current_token_id
        let current_token_value = TokenValues {
            first_ball,
            second_ball,
        };

        let mut current_token_id = private_get_current_token_id();
        
        assert(current_token_id <= 100, "all tickets are minted out");
        storage.token_values.at(current_token_id).write(current_token_value);

        storage.current_token_id.write(current_token_id + 1);
    }

    #[public]
    #[view]
    fn public_get_name() -> pub FieldCompressedString {
        storage.name.read()
    }

    #[private]
    #[view]
    fn private_get_name() -> pub FieldCompressedString {
        storage.name.read()
    }

    #[public]
    #[view]
    fn public_get_symbol() -> pub FieldCompressedString {
        storage.symbol.read()
    }

    #[private]
    #[view]
    fn private_get_symbol() -> pub FieldCompressedString {
        storage.symbol.read()
    }

    #[public]
    #[view]
    fn get_admin() -> Field {
        storage.admin.read().to_field()
    }

    // Transfers token with `token_id` from public balance of message sender to a private balance of `to`.
    #[private]
    fn transfer_to_private(to: AztecAddress, token_id: Field) {
        let from = context.msg_sender();

        let nft = NFT::at(context.this_address());

        // We prepare the private balance increase.
        let partial_note = _prepare_private_balance_increase(to, &mut context, storage);

        // At last we finalize the transfer. Usage of the `unsafe` method here is safe because we set the `from`
        // function argument to a message sender, guaranteeing that he can transfer only his own NFTs.
        nft._finalize_transfer_to_private_unsafe(from, token_id, partial_note).enqueue(&mut context);
    }
    
    #[private]
    fn prepare_private_balance_increase(to: AztecAddress) -> PartialNFTNote {
        _prepare_private_balance_increase(to, &mut context, storage)
    }
    
    #[contract_library_method]
    fn _prepare_private_balance_increase(
        to: AztecAddress,
        context: &mut PrivateContext,
        storage: Storage<&mut PrivateContext>,
    ) -> PartialNFTNote {
        let sender_and_completer = context.msg_sender();

        // We setup a partial note with unpopulated/zero token id for 'to'.
        let partial_note = NFTNote::partial(
            to,
            storage.private_nfts.at(to).storage_slot,
            context,
            to,
            sender_and_completer,
            sender_and_completer,
        );

        partial_note
    }

    #[public]
    fn finalize_transfer_to_private(token_id: Field, partial_note: PartialNFTNote) {
        
        let from_and_completer = context.msg_sender();
        _finalize_transfer_to_private(
            from_and_completer,
            token_id,
            partial_note,
            &mut context,
            storage,
        );
    }
    
    #[public]
    #[internal]
    fn _finalize_transfer_to_private_unsafe(
        from_and_completer: AztecAddress,
        token_id: Field,
        partial_note: PartialNFTNote,
    ) {
        _finalize_transfer_to_private(
            from_and_completer,
            token_id,
            partial_note,
            &mut context,
            storage,
        );
    }
    
    #[contract_library_method]
    fn _finalize_transfer_to_private(
        from_and_completer: AztecAddress,
        token_id: Field,
        partial_note: PartialNFTNote,
        context: &mut PublicContext,
        storage: Storage<&mut PublicContext>,
    ) {
        let public_owners_storage = storage.public_owners.at(token_id);
        assert(public_owners_storage.read().eq(from_and_completer), "invalid NFT owner");

        // Set the public NFT owner to zero
        public_owners_storage.write(AztecAddress::zero());

        // We finalize the transfer by completing the partial note.
        partial_note.complete(context, from_and_completer, token_id);
    }
    
    #[private]
    fn cancel_authwit(inner_hash: Field) {
        let on_behalf_of = context.msg_sender();
        let nullifier = compute_authwit_nullifier(on_behalf_of, inner_hash);
        context.push_nullifier(nullifier);
    }
    
    #[private]
    fn transfer_in_private(from: AztecAddress, to: AztecAddress, token_id: Field, nonce: Field) {
        if (!from.eq(context.msg_sender())) {
            assert_current_call_valid_authwit(&mut context, from);
        } else {
            assert(nonce == 0, "invalid nonce");
        }

        let nfts = storage.private_nfts;

        let notes = nfts.at(from).pop_notes(NoteGetterOptions::new()
            .select(NFTNote::properties().token_id, Comparator.EQ, token_id)
            .set_limit(1));
        assert(notes.len() == 1, "NFT not found when transferring");

        let new_note = NFTNote::new(token_id, to);

        nfts.at(to).insert(new_note).emit(encode_and_encrypt_note(&mut context, to, from));
    }
    
    #[private]
    fn transfer_to_public(from: AztecAddress, to: AztecAddress, token_id: Field, nonce: Field) {
        if (!from.eq(context.msg_sender())) {
            assert_current_call_valid_authwit(&mut context, from);
        } else {
            assert(nonce == 0, "invalid nonce");
        }

        let notes = storage.private_nfts.at(from).pop_notes(NoteGetterOptions::new()
            .select(NFTNote::properties().token_id, Comparator.EQ, token_id)
            .set_limit(1));
        assert(notes.len() == 1, "NFT not found when transferring to public");

        NFT::at(context.this_address())._finish_transfer_to_public(to, token_id).enqueue(
            &mut context,
        );
    }
    
    #[public]
    #[internal]
    fn _finish_transfer_to_public(to: AztecAddress, token_id: Field) {
        storage.public_owners.at(token_id).write(to);
    }

    #[public]
    #[view]
    fn owner_of(token_id: Field) -> AztecAddress {
        let mut current_token_id = get_current_token_id();
        assert(token_id as u8 <= current_token_id, "token does not exist");
        storage.public_owners.at(token_id).read()
    }

    #[utility]
    unconstrained fn get_private_nfts(
        owner: AztecAddress,
        page_index: u32,
    ) -> ([Field; MAX_NOTES_PER_PAGE], bool) {
        let offset = page_index * MAX_NOTES_PER_PAGE;
        let mut options = NoteViewerOptions::new();
        let notes = storage.private_nfts.at(owner).view_notes(options.set_offset(offset));

        let mut owned_nft_ids = [0; MAX_NOTES_PER_PAGE];
        for i in 0..options.limit {
            if i < notes.len() {
                owned_nft_ids[i] = notes.get_unchecked(i).token_id;
            }
        }

        let page_limit_reached = notes.len() == options.limit;
        (owned_nft_ids, page_limit_reached)
    }
}
