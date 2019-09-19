var latestTime = require("./test2.js");
// var promise1 = Promise.resolve(latestTime());
async function fun(){
var latestBlockTime ;
        await latestTime().then(function(value) {
    
            latestBlockTime = value;
           
          });
          console.log("Latest Block Time Stamp is: "+ latestBlockTime);
        }
        fun();