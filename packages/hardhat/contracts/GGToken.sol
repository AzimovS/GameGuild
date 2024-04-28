//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

library Leaderboard {
	struct User {
		address addr;
		uint256 balance;
	}
}

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract GGToken is ERC20 {
	address public owner;
	address public burner;
	mapping(address => bool) existingUsers;
	address[] public holders;

	constructor(uint256 initialSupply) ERC20("Game Guild Token", "GG") {
		owner = msg.sender;
		_mint(msg.sender, initialSupply);
	}

	modifier onlyOwner() {
		require(msg.sender == owner, "OWNER_ONLY");
		_;
	}

	modifier onlyBurner() {
		require(msg.sender == burner, "BURNER_ONLY");
		_;
	}

	function getUsers() external view returns (Leaderboard.User[] memory) {
		Leaderboard.User[] memory users = new Leaderboard.User[](
			holders.length
		);

		for (uint256 i = 0; i < holders.length; i++) {
			users[i].addr = holders[i];
			users[i].balance = balanceOf(holders[i]);
		}

		return users;
	}

	function burnTokens(address target, uint256 tokens) external onlyBurner {
		_burn(target, tokens);
	}

	function setBurner(address _burner) external onlyOwner {
		burner = _burner;
	}

	function rewardTokens(address _user, uint256 _tokens) external onlyOwner {
		_mint(_user, _tokens);
		if (!existingUsers[_user]) {
			holders.push(_user);
		}
		existingUsers[_user] = true;
	}

	function rewardTokensBatch(
		address[] memory users,
		uint256[] memory tokens
	) external onlyOwner {
		for (uint256 i = 0; i < users.length; i++) {
			_mint(users[i], tokens[i]);
			if (!existingUsers[users[i]]) {
				holders.push(users[i]);
			}
			existingUsers[users[i]] = true;
		}
	}

	function _beforeTokenTransfer(
		address from,
		address to,
		uint256 amount
	) internal override {
		super._beforeTokenTransfer(from, to, amount);
	}
}
