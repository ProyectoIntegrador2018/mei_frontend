var sessionID = localStorage.getItem("SessionId")
var participantEmail = localStorage.getItem("participantIDtoEdit")
var participantName = null
var participantRole = null;

function checkEditErrors(new_email, new_name, new_role){
	var error = false
	if (new_email == ""){
		$("#emailErrorMessage").html("Field required")
		error = true
	}
	else{
		$("#emailErrorMessage").html("")
	}

	if (new_name== ""){
		$("#nameErrorMessage").html("Field required")
		error = true
	}
	else{
		$("#nameErrorMessage").html("")
	}

	if (new_role == ""){
		$("#roleErrorMessage").html("Field required")
		error = true
	}
	else{
		$("#roleErrorMessage").html("")
	}

	return error;
}

$(document).ready(function(){
	getParticipantInformation()
})

$("#back").click(function(e){
	window.location.replace("sessionInfo.html")
})

$("#cancelParticipantChanges").click(function(e){
	e.preventDefault()
	$("#inputNameEdit").val(participantName)
	$("#inputEmailEdit").val(participantEmail)
	$("#inputRoleEdit").val(participantRole)

	$("#inputNameEdit").attr('disabled', true);
	$("#inputEmailEdit").attr('disabled', true);
	$("#inputRoleEdit").attr('disabled', true);

	checkEditErrors($("#inputEmailEdit").val(), $("#inputNameEdit").val(), $("#inputRoleEdit").val())

	$("#editButtons").css('display', 'none')
})

$("#saveParticipantChanges").click(function(e){
	e.preventDefault();
	var newParticipantName = $("#inputNameEdit").val()
	var newParticipantEmail = $("#inputEmailEdit").val()
	var newParticipantRole = $("#inputRoleEdit").val();

	var error = checkEditErrors(newParticipantEmail, newParticipantName, newParticipantRole)
	if (!error){
		console.log(participantEmail)
		console.log(newParticipantEmail)
		$.ajax({
			url : "http://127.0.0.1:5000/edit_participant",
			type : "POST",
			data : {
				name: newParticipantName,
				previous_email: participantEmail,
				new_email: newParticipantEmail,
				role: newParticipantRole,
				sessionID : localStorage.getItem("SessionId")
			},
			success : function (response){
				if (response['Success']){
					localStorage.setItem("participantIDtoEdit", newParticipantEmail)
					window.location.replace("participantInfo.html")
				}
			},
			error : function(e){
				console.log(e)
			}
		});
	}
})

$("#editParticipant").click(function(e){
	participantName = $("#inputNameEdit").val()
	participantEmail = $("#inputEmailEdit").val()
	participantRole = $("#inputRoleEdit").val()

	$("#inputNameEdit").attr('disabled', false);
	$("#inputEmailEdit").attr('disabled', false);
	$("#inputRoleEdit").attr('disabled', false);

	$("#editButtons").css('display', 'block')
})

function getParticipantInformation(){
	$.ajax({
	    url : "http://127.0.0.1:5000/get_participant_information",
		type : "POST",
		data : {
			sessionID : sessionID,
			email: participantEmail
		},
	    success : function (response) {
	        if (response['Success']){
	            $("#inputNameEdit").val(response['name'])
	            $("#inputEmailEdit").val(response['email'])
	            $("#inputRoleEdit").val(response['role'])
	        }
	        console.log(response)
	    },
	    error : function (error) {
	        console.log("Error: " + error);
	    }
	});
}
