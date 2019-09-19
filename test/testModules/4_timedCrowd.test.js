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
// this.trabicTokenSale;
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
         this.closingTime = this.openingTime + duration.weeks(1);
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

    });
  

    async function wait(ms) {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    }
    describe('timed crowdsale', function() {
        it('is open not reached closing time', async function() {
          await wait(1000);
           
          const isClosed = await this.trabicCrowdSale.hasClosed();
          isClosed.should.be.false;
         
        });
       
    
       
      });
    
   
    

})



///////    ******   Timed Crowd Sale     ****** Successfully Done   ///////
/////    Test Case Module   6     /////
//////     Check the CrowdSale stage is reached to close or open  ///
/////          ///////
