
var Sys = require('../../../Boot/Sys');
var request = require('request');

module.exports = function (Socket,io) {
  try {
    /*var i=0;
     setInterval(function(){ 
      io.to(Socket.id).emit("test",{val:++i});
      console.log("value i",i);
   }, 1000);*/

    //Start : Retail socket
    Socket.on("updateUserSocket",async function(data, response){
      //console.log("updateUserSocket socket id",Socket.id);
      response(await Sys.App.Sockets.Retailapp.updateUserSocket(Socket,data));
    });

    Socket.on("updateDisplayDeviceSocket",async function(data, response){
      //console.log("updateUserSocket socket id",Socket.id);
      response(await Sys.App.Sockets.Retailapp.updateDisplayDeviceSocket(Socket,data));
    });



    //Get online users
    Socket.on("getOnlineUser",async function(data, response){
      Sys.Log.info("getOnlineUser data",data);
      response(await Sys.App.Sockets.Retailapp.getOnlineUser(Socket,data));
    });

    //Retail Cashup
    Socket.on("cashup",async function(data, response){
      Sys.Log.info("cashup data",data);
      response(await Sys.App.Sockets.Retailapp.cashup(Socket,data));
    });

    //Retail Confirm Cashup
    Socket.on("confirmCashup",async function(data, response){
      Sys.Log.info("confirmCashup data",data);
      response(await Sys.App.Sockets.Retailapp.confirmCashup(Socket,io,data));
    });

    //Transfer money to user account
    Socket.on("transfer",async function(data, response){
      Sys.Log.info("transfer data",data);
      response(await Sys.App.Sockets.Retailapp.transfer(Socket,io,data));
    });

    //Accept or Reject Money transfer request
    Socket.on("replyMoneyTransfer",async function(data, response){
      Sys.Log.info("replyMoneyTransfer data",data);
      response(await Sys.App.Sockets.Retailapp.replyMoneyTransfer(Socket,io,data));
    });

    //Get favourite lotto
    Socket.on("getFavouriteLotto",async function(data, response){
      Sys.Log.info("getFavouriteLotto data",data);
      response(await Sys.App.Sockets.Retailapp.getFavouriteLotto(Socket,data));
    });


    //Get lotto market
    Socket.on("getLottoMarket",async function(data, response){
      Sys.Log.info("getLottoMarket data",data);
      response(await Sys.App.Sockets.Retailapp.getLottoMarket(Socket,data));
    });

    //Get country wise lotto
    Socket.on("getCountryWiseLottoList",async function(data,response) {
     response(await Sys.App.Sockets.Retailapp.getCountryWiseLottoList(Socket,data));
    });

    //Get all country lotto
    Socket.on("getAllCountryLotto",async function(data,response) {
     response(await Sys.App.Sockets.Retailapp.getAllCountryLotto(Socket,data));
    });

    //Get payout detail
    Socket.on("getPayoutDetail",async function(data,response) {
     response(await Sys.App.Sockets.Retailapp.getPayoutDetail(Socket,data));
    });

    //Confirm payout detail
    Socket.on("confirmPayout",async function(data,response) {
     response(await Sys.App.Sockets.Retailapp.confirmPayout(Socket,data));
    });

    //Get all country list
    /*Socket.on("getAllCountry",async function(data,response) {
     response(await Sys.App.Sockets.Retailapp.getAllCountry(Socket,data));
    });*/


    

    //Retail Confirm Cashup
    Socket.on("logout",async function(data, response){
      Sys.Log.info("logout data",data);
      response(await Sys.App.Sockets.Retailapp.logout(Socket,io,data));
    });
    
    Socket.on("disconnect", async function() {
      console.log("Socket disconnect id",Socket.id);
      console.log("Socket Disconnected");
    });
    //End : Retail socket
  } catch (error) {
    console.log("Error In Common Socket Handler : ", error);
  }

}
