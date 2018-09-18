var USER_ID = null

$(document).ready(function(){
	getSessionInfo()
})

$("#create_project").click(function(e){
    e.preventDefault()
    var name = $("#inputProjectName").val()
    var org = $("#inputOrg").val()
    var context = $("#inputContext").val()
    var date;
    date = new Date();
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ';

    createProject(name, org, date, context, USER_ID)
})

function createProject (name, org, creationDate, context, owner){
    $.ajax({
        url : "http://127.0.0.1:5000/create_project",
        type : "POST",
        data : {
            name : name,
            org : org,
            creationDate : creationDate,
            context : context,
            owner : owner
        },
        success : function (response) {
            if (response['Success']){
                window.location.replace("projects.html")
            }
            console.log(response)
        },
        error : function (error) {
            console.log("Error: " + error);
        }
    });
}

function getProjectCard(id,title, organization, creationDate, context){
	var projectCard = `
		<div class="card mt-2 mb-2">
			<div class="card-body shadow-sm projectCard">
				<h5 class="card-title">${title}</h5>
				<h6	class="card-text"><b>Organization: </b>${organization}</h6>
				<p class="card-text"><b>Description: </b>${context}</p>
				<p class="card-text">${creationDate}</p>
				<button type="button" class="btn btn-primary" onclick="getProjectInfo(${id})">Edit</button>
				<button type="button" class="btn btn-primary" onclick="getSessions(${id})">Sessions</button>
			</div>
		</div>`
	return projectCard
}

function getSessions(id){
	localStorage.setItem("id", id)
	window.location.replace("session.html")
}

function getSessionInfo(){
	$.ajax({
	  url : "http://127.0.0.1:5000/get_session_info",
	  type : "POST",
	  data : {
	  	session_key : 'email'
	  },
	  success : function(response){
	    if (response['Success']){
	      $("#welcome").html("Welcome " + response['name'])
	      getUserProjects(response['userID'])
          USER_ID = response['userID']
	    }
	  },
	  error : function(error){
	    console.log("Error: " + error);
	  }
	});
}

function getUserProjects(userID){
	$.ajax({
	  url : "http://127.0.0.1:5000/get_user_projects",
	  type : "POST",
	  data : {
	  	userID : userID
	  },
	  success : function(response){
	  	if (response['Success']){
	  		var projects = response['Projects']
	  		keys = Object.keys(projects)
	  		if (keys.length > 0){
	  			keys.forEach(function(key){
	  				var project = projects[key]
	  				var projectCard = getProjectCard(project['projectID'], project['name'], project['org'], project['creationDate'], project['context'])
	  				$("#userProjects").append(projectCard)
	  			})
	  		}
	  		else{
	  			$("#userProjects").append('<h3>You haven\'t created any projects yet.</h3>')
	  		}
	  	}
	  	console.log(response)
	  },
	  error : function(error){
	    console.log("Error: " + error);
	  }
	});
}

function getProjectInfo(projectID){
	localStorage.setItem("projectID", projectID)
	window.location.replace("individualProject.html")
}
