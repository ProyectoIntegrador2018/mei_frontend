$(document).ready(function(){
  $('#save_voting_details').click(function(e){
    e.preventDefault()
    setVotingDetails()
  })
  getVotingDetails()
})

function setVotingState(state){
  console.log("setVotingState")
  if (state){
    console.log("votation details found")
    console.log(localStorage);
    $("#CaptureVotingScheme").hide()
    $("#CaptureVotes").show()
    getSessionParticipantsVoting()
    getParentIdeas("")
    getIdeasVotingResults()
  } else {
    console.log("No previous votation details found")
    $("#CaptureVotingScheme").show()
    $("#CaptureVotes").hide()
    updateVotingText()
  }
}

function setVotingText(){
console.log("setVotingText")
  parentIdeas = localStorage.getItem("parentIdeas")
  ideasToVote = $("#x_ideas").val()
  percentage = (Number(ideasToVote)*100 / Number(parentIdeas)).toString() + '%'
  console.log(document.getElementById('votingText').innerHTML)
  document.getElementById('votingText').innerHTML = '/'+parentIdeas+ ' = ' + percentage ;
}

function updateVotingText(){
  console.log("UpdateVotingText")

  $.ajax({
    url : "http://127.0.0.1:5000/getNumberOfParentIdeas",
    type : "POST",
    data : {
      sessionID : localStorage.getItem("SessionId")
    },
    success : function (response) {
      if (response['Success']) {
        parentIdeas = response['parentIdeas']
        localStorage.setItem("parentIdeas",parentIdeas)
        $("#x_ideas").attr("max",parentIdeas)
        setVotingText()
      } else {
        console.log("Call error");
        console.log(response);
      }
    },
    error : function (error) {
      console.log("Error: " + error);
    }
  });
}

function getVotingDetails(){
  console.log("getVotingDetails")
  $.ajax({
    url : "http://127.0.0.1:5000/get_voting_details",
    type : "POST",
    data : {
      sessionID : localStorage.getItem("SessionId")
    },
    success : function (response) {
      if (response['Success']) {
        votingDetails = response['votingDetails']
        votingScheme = votingDetails[0]['votingScheme']
        ideasToVote = votingDetails[0]['ideasToVote']

        localStorage.setItem("votingScheme",votingScheme)
        localStorage.setItem("ideasToVote",ideasToVote)
        setVotingState(true)
      } else {
        console.log("No details found");
        setVotingState(false)
      }
    },
    error : function (error) {
      console.log("Error: " + error);
    }
  });
}

function setVotingDetails(){
  var votingScheme = $("#inputVotingScheme").val()
  var ideasToVote = $("#x_ideas").val()

  if (votingScheme != null){
    $.ajax({
      url : "http://127.0.0.1:5000/set_voting_details",
      type : "POST",
      data : {
        sessionID : localStorage.getItem("SessionId"),
        votingScheme : votingScheme,
        ideasToVote : ideasToVote,
      } ,
      success : function (response) {
        if (response['Success']){
          console.log(response)
          localStorage.setItem("votingScheme",votingScheme)
          localStorage.setItem("ideasToVote",ideasToVote)
          setVotingState(true)
        }
        else{
          setVotingState(false)
        }
      },
      error : function (error) {
        console.log("Error: " + error);
      }
    });
  }
}

function getIdeasVoting(){
  $.ajax({
    url : "http://127.0.0.1:5000/get_voting_ideas",
    type : "POST",
    data : {
      sessionID : localStorage.getItem("SessionId")
    },
    success : function (response) {
      if (response['Success']) {
        console.log(response)
      }
        // localStorage.setItem("ideasIDs",ideas)
    },
    error : function (error) {
      console.log("Error: " + error);
    }
  });
}

function getIdeasVotingResults(){
  $.ajax({
    url : "http://127.0.0.1:5000/get_voting_results",
    type : "POST",
    data : {
      votingScheme : localStorage.getItem("votingScheme"),
      sessionID : localStorage.getItem("SessionId"),
      ideasToVote : localStorage.getItem("ideasToVote")
    },
    success : function (response) {
      if (response['Success']) {
        response['votes'].forEach(function (result){
          console.log(result)
          addIdeaCardVotingResult(result)
        })
      }
    },
    error : function (error) {
      console.log("Error: " + error);
    }
  });
}

function getSessionParticipantsVoting(){
	$.ajax({
		url : "http://127.0.0.1:5000/get_session_participants",
		type : "POST",
		data : {
			sessionID : localStorage.getItem("SessionId")
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

function addIdeaCardVoting(id,ideasOptions){
  var ideaCard = `
    <div class="col-sm-4">
    <div id="ideaCardVoting" class="card" style="width: 36rem;"">
      <div class="card-body shadow-sm">
        <div class="row">
          <div class="col-9">
            <select class="form-control mt-2 shadow-sm" id="inputIdeaVoting${id}">
              <option value="" selected disabled hidden>Ideas</option>
              ${ideasOptions}
            </select>
          </div>
        </div>
      </div>
    </div>
    </div>`
  $("#ideasSectionVoting").append(ideaCard)
}

function addIdeaCardVotingPriority(id,ideasOptions){
  var ideaCard = `
    <div class="col-sm-4">
    <div id="ideaCardVoting" class="card" style="width: 36rem;"">
      <div class="card-body shadow-sm">
        <div class="row">
          <div class="col-1">
            <h4 class="card-text">${id}</h4>
          </div>
          <div class="col-9">
            <select class="form-control mt-2 shadow-sm" id="inputIdeaVoting${id}">
              <option value="" selected disabled hidden>Ideas</option>
              ${ideasOptions}
            </select>
          </div>
        </div>
      </div>
    </div>
    </div>`
  $("#ideasSectionVoting").append(ideaCard)
}

function addIdeaCardVotingResult(id){
  firstID = localStorage.getItem("firstID")
  var ideaCard = `
    <div class="col-sm-2">
    <div id="ideaCardVoting" class="card" style="width: 5rem;"">
      <div class="card-body shadow-sm">
          <div class="col-1">
            <h4 class="card-text">${id-(firstID-1)}</h4>
          </div>
      </div>
    </div>
    </div>`
  $("#ideasSectionResults").append(ideaCard)
}

function getCurrentVotes(){
  votes = []
  ideasToVote = localStorage.getItem("ideasToVote")
  firstID = localStorage.getItem("firstID")

  for(i=1; i<=ideasToVote; i++){
      votes.push( Number($("#inputIdeaVoting"+i).val()) )
  }
  return votes
}

function showVotingOptions(){
  var votingScheme = $("#inputVotingScheme").val()

  if(votingScheme == "no_voting"){
    $("#votingOptions").hide()
  } else {
    $("#votingOptions").show()
  }
}

function getParentIdeas(order){
  console.log("getParentIdeas");
  $.ajax({
    url : "http://127.0.0.1:5000/get_parent_ideas",
    type : "POST",
    data : {
      sessionID : localStorage.getItem("SessionId"),
      order : order
    },
    success : function (response) {
      if (response['Success']) {
        if (order != "random") {
          localStorage.setItem("ideasIDs",response['ideasIDs'])
          localStorage.setItem("ideasText",response['ideasText'])
          getFirstIdeaID()
        }
      }
    },
    error : function (error) {
      console.log("Error: " + error);
    }
  });
}

function saveIdeasOptions(ideas){
  var ideasToVote = localStorage.getItem("ideasToVote")
  var ideasIDs = localStorage.getItem("ideasIDs").split(',')
  var ideasText = localStorage.getItem("ideasText").split(',')
  var firstID = localStorage.getItem("firstID")
  var options = ""

  for (var i = 0; i < ideasIDs.length ; i++) {
    ideaID = ideasIDs[i]
    ideaNumber = ideaID - (firstID - 1)
    ideaText = ideasText[i]
    ideaOptionText = ideaNumber.toString() + " - " + ideaText
    console.log(ideaOptionText)

    options += `<option value="${ideaID}">${ideaOptionText}</option>`
  }
  localStorage.setItem("ideasOptions",options)
  setIdeasCards()
}

function setIdeasCards(){
  var ideasToVote = localStorage.getItem("ideasToVote")
  var options = localStorage.getItem("ideasOptions")
  var votingScheme = localStorage.getItem("votingScheme")

  if (votingScheme == "top_x"){
    for (var i = 0; i < ideasToVote ; i++) {
      addIdeaCardVotingPriority(i+1,options)
    }
  }
  else {
    for (var i = 0; i < ideasToVote ; i++) {
      addIdeaCardVoting(i+1,options)
    }
  }

}

function getFirstIdeaID(){
  $.ajax({
    url : "http://127.0.0.1:5000/get_first_ideaID",
    type : "POST",
    data : {
      sessionID : localStorage.getItem("SessionId")
    },
    success : function (response) {
      if (response['Success']) {
        console.log(response)
        localStorage.setItem("firstID",response['firstID'])
        saveIdeasOptions()
      }
    },
    error : function (error) {
      console.log("Error: " + error)
    }
  });
}

function generateIdeaCards(){
  var votingScheme = localStorage.getItem("votingScheme")
  var ideasToVote = localStorage.getItem("ideasToVote")

  if (votingScheme == "top_x"){
    for(i=1; i<=ideasToVote; i++){
      addPriorityVotingCard(i)
    }
  }
  else {
    for(i=1; i<=ideasToVote; i++){
      addVotingCard(i)
    }
  }
}

$("#save_vote").click(function(e){
  var votes = getCurrentVotes()
  var member = $("#inputParticipantNameVoting").val()
  var sessionID = localStorage.getItem("SessionId")

  for(i=0; i<votes.length; i++){
    $.ajax({
        url : "http://127.0.0.1:5000/save_vote",
        type : "POST",
        data : {vote : i+1,
                ideaID: votes[i],
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
