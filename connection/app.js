const contract = require('truffle-contract');
const Web3 = require('web3');
const trabic_artifact = require('../build/contracts/Trabic.json');

const crowdSale_artifact = require('../build/contracts/trabicCrowdSale.json');
const metacoin_artifact = require('../build/contracts/MetaCoin.json');


const web3Provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
var MetaCoin = contract(metacoin_artifact);
var TrabicCoin=contract(trabic_artifact)
var CrowdSale = contract(crowdSale_artifact);


module.exports = {

  start: function(callback) {    //// Get All Accounts /////
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(self.web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    self.web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
         console.log("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      self.accounts = accs;
      self.account = self.accounts[2];

     callback(self.accounts);
    });
  },


  tokenName:async function(){ ////   Get Token Name From Token Contract   //////
    let token;
    var self =this;
   await TrabicCoin.setProvider(self.web3.currentProvider)
   
   token=await TrabicCoin.deployed();
   const tokenName=await token.name();
    return tokenName;
},
tokenSymbol:async function(){  ////// Get Token Symbol from Token Contract   ///////////
  let token;
  var self =this;
 await TrabicCoin.setProvider(self.web3.currentProvider)
 
 token = await TrabicCoin.deployed();
 const tokenSymbol=await token.symbol();

return tokenSymbol;
},

tokenDecimal:async function(){  ////// Get Decemal of Token  ///////////
  let token;
  var self =this;
 await TrabicCoin.setProvider(self.web3.currentProvider)
 
 token = await TrabicCoin.deployed();
 const tokenDecimal=await token.decimals();

return tokenDecimal;
},

tokenRate:async function(){  ////// Get Token Price  ///////////
  let token;
  var self =this;
  try{
 await CrowdSale.setProvider(self.web3.currentProvider)

 
 token = await CrowdSale.deployed();
 const tokenRate=await token.rate();
return tokenRate;
  }
  catch(err){
    console.log("Erorr is : "+ err);
  }
},

totalSupply:async function(){  ////// Total Supply is///////////
  let token;
  var self =this;
  try{
 await CrowdSale.setProvider(self.web3.currentProvider)

 
 token = await TrabicCoin.deployed();
 const totalSupply=await token.totalSupply();
return totalSupply;
  }
  catch(err){
    console.log("Erorr is : "+ err);
  }
},
weiRaised:async function(){  ////// Get Wei Raised ///////////
  let token;
  var self =this;
  try{
 await CrowdSale.setProvider(self.web3.currentProvider)

 
 token = await CrowdSale.deployed();
 const waiRaised=await token.weiRaised();
return waiRaised;
  }
  catch(err){
    console.log("Erorr is : "+ err);
  }
},
minCap:async function(){  ////// Minimum Inverstment  ///////////
  let token;
  var self =this;
  try{
 await CrowdSale.setProvider(self.web3.currentProvider)
 
 token = await CrowdSale.deployed();
 const tokenRate=await token.weiRaised();
return tokenRate;
  }
  catch(err){
    console.log("Erorr is : "+ err);
  }
},
tokenAddress:async function(){  ////// Getting Token Address  ///////////
  let token;
  var self =this;
  try{
 await CrowdSale.setProvider(self.web3.currentProvider)
 
 token = await CrowdSale.deployed();
 const tokenAddress =await token.token();
return tokenAddress;
  }
  catch(err){
    console.log("Erorr is : "+ err);
  }
},
walletAddress:async function(){  ////// Getting Wallet Address  ///////////
  let token;
  var self =this;
  try{
 await CrowdSale.setProvider(self.web3.currentProvider)
 
 token = await CrowdSale.deployed();
 const walletAddress =await token.wallet();
return walletAddress;
  }
  catch(err){
    console.log("Erorr is : "+ err);
  }
},
hardCap:async function(){  ////// Getting Hard Cap   ///////////
  let token;
  var self = this;
  try{
 await CrowdSale.setProvider(self.web3.currentProvider)
 
 token = await CrowdSale.deployed();
 const hardCap =await token.cap();
return hardCap;
  }
  catch(err){
    console.log("Erorr is : "+ err);
  }
},
sendTransaction:async function(accounts){  ////// send Transactions  ///////////
  let token;
  var self = this;
  try{
 await CrowdSale.setProvider(self.web3.currentProvider)

// var investor = accounts;

 var _value =100;
 console.log("Investor is  "+accounts[1]);
 
 token = await CrowdSale.deployed();
 const sendTransaction =await token.sendTransaction({value: _value, from: accounts[1]});
return sendTransaction;
  }
  catch(err){
    console.log("Erorr is : "+ err);
  }
},
buyToken:async function(accounts){  ////// Buy Tokens  ///////////
  let token;
  var self = this;
  try{
 await CrowdSale.setProvider(self.web3.currentProvider)

// var investor = accounts;

 var _value =100;
 var investor = accounts[0];
 var purchaser = accounts[3];
 console.log("Investor address is:  "+investor + "     Purchaser address : "+purchaser);
 
 token = await CrowdSale.deployed();
 const buyTokens =await token.buyToken(purchaser,{value:value,from: accounts[3]});
return buyTokens;
  }
  catch(err){
    console.log("Erorr is : "+ err);
  }
},

balanceOfUser:async function(accounts){     /// Getting Balance of Current User

  let token;
  var self = this;
  await TrabicCoin.setProvider(self.web3.currentProvider);
  // var acc = await self.web3.eth.getAccounts();
  // var account;
  // await self.web3.eth.getAccounts(function(err, accs) {
  //   if (err != null) {
  //      console.log("There was an error fetching your accounts.");
  //     return;
  //   }

  //   if (accs.length == 0) {
  //     console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
  //     return;
  //   }
  //   account = accs[0];
  // })

  token = await TrabicCoin.deployed();
  var balanceIs = await token.balanceOf(accounts[0]);
  console.log("Balance is : "+ balanceIs);

  // Grab the template script
  // var theTemplateScript = $("#address-template").html();

  // // Compile the template
  // var theTemplate = Handlebars.compile(theTemplateScript);

  // // Define our data object
  // var context={
  //   "city": "London",
  //   "street": "Baker Street",
  //   "number": "221B"
  // };

  // // Pass our data to the template
  // var theCompiledHtml = theTemplate(context);

  // // Add the compiled html to the page
  // $('.content-placeholder').html(theCompiledHtml);


  return balanceIs;

 


},








  
  refreshBalance: function(account, callback) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(self.web3.currentProvider);

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account, {from: account});
    }).then(function(value) {
        callback(value.valueOf());
    }).catch(function(e) {
        console.log(e);
        callback("Error 404");
    });
  },
  sendCoin: function(amount, sender, receiver, callback) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(self.web3.currentProvider);

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.sendCoin(receiver, amount, {from: sender});
    }).then(function() {
      self.refreshBalance(sender, function (answer) {
        callback(answer);
      });
    }).catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });
  }
}
