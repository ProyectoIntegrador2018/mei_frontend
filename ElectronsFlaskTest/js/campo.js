const interact = require('interactjs');

let ideas = []
let ideaIDCategory = {}
let categoryIdeas = {}
let question = {
  'firstElement': -1,
  'secondElement': -1
}

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

function removeIdeaFromCategory(ideaID) {
	let ideasInCategory = $("#" + ideaID).parent().children(".idea")
	if (ideasInCategory.length == 2) {
		$($("#" + ideaID).parent().parent().parent()).remove()
		for (var i = 0; i < ideasInCategory.length; i++) {
			$(ideasInCategory[i]).addClass("draggable")
			$(ideasInCategory[i]).addClass("dropzone")
			$(ideasInCategory[i]).appendTo("#ideas")
			$(ideasInCategory[i]).find("button.close").css("display", "none")
		}
	}
	else{
		$("#" + ideaID).addClass("draggable")
		$("#" + ideaID).addClass("dropzone")
		$("#" + ideaID).appendTo("#ideas")
		$("#" + ideaID).find("button.close").css("display", "none")
	}
}

function getIdeaCard(idea){
	return `<div id="idea-${idea['ideaID']}" class="idea draggable dropzone" style="position: relative">
				<div class="card mt-2">
				  <div class="card-header">
			  		<button type="button" class="close float-left mr-2 mt-1" aria-label="Close" onclick="removeIdeaFromCategory('idea-${idea['ideaID']}')" style="Display: none">
			  		  &times;
			  	    </button>
				  	${idea['type']} ${idea['ideaSessionNumber']}
				  </div>
				  <div class="card-body">
				    <h6 class="card-title">${idea['idea']}</h6>
				  </div>
				</div>
			</div>`
}

function getCategoryCard(children){
	return `<div class="category dropzone">
				<div class="card mt-2">
				  <div class="card-header"><b>New category</b></div>
				  <div class="card-body">
				  	${children}
				  </div>
				</div>
			</div>`
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
          ideasCards = ""
          for(i = 0; i < ideasReceived.length; i++){
            ideas.push(ideasReceived[i])
            ideasCards = ideasCards + getIdeaCard(ideasReceived[i])
          }

          $("#ideas").append(ideasCards)
        }
      }
    },
    error : function (error) {
      console.log("Error: " + error);
    }
  });
}

interact('.draggable').draggable({
  // enable inertial throwing
    inertia: false,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "parent",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },

    onstart: function (event) {
        // event.target.style.zIndex = ;
        $(event.target).css("z-index", 1);
    },

    onend: function (event) {
    	var draggableElement = event.target
    	// translate the element
    	draggableElement.style.webkitTransform =
    	draggableElement.style.transform =
    	  'translate(' + 0 + 'px, ' + 0 + 'px)';

    	  // update the position attributes
    	draggableElement.setAttribute('data-x', 0);
    	draggableElement.setAttribute('data-y', 0);
    },

    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener,
})

// enable draggables to be dropped into this
interact('.dropzone').dropzone({
  // only accept elements matching this CSS selector
  accept: '.idea',
  // Require a 30% element overlap for a drop to be possible
  overlap: 0.3,

  ondrop: function (event) {
  	console.log("Drop!!")
    var draggableElement = event.relatedTarget,
        dropzoneElement = event.target;

    console.log(dropzoneElement)

    // translate the element
    draggableElement.style.webkitTransform =
    draggableElement.style.transform =
      'translate(' + 0 + 'px, ' + 0 + 'px)';

      // update the position attributes
    draggableElement.setAttribute('data-x', 0);
    draggableElement.setAttribute('data-y', 0);

    if ($(dropzoneElement).hasClass("idea")) {
    	draggableElement.classList.remove('draggable')
    	draggableElement.classList.remove('dropzone')
    	dropzoneElement.classList.remove('draggable')
    	dropzoneElement.classList.remove('dropzone')
    	$(draggableElement).find("button.close").css("display", "inline")
    	$(dropzoneElement).find("button.close").css("display", "inline")
    	let category = getCategoryCard($(dropzoneElement)[0].outerHTML + $(draggableElement)[0].outerHTML)
    	$(draggableElement).remove()
    	$(dropzoneElement).remove()
    	$("#ideas").prepend(category)
    }
    else if ($(dropzoneElement).hasClass("category")) {
    	draggableElement.classList.remove('draggable')
    	draggableElement.classList.remove('dropzone')
    	$(draggableElement).find("button.close").css("display", "inline")
    	$($($(dropzoneElement).children()[0]).children()[1]).append($(draggableElement)[0].outerHTML)
    	$(draggableElement).remove()
    }
  },
});

$("#saveCategories").click(function() {
	saveCategories()
})

function saveCategories(){

	let categories = $("#ideas").children(".category")
	let outerLevelIdeas = $("#ideas").children(".idea")

	console.log(categories)
	console.log(outerLevelIdeas)

	let categoriesToCreate = {}

	let categoryNumber = 1

	for (var i = 0; i < categories.length; i++) {
		let categoryIdeas = $($($(categories[i]).children()[0]).children()[1]).children(".idea")
		console.log(categoryIdeas)
		let ideas = []
		for (var j = 0; j < categoryIdeas.length; j++) {
			ideas.push($(categoryIdeas[j]).attr("id").substr($(categoryIdeas[j]).attr("id").indexOf("-") + 1))
		}

		categoriesToCreate[categoryNumber] = ideas
		categoryNumber += 1
	}

	for (var i = 0; i < outerLevelIdeas.length; i++) {
		categoriesToCreate[categoryNumber] = [$(outerLevelIdeas[i]).attr("id").substr($(outerLevelIdeas[i]).attr("id").indexOf("-") + 1)]
		categoryNumber += 1
	}

	$.ajax({
		url : "http://127.0.0.1:5000/save_categories",
		type : "POST",
		data : JSON.stringify({
			sessionID: localStorage.getItem("SessionId"),
			categories: categoriesToCreate,
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

	console.log(categoriesToCreate)
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

window.dragMoveListener = dragMoveListener;