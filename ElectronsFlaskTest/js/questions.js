let ideas = []
let question = {
  'firstElement': -1,
  'secondElement': -1
}

let questionWithVotes = []

$(document).ready(function(){
  hasStructure()
})

function getIdeaTypeQuestion(ideaType){
  $.ajax({
    url : "http://127.0.0.1:5000/ideatype_question",
    type : "POST",
    data : {
      ideaType : ideaType
    },
    success : function (response) { 
      if (response['Success']) {
        $("#relationQuestion").text(response['question'])
      }
    },
    error : function (error) {
      console.log("Error: " + error);
    }
  });
}

function hasStructure(){
  $.ajax({
    url : "http://127.0.0.1:5000/session_has_structure",
    type : "POST",
    data : {
      sessionID : localStorage.getItem("SessionId")
    },
    success : function (response) { 
      if (response['Success']) {
        if (response['hasStructure']) {
          var shouldDelete = confirm("This session already has a general structure. Click OK to overwrite it or close this dialog to view the structure.")
          if (shouldDelete) {
            deleteGeneralStructureAndMatrix()
          }
          else{
            console.log("Show general structureeeeee")
          }
        }
        else {
          getIdeas()
        }
      }
    },
    error : function (error) {
      console.log("Error: " + error);
    }
  });
}

function deleteGeneralStructureAndMatrix() {
  $.ajax({
    url : "http://127.0.0.1:5000/delete_structure_matrix",
    type : "POST",
    data : {
      sessionID : localStorage.getItem("SessionId")
    },
    success : function (response) { 
      if (response['Success']) {
        getIdeas()
      }
    },
    error : function (error) {
      console.log("Error: " + error);
    }
  });
}

function startGeneralStructure(amountIdeas){
  $.ajax({
    url : "http://127.0.0.1:5000/start_general_structure",
    type : "POST",
    data : {
      sessionID : localStorage.getItem("SessionId"),
      amountIdeas : amountIdeas
    },
    success : function (response) { 
      if (response['Success']){
        getNextQuestion()
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
      if (response['Success']) {
        var i = 0
        var ideasReceived = response['Ideas']
        if (ideasReceived.length == 0) {
          $("#questions").css('visibility', 'hidden')
          $("#warning").css('visibility', 'visible')
          $("#warning>div>h1").text('No elements found in this session.')
        }
        else if (ideasReceived.length == 1) {
          $("#questions").css('visibility', 'hidden')
          $("#warning").css('visibility', 'visible')
          $("#warning>div>h1").text('At least two elements are needed in this session.')
        }
        else {
          $("#questions").css('visibility', 'visible')
          $("#warning").css('visibility', 'hidden')
          for(i = 0; i < ideasReceived.length; i++){
            ideas.push(ideasReceived[i])
          }

          getIdeaTypeQuestion(ideasReceived[0]['type'])

          startGeneralStructure(ideasReceived.length)
        }
      }
    },
    error : function (error) {
      console.log("Error: " + error);
    }
  });
}

function answerQuestion(answer) {
  $.ajax({
    url : "http://127.0.0.1:5000/answer_question",
    type : "POST",
    data : {
      sessionID : localStorage.getItem("SessionId"),
      firstElement : question['firstElement'],
      secondElement : question['secondElement'],
      answer : answer
    },
    success : function (response) { 
      if (response['finished']) {
        console.log(response['levels'])
        $.ajax({
          url : "http://127.0.0.1:5000/save_matrix_structure",
          type : "POST",
          data : {
            sessionID : localStorage.getItem("SessionId"),
          },
          success : function (response) {
            console.log(questionWithVotes)
            $.ajax({
              url : "http://127.0.0.1:5000/save_votes",
              type : "POST",
              contentType : "application/json",
              data : JSON.stringify({
                'sessionID' : localStorage.getItem("SessionId"),
                'votes' : questionWithVotes
              }),
              success : function (response) {
                alert("Finished!")
                console.log(response)
              },
              error : function (error) {
                console.log("Error: " + error);
              }
            });
          },
          error : function (error) {
            console.log("Error: " + error);
          }
        });
      }
      else {
        getNextQuestion()
      }
    },
    error : function (error) {
      console.log("Error: " + error);
    }
  });
}

function getNextQuestion(){
  $.ajax({
    url : "http://127.0.0.1:5000/get_next_question",
    type : "POST",
    data : {
      sessionID : localStorage.getItem("SessionId")
    },
    success : function (response) { 
      console.log(response['first'] + 1, "influences" ,response['second'] + 1)
      firstElement = ideas[response['first']]
      secondElement = ideas[response['second']]
      question['firstElement'] = response['first']
      question['secondElement'] = response['second']
      $("#firstElementHeader").text(`${firstElement['type']} ${firstElement['ideaSessionNumber']}`)
      $("#firstElementStatement").text(firstElement['idea'])
      $("#firstElement>div").attr('id', firstElement['ideaID'])
      $("#secondElementHeader").text(`${secondElement['type']} ${secondElement['ideaSessionNumber']}`)
      $("#secondElementStatement").text(secondElement['idea'])
      $("#secondElement>div").attr('id', secondElement['ideaID'])
    },
    error : function (error) {
      console.log("Error: " + error);
    }
  });
}

$("#yes").click(function() {
  yesVotes = parseInt($("#yes-votes").val())
  noVotes = parseInt($("#no-votes").val())
  firstElementID = $("#firstElement>div").attr('id')
  secondElementID = $("#secondElement>div").attr('id')
  questionWithVotes.push({"firstElementID": firstElementID, "secondElementID": secondElementID, "yesVotes": yesVotes, "noVotes": noVotes})
  answerQuestion(1)
})

$("#no").click(function() {
  yesVotes = parseInt($("#yes-votes").val())
  noVotes = parseInt($("#no-votes").val())
  firstElementID = $("#firstElement>div").attr('id')
  secondElementID = $("#secondElement>div").attr('id')
  questionWithVotes.push({"firstElementID": firstElementID, "secondElementID": secondElementID, "yesVotes": yesVotes, "noVotes": noVotes})
  answerQuestion(0)
})