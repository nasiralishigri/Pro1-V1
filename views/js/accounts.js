

// var price_connect = require('../../test/coinbaseApi/price.js');


$( document ).ready(function() {

    // console.log("klfahkjdsj");
   
    
    $("#token_id").keyup(function(){
      // $.get('/')
      
        
        var notoken = $('#token_id').val();
        // console.log("Key up here"+ notoken);
        $.get('/getTokenRate',function(tokenRate){
          console.log("Key up here  "+ notoken);
          console.log("token Rate is"+ tokenRate);
          var toEther = (notoken * tokenRate)/1000000000000000000;

          $('#selected_curr_id').val(toEther + "  ETH");
          $.get('/getWalletAddress', function(walletAddress){
            $('#walletAddress').val(walletAddress);
          })
        // price_connect.getTokenOfEther(notoken, tokenRate, function(amountOfEther){
        //      $('#selected_curr_id').val(amountOfEther);
        // } )

        })
        
        
        // alert("Bye! You now leave! " + notoken);
      });
    


});