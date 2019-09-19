
var Client = require('coinbase').Client;
var client = new Client({'apiKey': '8oEJVBbeccvTnTYD', 'apiSecret': 'M9maqFYEmr0qoIC9cC0CNTVsKrAE9gkU'});


module.exports = {


 
  getEthToUSD: async function(callback){     // Convert Eth to USD

     client.getBuyPrice({'currencyPair': 'ETH-USD'}, function(err, obj) {    // Return Price of Token in USD

      var price = obj.data.amount;  //  1 Eth Price to Dollar
      console.log(" Price is"+ price);
      // var tokenPrice =  (0.02 * 1000000000000000000)/ price;
    //  var tokenPrice =  (tokenRate/1000000000000000000) * price;
     
    //  return price;
      callback(price);
    });
  },
  getEthToBTC: async function(){     // Convert Eth to BTC

      client.getBuyPrice({'currencyPair': 'ETH-BTC'}, function(err, obj) {    // Return Price of Token in USD

      var price = obj.data.amount;  //  1 Eth Price to Bitcoin

     console.log("Price to Bitcoin "+ price);
    //  var tokenPrice =  (tokenRate/1000000000000000000) * price;
     
     return price;
      // callback(tokenPrice);
    });
  }



}

