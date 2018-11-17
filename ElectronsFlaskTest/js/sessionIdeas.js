const server = require('../js/main')
const interact = require('interactjs');

// Hold clarifications before editing for when the user clicks Cancel and we can revert the TextArea value
// to the clarification before editing
var ideaClarificationDict = {}

function getIdeaCard(ideaID, ideaText, email, clarification, isChildren, children, ideaNumber){
  var display = "";
  if (isChildren){
    display = "inline"
  }
  else{
    display = "none"
  }

  var dropzone = ""
  if (!isChildren){
    dropzone = "dropzone"
  }

  return `<div class="card m-2 idea ${dropzone} draggable" id="idea-${ideaID}">
            <div class="card-body shadow-sm">
              <div style="overflow-y: scroll;">
                  <button type="button" class="close float-left mr-2 mt-1" aria-label="Close" onclick="removeChildIdea('idea-${ideaID}')" style="Display: ${display}">
                    &times;
                  </button>
                  <h5 class="card-title">
                    <b>${ideaNumber}</b> ${ideaText}
                  </h5>
                  <h6 style="Display: none" class="elementParticipant">Author: ${email}</h6>
                  <div class="form-group elementClarification" style="Display: none">
                    <div style="Display: inline">
                    <label for="comment">Clarification:</label>
                    <button type="button" class="btn btn-primary btn-sm" onclick="editClarification(${ideaID})" style="Display: inline" id="edit-${ideaID}">Edit</button>
                    <button type="button" class="btn btn-primary btn-sm" onclick="cancelEditClarification(${ideaID})"style="Display: none" id="cancel-${ideaID}">Cancel</button>
                    <button type="button" class="btn btn-primary btn-sm" onclick="saveClarification(${ideaID})"style="Display: none" id="save-${ideaID}">Save</button>
                    </div>
                    <textarea class="form-control" placeholder="No clarification" id="clarification-${ideaID}" disabled>${clarification}</textarea>
                  </div>
                  ${children}
              </div>
            </div>
          </div>`
}

function editClarification(ideaID){
  // Show/hide the appropriate buttons and enable the Clarification TextArea
  $("#edit-" + ideaID).css("display", "none")
  $("#cancel-" + ideaID).css("display", "inline")
  $("#save-" + ideaID).css("display", "inline")
  $("#clarification-" + ideaID).prop("disabled", false)

  // Keep track of the clarification before editing, Cancel should restore the TextArea value to this
  ideaClarificationDict[ideaID] = $("#clarification-" + ideaID).val()
}

function cancelEditClarification(ideaID){
  // Show/hide the appropriate buttons and disable the Clarification TextArea
  $("#edit-" + ideaID).css("display", "inline")
  $("#cancel-" + ideaID).css("display", "none")
  $("#save-" + ideaID).css("display", "none")
  $("#clarification-" + ideaID).prop("disabled", true)

  // Set the Clarification TextArea value to the clarification before editing
  $("#clarification-" + ideaID).val(ideaClarificationDict[ideaID])
}

function saveClarification(ideaID){
  // Show/hide the appropriate buttons and disable the Clarification TextArea
  $("#edit-" + ideaID).css("display", "inline")
  $("#cancel-" + ideaID).css("display", "none")
  $("#save-" + ideaID).css("display", "none")
  $("#clarification-" + ideaID).prop("disabled", true)
  var clarification = $("#clarification-" + ideaID).val()
  if (clarification !== ""){ // Check for only whitespaces????
    $.ajax({
      url : server.server_url + "/update_clarification",
      type : "POST",
      data : {
        ideaID : ideaID,
        clarification : clarification
      },
      error : function(error){
        console.log("Error: " + error)
      }
    })
  }
}

$(document).ready(function(){
  $.ajax({
    url : server.server_url + "/get_session_ideas",
    type : "POST",
    data : {
      sessionID : localStorage.getItem("SessionId")
    },
    success : function(response){
      if (response['Success']){
          var i = 0
          var ideas = response['Ideas']
          var keys = Object.keys(ideas)
          if (keys.length > 0){
            $("#showParticipants").prop('disabled', false)
            $("#showClarifications").prop('disabled', false)
            $("#saveIdeas").prop('disabled', false)
            for(i = 0; i < keys.length; i++){
              var childIdeas = ""
              for(j = 1; j < ideas[keys[i]].length; j++){
                var childID = ideas[keys[i]][j][0]
                var childIdeaText = ideas[keys[i]][j][2]
                var childClarification = (ideas[keys[i]][j][3] == null) ? '' : ideas[keys[i]][j][3]
                var childParticipantEmail = (ideas[keys[i]][j][4] == null) ? 'Anonymous' : ideas[keys[i]][j][4]
                var childIdeaNumber = ideas[keys[i]][j][7]
                var childIdea = getIdeaCard(childID, childIdeaText, childParticipantEmail, childClarification, true, "", childIdeaNumber)
                childIdeas += childIdea
              }

              var parentID = ideas[keys[i]][0][0]
              var parentIdeaText = ideas[keys[i]][0][2]
              var parentClarification = (ideas[keys[i]][0][3] == null) ? '' : ideas[keys[i]][0][3]
              var participantEmail = (ideas[keys[i]][0][4] == null) ? 'Anonymous' : ideas[keys[i]][0][4]
              var parentNumber = ideas[keys[i]][0][7]
              var parentIdea = getIdeaCard(parentID, parentIdeaText, participantEmail, parentClarification, false, childIdeas, parentNumber)
              $("#ideasSection").append(parentIdea)
            }
          }
          else{
            $("#ideasSection").append('<h3 class="mt-3">You haven\'t created any elements yet.</h3>')
            $("#showParticipants").prop('disabled', true)
            $("#showClarifications").prop('disabled', true)
            $("#saveIdeas").prop('disabled', true)
          }
      }
    },
    error : function(error){
      console.log("Error: " + error);
    }
  });
})

interact('.draggable').draggable({
  // enable inertial throwing
    inertia: false,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "parent",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },

    // enable autoScroll
    autoScroll: true,

    onstart: function (event) {
      console.log("Dragging started!")
        $(event.target).css("z-index", 1);
    },

    // call this function on every dragmove event
    onmove: dragMoveListener,

})

.pointerEvents({
    ignoreFrom: 'button',
});

// enable draggables to be dropped into this
interact('.dropzone').dropzone({
  // only accept elements matching this CSS selector
  accept: '.idea',
  // Require a 75% element overlap for a drop to be possible
  overlap: 0.1,

  ondrop: function (event) {
    var draggableElement = event.relatedTarget,
        dropzoneElement = event.target;

    // translate the element
    draggableElement.style.webkitTransform =
    draggableElement.style.transform =
      'translate(' + 0 + 'px, ' + 0 + 'px)';

      // update the position attributes
    draggableElement.setAttribute('data-x', 0);
    draggableElement.setAttribute('data-y', 0);

    var current = $(draggableElement)
    var childrenIdeas = $($(current.children()[0]).children()[0]).children('.idea')

    draggableElement.classList.remove('dropzone')
    draggableElement.classList.remove('draggable')
    
    $(draggableElement).find("button.close").css("display", "inline")
    $(draggableElement).css('z-index', $(dropzoneElement).css('z-index'));
    $($(dropzoneElement).children()[0].children[0]).append(draggableElement)
    $($(dropzoneElement).children()[0].children[0]).append(childrenIdeas)
  },
});

$("#showParticipants").click(function() {
  var display = $(".elementParticipant").css("Display")
  if (display === "none"){
    $("#showParticipants").text("Hide participants")
    $(".elementParticipant").css("display", "block")
  }
  else{
    $("#showParticipants").text("Show participants")
    $(".elementParticipant").css("display", "none")
  }
})

$("#showClarifications").click(function() {
  var display = $(".elementClarification").css("Display")
  if (display === "none"){
    $("#showClarifications").text("Hide clarifications")
    $(".elementClarification").css("display", "block")
  }
  else{
    $("#showClarifications").text("Show clarifications")
    $(".elementClarification").css("display", "none")
  }
})

$("#saveIdeas").click(function() {
  var ideas = getIdeaHierarchy()
  console.log(ideas)
  $.ajax({
    url: server.server_url + "/join_ideas",
    type: "POST",
    data: {
      sessionID: localStorage.getItem("SessionId"),
      ideas: ideas
    },
    success: function(response){
      console.log(response)
      if (response['Success']){
        window.location.replace("sessionIdeas.html")
      }
    },
    error: function(error){
      console.log("Error: " + error)
    }
  })
})

function getTriggering(){
  $.ajax({
    url : server.server_url + "/get_session_data",
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

function getIdeaHierarchy(){
  var ideasCards = $(".idea")
  var ideas = {}
  for (var i = 0; i < ideasCards.length; i++) {
    var idea = ideasCards[i]
    var ideaID = parseInt($(idea).attr("id").substring($(idea).attr("id").search("-") + 1))
    var childrenIdeas = $($($(idea).children()[0]).children()[0]).children('.idea')
    ideas[ideaID] = [-1]
    for (var j = 0; j < childrenIdeas.length; j++) {
      var childIdea = childrenIdeas[j]
      var childIdeaID = parseInt($(childIdea).attr("id").substring($(childIdea).attr("id").search("-") + 1))
      ideas[ideaID].push(childIdeaID)
    }
  }

  return ideas
}

function removeChildIdea(id){
    $("#ideasSection").append($("#" + id))
    $("#" + id).find("button").css("display", "none")
    $("#" + id).addClass('draggable')
    $("#" + id).addClass('dropzone')
}

function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the position attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}



// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;