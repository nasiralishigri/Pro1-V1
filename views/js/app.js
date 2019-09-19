App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    console.log("App initialized...")
    return App.initWeb3();
  },

  initWeb3: async function() {


    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
      // Request account access
      await window.ethereum.enable();
      } catch (error) {
      // User denied account access...
      console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContracts();
  },

  initContracts: function() 
  {
    $.getJSON("ERC20_Implementation.json",function(dappTokenSale) 
    {
      App.contracts.ERC20_Implementation = TruffleContract(dappTokenSale);
      App.contracts.ERC20_Implementation.setProvider(App.web3Provider);

        App.contracts.ERC20_Implementation.deployed().then(function(dappTokenSale) 
        {
          console.log("Dapp Token Sale Address:", dappTokenSale.address);      

          return App.render();
        })
      
     })
    
  },

 

  render: async function() {
    multi(10,10);

  // hello();
  // var pai = new Square(4);
  // console.log('hello');
  // const text =new text(4);
  //console.log(text);
var person =[ 
  {
    name:"Invester",
    value : 80
 }, 
 {
   name: "MArketer",
   value: 7
},
 {
   name: "Owner",
   value:46
  }
];
    // piChartModule.drawChart(person);

 
}

}
$(function() {
  $(window).load(function() {
   
    // alert("Call to App.js ");
   
    App.init();
  })
});



