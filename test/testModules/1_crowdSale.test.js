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
       

        this.openingTime = latestTimes + duration.seconds(10);//2589000
         this.closingTime = this.openingTime + duration.weeks(1);
         this.releaseTime = this.closingTime + duration.days(5);
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
      

    });
    it('track the trabic token',async function(){
        const tokenTrack=await this.trabicCrowdSale.token();
        tokenTrack.should.be.equal(this.trabicToken.address);
    })
    it('this is tracking of wallet address',async function(){
        const wallletAddress=await this.trabicCrowdSale.wallet();
        wallletAddress.should.equal(this.wallet)
    })

   describe('this is testing weather rate is correct',function(){

    it('this is tracking of rate ',async function(){
        //const value =ether(1);
        const wallletAddress=await this.trabicCrowdSale.rate();
        //wallletAddress.should.be.bignumber.equal(value)
        assert.equal(wallletAddress,this.rate,'both rate are equals') 
    })

   })
})