//GLOBAL CONSTANTS
IDEA_TYPE = ""

$(document).ready(function(){
  //TODO: NO SIEMPRE SE LOADEA EL CONTENIDO
  getTriggering()
  getIdeas()
  addParticipants()
})

let beforeEdit = {}

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
    url : "http://127.0.0.1:5000/get_all_session_ideas",
    type : "POST",
    data : {
      sessionID : localStorage.getItem("SessionId")
    },
    success : function (response) { 
      console.log(response)
      if (response['Success']) {
        var i = 0
        var ideas = response['Ideas']
        for(i = 0; i < ideas.length; i++){
          IDEA_TYPE = ideas[i]['type']
          var ideaID = ideas[i]['ideaID']
          var clarification = (ideas[i]['clarification']) == null ? 'No clarification' : ideas[i]['clarification']
          var statement = ideas[i]['idea']
          var ideaNumber = ideas[i]['ideaSessionNumber']
          var participant = (ideas[i]['participant'] == null) ? 'Anonymous' : ideas[i]['participant']
          var childIdea = getIdeaTableRow(ideaID, statement, clarification, participant, ideaNumber)
          $("#ideaSessions").append(childIdea)
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
        console.log(response.Members)
        console.log(response.Members.length)
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
    <div id="trigQuestion" class="card mb-2">
      <div class="card-header">Triggering Question</div>
      <div class="card-body shadow-sm">
        <h1 class="card-text text-center">${triggeringQuestion}</h1>
        <button id="trigAdd" class="btnadd float-right" data-toggle="modal" data-target="#addIdea"><i class="fa fa-plus"></i></button>
        <button id="trigTags" class="btnadd float-right" data-toggle="modal" data-target="#addTag"><i class="fa fa-tags"></i></button>
        <!--<button id="trigEdit" class="btnadd float-right"><i class="fas fa-edit"></i></button>-->
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

function getIdeaTableRow(id, statement, clarification, participant, ideaNumber){
  var clarificationWarning = ""
  if (clarification == "No clarification"){
    clarificationWarning = `class="table-warning"`
  }

  if (participant == null || participant == ""){
    participant = "Anonymous"
  }

  var ideaRow = `
    <tr>
      <th scope="row">${ideaNumber}</th>
      <td><span class="badge badge-secondary">${IDEA_TYPE}</span></td>
      <td id="statement-${id}">${statement}</td>
      <td ${clarificationWarning}>${clarification}</td>
      <td id="author-${id}">${participant}</td>
      <td>
        <div id="edit-${id}">
          <button type="button" class="btn btn-primary btn-sm" onclick="editIdea('${id}')">Edit</button>
        </div>
        <div id="canceledit-${id}" style="display: none">
          <button type="button" class="btn btn-primary btn-sm" onclick="saveIdea('${id}')">Save</button>
          <button type="button" class="btn btn-primary btn-sm" onclick="cancelEditIdea('${id}')">Cancel</button>
        </div>
      </td>
    </tr>
  `

  return ideaRow
}

function editIdea(ideaID) {
  $("#edit-" + ideaID).css("display", "none")
  $("#canceledit-" + ideaID).css("display", "inline")
  statement = $("#statement-" + ideaID).text()
  author = $("#author-" + ideaID).text()
  beforeEdit[ideaID] = {'statement': statement, 'author': author}
  select = $("#participantSelection").clone()
  select.val(author)
  $("#statement-" + ideaID).html(`<input type='text' value='${statement}' style='width: 100%'></input>`)
  $("#author-" + ideaID).html(select)
}

function cancelEditIdea(ideaID) {
  $("#edit-" + ideaID).css("display", "inline")
  $("#canceledit-" + ideaID).css("display", "none")
  $("#statement-" + ideaID).text(beforeEdit[ideaID]['statement'])
  $("#author-" + ideaID).text(beforeEdit[ideaID]['author'])
}

function saveIdea(ideaID) {
  $("#edit-" + ideaID).css("display", "inline")
  $("#canceledit-" + ideaID).css("display", "none")
  $.ajax({
    url : "http://127.0.0.1:5000/update_idea",
    type : "POST",
    data : {
      ideaID: ideaID,
      statement: $("#statement-" + ideaID + ">input").val(),
      author: $("#author-" + ideaID + ">select").val()
    },
    success : function (response) { 
      if (response['Success']){
        window.location.replace("triggeringQuestion.html")
      }
    },
    error : function (error) {
      console.log("Error: " + error);
    }
  });
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
          console.log(response)
          if (response['Success']){
            var ideaRow = getIdeaTableRow(response['ideaID'], statement, "No clarification", participant, response['ideaNumber'])
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




