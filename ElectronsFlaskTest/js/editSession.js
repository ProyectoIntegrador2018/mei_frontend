var sessionID = localStorage.getItem("SessionId")
var sessionTitle = null
var sessionSummary = null
var sessionCreationDate = null;

function checkEditFieldSessionErrors(newSessionTitle, newSessionSummary, newCreationDate){
	var error = false
	if (newSessionTitle == ""){
		$("#titleErrorMessage").html("Field required")
		error = true
	}
	else{
		$("#titleErrorMessage").html("")
	}

	if (newSessionSummary == ""){
		$("#summaryErrorMessage").html("Field required")
		error = true
	}
	else{
		$("#summaryErrorMessage").html("")
	}

	if (newCreationDate == ""){
		$("#dateErrorMessage").html("Field required")
		error = true
	}
	else{
		$("#dateErrorMessage").html("")
	}

	return error;
}

$(document).ready(function(){
	getSessionInformation()
})

$("#back").click(function(e){
	window.location.replace("session.html")
})

$("#cancelSessionChanges").click(function(e){
	e.preventDefault()
	$("#inputSessionNameEdit").val(sessionTitle)
	$("#inputSummaryEdit").val(sessionSummary)
	$("#inputCreationDateEdit").val(sessionCreationDate)

	$("#inputSessionNameEdit").attr('disabled', true);
	$("#inputSummaryEdit").attr('disabled', true);
	$("#inputCreationDateEdit").attr('disabled', true);

	checkEditFieldSessionErrors($("#inputSessionNameEdit").val(), $("#inputSummaryEdit").val(), $("#inputCreationDateEdit").val());

	$("#editButtons").css('display', 'none')
})

$("#saveSessionChanges").click(function(e){
	e.preventDefault();
	var newSessionTitle = $("#inputSessionNameEdit").val()
	var newSessionSummary = $("#inputSummaryEdit").val()
	var newCreationDate = $("#inputCreationDateEdit").val()
	var error = checkEditFieldSessionErrors(newSessionTitle, newSessionSummary, newCreationDate);
	if (!error){
		$.ajax({
			url : "http://127.0.0.1:5000/edit_session",
			type : "POST",
			data : {
				name: newSessionTitle,
				summary: newSessionSummary,
				creationDate: newCreationDate,
				sessionID : localStorage.getItem("SessionId")
			},
			success : function (response){
				if (response['Success']){
					window.location.replace("sessionInfo.html")
				}
			},
			error : function(e){
				console.log(e)
			}
		});
	}
})

$("#editSession").click(function(e){
	sessionTitle = $("#inputSessionNameEdit").val()
	sessionSummary = $("#inputSummaryEdit").val()
	sessionCreationDate = $("#inputCreationDateEdit").val()

	$("#inputSessionNameEdit").attr('disabled', false);
	$("#inputSummaryEdit").attr('disabled', false);
	$("#inputCreationDateEdit").attr('disabled', false);

	$("#editButtons").css('display', 'block')
})

function getSessionInformation(){
	$.ajax({
	    url : "http://127.0.0.1:5000/get_session_data",
		type : "POST",
		data : {
			sessionID : localStorage.getItem("SessionId")
		},
	    success : function (response) {
	        if (response['Success']){
	        	sessionID = localStorage.getItem("SessionId")
	            $("#inputSessionNameEdit").val(response['name'])
	            $("#inputSummaryEdit").val(response['summary'])
	            $("#inputCreationDateEdit").val(response['creationDate'])
	        }
	        console.log(response)
	    },
	    error : function (error) {
	        console.log("Error: " + error);
	    }
	});
}