
var Sys = require('../../../Boot/Sys');
var request = require('request');

module.exports = function (Socket,io) {
  try {

    Socket.on("FavouriteLotto",async function(data,responce) {
     await responce(await Sys.App.Sockets.Kioskapp.FavouriteLotto(Socket,data));
     Socket.conn.close ();
    });

    Socket.on("loadIAV",async function(data,responce) {
     await responce(await Sys.App.Sockets.Kioskapp.loadIAV(Socket,data));
     Socket.conn.close ();
    });

    Socket.on("withDrawHistory",async function(data,responce) {
     await responce(await Sys.App.Sockets.Kioskapp.withDrawHistory(Socket,data));
     Socket.conn.close ();
    });

    Socket.on("LottoMarket",async function(data,responce) {
     await responce(await Sys.App.Sockets.Kioskapp.LottoMarket(Socket,data));
     Socket.conn.close ();
    });

    Socket.on("mobileLottoMarket",async function(data, response){
      Sys.Log.info("mobileLottoMarket data",data);
      await response(await Sys.App.Sockets.Kioskapp.mobileLottoMarket(Socket,data));
      Socket.conn.close ();
    });

    Socket.on("countryWiseLottoList",async function(data,responce) {
     await responce(await Sys.App.Sockets.Kioskapp.countryWiseLottoList(Socket,data));
     Socket.conn.close ();
    });
    
    Socket.on("mobileNextLotto",async function(data,responce) {
     await responce(await Sys.App.Sockets.Kioskapp.mobileNextLotto(Socket,data));
     Socket.conn.close ();
    });

    Socket.on("popularLotto",async function(data,responce) {
     await responce(await Sys.App.Sockets.Kioskapp.popularLotto(Socket,data));
     Socket.conn.close ();
    });

    Socket.on("iavBalance",async function(data,responce) {
     await responce(await Sys.App.Sockets.Kioskapp.iavBalance(Socket,data));
     Socket.conn.close ();
    });

    Socket.on("betHistory",async function(data,responce) {
     await responce(await Sys.App.Sockets.Kioskapp.betHistory(Socket,data));
     Socket.conn.close ();
    });

    Socket.on("iavHistory",async function(data,responce) {
     await responce(await Sys.App.Sockets.Kioskapp.iavHistory(Socket,data));
     Socket.conn.close ();
    });

    Socket.on("getSetting",async function(data,responce) {
     await responce(await Sys.App.Sockets.Kioskapp.getSetting(Socket,data));
     Socket.conn.close ();
    });
    
    Socket.on("countryList",async function(data,responce) {
     await responce(await Sys.App.Sockets.Kioskapp.countryList(Socket,data));
     Socket.conn.close ();
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
