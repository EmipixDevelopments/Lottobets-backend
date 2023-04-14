'use strict';
var Sys = require('../../../Boot/Sys');

const mongoose = require('mongoose');
//const eventModel  = mongoose.model('event');
//const gameModel  = mongoose.model('game');

module.exports = {

  // get: async function(id){
  //   try {
  //     if(Sys.Event[id]){
  //       return Sys.Event[id];
  //     }
  //     else{
  //       let event = await eventModel.findOne({'eventId' :id});
  //       if(!event){
  //         return new Error("event Not Found !");
  //       }else{
  //         Sys.Event[event.eventId]  = new Sys.BetServer.SportBet.Entities.Event().createObject(event);  
  //         return Sys.Event[event.eventId];
  //       }
  //     }
  //   }
  //   catch (error) {
  //     Sys.Log.info('Error in Get Event : ' + error);
  //     return new Error("Event Not Found !");
  //   }
  // },
  // create: async function(data,id,name,openDate,competitionId,marketName){
  //   try {

  //     console.log("Data :",data)
  //     console.log("id :",id)
  //     console.log("openDate :",openDate)
  //     console.log("competitionId :",competitionId)
  //     console.log("marketName :",marketName)


  //         let eventObj = {
  //           eventId           : id,
  //           marketId         :  data.marketId,
  //           name              : name,
  //           marketName        : marketName,
  //           btype             : '-',
  //           status            : data.status,
  //           start             : 0,
  //           isBettable        : false,
  //           openDate          : openDate,
  //           eventTypeId       : '-',
  //           inplay            : data.inplay,
  //           competition       : competitionId,
  //           matched           : 0,
  //           numWinners        : 0,
  //           numRunners        : 0,
  //           numberOfActiveRunners  : data.numberOfActiveRunners,
  //           runners           : data.runners,
  //           fancy             : data.fancy,
  //           isEnabled         : false,
  //         }
  //         let eventSave = new eventModel(eventObj);
  //         let  event = await eventSave.save(); // Save Room
  //         if(event){
  //               Sys.Event[event.eventId]  = new Sys.BetServer.SportBet.Entities.Event().createObject(event);
  //               return Sys.Event[event.eventId];
  //         }
  //         else{
  //           return new Error("Event Not Created !");
  //         }
     
  //   }
  //   catch (error) {
  //     Sys.Log.info('Error in Create Event : ' + error);
  //     return new Error("Event Not Found !");
  //   }
  // },

  // // update: async function(data){
  // //   try {
  // //    // console.log("Name ::",data.event.name)

  // //       Sys.Event[data.event.id].name =  data.event.name;
  // //       Sys.Event[data.event.id].mtype =  data.mtype;
  // //       Sys.Event[data.event.id].btype =  data.btype;
  // //       Sys.Event[data.event.id].start =  data.start;
  // //       Sys.Event[data.event.id].isBettable =  data.isBettable;
  // //       Sys.Event[data.event.id].openDate =  data.event.openDate;
  // //       Sys.Event[data.event.id].eventTypeId =  data.eventTypeId;
  // //       Sys.Event[data.event.id].inPlay =  data.inPlay;
  // //       Sys.Event[data.event.id].competition =  data.competition.id;
  // //       Sys.Event[data.event.id].matched =  data.matched;
  // //       Sys.Event[data.event.id].numWinners =  data.numWinners;
  // //       Sys.Event[data.event.id].numRunners =  data.numRunners;
  // //       Sys.Event[data.event.id].numActiveRunners =  data.numActiveRunners;
  // //       Sys.Event[data.event.id].runners =  data.runners;
        
  // //      return Sys.Event[data.event.id];
  // //   }
  // //   catch (error) {
  // //     Sys.Log.info('Error in Update Event : ' + error);
  // //     return new Error("Event Not Found !");
  // //   }
  // // },

  // updateDB: async function(){
  //   try {


  //       let eventIDAddy = Object.keys(Sys.Event);
  //       for(let j=0; j < eventIDAddy.length; j++){
  //           let tempEvent = Sys.Event[eventIDAddy[j]].toJson();
  //           //console.log("event ------------------------- :-",Sys.Event[eventIDAddy[j]].runners);
  //           //tempEvent.name = 'Himanmshu';
  //           let updatedevent = await eventModel.updateOne({
  //             _id: Sys.Event[eventIDAddy[j]].id,
  //           }, tempEvent, {
  //             new: true
  //           });
  //       }



  //     // Sys.Event.forEach( async function(event){
  //     //   let tempEvent = event.toJson();

  //     //  // console.log("Updated Name :",tempEvent.name)
  //     //   let updatedEvent = await eventModel.updateOne({
  //     //     _id: event.id
  //     //   }, tempEvent, {
  //     //     new: true
  //     //   });

  //     // });
  //   }
  //   catch (error) {
  //     Sys.Log.info('Error in Update Event : ' + error);
  //     return new Error("Event Not Found !");
  //   }
  // },

 

}
