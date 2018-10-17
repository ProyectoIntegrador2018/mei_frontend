$(document).ready(function(){
  getSessionParticipantsVoting(localStorage.getItem("SessionId"))
})
function getSessionParticipantsVoting(sessionID){
	$.ajax({
		url : "http://127.0.0.1:5000/get_session_participants",
		type : "POST",
		data : {
			sessionID : sessionID
		},
		success : function(response){
			if (response['Success']){
        var options = ""
				response['Members'].forEach(function (member){
          options += `<option value="${member['email']}">${member['name']}</option>`
        })
        $("#inputParticipantNameVoting").append(options)
        // var participants = response['Members']
				// keys = Object.keys(participants)
				// if (keys.length > 0){
				// 	keys.forEach(function(key){
				// 		var participant = participants[key]
        //
				// 		$("#sessionParticipants").append( participant['name'], participant['email'] )
				// 	})
      }
		},
		error : function(error){
			console.log("Error: " + error);
		}
	});
}
