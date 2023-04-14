'use strict';
var Sys = require('../../../Boot/Sys');

//const mongoose = require('mongoose');
//const competitionModel  = mongoose.model('competition');
//const gameModel  = mongoose.model('game');

module.exports = {
  // saveAllCompitition: async function(){
  //   try {
  //     let competitions = await competitionModel.find();
  //     for(let i=0; i < competitions.length; i++){
  //       Sys.Competition[competitions[i].competitionId]  = new Sys.BetServer.SportBet.Entities.Competition().createObject(competitions[i]); 
  //     }
  //     return Sys.Competition;
  //   }catch (error) {
  //     Sys.Log.info('Error in Get All Competition : ' + error);
  //     return new Error("All Competition Not Found !");
  //   }
  // },
  // getAll: async function(){
  //   try {
  //     return Sys.Competition;
  //   }catch (error) {
  //     Sys.Log.info('Error in Get All Competition : ' + error);
  //     return new Error("All Competition Not Found !");
  //   }
  // },
  // get: async function(id){
  //   try {
  //     if(Sys.Competition[id]){
  //       return Sys.Competition[id];
  //     }
  //     else{
  //       let competition = await competitionModel.findOne({'competitionId' :id});
  //       if(!competition){
  //         return new Error("Competition Not Found !");
  //       }else{
  //         Sys.Competition[competition.competitionId]  = new Sys.BetServer.SportBet.Entities.Competition().createObject(competition);  
  //         return Sys.Competition[competition.competitionId];
  //       }
  //     }
  //   }
  //   catch (error) {
  //     Sys.Log.info('Error in Get Competition : ' + error);
  //     return new Error("Competition Not Found !");
  //   }
  // },
  // create: async function(data){
  //   try {
  //         // console.log("data :",data)
  //         let competitionObj = {
  //           competitionId       : data.competition.id,
  //           name                : data.competition.name,
  //           isEnabled           : false,
  //           //marketCount         : data.marketCount,
  //           //competitionRegion   : data.competitionRegion
  //         }
  //         let competitionSave = new competitionModel(competitionObj);
  //         let  competition = await competitionSave.save(); // Save Room
  //       if(competition){
  //         Sys.Competition[competition.competitionId]  = new Sys.BetServer.SportBet.Entities.Competition().createObject(competition);  
  //         return Sys.Competition[competition.competitionId];
  //       }
  //       else{
  //         return new Error("Competition Not Created !");
  //       }
     
  //   }
  //   catch (error) {
  //     Sys.Log.info('Error in create Competitions : ' + error);
  //     return new Error("Competition Not Found !");
  //   }
  // },

  // updateDB: async function(){
  //   try {

  //       let competitionIDAddy = Object.keys(Sys.Competition);
  //       for(let j=0; j < competitionIDAddy.length; j++){
  //         //console.log("Competition :-",Sys.Competition[competitionIDAddy[j]].id);
  //           let tempComp = Sys.Competition[competitionIDAddy[j]].toJson();

  //           let updatedCompetition = await competitionModel.updateOne({
  //             _id: Sys.Competition[competitionIDAddy[j]].id,
  //           }, tempComp, {
  //             new: true
  //           });
  //       }

      // Sys.Competition.forEach( async function(comp){
      //   let tempComp = comp.toJson();
      //   let updatedCompetition = await competitionModel.updateOne({
      //     _id: comp.id
      //   }, tempComp, {
      //     new: true
      //   });

      // });
  //   }
  //   catch (error) {
  //     Sys.Log.info('Error in Update Competitions : ' + error);
  //     return new Error("Competition Not Found !");
  //   }
  // },

 

}
