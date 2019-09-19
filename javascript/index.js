var _ = require('lodash');
var $ =require('jquery');
var price_connect = require('../public_static/js/others/price.js');


$( document ).ready(function() {

    // console.log("klfahkjdsj");
   alert("This is ready");
    
    $("#token_id").keyup(function(){
        
        var notoken = $('#token_id').val();
        $.get('/getTokenRate',function(tokenRate){
            
        price_connect.getTokenOfEther(notoken, tokenRate, function(amountOfEther){
             $('#selected_curr_id').val(amountOfEther);
        } )

        })
        
        
        // alert("Bye! You now leave! " + notoken);
      });
    


});