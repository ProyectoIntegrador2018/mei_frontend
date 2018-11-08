let ideas = []
let ideaIDCategory = {}
let categoryIdeas = {}
let question = {
  'firstElement': -1,
  'secondElement': -1
}

let questions = []

let categoriesCreated = 0

$(document).ready(function(){
	sessionHasCategories()
})

function sessionHasCategories(){
	$.ajax({
	  url : "http://127.0.0.1:5000/session_has_categories",
	  type : "POST",
	  data : {
	    sessionID : localStorage.getItem("SessionId")
	  },
	  success : function (response) {
	  	console.log(response)
	    if (response['Success']) {
	    	if (response['hasCategories'] == true) {
	    		var shouldDelete = confirm("This session already has categories saved. Click OK to overwrite them or close this dialog to view the categories.")
	    		if (shouldDelete) {
	    			console.log("DELETING")
					deleteSessionCategories()
				}
				else{
					window.location.replace("categories.html")
				}
	    	}
	    	else {
	    		getIdeas();
	    		getRelationshipQuestion();
	    	}
	    }
	  },
	  error : function (error) {
	    console.log("Error: " + error);
	  }
	});
}

function deleteSessionCategories() {
	$.ajax({
	  url : "http://127.0.0.1:5000/delete_session_categories",
	  type : "POST",
	  data : {
	    sessionID : localStorage.getItem("SessionId")
	  },
	  success : function (response) { 
	    if (response['Success']) {
	    	getIdeas()
	    	getRelationshipQuestion()
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

          setNextQuestion(0, 1)
        }
      }
    },
    error : function (error) {
      console.log("Error: " + error);
    }
  });
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

$("#yes").click(function() {
  yesVotes = parseInt($("#yes-votes").val())
  noVotes = parseInt($("#no-votes").val())
  firstElementID = $("#firstElement>div").attr('id')
  secondElementID = $("#secondElement>div").attr('id')

  if (!(firstElementID in ideaIDCategory)){
  	ideaIDCategory[firstElementID] = categoriesCreated
  	ideaIDCategory[secondElementID] = categoriesCreated
  	categoriesCreated += 1
  }
  else{
  	ideaIDCategory[secondElementID] = ideaIDCategory[firstElementID]
  }

  console.log(ideaIDCategory)

  questions.push({'firstElement': ideas[question['firstElement']]['ideaID'], 'secondElement': ideas[question['secondElement']]['ideaID'], 'yesVotes': yesVotes, 'noVotes': noVotes, 'answer': true})

  getNextQuestion()
})

$("#no").click(function() {
  yesVotes = parseInt($("#yes-votes").val())
  noVotes = parseInt($("#no-votes").val())
  firstElementID = $("#firstElement>div").attr('id')
  secondElementID = $("#secondElement>div").attr('id')

  if (!(firstElementID in ideaIDCategory)){
  	ideaIDCategory[firstElementID] = categoriesCreated
  	categoriesCreated += 1
  }
  
  if (!(secondElementID in ideaIDCategory)){
  	ideaIDCategory[secondElementID] = categoriesCreated
  	categoriesCreated += 1
  }

  console.log(ideaIDCategory)

  questions.push({'firstElement': ideas[question['firstElement']]['ideaID'], 'secondElement': ideas[question['secondElement']]['ideaID'], 'yesVotes': yesVotes, 'noVotes': noVotes, 'answer': false})

  getNextQuestion()
})

function getNextQuestion() {
	currentQuestion = question
	nextQuestion = {'firstElement': -1, 'secondElement': -1}

	if (currentQuestion['secondElement'] >= (ideas.length - 1)) {
		nextQuestion['firstElement'] = currentQuestion['firstElement'] + 1
		nextQuestion['secondElement'] = nextQuestion['firstElement'] + 1
	}
	else{
		nextQuestion['firstElement'] = currentQuestion['firstElement']
		nextQuestion['secondElement'] = currentQuestion['secondElement'] + 1
	}

	if (nextQuestion['firstElement'] == (ideas.length - 1)){
		console.log("Saving categories!")
		saveCategories()
	}
	else {
		question = nextQuestion
		setNextQuestion(question['firstElement'], question['secondElement'])
	}
}

function saveCategories(){
	Object.keys(ideaIDCategory).forEach(function(ideaID) {
	    category = ideaIDCategory[ideaID]
	    if (!(category in categoryIdeas)){
	    	categoryIdeas[category] = []
	    }

	    categoryIdeas[category].push(ideaID)
	});

	$.ajax({
		url : "http://127.0.0.1:5000/save_categories",
		type : "POST",
		data : JSON.stringify({
			sessionID: localStorage.getItem("SessionId"),
			categories: categoryIdeas,
			questions: questions
		})
		,
		contentType: "application/json",
		success : function (response) { 
		  console.log(response)
		  if (response['Success']) {
		  	// Alert and redirect to categories visualization
		  	window.location.replace("categories.html")
		  }
		},
		error : function (error) {
		  console.log("Error: " + error);
		}
	})
}

function getRelationshipQuestion(){
	$.ajax({
		url : "http://127.0.0.1:5000/get_structure_question",
		type : "POST",
		data : {
		  structureType : "CAMPO"
		},
		success : function (response) { 
		  if (response['Success']) {
		  	$("#relationQuestion").text(response['question'])
		  }
		},
		error : function (error) {
		  console.log("Error: " + error);
		}
	})
}