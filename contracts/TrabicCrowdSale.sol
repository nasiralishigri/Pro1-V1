pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/PausableToken.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/TokenTimelock.sol";
import "../node_modules/openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "../node_modules/openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "../node_modules/openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "../node_modules/openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";
import "../node_modules/openzeppelin-solidity/contracts/crowdsale/validation/WhitelistedCrowdsale.sol";
import "../node_modules/openzeppelin-solidity/contracts/crowdsale/distribution/RefundableCrowdsale.sol";
// import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract trabicCrowdSale is Crowdsale,MintedCrowdsale ,CappedCrowdsale  ,TimedCrowdsale , WhitelistedCrowdsale , RefundableCrowdsale {
  
  // Track Invester Contribution
 uint256 public investorMinCap = 2000000000000000; // 0.002 ether
  uint256 public investorHardCap = 50000000000000000000;// 2 ether
  mapping(address => uint256) public contributions;

  // ICO Stages
 enum CrowdsaleStage { PreICO, ICO}
  // Default to PreICO stage
  CrowdsaleStage public stage = CrowdsaleStage.PreICO;

  // Token Distribution
  uint256 public tokenSalePercentage   = 70;
  uint256 public foundersPercentage    = 10;
  uint256 public foundationPercentage  = 10;
  uint256 public partnersPercentage    = 10;

    // Token reserve funds
  address public foundersFund;
  address public foundationFund;
  address public partnersFund;

  // Token time lock
  uint256 public releaseTime;
  address public foundersTimelock;
  address public foundationTimelock;
  address public partnersTimelock;



// Constructor of CrowdSale Contract
  constructor(
    uint256 _rate,
    address  _wallet,
    ERC20 _token,
    uint256 _cap,
    uint256 _openingTime,
    uint256 _closingTime,
    uint256 _goal,
    address _foundersFund,
    address _foundationFund,
    address _partnersFund,
    uint256 _releaseTime
      )

  Crowdsale(_rate, _wallet, _token)
  CappedCrowdsale(_cap)
  TimedCrowdsale(_openingTime , _closingTime)
  RefundableCrowdsale(_goal)
    public {
    require(_goal < _cap, "CrowdFunding reached Hard Cap");
    foundersFund = _foundersFund;
    foundationFund = _foundationFund;
    partnersFund = _partnersFund;
    releaseTime = _releaseTime;
}




/**
  * @dev Returns the amount contributed so far by a sepecific user.
  * @param _beneficiary Address of contributor
  * @return User contribution so far
  */
  function getUserContribution(address _beneficiary)
    public view returns (uint256)
  {
    return contributions[_beneficiary];
  }


/**
  * @dev Allows admin to update the crowdsale stage
  * @param _stage Crowdsale stage
  */

function setCrowdSaleStage(uint256 _stage) public onlyOwner{

if( uint(CrowdsaleStage.PreICO) == _stage ){
  stage = CrowdsaleStage.PreICO;
}
else if(uint(CrowdsaleStage.ICO) == _stage){
  stage = CrowdsaleStage.ICO;
}


if(stage == CrowdsaleStage.PreICO){
  rate = 500;
}
else if(stage == CrowdsaleStage.ICO){
  rate = 250;
}

}



  /**
   * @dev forwards funds to the wallet during the PreICO stage, then the refund vault during ICO stage
   */
  function _forwardFunds() internal {
    if(stage == CrowdsaleStage.PreICO) {
    address  wallet;
    wallet.transfer(msg.value);
    } else if (stage == CrowdsaleStage.ICO) {
      super._forwardFunds();
    }
  }


/**
  * @dev Extend parent behavior requiring purchase to respect investor min/max funding cap.
  * @param _beneficiary Token purchaser
  * @param _weiAmount Amount of wei contributed
  */

function _preValidatePurchase1(
    address _beneficiary,
    uint256 _weiAmount
  )
    internal
  {
    super._preValidatePurchase(_beneficiary, _weiAmount);
    uint256 _existingContribution = contributions[_beneficiary];
    uint256 _newContribution = _existingContribution.add(_weiAmount);
    require(_newContribution >= investorMinCap && _newContribution <= investorHardCap,'this transection ok now  because it is in between range');
    contributions[_beneficiary] = _newContribution;
  }


 /**
   * @dev enables token transfers, called when owner calls finalize()
  */
  function finalization() internal {
    if(goalReached()) {
      MintableToken _mintableToken = MintableToken(token);
      uint256 _alreadyMinted = _mintableToken.totalSupply(); // Get TotalSupply which token buy by invester

      uint256 _finalTotalSupply = _alreadyMinted.div(tokenSalePercentage).mul(100); // final total supply is invester % and added other part in total supply

      foundersTimelock = new TokenTimelock(token, foundersFund, releaseTime);
      foundationTimelock = new TokenTimelock(token, foundationFund, releaseTime);
      partnersTimelock = new TokenTimelock(token, partnersFund, releaseTime);


      _mintableToken.mint(address(foundersTimelock),   _finalTotalSupply.mul(foundersPercentage).div(100));   //Mint Token of Founders
      _mintableToken.mint(address(foundationTimelock), _finalTotalSupply.mul(foundationPercentage).div(100));
      _mintableToken.mint(address(partnersTimelock),   _finalTotalSupply.mul(partnersPercentage).div(100));


// Do more stuff....
      _mintableToken.finishMinting();
       // Unpause the token
      PausableToken _pausableToken = PausableToken(token);
      _pausableToken.unpause();
      _pausableToken.transferOwnership(wallet);
    }

    super.finalization();
  }

}
