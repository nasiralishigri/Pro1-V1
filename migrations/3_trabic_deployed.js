var Migrations = artifacts.require("./Trabic.sol");
var CrowdSale = artifacts.require("./trabicCrowdSale.sol");

// var ether = require('./../test/helpers/ethers.js');


const ether = (n) => new web3.BigNumber(web3.toWei(n, 'ether'));    // change wei to ether

const duration = {                                    // Get different Time Duratuib by using duration object
  seconds: function (val) { return val; },
  minutes: function (val) { return val * this.seconds(60); },
  hours: function (val) { return val * this.minutes(60); },
  days: function (val) { return val * this.hours(24); },
  weeks: function (val) { return val * this.days(7); },
  years: function (val) { return val * this.days(365); },
};


module.exports = async function( deployer , accounts ) { 

  await deployer.deploy(
    Migrations,
    'Trabic',
    'TRC',
     18
    );  // Deploy TRC Token

  const trabicToken = await Migrations.deployed();    // get Obj of TRC Token


  const latestTime = (new Date).getTime();
  const _rate = 500;
  const _wallet = accounts[0];   // CrowdSale Wallet Address to Raise fund
  const _token = trabicToken.address;  // get Address of trabicToken
  const _openingTime = latestTime + duration.minutes(1);   // CrowdSale Opening Time
  const _closingTime = _openingTime + duration.weeks(5);   // Closing Time of CrowdSale
  const _cap = ether(100);
  const _goal =  ether(50);
  const _foundersFund = accounts[6];  // Set Founders fund Address
  const _foundationFund = accounts[7]; // Set Foundation fund account address
  const _partnersFund = accounts[8];  // Set Partners fund account address
  const _releaseTime = _closingTime + duration.days(5); // Fund distribution time is 

  // const wei=100000000000000;
  // const _cap=10*wei;
  // var _rate= 200000000000000;
  // var checkAccount =await web3.eth.getAccounts();
  // var trabiAddress = trabicToken.address;
  // console.log("Trabic Token address is : "+ trabiAddress);
  // // console.log("Checking account in migration is :"+ checkAccount[0]);
  
  // // var _wallet=accounts[1];
  // // console.log("Wallet address in Migration is : "+ _wallet);

  // var openinigTime =  1566299617105;
  // var closingTime =   15662999999999;
  // var _goal = 5 *wei;
  // const _foundersFund   = accounts[1]; // TODO: Replace me
  // const _foundationFund = accounts[0]; // TODO: Replace me
  // const _partnersFund   = accounts[0]; // TODO: Replace me
  // const _releaseTime    = closingTime + 10000000;

  
await deployer.deploy(
  CrowdSale,
  _rate,
  _wallet,
  _token,
  _cap,
  _openingTime,
  _closingTime,
  _goal,
  _foundersFund,
  _foundationFund, 
  _partnersFund,
  _releaseTime
    );
  //  await CrowdSale.deployed();

  return true;
};