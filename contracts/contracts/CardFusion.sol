// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title CardFusion - Privacy-preserving card fusion system using FHEVM
/// @notice A dapp that allows players to fuse cards with encrypted attributes
/// @dev All card attributes are encrypted and fusion operations are performed on ciphertext
contract CardFusion is ZamaEthereumConfig, ERC721, ERC721Enumerable, Ownable, ReentrancyGuard {
    /// @notice Counter for card IDs
    uint256 private _cardIdCounter;

    /// @notice Internal function to check if a card exists
    /// @param cardId The ID of the card to check
    /// @return true if the card exists, false otherwise
    function _exists(uint256 cardId) internal view returns (bool) {
        return cards[cardId].owner != address(0);
    }

    /// @notice Structure to store encrypted card attributes
    struct Card {
        uint256 id;
        address owner;
        euint32 attack;      // Encrypted attack value
        euint32 defense;      // Encrypted defense value
        euint32 rarity;       // Encrypted rarity value
        euint32 specialPower; // Encrypted special power value
        bool isFused;         // Whether this card has been used in fusion
    }

    /// @notice Mapping from card ID to Card struct
    mapping(uint256 => Card) public cards;

    /// @notice Event emitted when a new card is minted
    event CardMinted(uint256 indexed cardId, address indexed owner);

    /// @notice Event emitted when two cards are fused
    event CardsFused(
        uint256 indexed cardId1,
        uint256 indexed cardId2,
        uint256 indexed newCardId,
        address owner
    );

    /// @notice Event emitted when a card is burned
    event CardBurned(uint256 indexed cardId);

    /// @notice Constructor
    /// @param name ERC721 token name
    /// @param symbol ERC721 token symbol
    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _cardIdCounter = 1;
    }

    /// @notice Mint a new card with encrypted attributes
    /// @param owner The address that will own the card
    /// @param encAttack Encrypted attack value
    /// @param encDefense Encrypted defense value
    /// @param encRarity Encrypted rarity value
    /// @param encSpecialPower Encrypted special power value
    /// @param inputProof Proof for the encrypted inputs
    /// @return cardId The ID of the newly minted card
    function mintCard(
        address owner,
        externalEuint32 encAttack,
        externalEuint32 encDefense,
        externalEuint32 encRarity,
        externalEuint32 encSpecialPower,
        bytes calldata inputProof
    ) external nonReentrant returns (uint256) {
        require(owner != address(0), "CardFusion: invalid owner address");

        uint256 cardId = _cardIdCounter;
        _cardIdCounter++;

        // Convert external encrypted values to internal euint32
        euint32 attack = FHE.fromExternal(encAttack, inputProof);
        euint32 defense = FHE.fromExternal(encDefense, inputProof);
        euint32 rarity = FHE.fromExternal(encRarity, inputProof);
        euint32 specialPower = FHE.fromExternal(encSpecialPower, inputProof);

        // Create card with encrypted attributes
        cards[cardId] = Card({
            id: cardId,
            owner: owner,
            attack: attack,
            defense: defense,
            rarity: rarity,
            specialPower: specialPower,
            isFused: false
        });

        // Mint NFT
        _safeMint(owner, cardId);

        // Grant ACL permissions for the owner to decrypt
        FHE.allowThis(attack);
        FHE.allow(attack, owner);
        FHE.allowThis(defense);
        FHE.allow(defense, owner);
        FHE.allowThis(rarity);
        FHE.allow(rarity, owner);
        FHE.allowThis(specialPower);
        FHE.allow(specialPower, owner);

        emit CardMinted(cardId, owner);

        return cardId;
    }

    /// @notice Fuse two cards to create a new card with combined encrypted attributes
    /// @param cardId1 ID of the first card to fuse
    /// @param cardId2 ID of the second card to fuse
    /// @return newCardId The ID of the newly created fused card
    /// @dev Fusion formula:
    ///      - New attack = (attack1 + attack2) / 2 + 10
    ///      - New defense = (defense1 + defense2) / 2 + 10
    ///      - New rarity = max(rarity1, rarity2) + 5
    ///      - New specialPower = (specialPower1 + specialPower2) / 2
    function fuseCards(
        uint256 cardId1,
        uint256 cardId2
    ) external nonReentrant returns (uint256) {
        require(cardId1 != cardId2, "CardFusion: cannot fuse same card");
        require(_exists(cardId1), "CardFusion: card1 does not exist");
        require(_exists(cardId2), "CardFusion: card2 does not exist");
        require(!cards[cardId1].isFused, "CardFusion: card1 already fused");
        require(!cards[cardId2].isFused, "CardFusion: card2 already fused");
        require(ownerOf(cardId1) == msg.sender, "CardFusion: not owner of card1");
        require(ownerOf(cardId2) == msg.sender, "CardFusion: not owner of card2");

        Card storage card1 = cards[cardId1];
        Card storage card2 = cards[cardId2];

        // Mark cards as fused
        card1.isFused = true;
        card2.isFused = true;

        // Perform fusion calculations on encrypted values
        // New attack = (attack1 + attack2) / 2 + 10
        euint32 newAttack = FHE.add(
            FHE.div(FHE.add(card1.attack, card2.attack), 2),
            FHE.asEuint32(10)
        );

        // New defense = (defense1 + defense2) / 2 + 10
        euint32 newDefense = FHE.add(
            FHE.div(FHE.add(card1.defense, card2.defense), 2),
            FHE.asEuint32(10)
        );

        // New rarity = max(rarity1, rarity2) + 5
        euint32 maxRarity = FHE.max(card1.rarity, card2.rarity);
        euint32 newRarity = FHE.add(maxRarity, FHE.asEuint32(5));

        // New specialPower = (specialPower1 + specialPower2) / 2
        euint32 newSpecialPower = FHE.div(
            FHE.add(card1.specialPower, card2.specialPower),
            2
        );

        // Create new card
        uint256 newCardId = _cardIdCounter;
        _cardIdCounter++;

        cards[newCardId] = Card({
            id: newCardId,
            owner: msg.sender,
            attack: newAttack,
            defense: newDefense,
            rarity: newRarity,
            specialPower: newSpecialPower,
            isFused: false
        });

        // Mint NFT for the new card
        _safeMint(msg.sender, newCardId);

        // Grant ACL permissions for the owner to decrypt
        FHE.allowThis(newAttack);
        FHE.allow(newAttack, msg.sender);
        FHE.allowThis(newDefense);
        FHE.allow(newDefense, msg.sender);
        FHE.allowThis(newRarity);
        FHE.allow(newRarity, msg.sender);
        FHE.allowThis(newSpecialPower);
        FHE.allow(newSpecialPower, msg.sender);

        // Burn the original cards
        _burn(cardId1);
        _burn(cardId2);

        emit CardsFused(cardId1, cardId2, newCardId, msg.sender);
        emit CardBurned(cardId1);
        emit CardBurned(cardId2);

        return newCardId;
    }

    /// @notice Get encrypted card attributes
    /// @param cardId The ID of the card
    /// @return attack Encrypted attack value
    /// @return defense Encrypted defense value
    /// @return rarity Encrypted rarity value
    /// @return specialPower Encrypted special power value
    /// @return isFused Whether the card has been fused
    function getCardAttributes(
        uint256 cardId
    ) external view returns (
        euint32 attack,
        euint32 defense,
        euint32 rarity,
        euint32 specialPower,
        bool isFused
    ) {
        require(_exists(cardId), "CardFusion: card does not exist");
        Card storage card = cards[cardId];
        return (card.attack, card.defense, card.rarity, card.specialPower, card.isFused);
    }

    /// @notice Get card owner
    /// @param cardId The ID of the card
    /// @return The owner address
    function getCardOwner(uint256 cardId) external view returns (address) {
        require(_exists(cardId), "CardFusion: card does not exist");
        return cards[cardId].owner;
    }

    /// @notice Get total number of cards minted
    /// @return The total number of cards
    function getTotalCards() external view returns (uint256) {
        return _cardIdCounter - 1;
    }

    /// @notice Override required by Solidity
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    /// @notice Override required by Solidity
    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    /// @notice Override required by Solidity for multiple inheritance
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

