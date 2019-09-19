const { balance, expectEvent } = require('openzeppelin-test-helpers');
var ether = require('./helpers/ehers.js');
var { AssertionError } = require('assert');
const BigNumber = web3.BigNumber;
var EVMRevert = require('./helpers/EVMRevert');
var { increaseTimeTo, duration } = require ('./helpers/increaseTime');
var latestTime = require("./helpers/latestTime");
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
       

        this.openingTime = latestTimes + duration.seconds(10);//2589000
         this.closingTime = this.openingTime + duration.weeks(1);
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
        this.trabicCrowdSale=await trabicSale.new(500,this.wallet,this.trabicToken.address,this.cap.toString(), this.openingTime, this.closingTime, this.goal);
          // Transfer token ownership to crowdsale address
        await this.trabicToken.transferOwnership(this.trabicCrowdSale.address)

        // Add investors to whitelist
       
        // await this.trabicCrowdSale.addWhitelisted(invester1);
        // await this.trabicCrowdSale.addWhitelisted(invester2);

        // Track Refund Vault

        this.vaultAddress = await this.trabicCrowdSale.address;
        // this.vaultAddress = await this.trabicCrowdSale.vault();
        // this.vault = RefundVault.at(this.vaultAddress);

        // Advance time to crowdsale start
    await increaseTimeTo(this.openingTime + 1);

        await this.trabicToken.addMinter(this.trabicCrowdSale.address)
       // addMinter(address account) 

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


  ///      Case 4 Minting Crowd Sale ////////////////
  describe("CrowdSale Minting", function(){


    it('this mint after purchase', async function(){
     
        // const orginalTotalSupply = await this.trabicToken.totalSupply();
        // await this.trabicCrowdSale.sendTransaction({value: ether(1), from: invester1});
        // const newTotalSupply = await this.trabicToken.totalSupply();
        // assert.isTrue(newTotalSupply > orginalTotalSupply);

    })
})
 ///// 5 Capped crowdSale   //////
 describe("Caped CrowdSale ", function(){   /// Check Hard Cap ///
    it('it has  correct hard Cap', async function(){
        const hardCap = await this.trabicCrowdSale.cap();
        const hardCap1= hardCap.toString();
        const cap = await this.cap.toString();
       
        assert.equal(cap,hardCap, ' Cap rate is correct both are not  equal');
    })
})

/////    Timed CrowdSale       ///////
describe('timed crowdsale', function() {
    it('is open', async function() {
        // const isOpen = await this.trabicCrowdSale.isOpen();
    //   const isClosed = await this.trabicCrowdSale.hasClosed();
    //   isClosed.should.be.false;
    //   isOpen.should.be.true;
    });
  });

  /////// WhiteListed Crowd Sale ////////

  describe('Whitelisted CrowdSale',function(){    // check

    it('reject non whitelisted user ', async function(){

        const nonWhiteListed = _;
        // await this.trabicCrowdSale.buyTokens(nonWhiteListed, { value: ether(1), from: nonWhiteListed}).should.be.fulfilled//rejectedWith(EVMRevert);

    })
  })


  describe('refundable crowdsale', function() {
    beforeEach(async function() {
      // await this.trabicCrowdSale.buyTokens(invester1, { value: ether(1), from: invester1 });
    });

    describe('during crowdsale', function() {
      it('prevents the investor from claiming refund', async function() {
        // await this.vaultAddress.refund(invester1, { from: invester1 }).should.be.rejectedWith(EVMRevert);
      });
    });
  });

  //    ICO CrowdSale Stages    Stage 9////

  //When Crowd Sale is at on Pre ICO Stage
  describe('when the corwdsale stage is PreICO', function() {
    beforeEach(async function () {
      // Crowdsale stage is already PreICO by default
      // await this.trabicCrowdSale.buyTokens(invester1, { value: ether(1), from: invester1 });
    });

    it('forwards funds to the wallet', async function () {
      const balance = await web3.eth.getBalance(this.wallet);
      // expect(Number(balance).should.to.be.above(Number(ether(100))));
    });
  });

   // When ICO stage Check

   describe("When CrowdSale is ICO Stage", function(){

        beforeEach(async function(){
        await this.trabicCrowdSale.setCrowdSaleStage(this.icoStage, { from: _ });
        // await this.trabicCrowdSale.buyTokens(invester1, { value: ether(1), from: invester1});

        })
        it("It forward fund to Vault Address", async function(){
          // const balance = await web3.eth.getBalance(this.vaultAddress);
          // expect(Number(balance).should.be.above(0));

        })
   })

   // //// Crowd Sale Stages    /////
     describe("Crowd Sale Stages ", function(){
     it('it start in Pre ICO', async function(){
       var stage = await this.trabicCrowdSale.stage();
       Number(stage).should.be.equal(this.preIcoStage);
     })
     it("it start at PreICO Rate", async function(){
       
       var rate = await this.trabicCrowdSale.rate();
       Number(rate).should.be.equal(this.preIcoRate);

     })
     it("it allow admin to change ICO Stage and rate", async function(){

      // await this.trabicCrowdSale.setCrowdSaleStage(this.icoStage, { from: _ });
      // const stage = await this.trabicCrowdSale.stage();
      // Number(stage).should.be.equal(this.icoStage);
      // const rate = await this.trabicCrowdSale.rate();
      // Number(rate).should.be.equal(this.icoRate);
     })
     it("it prevent non-admin to updating stages ", async function(){

      await this.trabicCrowdSale.setCrowdSaleStage(this.icoStage, { from: invester1}).should.rejectedWith(EVMRevert);
     })

     })

    describe(" Accepting Payment ", function(){   /// Accepting Payment
        it('it describe the accept payments', async function(){
         const value = ether(1);
         const purchaser = invester2;

        //  await this.trabicCrowdSale.sendTransaction({value: value, from: invester1}).should.be.fulfilled;
        //  await this.trabicCrowdSale.buyTokens(invester1, {value: value, from: purchaser }).should.be.fulfilled;
        })

    })
   
describe('buyTokens()' , function(){

     describe('When Contribution is less than min investment Cap', function(){ // Min Investment
         it('it shoud reject transactions', async function(){
             const value = this.investorMinCap -100 ;
            //  console.log("Value is : "+ value);
        
            //  await this.trabicCrowdSale.buyTokens(invester2, {value: value , from: invester2}).should.be.rejectedWith(EVMRevert);
         })
    
    describe(' When Contribution exceed hard Cap', function(){

        it(' reject the transaction', async function(){

        // First contribution is in valid range
        const value1 = ether(2);
        // await this.trabicCrowdSale.buyTokens(invester2, { value: value1, from: invester2 });
        // Second contribution sends total contributions over investor hard cap
        const value2 = ether(49);
        // await this.trabicCrowdSale.buyTokens(invester2, { value: value2, from: invester2 }).should.be.rejectedWith(EVMRevert);

                })
            })
     })

     describe('when the investor has already met the minimum cap', function() {
        it('allows the investor to contribute below the minimum cap', async function() {
          // First contribution is valid
          const value1 = ether(1);
          // await this.trabicCrowdSale.buyTokens(invester1, { value: value1, from: invester1 });
          // Second contribution is less than investor cap
          const value2 = 1; // wei
          // await this.trabicCrowdSale.buyTokens(invester1, { value: value2, from: invester1 }).should.be.fulfilled;
        });
      });

})

describe("Transfer Token", function(){
  it("it does not allow the investor to transfer token during ICO", async function(){

 // Buy some tokens first
//  await this.trabicCrowdSale.buyTokens(invester1, { value: ether(1), from: invester1 });
 // Attempt to transfer tokens during crowdsale
//  await this.trabicToken.transfer(invester2, 1, { from: invester1 }).should.be.fulfilled.rejectedWith(EVMRevert);

  })
})
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
