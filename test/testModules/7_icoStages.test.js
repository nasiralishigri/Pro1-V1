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
  
contract('this is the trabic Crowdsale ', function([_,wallet,invester1,invester2, foundersFund, foundationFund, partnersFund],value,rate){
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
         this.closingTime = this.openingTime + duration.weeks(3);
         console.log("Opening Time is : "+this.openingTime +"\n Closing Time is : "+ this.closingTime);
         this.releaseTime = this.closingTime + duration.years(1);
         
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
          foundersFund,
          foundationFund,
          partnersFund,
          this.releaseTime
        );
      
         // Transfer token ownership to crowdsale address
         await this.trabicToken.transferOwnership(this.trabicCrowdSale.address)
        

        //  await this.trabicToken.addMinter(this.trabicCrowdSale.address)


         // Add investors to whitelist
    await this.trabicCrowdSale.addToWhitelist(invester1);
   
     await increaseTimeTo(this.openingTime + 1)


    });
  


       
    describe('crowdsale stages', function() {

      it('it starts in PreICO', async function () {
        const stage = await this.trabicCrowdSale.stage();
        assert.equal(stage , this.preIcoStage , "This both value are not equal ");
        // stage.should.be.equal(this.preIcoStage);
      });
  
      it('starts at the preICO rate', async function () {
        const rate = await this.trabicCrowdSale.rate();
        assert.equal(rate , this.preIcoRate , "Hey! rate is not equal ");
        // rate.should.be.equal(this.preIcoRate);
      });
  
      it('allows admin to update the stage ', async function() {
        // await wait(3000);
        await this.trabicCrowdSale.setCrowdSaleStage(this.icoStage, { from: _ });
        const stage = await this.trabicCrowdSale.stage();
        assert.equal(stage , this.icoStage , " this stage is not in ICO Stage");
        
      });
      it('allows admin to update the  rate', async function() {
        // await wait(3000);
        await this.trabicCrowdSale.setCrowdSaleStage(this.icoStage, { from: _ });
        const rate = await this.trabicCrowdSale.rate();

        assert.equal(Number(rate) , this.icoRate , " Hey this rate is not equal to ICO rate \n its means this is not in ICO Stage");
        // rate.should.be.bignumber.equal(this.icoRate);
      });
  
      it('prevents non-admin from updating the stage', async function () {
        await this.trabicCrowdSale.setCrowdSaleStage(this.icoStage, { from: invester1 }).should.be.rejectedWith(EVMRevert);
      });
    });
        
       
  

    
   
    

})



///////    ******   STO Stages of  Crowd Sale     ****** All cases Successfull test    ///////
/////    Test Case Module   9    /////
//////     Set Crowd Sale Stages only right to admin  ///
///// According to stages change the rate of token   ////

