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
  const RefundVault = artifacts.require('./RefundVault.sol');
// console.log(latestTime.latestTime)
contract('this is the trabic Crowdsale ',function([_,wallet,invester1,invester2],value,rate){
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
         this.closingTime = this.openingTime + duration.seconds(10);
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
      
         // Transfer token ownership to crowdsale address
         await this.trabicToken.transferOwnership(this.trabicCrowdSale.address)

        //  await this.trabicToken.addMinter(this.trabicCrowdSale.address)


         // Add investors to whitelist
    await this.trabicCrowdSale.addManyToWhitelist([invester1, invester2]);
    // await this.trabicCrowdSale.addWhitelisted(invester2);
    await wait(2000);

    // Track refund vault
    this.vaultAddress = await this.trabicCrowdSale.vault();
    this.vault =  new RefundVault(this.vaultAddress);
   
      // this.vault =  refundEsc.at(this.vaultAddress);
     // Advance time to crowdsale start
     await increaseTimeTo(this.openingTime + 1)


    });
  
    async function wait(ms) {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    }

    describe('refundable crowdsale', function() {
      beforeEach(async function() {
    await wait(2000);
        await this.trabicCrowdSale.buyTokens(invester1, { value: ether(1), from: invester1 });
        
      });
  
      describe('during crowdsale', function() {

        it('prevents the investor from claiming refund', async function() {
          
          await wait(12000);
           await this.vault.refund(invester1, { from: invester1 }).should.be.rejectedWith(EVMRevert);
        });
      });
    });

    
   
    

})

///// Need Revision after completion before launch

///////    ******   Refundable Crowd Sale     ****** 1 test case successfull but doubt Un-Successfull test is in pending   ///////
/////    Test Case Module   8    /////
////   Test Refund without during crowdsale then this sto  successfully
//////     Refund to invester valut if goal not reached on time  ///

