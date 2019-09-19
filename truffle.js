// Allows us to use ES6 in our migrations and tests.
require('babel-register')
require('babel-register')();
require('babel-polyfill');

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*'
    }
  },
   compilers: {
    solc: {
      version: "0.4.24" // ex:  "0.4.20". (Default: Truffle's installed solc)
    }
 } 


}

// compilers: {
//     solc: {
//       version: "0.4.25"
//     }
//   }