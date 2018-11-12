let ideas = []

let question = {
  'firstElement': -1,
  'secondElement': -1
}

let ideaIDToIndex = {}

let questionMatrix = []

let followUpQuestions = []
let isFollowUp = false
let isSearchingHigher = false

let priorities = []

let questionsAsked = []

$(document).ready(function(){
	getIdeas()
})

function deleteSessionPriorities() {
	$.ajax({
	  url : "http://127.0.0.1:5000/delete_session_priorities",
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

function getIdeas(){
  ideasToStructure = localStorage.getItem("ideasToStructure")
  console.log(ideasToStructure)
  if(ideasToStructure != null){
    $.ajax({
      url : "http://127.0.0.1:5000/get_all_session_ideas_in",
      type : "POST",
      data : {
        sessionID : localStorage.getItem("SessionId"),
        ideasToStructure : ideasToStructure
      },
      success : function (response) {
        console.log(response)
        if (response['Success']) {
          var i = 0
          var ideasReceived = response['Ideas']
          if (ideasReceived.length == 0) {
            $("#categories").css('visibility', 'hidden')
            $("#warning").css('visibility', 'visible')
            $("#warning>div>h1").text('No elements found in this session.')
          }
          else if (ideasReceived.length == 1) {
            $("#categories").css('visibility', 'hidden')
            $("#warning").css('visibility', 'visible')
            $("#warning>div>h1").text('At least two elements are needed in this session.')
          }
          else {
            $("#questions").css('visibility', 'visible')
            $("#warning").css('visibility', 'hidden')
            for(i = 0; i < ideasReceived.length; i++){
              ideas.push(ideasReceived[i])
              ideaIDToIndex[ideasReceived[i]['ideaID'].toString()] = i
              questionMatrix[i] = []
            }

            for (i = 0; i < ideasReceived.length; i++) {
              for (var j = 0; j < ideasReceived.length; j++) {
                if (i == j){
                  questionMatrix[i][j] = true
                }
                else{
                  questionMatrix[i][j] = false
                }
              }
            }

            setNextQuestion(0, 1)
          }
        }
      },
      error : function (error) {
        console.log("Error: " + error);
      }
    });
  } else {
    console.log("No Ideas to Structure Selected")
  }
}

function setNextQuestion(i, j) {
	question['firstElement'] = i
	question['secondElement'] = j
	$("#firstElementHeader").text(`${ideas[i]['type']} ${ideas[i]['ideaSessionNumber']}`)
    $("#firstElementStatement").text(ideas[i]['idea'])
    $("#firstElement>div").attr('id', ideas[i]['ideaID'])
    $("#secondElementHeader").text(`${ideas[j]['type']} ${ideas[j]['ideaSessionNumber']}`)
    $("#secondElementStatement").text(ideas[j]['idea'])
    $("#secondElement>div").attr('id', ideas[j]['ideaID'])
}

$("#higher").click(function() {

  higherVotes = parseInt($("#higher-votes").val())
  lowerVotes = parseInt($("#lower-votes").val())
  sameVotes = parseInt($("#same-votes").val())
  firstElementID = $("#firstElement>div").attr('id')
  secondElementID = $("#secondElement>div").attr('id')

  questionMatrix[ideaIDToIndex[firstElementID]][ideaIDToIndex[secondElementID]] = true
  questionMatrix[ideaIDToIndex[secondElementID]][ideaIDToIndex[firstElementID]] = true

  questionsAsked.push({'firstElement': firstElementID, 'secondElement': secondElementID, 'higherVotes': higherVotes, 'lowerVotes': lowerVotes, 'sameVotes': sameVotes, 'answer': 0})

  if (priorities.length == 0){
  	priorities.push([firstElementID])
  	priorities.push([secondElementID])
    getNextQuestion()
    console.log(priorities)
  }
  else{
    let index = -1
    for (var i = 0; i < priorities.length; i++) {
      if (priorities[i].indexOf(firstElementID) != -1){
        console.log(i)
        index = i
        break
      }
    }

    if (index == priorities.length - 1) {
      priorities[index - 1].push(secondElementID)
      getNextQuestion()
    }
    else{
      if (isFollowUp) {
        if (isSearchingHigher) {
          for (var i = 0; i < priorities.length; i++) {
            if (priorities[i].indexOf(secondElementID) != -1){
              priorities.splice(i, 0, [firstElementID])
              followUpQuestions = []
              isFollowUp = false
              getNextQuestion()
              break
            }
          }
        }
        else {
          console.log("QUE PEDO piqué higher")
          if (index == 0){
            priorities.splice(0, 0, [firstElementID])
          }
          getNextQuestion()
        }
      }
      else {
        isSearchingHigher = true
        console.log(priorities)
        for (var i = index + 1; i < priorities.length; i++) {
          followUpQuestions.push({'firstElement': ideaIDToIndex[secondElementID], 'secondElement': ideaIDToIndex[priorities[i][0]]})
        }

        console.log(followUpQuestions)

        getNextQuestion()
      }
    }
  }
})

$("#lower").click(function() {
  higherVotes = parseInt($("#higher-votes").val())
  lowerVotes = parseInt($("#lower-votes").val())
  sameVotes = parseInt($("#same-votes").val())
  firstElementID = $("#firstElement>div").attr('id')
  secondElementID = $("#secondElement>div").attr('id')

  questionMatrix[ideaIDToIndex[firstElementID]][ideaIDToIndex[secondElementID]] = true
  questionMatrix[ideaIDToIndex[secondElementID]][ideaIDToIndex[firstElementID]] = true

  questionsAsked.push({'firstElement': firstElementID, 'secondElement': secondElementID, 'higherVotes': higherVotes, 'lowerVotes': lowerVotes, 'sameVotes': sameVotes, 'answer': 1})

  if (priorities.length == 0){
  	priorities.push([secondElementID])
  	priorities.push([firstElementID])
    getNextQuestion()
    console.log(priorities)
  }
  else{
    let index = -1
    for (var i = 0; i < priorities.length; i++) {
      if (priorities[i].indexOf(firstElementID) != -1){
        console.log(i)
        index = i
        break
      }
    }

    if (index == 0) {
      priorities.splice(0, 0, [secondElementID])
      getNextQuestion()
    }
    else{
      if (isFollowUp) {
        if (isSearchingHigher == false) {
          for (var i = 0; i < priorities.length; i++) {
            if (priorities[i].indexOf(secondElementID) != -1){
              priorities.splice(i+1, 0, [firstElementID])
              followUpQuestions = []
              isFollowUp = false
              getNextQuestion()
              break
            }
          }
        }
        else {
          if (index == priorities.length - 1){
            priorities.splice(i+1, 0, [firstElementID])
          }
          getNextQuestion()
        }
      }
      else {
        isSearchingHigher = false
        console.log(priorities)
        for (var i = index - 1; i >= 0; i--) {
          followUpQuestions.push({'firstElement': ideaIDToIndex[secondElementID], 'secondElement': ideaIDToIndex[priorities[i][0]]})
        }

        console.log(followUpQuestions)

        getNextQuestion()
      }
    }
  }
})

$("#same").click(function() {
  higherVotes = parseInt($("#higher-votes").val())
  lowerVotes = parseInt($("#lower-votes").val())
  sameVotes = parseInt($("#same-votes").val())
  firstElementID = $("#firstElement>div").attr('id')
  secondElementID = $("#secondElement>div").attr('id')

  questionMatrix[ideaIDToIndex[firstElementID]][ideaIDToIndex[secondElementID]] = true
  questionMatrix[ideaIDToIndex[secondElementID]][ideaIDToIndex[firstElementID]] = true

  questionsAsked.push({'firstElement': firstElementID, 'secondElement': secondElementID, 'higherVotes': higherVotes, 'lowerVotes': lowerVotes, 'sameVotes': sameVotes, 'answer': 2})

  if (priorities.length == 0){
  	priorities.push([firstElementID, secondElementID])
    getNextQuestion()
    console.log(priorities)
  }
  else{
    if (isFollowUp) {
      for (var i = 0; i < priorities.length; i++) {
        if (priorities[i].indexOf(secondElementID) != -1){
          priorities[i].push(firstElementID)
          followUpQuestions = []
          isFollowUp = false
          getNextQuestion()
          break
        }
      }
    }
    else{
      for (var i = 0; i < priorities.length; i++) {
        if (priorities[i].indexOf(firstElementID) != -1){
          priorities[i].push(secondElementID)
          break
        }
      }

      getNextQuestion()
    }
  }
})

function getNextQuestion() {
  if (followUpQuestions.length == 0) {
    currentQuestion = question
    nextQuestion = {'firstElement': -1, 'secondElement': -1}

    for (var i = 0; i < ideas.length; i++) {
        if (questionMatrix[0][i] == false) {
          nextQuestion['firstElement'] = 0
          nextQuestion['secondElement'] = i
          question = nextQuestion
          isFollowUp = false
          setNextQuestion(question['firstElement'], question['secondElement'])
          return
        }
    }

    console.log(priorities)
    savePriorities()
  }
  else {
    question = followUpQuestions.shift()
    setNextQuestion(question['firstElement'], question['secondElement'])
    isFollowUp = true
  }
}

function savePriorities(){
	$.ajax({
		url : "http://127.0.0.1:5000/save_priorities",
		type : "POST",
		data : JSON.stringify({
			sessionID: localStorage.getItem("SessionId"),
			priorities: priorities,
			questionsAsked: questionsAsked
		})
		,
		contentType: "application/json",
		success : function (response) {
		  console.log(response)
		  if (response['Success']) {
		  	// Alert and redirect to categories visualization
		  	//window.location.replace("priorities.html")
        alert("Finished")
        window.location.replace("priority_visualization.html")
        console.log(priorities)
		  }
		},
		error : function (error) {
		  console.log("Error: " + error);
		}
	})
}
