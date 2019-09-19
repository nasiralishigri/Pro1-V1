pragma solidity ^0.4.23;
// import "/media/hammad/New Volume/ExpressBox/contracts/ERC1404.sol";
//import "openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
//import "openzeppelin-solidity/contracts/token/ERC20/PausableToken.sol";
// import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/PausableToken.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";




contract Trabic is MintableToken, PausableToken, DetailedERC20{
   // string public constant name = "ERC20Token"; // solium-disable-line uppercase
    //string public constant symbol = "ERC"; // solium-disable-line uppercase
    //uint8 public constant decimals = 18; // solium-disable-line uppercase
   // uint256 public constant INITIAL_SUPPLY = 10000 * (10 ** uint256(decimals));
    uint8 public constant SUCCESS_CODE = 0;
    uint8 public constant ZERO_ADDRESS_RESTRICTION_CODE = 1;
    string public constant UNKNOWN_MESSAGE = "UNKNOWN";
    string public constant SUCCESS_MESSAGE = "SUCCESS";
    string public constant ZERO_ADDRESS_RESTRICTION_MESSAGE = "ILLEGAL_TRANSFER_TO_ZERO_ADDRESS";
    mapping (address => uint256) private blacklist;

  constructor(
       string memory _name,
       string memory _symbol, 
       uint8 _decimals
       )
        DetailedERC20(_name,_symbol,_decimals)
        public
    {

    }
 function addToBlacklist (address _user) public onlyOwner  {
        blacklist[_user] = 1;
    }
 function removeToBlacklist (address _user) public onlyOwner {
        blacklist[_user] = 0;
    }
  function isUserBlacklisted(address _user) public returns (uint256) {
        return blacklist[_user];
    }
   modifier notRestricted (address from, address to, uint256 value) {
        uint8 restrictionCode = detectTransferRestriction(from, to, value);
        require(blacklist[from] == 0 && blacklist[to] == 0);
        require(restrictionCode == SUCCESS_CODE, messageForTransferRestriction(restrictionCode));
        _;
  }
     function detectTransferRestriction (address from, address to, uint256 value)
        public returns (uint8 restrictionCode)
    {
        restrictionCode = SUCCESS_CODE; // success
        if (to == address(0x0)) {
            restrictionCode = ZERO_ADDRESS_RESTRICTION_CODE; // illegal transfer to zero address
        }
    }
 function messageForTransferRestriction (uint8 restrictionCode)
        public  returns (string memory message)
    {
        message = UNKNOWN_MESSAGE;
        if (restrictionCode == SUCCESS_CODE) {
            message = SUCCESS_MESSAGE;
        } else if (restrictionCode == ZERO_ADDRESS_RESTRICTION_CODE) {
            message = ZERO_ADDRESS_RESTRICTION_MESSAGE;
        }
    }
       function transfer (address to, uint256 value)
        public notRestricted(msg.sender, to, value) returns (bool)
    {
        return super.transfer(to, value);
    }



}
