SESSION_ID = localStorage.getItem("id")

$(document).ready(function(){
	getTriggering(localStorage.getItem("id"))
})

function getTriggering(sessionID){
	$.ajax({
		url : "http://127.0.0.1:5000/get_session_data",
		type : "POST",
		data : {
			sessionID : localStorage.getItem("SessionId")
		},
		success : function (response) {	
			if (response['Success']){
				var sessionCard = getSessionCard(localStorage.getItem("SessionId"), response['triggeringQuestion'])
				$("#projectSessions").append(sessionCard)
			}
		},
		error : function (error) {
			console.log("Error: " + error);
		}
	});
}

function getSessionCard(id,triggeringQuestion){
	var sessionCard = `
		<div class="card mt-2 mb-2">
			<div class="card-body shadow-sm">
				<h5 class="card-text">${triggeringQuestion}</h5>
				<button class="btnadd float-right"><i class="fa fa-plus"></i></button>
			</div>
		</div>`
	return sessionCard
}
function getSessionIdeas(projectID){
	$.ajax({
	  url : "http://127.0.0.1:5000/get_project_sessions",
	  type : "POST",
	  data : {
	  	projectID : projectID
	  },
	  success : function(response){
	  	if (response['Success']){
	  		var sessions = response['Sessions']
	  		keys = Object.keys(sessions)
	  		if (keys.length > 0){
	  			keys.forEach(function(key){
	  				var session = sessions[key]
	  				var sessionCard = getSessionCard(
	  					session['sessionID'], 
	  					session['name'],
	  					session['summary'], 
	  					session['triggeringQuestion'], 
	  					session['creationDate'])
	  				$("#projectSessions").append(sessionCard)
	  			})
	  		}
	  		else{
				$("#projectSessions").append('<h3>You haven\'t created any sessions yet.</h3>')
	  		}
	  	}
	  },
	  error : function(error){
	    console.log("Error: " + error);
	  }
	});
}