$("#CampaingAddForm").validate({
  rules: {
    name: "required",
    template: "required",
    contactList: "required",
    senders: "required",
    categories: "required",
    countries: "required",
  },
  messages: {
    name: "Please Enter name",
    template: "Please Select Template Name",
    contactList: "Please Select Contact List",
    senders: "Please Select senders",
    categories: "Please Select category",
    countries: "Please Select Country",
  },
  submitHandler: function (form) {
    var FN = document.createElement("input");
    FN.setAttribute("type", "hidden");
    FN.setAttribute("name", "created_at");
    
    form.appendChild(FN);
    var date_ob = new Date();
    var day = ("0" + date_ob.getDate()).slice(-2);
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var year = date_ob.getFullYear();
       
    var date = year + "-" + month + "-" + day;
    console.log(date);
        
    var hours = date_ob.getHours();
    var minutes = date_ob.getMinutes();
    var seconds = date_ob.getSeconds();
      
    var dateTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    console.log(dateTime);
    FN.setAttribute("value", dateTime);
    $("#CampaingaddFormSubmit").prop("disabled", true);
    $("#save&send").prop("disabled", true);
    form.submit();
  }
});
$("#CampaingEditForm").validate({
  rules: {
    name: "required",
    template: "required",
    contactList: "required",
    senders: "required",
  },
  messages: {
    name: "Please Enter name",
    template: "Please Select Template Name",
    contactList: "Please Select Contact List",
    senders: "Please Select senders",
  },
  submitHandler: function (form) {
    var FN = document.createElement("input");
    FN.setAttribute("type", "hidden");
    FN.setAttribute("name", "updated_at");
    
    form.appendChild(FN);
    var date_ob = new Date();
    var day = ("0" + date_ob.getDate()).slice(-2);
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var year = date_ob.getFullYear();
       
    var date = year + "-" + month + "-" + day;
    console.log(date);
        
    var hours = date_ob.getHours();
    var minutes = date_ob.getMinutes();
    var seconds = date_ob.getSeconds();
      
    var dateTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    console.log(dateTime);
    
    FN.setAttribute("value", dateTime);
    $("#CampaingaddFormSubmit").prop("disabled", true);
    $("#save&send").prop("disabled", true);
    form.submit();
  }
});
$("body").on('click',".CampaingAddFormModal", function(){
 $(".textAddFormData").attr('dataid','');
 $("body").find("#TextAddForm")[0].reset();
 $("body").find("#CampaingEditForm")[0].reset();
})
$("body").on("click",".textAddFormData",function(){
  
  $("body").find("#TextAddForm")[0].reset();
  let id= $(this).attr('dataid');
  $("#campaignId").val(id);
  $("#TextAddForm").attr("action","/textTemplate/save");
  console.log('id : ',id);
  $("#templateList").html("");
  
  if(id != null){
    // e.preventDefault(); 
    //var $this = $(this); // `this` refers to the current form element
    if($('.categoryTarget').val()){
      var categories = $('.categoryTarget').val();
    }else{
      var categories = $('#categoryList').val();
    }
    if($('.countriesTarget').val()){
      var countries= $('.countriesTarget').val();
    }else{
      var countries= $('#editCountry').val();
    }
    $.ajax({
          type: "POST",
          url: "/getTemplates/all",
          /*dataType: "json",*/
          data: { id : id,categories:categories, countries:countries },
          success: function(data) {
        console.log('waiting for response ::::: 30 ');
            if(data.error){
              alert(data.error)
            } else {
        var templateData = JSON.parse(data);
        let htmlTxt = "<table class='table table-bordered table-striped dataTable no-footer dtr-inline'><thead><tr><th>TemplateName</th><th>Message</th><th>Action</th></tr></thead><tboday>";
        if(templateData.length){
          for(var i = 0; i < templateData.length; i++){
            htmlTxt += "<tr id='temp_row_"+templateData[i].id+"'><td id='tempName_"+templateData[i].id+"'><div class='form-group'><input type='text' class='form-control temp_name_"+templateData[i].id+"' name='tempName'  placeholder='Template Name' value="+templateData[i].name+"></div></td><td><div class='form-group'><textarea name='tempMessage' class='form-group temp_message_"+templateData[i].id+"'  id="+templateData[i].id+">"+templateData[i].message+"</textarea></td></div><td><input type='hidden' class='temp_id_"+templateData[i].id+"' name='tempId' value="+templateData[i].id+"><a  type='button'  class='btn btn-danger btn-sm deleteTemp' dataid="+templateData[i].id+" id='tempMessage_"+templateData[i].id+"' campaignId="+templateData[i].campaignId+" title='Delete'  ><i class='fa fa-trash'></i></a></td></tr>";

          }
        }else{
          htmlTxt += "<tr><td colspan='3' style='text-align:center'>No data available in table</td></tr>";
        }
        if(categories!=''){
          $("#templateCategoryList").val(categories);
          $("#templateCategoryList").attr('disabled',true);
        }
        if(countries!=''){
          $("#templateCountryList").val(countries);
          $("#templateCountryList").attr('disabled',true);
        }
              
                  htmlTxt += "</tboday></table>";
                  $("#templateList").html(htmlTxt);
        
            }
          }
      });
  
  }
});

$("#TextAddForm").submit(function(e) {
  
  //if(!($("#campaignId").val())){
    e.preventDefault(); 
    var $this = $(this); // `this` refers to the current form element
    $.ajax({
          type: "POST",
          url: "/saveCampingTemplate/save",
          /*dataType: "json",*/
          data: $this.serialize(),
          success: function(data) {
            if(data.error){
              alert(data.error)
            }else{
              console.log($( this ).serialize())
              //if(!data.hasOwnProperty('flag')){
                //$("#templateLoop").append('<option value="'+data.id+'">'+data.name+'</option>');
               // $("#editTemplateLoop").append('<option value="'+data.id+'" class="edit_template edit_temp_id_'+data.id+'">'+data.name+'</option>');
                
              //}
              let templateData = data;
              let tempHtml='';
              let tempHtml2='';
              let selected = $('#editTemplateLoop').val().toString();
                  selected = selected.split(',');
              for(var i = 0; i < templateData.length; i++){
                let index = selected.indexOf(templateData[i].id.toString());
                index = (index>-1)? 'selected':'';
                let msg=(templateData[i].message)?'('+templateData[i].message+')':'';
                tempHtml +='<option value='+templateData[i].id+'  id="temp_id_'+templateData[i].id+'">'+templateData[i].name+' '+msg+'</option>';
                tempHtml2 +='<option value="'+templateData[i].id+'" '+index+' class="edit_template edit_temp_id_'+templateData[i].id+'">'+templateData[i].name+' '+msg+'</option>';
              }
              $("#templateLoop").html(tempHtml);
              $("#editTemplateLoop").html(tempHtml2);
              $("#textAddFormModal").modal("hide");
              
            }
          }
      });
  
 // }
    
});
$("body").on("click",".deleteTemp",function(){
  let tempId=$(this).attr('dataid');
  let campaignId=$(this).attr('campaignId');
  if(confirm("Are you sure you want to delete this template?")){
    $.ajax({
          type: "POST",
          url: "/template/delete",
          dataType: "json",
          data: {"tempId":tempId,"campaignId":campaignId},
          success: function(data) {
            if(data.error){
              alert(data.error)
            }else{
              $("#temp_row_"+tempId).remove();
            }
          }
      });
  }
})
$("body").on("click",".textAddFormDataTmp",function(){
  $("#TextAddForm")[0].reset();
  let id= $(this).attr('dataid');
  $("#campaignId").val(id);
  $("#TextAddForm").attr("action","/textTemplate/save");
  console.log('id : ',id);
  $("#templateList").html("");
  if(id == null){
    // e.preventDefault(); 
    //var $this = $(this); // `this` refers to the current form element
    $.ajax({
          type: "POST",
          url: "/getTemplates/all",
          /*dataType: "json",*/
          data: { id : id,categories:$("#categoryList").val(),countries:$("#editCountry").val() },
          success: function(data) {
        console.log('waiting for response ::::: 30 ');
            if(data.error){
              alert(data.error)
            } else {
              let templateData = JSON.parse(data);
              let tempHtml='';
              let tempHtml2='';
              let selected = $('#editTemplateLoop').val().toString();
              console.log("templateData==",templateData)
                  selected = selected.split(',');
              for(var i = 0; i < templateData.length; i++){
                let index = selected.indexOf(templateData[i].id.toString());
                index = (index>-1)? 'selected':'';
                let msg=(templateData[i].message)?'('+templateData[i].message+')':'';
                tempHtml +='<option value='+templateData[i].id+'  id="temp_id_'+templateData[i].id+'">'+templateData[i].name+' '+msg+'</option>';
                tempHtml2 +='<option value="'+templateData[i].id+'" '+index+' class="edit_template edit_temp_id_'+templateData[i].id+'">'+templateData[i].name+' '+msg+'</option>';
              }
              $("#templateLoop").html(tempHtml);
              $("#editTemplateLoop").html(tempHtml2);
              $("#textAddFormModal").modal("hide");
        
            }
          }
      });
  
  }
});
$("body").on("click",".abTesting",function(){
  if ($(this).prop('checked')==true){ 
    $(".percent").show();      
  }else{
    $(".percent").hide();
  }
});
$("body").on("click","#mmd_channel,#deliverhub_channel,#textlocal_channel,#abTesting",function(){
  if($("#abTesting").prop('checked')){
    $("#deliverhub_channel").attr('disabled',false);
    $("#textlocal_channel").attr('disabled',false);
    $("#mmd_channel").attr('disabled',false);
    $("body").find("#contactSendDetailEdit").show();
  }else{
    $("body").find("#contactSendDetailEdit").hide();
    if($("#mmd_channel").prop('checked')){
      $("#mmd_channel").attr('disabled',false);
      $("#deliverhub_channel").attr('disabled',false);
      $("#textlocal_channel").attr('disabled',false);
      $("#deliverhub_channel").attr('disabled',true);
      $("#textlocal_channel").attr('disabled',true);
    }else if($("#deliverhub_channel").prop('checked')){
      $("#mmd_channel").attr('disabled',false);
      $("#deliverhub_channel").attr('disabled',false);
      $("#textlocal_channel").attr('disabled',false);
      $("#mmd_channel").attr('disabled',true);
      $("#textlocal_channel").attr('disabled',true);
    }else if($("#textlocal_channel").prop('checked')){
      $("#mmd_channel").attr('disabled',false);
      $("#deliverhub_channel").attr('disabled',false);
      $("#textlocal_channel").attr('disabled',false);
      $("#mmd_channel").attr('disabled',true);
      $("#deliverhub_channel").attr('disabled',true);
    }else{
      $("#mmd_channel").attr('disabled',false);
      $("#deliverhub_channel").attr('disabled',false);
      $("#textlocal_channel").attr('disabled',false);
    }
  }
});
$("body").on("click",".mmd_channel,.deliverhub_channel,.textlocal_channel,.abTesting",function(){
  if($(".abTesting").prop('checked')){
    $(".deliverhub_channel").attr('disabled',false);
    $(".textlocal_channel").attr('disabled',false);
    $(".mmd_channel").attr('disabled',false);
    $("body").find("#contactSendDetailEdit").show();
  }else{
    $("body").find("#contactSendDetailEdit").hide();
    if($(".mmd_channel").prop('checked')){
      $(".mmd_channel").attr('disabled',false);
      $(".deliverhub_channel").attr('disabled',false);
      $(".textlocal_channel").attr('disabled',false);
      $(".deliverhub_channel").attr('disabled',true);
      $(".textlocal_channel").attr('disabled',true);
    }else if($(".deliverhub_channel").prop('checked')){
      $(".mmd_channel").attr('disabled',false);
      $(".deliverhub_channel").attr('disabled',false);
      $(".textlocal_channel").attr('disabled',false);
      $(".mmd_channel").attr('disabled',true);
      $(".textlocal_channel").attr('disabled',true);
    }else if($(".textlocal_channel").prop('checked')){
      $(".mmd_channel").attr('disabled',false);
      $(".deliverhub_channel").attr('disabled',false);
      $(".textlocal_channel").attr('disabled',false);
      $(".mmd_channel").attr('disabled',true);
      $(".deliverhub_channel").attr('disabled',true);
    }else{
      $(".mmd_channel").attr('disabled',false);
      $(".deliverhub_channel").attr('disabled',false);
      $(".textlocal_channel").attr('disabled',false);
    }
  }
});
$("body").on("click",".deleteMasterTemp",function(){
  if($(this).attr('is_deleted')=='0'){
    var is_deleted=0;
    var msg='Are you sure want to Disable this template?';
  }else{
    is_deleted=1;
    var msg='Are you sure want to Enable this template?';
  }
    let tempId = $(this).attr('dataid');
    if(confirm(msg)){
      if(is_deleted==0){
        $("#tempMessage_"+tempId).html('<i class="fa fa-lock"></i>');
      }else{
         $("#tempMessage_"+tempId).html('<i class="fa fa-unlock"></i>');
      }
      $.ajax({
          type: "POST",
          url: "/template/enableDisable",
          dataType: "json",
          data: {"tempId":tempId},
          success: function(data) {
            if(data.error){
              alert(data.error)
            }else{
              
              if(is_deleted==0){
                
                $(".temp_name_"+tempId).attr("disabled",true);
                $(".temp_message_"+tempId).attr("disabled",true);
                $(".temp_id_"+tempId).attr("disabled",true);
                $("#tempMessage_"+tempId).attr("is_deleted",'1');
                
              }else{
                
                $(".temp_name_"+tempId).attr("disabled",false);
                $(".temp_message_"+tempId).attr("disabled",false);
                $(".temp_id_"+tempId).attr("disabled",false);
                $("#tempMessage_"+tempId).attr("is_deleted",'0');
              }
            }
          }
      });
    }
  
});
$("body").on("click",".sendCampaign", function(){
    let ids=$(this).attr('dataid');
    var date_ob = new Date();
    var day = ("0" + date_ob.getDate()).slice(-2);
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var year = date_ob.getFullYear();
     
    var date = year + "-" + month + "-" + day;
    console.log(date);
      
    var hours = date_ob.getHours();
    var minutes = date_ob.getMinutes();
    var seconds = date_ob.getSeconds();
    //var millisec = date_ob.getMillisec();
    var dateTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
     if(confirm("Are you sure want to send campaign?")){
      //console.log('/campaing/delete/'+ids+'/'+dateTime)
      window.location.href='/send/campaign/'+ids+'/'+dateTime;
     }
   });

/***** On change value of percent box ***/
$("body").on("keyup keydown",".percentInput, .quantityInput",function(e){
	
    let percentVal = $(".percentInput").val();
	if(percentVal > 100){
		alert("Please Enter a value upto 100%");
		$(".percentInput").val("");
		return false;
	}
	
    let quantityInput = $(".quantityInput").val();
	
	if (quantityInput.indexOf('.') > -1) {
		alert('Use WHOLE numbers only');
		$(".quantityInput").val("");
		return false;
    }
	
    let contactList = $('#contactList :selected').val();
	let	campaignId = "";
	
	// alert("percentVal="+percentVal+" contactList="+contactList);
	console.log('percentVal : ',percentVal," contactList : ",contactList," campaignId : ", campaignId, "quantityInput : ",quantityInput);
	$.ajax({
		  type: "POST",
		  url: "/getContactPercentage",
		  dataType: "json",
		  data: {"percentVal":percentVal,"contactList":contactList,"campaignId":campaignId,"quantityInput" : quantityInput},
		  success: function(data) {
			if(data.error){
			  alert(data.error)
			}else{
				console.log("dataContactPercentage : ",data);
				let percentageData = "<b>"+data.totaContactSelected+"/"+data.totalContacts+"</b>";
				
				if(quantityInput !=""){
					if(quantityInput > data.totalContacts){
						alert("Qty cannot exceed total available leads");
						$(".percentInput").val("");
						$(".quantityInput").val("");
					} else {
						$(".percentInput").val(data.contactPercentageVal);
					}
				}	
				
				
				$("#contactSendDetail").html(percentageData);
			}
		  }
	});  
});
$("body").on("keyup keydown","#ab_percent, #ab_percent_QTY",function(e){
	
    // let percentVal = $(this).val();
	let percentVal = $("#ab_percent").val();
	if(percentVal > 100){
		alert("Please Enter a value upto 100%");
		$("#ab_percent").val("");
		return false;
	}
	let quantityInput = $("#ab_percent_QTY").val();
	
	if (quantityInput.indexOf('.') > -1) {
		alert('Use WHOLE numbers only');
		$("#ab_percent_QTY").val("");
		return false;
    }
		
    let contactList = $('#contactList :selected').val();
	
	const element = document.getElementById("CampaingEditForm"); 
	let textAction = element.getAttribute("action");
	console.log('textAction ::::::',textAction," : ",textAction.split('/'));
	let	campaignId = textAction.split('/')[3];
	console.log('campaignId : ',campaignId);
	if(campaignId){
		contactList = $('#editCmpContact :selected').val();
	}
	// alert("percentVal="+percentVal+" contactList="+contactList);
	console.log('percentVal : ',percentVal," contactList : ",contactList," campaignId : ", campaignId);
	$.ajax({
		  type: "POST",
		  url: "/getContactPercentage",
		  dataType: "json",
		  data: {"percentVal":percentVal,"contactList":contactList,"campaignId":campaignId,"quantityInput" : quantityInput},
		  success: function(data) {
			if(data.error){
			  alert(data.error)
			}else{
				console.log("dataContactPercentage : ",data);
				let percentageData = "<b>"+data.totaContactSelected+"/"+data.totalContacts+"</b>";
				if(quantityInput !=""){
					if(quantityInput > data.totalContacts){
						alert("Qty cannot exceed total available leads");
						$("#ab_percent").val("");
						$("#ab_percent_QTY").val("");
					} else {
						$("#ab_percent").val(data.contactPercentageVal);
					}
					
				}	
				
				$("#contactSendDetailEdit").html(percentageData);
			}
		  }
	});  
});
$( "body" ).on('change','.categoryTarget, .countriesTarget',function() {
  $.ajax({
          type: "POST",
          url: "/getTemplates/all",
          /*dataType: "json",*/
          data: { categories:$('.categoryTarget').val(), countries:$('.countriesTarget').val()  },
          success: function(data) {
        console.log('waiting for response ::::: 30 ');
            if(data.error){
              alert(data.error)
            } else {
            
            let templateData = JSON.parse(data);
              let tempHtml='';
              let tempHtml2='';
              let selected = $('#editTemplateLoop').val().toString();
                  selected = selected.split(',');
              for(var i = 0; i < templateData.length; i++){
                let index = selected.indexOf(templateData[i].id.toString());
                index = (index>-1)? 'selected':'';
                let msg=(templateData[i].message)?'('+templateData[i].message+')':'';
                tempHtml +='<option value='+templateData[i].id+'  id="temp_id_'+templateData[i].id+'">'+templateData[i].name+' '+msg+'</option>';
                tempHtml2 +='<option value="'+templateData[i].id+'" '+index+' class="edit_template edit_temp_id_'+templateData[i].id+'">'+templateData[i].name+' '+msg+'</option>';
              }
              $("#templateLoop").html(tempHtml);
              $("#editTemplateLoop").html(tempHtml2);
              $("#textAddFormModal").modal("hide");
        
            }
          }
      });
      $.ajax({
          type: "POST",
          url: "/getContactList/all",
          dataType: "json",
          data: { categories:$('.categoryTarget').val(), countries:$('.countriesTarget').val()  },
          success: function(data) {
        console.log('waiting for response ::::: 30 ');
            if(data.error){
              alert(data.error)
            } else {
              console.log(data)
              let contactList='<option value="">Select Contact List</option>';
              let offerList='<option value="">Select Offer List</option>';
              for(let i=0;i<data.contact.length;i++){
                contactList +='<option value='+data.contact[i].id+'>'+data.contact[i].name+'</option>';
              }
              for(let i=0;i<data.offer.length;i++){
                let comment=(data.offer[i].comment)?'('+data.offer[i].comment+')':'';
                let url=(data.offer[i].url)?'('+data.offer[i].url+')':'';
                offerList+='<option value='+data.offer[i].id+' >'+data.offer[i].company+' '+comment+' '+url+'</option>';
              }
              $("#contactList").html(contactList);
              $("#offerList").html(offerList);
            }
          }
      });
});