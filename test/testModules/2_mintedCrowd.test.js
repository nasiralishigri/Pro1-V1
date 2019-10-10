const { balance, expectEvent } = require('openzeppelin-test-helpers');
var ether = require('./../helpers/ethers.js');

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
// this.trabicTokenSale;
// console.log(latestTime.latestTime)
contract('this is the trabic Crowdsale ',function([_,wallet,invester1,invester2, foundersFund, foundationFund, partnersFund],value,rate){
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
         this.releaseTime = this.closingTime +duration.weeks(3);
        // console.log("Closing Time is :"+this.closingTime );
     // Token Distribution
          this.tokenSalePercentage  = 70;
          this.foundersPercentage   = 10;
          this.foundationPercentage = 10;
          this.partnersPercentage   = 10;

        this.investorMinCap = ether(0.002);
        this.inestorHardCap = ether(50);
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
         await this.trabicToken.transferOwnership(this.trabicCrowdSale.address); // this.trabicCrowdSale.address
        //  await this.trabicToken.renounceOwnership();

        //  await this.trabicToken.addMinter(this.trabicCrowdSale.address)
        // Add Invester to WhiteList
        this.trabicCrowdSale.addManyToWhitelist([invester1 ,invester2]);

    });
  
    async function wait(ms) {
        return new Promise(resolve => {
          setTimeout(resolve, ms);
        });
      }


    describe("CrowdSale Minting", function(){


        it('this mint after purchase', async function(){
            await wait(3000);
         
            const orginalTotalSupply = await this.trabicToken.totalSupply();
            await this.trabicCrowdSale.sendTransaction({value: ether(1), from: invester1});

            const newTotalSupply = await this.trabicToken.totalSupply();
            console.log("Original Total Suply "+orginalTotalSupply + "\n New Total Supply "+ newTotalSupply);
            assert.isTrue(newTotalSupply > orginalTotalSupply);
    
        })
    })

    describe(" Accepting Payment ", function(){   /// Accepting Payment
        it('it describe the accept payments', async function(){
            await wait(3000);
         const value = ether(1);
         const purchaser = invester2;

         await this.trabicCrowdSale.sendTransaction({value: value, from: invester2}).should.be.fulfilled;
         await this.trabicCrowdSale.buyTokens(invester1, {value: value, from: purchaser }).should.be.fulfilled;
        })

    })

})



///////    ******   Crowd Sale Minting     ****** Successfully Done  ///////
/////    Test Case Module   4      /////
//////     Transfer Minting Role to CrowdSale address and Mint Token   after minting token totoSupply is increased ///
//       Check Buytokens Method which accept Payment    ///////