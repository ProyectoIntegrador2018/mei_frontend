const server = require('../js/main')

PROJECT_ID = localStorage.getItem("id")

var sessionID = localStorage.getItem("SessionId")
var sessionTitle = null
var sessionSummary = null
var sessionCreationDate = null;
var sessionTriggeringQuestion = null

function checkEditFieldSessionErrors(newSessionTitle, newSessionSummary, newTriggeringQuestion, newCreationDate){
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

	if (newTriggeringQuestion == ""){
		$("#triggeringQuestionErrorMessage").html("Field required")
		error = true
	}
	else{
		$("#triggeringQuestionErrorMessage").html("")
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

function getProjectSessions(projectID){
	$.ajax({
		url : server.server_url + "/get_project_sessions",
		type : "POST",
		data : {
			projectID : projectID
	  },
		success : function(response){
			if (response['Success']){
				var sessions = response['Sessions']
				keys = Object.keys(sessions)
				console.log(localStorage.getItem("SessionId"))

				// Dropdown should be available if there's at least another session created
				if (keys.length > 1){
					$("#copy_participants").attr('disabled', false)
					$("#copySessionList").attr('disabled', false)
					var options = ""
					keys.forEach(function(key){
						var session = sessions[key]
						if (session['sessionID'] != sessionID){
							options += `<option value="${session['sessionID']}">${session['name']} (${session['creationDate']})</option>`
						}
					})

					$("#copySessionList").html(options)
				}
				else{
					$("#copySessionList").html("<option>You don't have any other sessions!</option>")
					$("#copy_participants").attr('disabled', true)
					$("#copySessionList").attr('disabled', true)
				}
			}
		},
		error : function(error){
			console.log("Error: " + error);
		}
	});
}

$(document).ready(function(){
	getSessionInformation()
	getParticipantTypes()
	getSessionParticipants(sessionID)
	getProjectSessions(localStorage.getItem("id"))
})

$("#copy_participants").click(function(e){
	var sessionFrom = $("#copySessionList").val()
	var sessionTo = sessionID

	$.ajax({
		url : server.server_url + "/copy_session_participants",
		type : "POST",
		data : {
			sessionID : sessionTo,
			copyFromSessionID: sessionFrom
		},
		success : function (response) {
			if (response['Success']){
				$("#sessionParticipants").html("")
				getSessionParticipants(sessionID)
			}
		},
		error : function (error) {
			console.log("Error: " + error);
		}
	});

})

$("#back").click(function(e){
	window.location.replace("session.html")
})

$("#cancelSessionChanges").click(function(e){
	e.preventDefault()
	$("#inputSessionNameEdit").val(sessionTitle)
	$("#inputSummaryEdit").val(sessionSummary)
	$("#inputTriggeringQuestionEdit").val(sessionTriggeringQuestion)
	$("#inputCreationDateEdit").val(sessionCreationDate)

	$("#inputSessionNameEdit").attr('disabled', true);
	$("#inputSummaryEdit").attr('disabled', true);
	$("#inputTriggeringQuestionEdit").attr('disabled', true)
	$("#inputCreationDateEdit").attr('disabled', true);

	checkEditFieldSessionErrors(
		$("#inputSessionNameEdit").val(), 
		$("#inputSummaryEdit").val(),
		$("#inputTriggeringQuestionEdit").val(), 
		$("#inputCreationDateEdit").val());

	$("#editButtons").css('display', 'none')
})

$("#saveSessionChanges").click(function(e){
	e.preventDefault();
	var newSessionTitle = $("#inputSessionNameEdit").val()
	var newSessionSummary = $("#inputSummaryEdit").val()
	var newTriggeringQuestion = $("#inputTriggeringQuestionEdit").val()
	var newCreationDate = $("#inputCreationDateEdit").val()
	var error = checkEditFieldSessionErrors(newSessionTitle, newSessionSummary, newTriggeringQuestion, newCreationDate);
	if (!error){
		$.ajax({
			url : server.server_url + "/edit_session",
			type : "POST",
			data : {
				name: newSessionTitle,
				summary: newSessionSummary,
				triggeringQuestion : newTriggeringQuestion,
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
	sessionTriggeringQuestion = $("#inputTriggeringQuestionEdit").val()
	sessionCreationDate = $("#inputCreationDateEdit").val()

	$("#inputSessionNameEdit").attr('disabled', false);
	$("#inputSummaryEdit").attr('disabled', false);
	$("#inputTriggeringQuestionEdit").attr('disabled', false);
	$("#inputCreationDateEdit").attr('disabled', false);

	$("#editButtons").css('display', 'block')
})

function getSessionInformation(){
	$.ajax({
		url : server.server_url + "/get_session_data",
		type : "POST",
		data : {
			sessionID : localStorage.getItem("SessionId")
		},
		success : function (response) {
			if (response['Success']){
				sessionID = localStorage.getItem("SessionId")
				$("#inputSessionNameEdit").val(response['name'])
				$("#inputSummaryEdit").val(response['summary'])
				$("#inputTriggeringQuestionEdit").val(response['triggeringQuestion'])
				$("#inputCreationDateEdit").val(response['creationDate'])
			}
		},
		error : function (error) {
			console.log("Error: " + error);
		}
	});
}

function getParticipantTypes(){
	$.ajax({
		url : server.server_url + "/get_participant_types",
		type : "POST",
		success : function (response) {
			if (response['Success']){
				var options = ""
				response['Roles'].forEach(function (role){
					options += `<option value="${role['name']}">${role['name']}</option>`
				})

				$("#inputParticipantRole").append(options)
			}
		},
		error : function (error) {
			console.log("Error: " + error);
		}
	});
}

function getSessionParticipants(sessionID){
	$.ajax({
		url : server.server_url + "/get_session_participants",
		type : "POST",
		data : {
			sessionID : sessionID
		},
		success : function(response){
			if (response['Success']){
				var participants = response['Members']
				keys = Object.keys(participants)
				if (keys.length > 0){
					keys.forEach(function(key){
						var participant = participants[key]
						var participantCard = getParticipantCard(participant['name'], participant['email'], participant['role'])
						$("#sessionParticipants").append(participantCard)
					})
				}
				else{
					$("#sessionParticipants").append('<h3>You haven\'t added any participants yet.</h3>')
				}
			}
		},
		error : function(error){
			console.log("Error: " + error);
		}
	});
}

$("#create_participant").click(function(e){
	e.preventDefault()
	var name  = $("#inputParticipantName").val()
	var email = $("#inputParticipantEmail").val()
	var role = $("#inputParticipantRole").val()

	createParticipant(name,email,role)
})

function createParticipant (name,email, role){
	if (name == "" || email == "" || role == "" || role == null){
		$("#participantErrorMessage").html("<li>Please complete all the fields</li>")
	}
	else{
		$("#participantErrorMessage").html("")
		$.ajax({
			url : server.server_url + "/create_participant",
			type : "POST",
				data : {
				name : name,
				email : email,
				role : role,
				sessionID : sessionID
			},
			success : function (response) {
				if (response['Success']){
					 window.location.replace("sessionInfo.html")
				}
			},
			error : function (error) {
				console.log("Error: " + error);
			}
		});
	}
}

function deleteParticipant(email) {
	console.log(email)
	$.ajax({
		url : server.server_url + "/delete_participant",
		type : "POST",
		data : {
			email : email,
			sessionID : sessionID
		},
		success : function (response) {
			if (response['Success']){
				window.location.replace("sessionInfo.html")
			}
		},
		error : function (error) {
			console.log("Error: " + error);
		}
	});
}

function editParticipant(email){
	localStorage.setItem("participantIDtoEdit", email)
	window.location.replace("participantInfo.html")
}

function getParticipantCard(name, email, role){
	var participantCard = `
		<div class="card mt-2 mb-2">
			<div class="card-body shadow-sm">
				<h5 class="card-title">${name}</h5>
				<h6	class="card-text">${email}</h6>
				<p class="card-text">${role}</p>
				<button type="button" class="btn btn-primary" onclick="editParticipant('${email}', ${sessionID})">Edit</button>
				<button type="button" class="btn btn-primary" onclick="deleteParticipant('${email}')">Delete</button>
			</div>
		</div>`
	return participantCard
}
