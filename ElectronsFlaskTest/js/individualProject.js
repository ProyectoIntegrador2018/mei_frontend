var projectID = null
var projectTitle = null
var projectOrganization = null
var projectDate = null;
var projectContext = null;

$(document).ready(function(){
	getProjectInformation()
})

$("#back").click(function(e){
	window.location.replace("projects.html")
})

$("#saveProjectChanges").click(function(e){
	e.preventDefault();
	var newProjectTitle = $("#inputProjectNameEdit").val()
	var newProjectOrganization = $("#inputOrgEdit").val()
	var newProjectDate = $("#inputProjectDateEdit").val()
	var newProjectContext = $("#inputContextEdit").val()

	var error = false
	if (newProjectTitle == ""){
		$("#titleErrorMessage").html("Field required")
		error = true
	}
	else{
		$("#titleErrorMessage").html("")
	}

	if (newProjectOrganization == ""){
		$("#orgErrorMessage").html("Field required")
		error = true
	}
	else{
		$("#orgErrorMessage").html("")
	}

	if (newProjectDate == ""){
		$("#dateErrorMessage").html("Field required")
		error = true
	}
	else{
		$("#dateErrorMessage").html("")
	}

	if (newProjectContext == ""){
		$("#contextErrorMessage").html("Field required")
		error = true
	}
	else{
		$("#contextErrorMessage").html("")
	}

	if (!error){
		$.ajax({
			url : "http://127.0.0.1:5000/edit_project",
			type : "POST",
			data : {
				name: newProjectTitle,
				org: newProjectOrganization,
				creationDate: newProjectDate,
				context: newProjectContext
			},
			success : function (response){
				if (response['Success']){
					window.location.replace("individualProject.html")
				}
			},
			error : function(e){
				console.log(e)
			}
		});
	}
})

$("#editProject").click(function(e){
	projectTitle = $("#inputProjectNameEdit").val()
	projectOrganization = $("#inputOrgEdit").val()
	projectDate = $("#inputProjectDateEdit").val()
	projectContext = $("#inputContextEdit").val()

	$("#inputProjectNameEdit").attr('disabled', false);
	$("#inputOrgEdit").attr('disabled', false);
	$("#inputProjectDateEdit").attr('disabled', false);
	$("#inputContextEdit").attr('disabled', false);

	$("#editButtons").css('display', 'block')
})

function getProjectInformation(){
	$.ajax({
	    url : "http://127.0.0.1:5000/get_project_info",
	    type : "POST",
	    success : function (response) {
	        if (response['Success']){
	        	projectID = response['projectID']
	            $("#inputProjectNameEdit").val(response['projectName'])
	            $("#inputOrgEdit").val(response['organization'])
	            $("#inputProjectDateEdit").val(response['creationDate'])
	            $("#inputContextEdit").val(response['description'])
	        }
	        console.log(response)
	    },
	    error : function (error) {
	        console.log("Error: " + error);
	    }
	});
}