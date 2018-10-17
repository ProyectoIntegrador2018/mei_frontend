

$(document).ready(function(){
  getIdeasVoting()
  getSessionParticipantsVoting(localStorage.getItem("SessionId"))
})

function getIdeasVoting(){
  $.ajax({
    url : "http://127.0.0.1:5000/get_session_ideas",
    type : "POST",
    data : {
      sessionID : localStorage.getItem("SessionId")
    },
    success : function (response) {
      if (response['Success']) {
        var i = 1
        IDEAS_NUMBER = response['Ideas'][1].length
        localStorage.setItem("ideasNum",IDEAS_NUMBER)
        IDEAS_IDS = []
        options = setupPriorities(IDEAS_NUMBER)
        response['Ideas'][1].forEach(function (idea){
          var ideaText = idea[2]
          IDEAS_IDS.push(idea[0])
          addIdeaCardVoting(i,ideaText,options)
          i++
        })

        localStorage.setItem("ideasIDs",IDEAS_IDS)
      }
    },
    error : function (error) {
      console.log("Error: " + error);
    }
  });
}

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
        console.log(options)
        $("#inputParticipantNameVoting").append(options)
        console.log($("#inputParticipantNameVoting"))
      }
		},
		error : function(error){
			console.log("Error: " + error);
		}
	});
}

function addIdeaCardVoting(id,statement,priority){
  var ideaCard = `
    <div class="col-sm-4">
    <div id="ideaCardVoting" class="card" style="width: 36rem;"">
      <div class="card-body shadow-sm">
        <div class="row">
          <div class="col-1">
            <h4 class="card-text">${id}</h4>
          </div>
          <div class="col-8">
            <h4 class="card-text">${statement}</h4>
          </div>
          <div class="col-3">
            <select class="form-control mt-2 shadow-sm" id="inputIdeaVoting${id}">
              <option value="" selected disabled hidden>Priority</option>
              ${priority}
            </select>
          </div>
        </div>
      </div>
    </div>
    </div>`
  $("#ideasSectionVoting").append(ideaCard)
}

function setupPriorities(IDEAS_NUMBER){
  var options = ""
  for(i=1; i<=IDEAS_NUMBER; i++){
      options += `<option value="${i}">${i}</option>`
  }
  console.log(options);

  // var inputs = $('[id^=inputIdeaVoting]')
  // inputs.forEach(function (input){
  //   input.append(options)
  // })
  // console.log(inputs)
  // for (i = 1; i <= IDEAS_NUMBER; i++){
  //   $("#inputIdeaVoting"+i).append(options)
  // }
  return options
}

function getCurrentVotes(){
  votes = []
  IDEAS_NUMBER = localStorage.getItem("ideasNum")

  for(i=1; i<=IDEAS_NUMBER; i++){
      votes.push( $("#inputIdeaVoting"+i).val() )
  }
  return votes
}

$("#save_vote").click(function(e){
  e.preventDefault()
  var votes = getCurrentVotes()
  var member = $("#inputParticipantNameVoting").val()
  var sessionID = localStorage.getItem("SessionId")
  var ideasIDs = localStorage.getItem("ideasIDs").split(',')

  console.log(votes)
  console.log(ideasIDs)
  console.log(member)
  console.log(sessionID)

  for(i=0; i<votes.length; i++){
    $.ajax({
        url : "http://127.0.0.1:5000/save_vote",
        type : "POST",
        data : {vote : votes[i],
                ideaID: ideasIDs[i],
                member: member,
                sessionID: sessionID},
        success : function (response) {
            console.log(response)
        },
        error : function (error) {
            console.log("Error: " + error);
        }
    });
  }

})
