PROJECT_ID = localStorage.getItem("id")

$(document).ready(function(){
	getProjectSessions(localStorage.getItem("id"))
})

function getProjectSessions(projectID){
	$.ajax({
	  url : "http://127.0.0.1:5000/get_project_sessions",
	  type : "POST",
	  data : {
	  	projectID : projectID
	  },
	  success : function(response){
	  	if (response['Success']){
	  		console.log(response)
	  		var sessions = response['Sessions']
	  		keys = Object.keys(sessions)
	  		if (keys.length > 0){
	  			keys.forEach(function(key){
	  				var session = sessions[key]
	  				var sessionCard = getSessionCard(session['sessionID'], session['name'],session['summary'], session['creationDate'])
	  				$("#projectSessions").append(sessionCard)
	  			})
	  		}
	  		else{
	  			$("#projectSessions").append('<h3>You haven\'t created any projects yet.</h3>')
	  		}
	  	}
	  	console.log(response)
	  },
	  error : function(error){
	    console.log("Error: " + error);
	  }
	});
}

function getSessionCard(id,title, summary, creationDate){
	var sessionCard = `
		<div class="card w-75 mt-2">
			<div class="card-body">
				<h5 class="card-title">${title}</h5>
				<h6	class="card-text">${summary}</h6>
				<p class="card-text">${creationDate}</p>
				<button type="button" class="btn btn-primary" onclick="getSessionInfo(${id})">Edit</button>
				<button type="button" class="btn btn-primary" onclick="startSession(${id})">Start</button>
			</div>
		</div>`
	return sessionCard
}

function getSessionInfo(id) {
	localStorage.setItem("SessionId", id)
	window.location.replace("sessionInfo.html")
}

$("#back").click(function(e) {
	e.preventDefault()
	window.location.replace("projects.html")
})

$("#create_session").click(function(e){
    e.preventDefault()
    var name  = $("#inputSessionName").val()
    var summary = $("#inputSummary").val()
    console.log(summary)
    var date;
    date = new Date();
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' +
        ('00' + date.getUTCHours()).slice(-2) + ':' +
        ('00' + date.getUTCMinutes()).slice(-2) + ':' +
        ('00' + date.getUTCSeconds()).slice(-2);


    createSession(name,summary, date)
})

function createSession (name,summary, date){
	console.log(name,summary, date, PROJECT_ID)
    $.ajax({
        url : "http://127.0.0.1:5000/create_session",
        type : "POST",
        data : {
        	name : name,
            summary : summary,
            creationDate : date,
            projectID : PROJECT_ID
        },
        success : function (response) {
            if (response['Success']){
                 window.location.replace("session.html")
            }
            console.log(response)
        },
        error : function (error) {
            console.log("Error: " + error);
        }
    });
}