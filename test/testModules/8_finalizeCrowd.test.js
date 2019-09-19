const { balance, expectEvent } = require('openzeppelin-test-helpers');
var ether = require('../helpers/ethers.js');

var { AssertionError } = require('assert');
const BigNumber = web3.BigNumber;
var EVMRevert = require('../helpers/EVMRevert');
var { increaseTimeTo, duration } = require ('../helpers/increaseTime');
var latestTime = require("../helpers/latestTime");
const Trabic  = artifacts.require('Trabic')
const trabicSale = artifacts.require('trabicCrowdSale')
const Web3 = require('web3')

 require('chai')
.use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();
  // refund Vault
  const RefundVault = artifacts.require('./RefundVault');
// console.log(latestTime.latestTime)
contract('this is the trabic Crowdsale ',function([_,wallet,invester1,invester2],value,rate){


  before(async function() {
    // Transfer extra ether to investor1's account for testing
    await web3.eth.sendTransaction({ from: _, to: invester1, value: ether(25) })
  });

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
       

        this.openingTime = latestTimes + duration.seconds(1);//2589000
         this.closingTime = this.openingTime + duration.seconds(8);
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
        this.trabicCrowdSale=await trabicSale.new(500,this.wallet,this.trabicToken.address,this.cap.toString(), this.openingTime, this.closingTime, this.goal);
      

        // Pause Token
    await this.trabicToken.pause();
         // Transfer token ownership to crowdsale address
         await this.trabicToken.transferOwnership(this.trabicCrowdSale.address)

        //  await this.trabicToken.addMinter(this.trabicCrowdSale.address)


         // Add investors to whitelist
    await this.trabicCrowdSale.addManyToWhitelist([invester1 , invester2]);
    // await this.trabicCrowdSale.addWhitelisted(invester2);
    // await this.trabicCrowdSale.addWhitelisted(invester2);
    await wait(2000);

    // Track refund vault
    this.vaultAddress = await this.trabicCrowdSale.wallet();
    this.vault = await new RefundVault(this.vaultAddress);
   
      // this.vault =  refundEsc.at(this.vaultAddress);
     // Advance time to crowdsale start
     await increaseTimeTo(this.openingTime + 1)


    });
  
    async function wait(ms) {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    }

    


  /// Finalized CrowdSale   
  
//   describe("First Buy Token and then ", function(){

//     it('it buy tokens ', async function(){
//         await wait(2000);
//         // Do not meet the toal
//         await this.trabicCrowdSale.buyTokens(invester1, { value: ether(1), from: invester1 });
//         await this.trabicCrowdSale.buyTokens(invester1, { value: ether(26), from: invester1 });
//  await this.trabicCrowdSale.buyTokens(invester2, { value: ether(26), from: invester2 });
//         // await increaseTimeTo(this.closingTime + 1);
        
//     })

//   })

    //       When Goal is not Reached   //
     describe('when the goal is not reached', function() {

       
      beforeEach(async function () {
        await wait(1000);
        // Do not meet the toal
        await this.trabicCrowdSale.buyTokens(invester2, { value: ether(1), from: invester2 });
         // Fastforward past end time
         await increaseTimeTo(this.closingTime + 1);
        // Finalize the crowdsale
        await wait(8000);
        await this.trabicCrowdSale.finalize({ from: _ });
        
      });

      it('allows the investor to claim refund', async function () {
        //   await wait(2000);
        await this.vault.refund(invester2, {from: invester2}).should.be.fulfilled;
      });
    });
          
    describe('when goal is reached', function(){

    beforeEach(async function(){
      await wait(1000);
 // track current wallet balance
 this.walletBalance = await web3.eth.getBalance(wallet);
 console.log("Balance of Wallet "+this.walletBalance);
// await wait(2000);
 // Meet the goal

 await this.trabicCrowdSale.buyTokens(invester1, { value: ether(26), from: invester1 });
 await this.trabicCrowdSale.buyTokens(invester2, { value: ether(26), from: invester2 });

var goalRe = await this.trabicCrowdSale.goalReached();
console.log("Goal Reached : "+goalRe);
 // Fastforward past end time
 await increaseTimeTo(this.closingTime + 1);
 // Finalize the crowdsale
//  await wait(10000);
await wait(8000);
 await this.trabicCrowdSale.finalize({from:_});


    })


it(' it Handle goal reached ', async function(){

   // Track Goal Reached 

   const goalReached = await this.trabicCrowdSale.goalReached();
   goalReached.should.be.true;
   // finish Minting Token
   const mintingFinished = await this.trabicToken.mintingFinished();
   mintingFinished.should.be.true;

   //Unpause the token
   const paused = await this.trabicToken.paused();
   paused.should.be.false;

//  Prevent Investor from Claiming refund
await this.vault.refund(invester1, {from: invester1}).should.be.rejectedWith(EVMRevert);


})


    })


})

    



///////    ******   Finalize Crowd Sale     ****** Successfull  ***  issue with when crowd sale is reached goal its refund ///////
/////    Test Case Module   10   /////
////   Finsing minting When goal is not reached refund to invester paused Token 
//////     if goal is reached than Need to Revert But it fullfied user to claim refund    ///

