var Sys = require('../../../Boot/Sys');
var request = require('request');
module.exports = {
  
  bradcastFavouriteLoto: async function(){
    try {
        let liveCricketEventsJson = [];
        let i = 0;
        
        setInterval( async function(){
              // let eventIDAddy = Object.keys(Sys.Event);
              // // console.log('eventIDAddy' , eventIDAddy);
              // let liveCricketEventsJsonArray = [];
              // if(Sys.cricket_status === 'on'){
              //   for(let j=0; j < eventIDAddy.length; j++){
              //     if(Sys.Event[eventIDAddy[j]].isEnabled === true){
              //       Sys.Event[eventIDAddy[j]].isBettable= true; 
              //       Sys.Event[eventIDAddy[j]].inplay= true; 
              //       liveCricketEventsJsonArray.push(Sys.Event[eventIDAddy[j]].toJson());
              //     }
              //   }
              // }
              //console.log('============')
              //let iav_check = "SELECT * FROM "+Sys.Config.Table.FAVOURITE+" ORDER BY userId DESC";
              let iav_check = "SELECT f.ProfileID As ID,f.ProfileName,f.State,f.Country,lp.colorimage,lp.grayscaleimage FROM "+Sys.Config.Table.FAVOURITE+" f LEFT JOIN "+Sys.Config.Table.LOTTO_PROFILE+" lp ON f.ProfileID=lp.ProfileID ORDER BY f.`Favourite` DESC";
       
              let result_iav_check = await Sys.SqlPool.query(iav_check);
              liveCricketEventsJson = result_iav_check;
              ///console.log('====',liveCricketEventsJson.length)
         }, 1000);

         setInterval( async function(){
          // console.log("Length :",liveCricketEventsJson.length)
          Sys.Io.emit('liveCricketEvents',liveCricketEventsJson);
         }, 1000);

        return {
          status: 'success',
          result: null,
          message: 'Bradcast Live Data.......'
        }
    } catch (error) {
        Sys.Log.info('Error in updateLiveData : ' + error);
    }
  },
  
}
