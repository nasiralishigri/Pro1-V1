 async function  latestTime () {

  var block= await web3.eth.getBlock('latest', function(error, result){
}) 
var blockTimeStamp= await block.timestamp;
// console.log("Time Stamp : "+blockTimeStamp);
   
return blockTimeStamp;

  }
  module.exports = latestTime;