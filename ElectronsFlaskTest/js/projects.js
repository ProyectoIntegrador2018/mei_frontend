$(document).ready(function(){
	getSessionInfo()
})

function getProjectCard(title, organization, creationDate, context){
	var projectCard = `
		<div class="card w-75 mt-2">
			<div class="card-body">
				<h5 class="card-title">${title}</h5>
				<h6	class="card-text">${organization}</h6>
				<p class="card-text">${context}</p>
				<p class="card-text">${creationDate}</p>
			</div>
		</div>`
	return projectCard
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
	  				var projectCard = getProjectCard(project['name'], project['org'], project['creationDate'], project['context'])
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

function createProject(name, org, creationDate, context, owner){
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
                var projectCard = getProjectCard(name, org, creationDate, context)
				$("#userProjects").append(projectCard)
            }
            console.log(response)
        },
		error : function (error) {
            console.log("Error: " + error);
        }
	});
}