const { balance, expectEvent } = require('openzeppelin-test-helpers');
var ether = require('../helpers/ethers.js');

var { AssertionError } = require('assert');
const BigNumber = web3.BigNumber;
var EVMRevert = require('../helpers/EVMRevert');
var { increaseTimeTo, duration } = require ('../helpers/increaseTime');
var latestTime = require("../helpers/latestTime");
const Trabic  = artifacts.require('Trabic')
const trabicSale = artifacts.require('TrabicCrowdSale')
const Web3 = require('web3')

 require('chai')
.use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();
  // refund Vault
  const RefundVault = artifacts.require('./RefundVault');
  const TokenTimelock = artifacts.require('./TokenTimelock');
// console.log(latestTime.latestTime)
contract('this is the trabic Crowdsale ',function([_,wallet,invester1,invester2, foundersFund, foundationFund, partnersFund]){
    //const expectedTokenAmount = rate.mul(value);
    beforeEach(async function(){
        this.name='Trabic';
        this.symbol='TRC';
        this.decimals=18;
        this.trabicToken=await Trabic.new(this.name,this.symbol,this.decimals);
        // const wei=1000000000000000000;
        this.cap=  ether(100); //10*wei;
        this.rate=500;
        this.goal = ether(50);
        
        var latestTimes = await latestTime()
        // console.log("Latest TimeStamp of Block is:  "+latestTime );
        this.foundersFund = foundersFund;
        this.foundationFund = foundationFund;
        this.partnersFund = partnersFund;

        this.openingTime = latestTimes + duration.seconds(1);//2589000
         this.closingTime = this.openingTime + duration.seconds(8);
         this.releaseTime = this.closingTime +duration.seconds(4);
        // console.log("Closing Time is :"+this.closingTime );
     // Token Distribution
          this.tokenSalePercentage  = 70;
          this.foundersPercentage   = 10;
          this.foundationPercentage = 10;
          this.partnersPercentage   = 10;

        this.investorMinCap = ether(0.002);
        this.investorHardCap = ether(50);
            // ICO Stages
            this.preIcoStage = 0;
            this.preIcoRate = 500;
            this.icoStage = 1;
            this.icoRate = 250;

        this.wallet=wallet; 
        this.trabicCrowdSale=await trabicSale.new(
            500,
            this.wallet,
            this.trabicToken.address,
            this.cap.toString(), 
            this.openingTime,
            this.closingTime, 
            this.goal,
            this.foundersFund,
            this.foundationFund,
            this.partnersFund,
            this.releaseTime
             
             );
      


             // Pause Token
    await this.trabicToken.pause();
         // Transfer token ownership to crowdsale address
         await this.trabicToken.transferOwnership(this.trabicCrowdSale.address)

        //  await this.trabicToken.addMinter(this.trabicCrowdSale.address)


         // Add investors to whitelist
    await this.trabicCrowdSale.addToWhitelist(invester1);
    await this.trabicCrowdSale.addToWhitelist(invester2);
    // await this.trabicCrowdSale.addWhitelisted(invester2);
    await wait(2000);

    // Track refund vault
    this.vaultAddress = await this.trabicCrowdSale.vault();
    this.vault = await RefundVault.at(this.vaultAddress);
   
      // this.vault =  refundEsc.at(this.vaultAddress);
     // Advance time to crowdsale start
     await increaseTimeTo(this.openingTime + 1)


    });
  
    async function wait(ms) {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    }
    describe('Check token Vesting after finalization', function() {
      
    
    
    beforeEach(async function () {
      // track current wallet balance
      this.walletBalance = await web3.eth.getBalance(wallet);

      // Meet the goal
      await this.trabicCrowdSale.buyTokens(invester1, { value: ether(26), from: invester1 });
      await this.trabicCrowdSale.buyTokens(invester2, { value: ether(26), from: invester2 });
      // Fastforward past end time
      // await increaseTimeTo(this.closingTime + 1);
      await wait(8000);
      // Finalize the crowdsale
      await this.trabicCrowdSale.finalize({ from: _ });
    });

   
    it('handles goal reached', async function () {
        // Tracks goal reached
        const goalReached = await this.trabicCrowdSale.goalReached();
        goalReached.should.be.true;

        // Finishes minting token
        // const mintingFinished = await this.trabicToken.renounceMinter();
        // mintingFinished.should.be.true;

        // Unpauses the token
        const paused = await this.trabicToken.paused();
        paused.should.be.false;

        // Enables token transfers
        await this.trabicToken.transfer(invester2, 1, { from: invester2 }).should.be.fulfilled;

        let totalSupply = await this.trabicToken.totalSupply();
        totalSupply = totalSupply.toString();

        // Founders
        const foundersTimelockAddress = await this.trabicCrowdSale.foundersTimelock();
        let foundersTimelockBalance = await this.trabicToken.balanceOf(foundersTimelockAddress);

        foundersTimelockBalance = foundersTimelockBalance.toString();
        foundersTimelockBalance = foundersTimelockBalance / (10 ** this.decimals);

        let foundersAmount = totalSupply / this.foundersPercentage;
        foundersAmount = foundersAmount.toString();
        foundersAmount = foundersAmount / (10 ** this.decimals);

        assert.equal(foundersTimelockBalance.toString(), foundersAmount.toString());

        // Foundation
        const foundationTimelockAddress = await this.trabicCrowdSale.foundationTimelock();
        let foundationTimelockBalance = await this.trabicToken.balanceOf(foundationTimelockAddress);
        foundationTimelockBalance = foundationTimelockBalance.toString();
        foundationTimelockBalance = foundationTimelockBalance / (10 ** this.decimals);

        let foundationAmount = totalSupply / this.foundationPercentage;
        foundationAmount = foundationAmount.toString();
        foundationAmount = foundationAmount / (10 ** this.decimals);

        assert.equal(foundationTimelockBalance.toString(), foundationAmount.toString());

        // Partners
        const partnersTimelockAddress = await this.trabicCrowdSale.partnersTimelock();
        let partnersTimelockBalance = await this.trabicToken.balanceOf(partnersTimelockAddress);
        partnersTimelockBalance = partnersTimelockBalance.toString();
        partnersTimelockBalance = partnersTimelockBalance / (10 ** this.decimals);

        let partnersAmount = totalSupply / this.partnersPercentage;
        partnersAmount = partnersAmount.toString();
        partnersAmount = partnersAmount / (10 ** this.decimals);

        assert.equal(partnersTimelockBalance.toString(), partnersAmount.toString());

        // Can't withdraw from timelocks
        const foundersTimelock = await TokenTimelock.at(foundersTimelockAddress);
        await foundersTimelock.release().should.be.rejectedWith(EVMRevert);

        const foundationTimelock = await TokenTimelock.at(foundationTimelockAddress);
        await foundationTimelock.release().should.be.rejectedWith(EVMRevert);

        const partnersTimelock = await TokenTimelock.at(partnersTimelockAddress);
        await partnersTimelock.release().should.be.rejectedWith(EVMRevert);

        // Can withdraw from timelocks
        await increaseTimeTo(this.releaseTime + 1);

        await foundersTimelock.release().should.be.fulfilled;
        await foundationTimelock.release().should.be.fulfilled;
        await partnersTimelock.release().should.be.fulfilled;

        // Funds now have balances

        // Founders
        let foundersBalance = await this.trabicToken.balanceOf(this.foundersFund);
        foundersBalance = foundersBalance.toString();
        foundersBalance = foundersBalance / (10 ** this.decimals);

        assert.equal(foundersBalance.toString(), foundersAmount.toString());

        // Foundation
        let foundationBalance = await this.trabicToken.balanceOf(this.foundationFund);
        foundationBalance = foundationBalance.toString();
        foundationBalance = foundationBalance / (10 ** this.decimals);

        assert.equal(foundationBalance.toString(), foundationAmount.toString());

        // Partners
        let partnersBalance = await this.trabicToken.balanceOf(this.partnersFund);
        partnersBalance = partnersBalance.toString();
        partnersBalance = partnersBalance / (10 ** this.decimals);

        assert.equal(partnersBalance.toString(), partnersAmount.toString());

        // Transfers ownership to the wallet
        const owner = await this.trabicToken.owner();
        owner.should.equal(this.wallet);

        // Prevents investor from claiming refund
        await this.vault.refund(invester1, {from: invester1}).should.be.rejectedWith(EVMRevert);
      });


    });
})

    



///////    ******   Token Vesting Crowd Sale Coontributions Finishing and distributing to all    ****** Successfull   ///////
/////    Test Case Module   12   /////
////   Token Distributioin Cases Correctly
//////    Breakdown percentage is correctly   ///

