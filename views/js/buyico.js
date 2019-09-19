$( document ).ready(function() {
    // console.log("klfahkjdsj");   


    $("#toETH").keyup(function(){       // If Enter any Ether Value Enter
       
      
        var notoken = $('#toETH').val();
        console.log("Eth key Pressed "+ notoken);
        
        $.get('/getEthToUSD',function(toDollar){


          console.log("get EthToUSD  "+ toDollar);
          var toUSD = notoken * toDollar;
          $('#toUSD').val(toUSD + "  USD");
        });

      // $.get('/getEthToBTC', function(toBitcoin){     // this Eth to BTC conversion not found in coinbase API
      //   console.log("Eth to BTC   "+ toBitcoin);
      //    var toBTC = notoken * toBitcoin;
      //    $('#toBTC').val(toBTC + "  BTC");
      // })
      $.get('/getTokenRate', function(tokenRate){

        var toTRC =  (notoken * 1000000000000000000)/ tokenRate ;
        $('#toTRC').val(toTRC + '  TRC');
      })
        
      });


});