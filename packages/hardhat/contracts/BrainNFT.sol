//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./GGToken.sol";

contract BrainNFT is ERC721URIStorage {
	uint256 public constant BRONZE_THRESHOLD = 50 ether;
	uint256 public constant SILVER_THRESHOLD = 300 ether;
	uint256 public constant GOLD_THRESHOLD = 500 ether;
	uint256 public constant NFT_AMOUNT = 9;
	uint256 public constant CLAIM_NFT_REWARD = 20;

	address public owner;
	address public ggToken;
	mapping(address => mapping(uint256 => uint256)) ownerCounter;

	string private baseURI;

	using Counters for Counters.Counter;
	Counters.Counter private _tokenIds;

	constructor(
		address ggToken_,
		string memory baseURI_
	) ERC721("Brain NFT", "FNFT") {
		baseURI = baseURI_;
		ggToken = ggToken_;
	}

	function claimNFT(uint256 nftIndex) external {
		require(GGToken(ggToken).burner() == address(this), "NO_ACCESS");
		require(nftIndex >= 1 && nftIndex <= NFT_AMOUNT, "INVALID_NFT_INDEX");

		uint256 tokens = BRONZE_THRESHOLD;
		if (nftIndex > 7) {
			tokens = GOLD_THRESHOLD;
		} else if (nftIndex > 2) {
			tokens = SILVER_THRESHOLD;
		}
		require(
			GGToken(ggToken).balanceOf(msg.sender) >= tokens,
			"INSUFFICIENT_FUNDS"
		);

		GGToken(ggToken).burnTokens(msg.sender, tokens);
		_tokenIds.increment();
		uint256 newItemId = _tokenIds.current();
		_mint(msg.sender, newItemId);
		_setTokenURI(newItemId, Strings.toString(nftIndex));
		ownerCounter[msg.sender][nftIndex]++;
	}

	function getOwnershipCount(
		address user
	) external view returns (uint256[] memory) {
		uint256[] memory count = new uint256[](NFT_AMOUNT + 1);
		for (uint256 i = 1; i <= NFT_AMOUNT; i++) {
			count[i] = ownerCounter[user][i];
		}
		return count;
	}

	modifier onlyOwner() {
		require(msg.sender == owner, "OWNER_ONLY");
		_;
	}

	function _baseURI() internal view override returns (string memory) {
		return baseURI;
	}

	function setBaseURI(string memory baseURI_) external onlyOwner {
		baseURI = baseURI_;
	}
}
