var sessionID = localStorage.getItem("SessionId")
var sessionTitle = null
var sessionSummary = null
var sessionCreationDate = null;

$(document).ready(function(){
	getSessionInformation()
	getSessionParticipants(sessionID)
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

	$("#editButtons").css('display', 'none')
})

$("#saveSessionChanges").click(function(e){
	e.preventDefault();
	var newSessionTitle = $("#inputSessionNameEdit").val()
	var newSessionSummary = $("#inputSummaryEdit").val()
	var newCreationDate = $("#inputCreationDateEdit").val()

	var error = false
	if (newSessionTitle == ""){
		$("#titleErrorMessage").html("Field required")
		error = true
	}
	else{
		$("#titleErrorMessage").html("")
	}

	if (newSessionSummary== ""){
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
	projectTitle = $("#inputSessionNameEdit").val()
	projectOrganization = $("#inputSummaryEdit").val()
	projectDate = $("#inputCreationDateEdit").val()

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

function getSessionParticipants(sessionID){
    $.ajax({
        url : "http://127.0.0.1:5000/get_session_participants",
        type : "POST",
        data : {
            sessionID : sessionID
        },
        success : function(response){
            if (response['Success']){
                console.log(response)
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
            console.log(response)
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
    if (name == "" || email == "" || role == ""){
        $("#participantErrorMessage").html("<li>Please complete all the fields</li>")
    }
    else{
        $("#participantErrorMessage").html("")
        $.ajax({
            url : "http://127.0.0.1:5000/create_participant",
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
                console.log(response)
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
        url : "http://127.0.0.1:5000/delete_participant",
        type : "POST",
        data : {
            email : email,
            sessionID : sessionID
        },
        success : function (response) {
            if (response['Success']){
                window.location.replace("sessionInfo.html")
            }
            console.log(response)
        },
        error : function (error) {
            console.log("Error: " + error);
        }
    });
}

function getParticipantCard(name, email, role){
    var participantCard = `
		<div class="card mt-2 mb-2">
			<div class="card-body shadow-sm">
				<h5 class="card-title">${name}</h5>
				<h6	class="card-text">${email}</h6>
				<p class="card-text">${role}</p>
				<button type="button" class="btn btn-primary" onclick="deleteParticipant('${email}')">Delete</button>
			</div>
		</div>`
    return participantCard
}