//GLOBAL CONSTANTS
IDEA_TYPE = ""

$(document).ready(function(){
  //TODO: NO SIEMPRE SE LOADEA EL CONTENIDO
  getTriggering()
  getIdeas()
  addParticipants()
})

function getTriggering(){
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

function getIdeas(){
  $.ajax({
    url : "http://127.0.0.1:5000/get_session_ideas",
    type : "POST",
    data : {
      sessionID : localStorage.getItem("SessionId")
    },
    success : function (response) { 
      if (response['Success']) {
        var i = 0
        var ideas = response['Ideas']
        var keys = Object.keys(ideas)
        if (keys.length > 0){
          for(i = 0; i < keys.length; i++){
            for(j = 0; j < ideas[keys[i]].length; j++){
              IDEA_TYPE = ideas[keys[i]][j][5]
              var childID = ideas[keys[i]][j][0]
              var childIdeaText = ideas[keys[i]][j][2]
              var childClarification = (ideas[keys[i]][j][3] == null) ? 'No clarification' : ideas[keys[i]][j][3]
              var childParticipantEmail = (ideas[keys[i]][j][4] == null) ? 'Anonymous' : ideas[keys[i]][j][4]
              var childIdea = getIdeaTableRow(childID, childIdeaText, childClarification, childParticipantEmail)
              $("#ideaSessions").append(childIdea)
            }
          }
        }
      }
    },
    error : function (error) {
      console.log("Error: " + error);
    }
  });
}

function addParticipants(){
  $.ajax({
    url : "http://127.0.0.1:5000/get_session_participants",
    type : "POST",
    data : {
      sessionID : localStorage.getItem("SessionId")
    },
    success : function (response) { 
      if (response['Success']){
        console.log( response.Members.length)
        var option = document.createElement("option");
        for(member in response.Members) {
          var option = document.createElement("option");
          option.text = response.Members[member].email;
          option.value = response.Members[member].email;
          $("#participantSelection").append(option)
        }
      }
    },
    error : function (error) {
      console.log("Error: " + error);
    }
  });
}

function getSessionCard(id,triggeringQuestion){
  var sessionCard = `
    <div id="trigQuestion" class="card mt-2 mb-2">
      <div class="card-header">Triggering Question</div>
      <div class="card-body shadow-sm">
        <h1 class="card-text text-center">${triggeringQuestion}</h1>
        <button id="trigAdd" class="btnadd float-right" data-toggle="modal" data-target="#addIdea"><i class="fa fa-plus"></i></button>
        <button id="trigTags" class="btnadd float-right" data-toggle="modal" data-target="#addTag"><i class="fa fa-tags"></i></button>
        <button id="trigEdit" class="btnadd float-right"><i class="fas fa-edit"></i></button>
      </div>
    </div>`
  return sessionCard
}

function getIdeaCard(id,statement, clarification, participant){
  var ideaCard = `
    <div class="col-sm-4">
    <div id="ideaCard" class="card" style="width: 18rem;"">
      <div class="card-body shadow-sm">
        <h3 class="card-text">${statement}</h3>
        <h4 class="card-text">${clarification}</h4>
        <span class="badge badge-secondary" float-left>${IDEA_TYPE}</span>
        <h6 class="card-text" float-right">${participant}</h6>
      </div>
    </div>
    </div>`
  return ideaCard
}

function getIdeaTableRow(id, statement, clarification, participant){
  var clarificationWarning = ""
  if (clarification == "No clarification"){
    clarificationWarning = `class="table-warning"`
  }

  if (participant == null || participant == ""){
    participant = "Anonymous"
  }

  var ideaRow = `
    <tr>
      <th scope="row">${id}</th>
      <td align="center"><span class="badge badge-secondary">${IDEA_TYPE}</span></td>
      <td>${statement}</td>
      <td ${clarificationWarning}>${clarification}</td>
      <td>${participant}</td>
    </tr>
  `

  return ideaRow
}

$("#addIdeabtn").click(function() {
  var statement =  $("#statement").val();
  var participant = $("#participantSelection").val();
  if (participant === ""){
    participant = null
  }

  if(IDEA_TYPE != "") {
    if (statement != ""){
      $.ajax({
        url : "http://127.0.0.1:5000/create_element",
        type : "POST",
        data : {
          idea : statement,
          ideaType : IDEA_TYPE,
          participant : participant,
          sessionID : localStorage.getItem("SessionId")
        },
        success : function (response) {
          if (response['Success']){
            var ideaRow = getIdeaTableRow(response['ideaID'], statement, "No clarification", participant)
            $("#ideaSessions").append(ideaRow)
            $("#statement").val("")
            $("#participantSelection").val("")
          }
        },
        error : function (error) {
          console.log("Error: " + error);
        }
      })
    }
  } else {
    alert("There is no element type for the session")
  }
});

$("#addElementTypeBtn").click(function() {
  if (IDEA_TYPE == "") {
      IDEA_TYPE = $("#elementSelection").value
      $("#trigQuestion").append( '<span class="badge badge-primary">' + IDEA_TYPE + '</span>')
      $( "#otherOption").hide()
      $("#addTag").prop('disabled', true);
      console.log("hello")
    }

});

$( "#elementSelection" ).change(function() {
  if(this.value == "Other") {
    $( "#otherOption").show()
    IDEA_TYPE = $( "#otherOption").value
  } else {
    IDEA_TYPE = this.value
  }
});




