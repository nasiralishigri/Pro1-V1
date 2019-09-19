var BigNumber = require('bignumber.js');
 function ether (n) {
 var b=web3.utils.toWei(n.toString(), 'ether')
 //var c=new  
 return new BigNumber(b);
}

module.exports = ether;