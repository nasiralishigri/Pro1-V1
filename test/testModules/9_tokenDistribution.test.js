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

    
    describe('token distribution', function() {
        it('tracks token distribution correctly', async function () {
          const tokenSalePercentage = await this.trabicCrowdSale.tokenSalePercentage();
          Number(tokenSalePercentage).should.be.equal(this.tokenSalePercentage, 'has correct tokenSalePercentage');
          const foundersPercentage = await this.trabicCrowdSale.foundersPercentage();
          Number(foundersPercentage).should.be.equal(this.foundersPercentage, 'has correct foundersPercentage');
          const foundationPercentage = await this.trabicCrowdSale.foundationPercentage();
          Number(foundationPercentage).should.be.equal(this.foundationPercentage, 'has correct foundationPercentage');
          const partnersPercentage = await this.trabicCrowdSale.partnersPercentage();
          Number(partnersPercentage).should.be.equal(this.partnersPercentage, 'has correct partnersPercentage');
        });
        it('is a valid percentage breakdown', async function () {
          const tokenSalePercentage = await this.trabicCrowdSale.tokenSalePercentage();
          const foundersPercentage = await this.trabicCrowdSale.foundersPercentage();
          const foundationPercentage = await this.trabicCrowdSale.foundationPercentage();
          const partnersPercentage = await this.trabicCrowdSale.partnersPercentage();
      
          const total = tokenSalePercentage.toNumber() + foundersPercentage.toNumber() + foundationPercentage.toNumber() + partnersPercentage.toNumber()
          total.should.equal(100);
        });
      
      });
  
  


})

    



///////    ******   Token Distribution     ****** Successfull  ***  ///////
/////    Test Case Module   11  /////
////   Check Distribution between Owner Partner Invester and others  ///
/////   Test All Distribution with percentage will be 100 an valid   ////

