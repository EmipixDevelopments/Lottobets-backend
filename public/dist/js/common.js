toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": false,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}
function notificationMsg(type , msg , target){
	console.log('msg type' , type);
	let notifyClass = '';
	if(type === 'success'){
		toastr[type]('<b>'+ msg +'</b>' , 'Success!');
	}else if(type === 'error'){
		toastr[type]('<b>'+ msg +'</b>' , 'Error!');
	}	
}

function createPlaceHolder(){
	var $inputItem = $(".js-inputWrapper");
	$inputItem.length && $inputItem.each(function() {
		var $this = $(this),
		    $input = $this.find(".formRow-input"),
		    placeholderTxt = $input.attr("placeholder"),
		    $placeholder;

		$input.after('<span class="placeholder">' + placeholderTxt + "</span>"),
		$input.attr("placeholder", ""),
		$placeholder = $this.find(".placeholder"),

		$input.val().length ? $this.addClass("active") : $this.removeClass("active"),
		    
		$input.on("focusout", function() {
		    $input.val().length ? $this.addClass("active") : $this.removeClass("active");
		}).on("focus", function() {
		    $this.addClass("active");
		});
	});
}

$(function () {
    $('.datetimepicker').datetimepicker({
    	 format: 'YYYY-MM-DD',
    	 pickTime: false
    });
});

function getArrayDiff(a1 , a2){
    let a = [], diff = [];
    for (let i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }
    for (let i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }
    for (let k in a) {
    diff.push(k);
    }
    return diff;
}

$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip(); 
});

function formatWalletData ( d ) {
	// `d` is the original data object for the row
  return '<table cellpadding="5" cellspacing="0" border="0" class="table">'+
      '<tr>'+
          '<td>'+
          	'<div class="col-md-1"><b>Chips : </b></div><div class="col-md-2">'+ parseFloat(d.userWallet.chips).toFixed(2) + '</div>'+
          	'<div class="col-md-1"><b>A/C Chips : </b></div><div class="col-md-2">'+ parseFloat(d.userWallet.acChips).toFixed(2) + '</div>'+
      	'</td>'+
      '</tr>'+
      '<tr>'+
         '<td>'+
          	'<div class="col-md-1"><b>Liability : </b></div><div class="col-md-2">'+ parseFloat(d.userWallet.liability).toFixed(2) + '</div>'+
          	'<div class="col-md-1"><b>Wallet : </b></div><div class="col-md-2">'+ parseFloat(d.userWallet.walletBalance).toFixed(2) + '</div>'+
      	'</td>'+
      '</tr>'+
  '</table>';
}