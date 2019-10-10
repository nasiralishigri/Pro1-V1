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
       

        this.openingTime = latestTimes + duration.seconds(1);//2589000
         this.closingTime = this.openingTime + duration.weeks(1);
         this.releaseTime = this.closingTime + duration.weeks(4);
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

        //   await this.trabicToken.addMinter(this.trabicCrowdSale.address)
 
 await wait(2000);
          // Add investors to whitelist
     await this.trabicCrowdSale.addToWhitelist(invester1);
     await this.trabicCrowdSale.addToWhitelist(invester2);

    });
  


    async function wait(ms) {
        return new Promise(resolve => {
          setTimeout(resolve, ms);
        });
      }
  

    describe("Caped CrowdSale ", function(){   /// Check Hard Cap ///
        it('it has  correct hard Cap', async function(){
            const hardCap = await this.trabicCrowdSale.cap();
            const hardCap1= hardCap.toString();
            const cap = await this.cap.toString();
            console.log("Cap is "+ cap);
           
            assert.equal(cap,hardCap, ' Cap rate is correct both are not  equal');
        })


        describe('buyTokens()' , function(){

            describe('When Contribution is less than min investment Cap', function(){ // Min Investment Rejected
                it('it shoud reject transactions', async function(){
                    const value1 = this.investorMinCap  - 100 ;
                    
                    assert.notEqual(value1, this.investorMinCap, 'these numbers are not equal');

                   //  console.log("Value is : "+ value);
               
                    await this.trabicCrowdSale.buyTokens(invester1, {value: value1 , from: invester1}).should.be.rejectedWith(EVMRevert);

                })

            })


           describe('When the invester has already met minimum cap', function(){ // Invester Contribute less then min investment cap if they have already invested

            it('it allow the contributer to contribute below min investment cap', async function(){

                const value1 = ether(1);
                // First contributtion is valid
                console.log("Its just running....");
                await this.trabicCrowdSale.buyTokens(invester1, {value: value1 , from:invester1}).should.be.fulfilled;

                // second contribution is less than min investment

                const value2 = 5 ;// 5 Wei
                await this.trabicCrowdSale.buyTokens(invester1, {value:value2 , from: invester1}).should.be.fulfilled;


            })
           })

           
           describe(' When Contribution exceed hard Cap', function(){   // If User contribute exceed HardCap then
       
               it(' reject the transaction', async function(){   
       
               // First contribution is in valid range
               const value1 = ether(2);
               await this.trabicCrowdSale.buyTokens(invester1, { value: value1, from: invester2 });
               // Second contribution sends total contributions over investor hard cap
               const value2 = ether(49);
               await this.trabicCrowdSale.buyTokens(invester1, { value: value2, from: invester2 }).should.be.rejectedWith(EVMRevert);
       
                       })
                   })
                  
           


            describe('when the contribution is within the valid range', function(){
                it("it succeeded and Update the Contribution Amount  ", async function(){
                const value1 = ether(0.02);
                const value2 = ether(1);
                const sumVal = Number(value1) + Number(value2);
                await this.trabicCrowdSale.buyTokens(invester1, { value:value1 , from: invester1}).should.be.fulfilled;

                await this.trabicCrowdSale.buyTokens(invester1, { value:value2 , from: invester1}).should.be.fulfilled;

                var  contribute = await this.trabicCrowdSale.contributions(invester1);
                console.log("Contribution direcctly : " + contribute + "     \n Value     :  "+ sumVal);
                // var contribution = await this.trabicCrowdSale.getUserContribution(invester1);
                // console.log("Contribution is  "+ contribution);
                assert.equal(contribute.toString(),sumVal.toString(), " Hey! This contribution is not equal ");


                })
            })
       
          
       
       })
    
       
    })
   
    

})



///////    ******   Capped Crowd Sale     ****** Successfully Done  all cases ///////
/////    Test Case Module   5      /////
//////     Check Total Cap ///
//       Check  les than minimum cap then reject    ///////
//   check if the invester already invest and they send less than min contributioin then successfully send ////
//       Check  exceed hard cap then reject  transaction    ////
//      send transaction and check the contribution of contributer // ////
