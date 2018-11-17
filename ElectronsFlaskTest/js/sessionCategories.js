const server = require('../js/main')

let categoryNames = {}
let focusedCategoryNameID = null
let focusOutFromMousedown = false

$(document).ready(function(){
	getSessionCategories()
})

function getIdeaInCategoryCard(statement, type, ideaSessionNumber) {
	return `<div class="card mb-2">
			  <div class="card-header" id="firstElementHeader">
			  	${type} ${ideaSessionNumber}
			  </div>
			  <div class="card-body">
			    <h5 class="card-title" id="firstElementStatement">${statement}</h5>
			  </div>
			</div>`
}

// HACK: onclick event is fired after onfocusout, using onmousedown instead
// https://stackoverflow.com/questions/13980448/jquery-focusout-click-conflict
function getCategoryCard(categoryID, categoryName, ideasInCategory) {
	return `<div id="category-${categoryID}" class="card mb-2">
			  <div class="card-header" id="firstElementHeader" style="display: inline-block">
			  	<button onmousedown="updateCategoryName('${categoryID}')" type="button" class="btn btn-primary float-right" style="width: 20%; display: none">Update</button>
			  	<h4
			  		id="${categoryID}"
			  		contenteditable="true"
			  		onfocus="enterFocus('${categoryID}')"
			  		onfocusout="exitFocus('${categoryID}')"
			  		style="width: 75%">
			  			<b>${categoryName}<b>
		  		</h4>
			  </div>
			  <div class="card-body">
			    ${ideasInCategory}
			  </div>
			</div>`
}

function updateCategoryName(categoryID) {
	focusOutFromMousedown = true
	let newCategoryName = $("#" + categoryID).text()
	$.ajax({
	  url : server.server_url + "/update_category_name",
	  type : "POST",
	  data : {
	    categoryID : categoryID,
	    categoryName : $("#" + categoryID).text()
	  },
	  success : function (response) { 
	  	console.log(response)
	    if (response['Success']) {
	    	categoryNames[parseInt(categoryID)] = newCategoryName
	    	$("#" + categoryID).text(newCategoryName)
	    }
	  },
	  error : function (error) {
	    console.log("Error: " + error);
	  }
	});
}

function enterFocus(categoryNameID) {
	$("#" + categoryNameID).prev().css('display', 'inline')
}

function exitFocus(categoryNameID) {
	console.log(focusOutFromMousedown)
	if (!focusOutFromMousedown){
		$("#" + categoryNameID).text(categoryNames[parseInt(categoryNameID)])
	}
	
	focusOutFromMousedown = false
	$("#" + categoryNameID).prev().css('display', 'none')
}

function getSessionCategories() {
	$.ajax({
		url : server.server_url + "/get_session_ideas_in_categories",
		type : "POST",
		data : {
			sessionID: localStorage.getItem("SessionId"),
		},
		success : function (response) {
			let categories = response['categories']
			if (response['Success']){
				if (categories.length == 0) {
					$("#warning").append("<h1>There's no category structure saved for this session.</h1>")
					$("#title").css("display", "none")
				}

				for (var i = 0; i < categories.length; i++) {
					category = categories[i]
					ideasCards = ""
					categoryNames[category['categoryID']] = category['categoryName']
					for (var j = 0; j < category['ideas'].length; j++) {
						idea = category['ideas'][j]
						ideasCards = ideasCards + getIdeaInCategoryCard(idea['statement'], idea['ideaType'], idea['ideaSessionNumber'])
					}

					categoryCard = getCategoryCard(category['categoryID'], category['categoryName'], ideasCards)
					if (i % 2 == 0){
						$("#categoriesSection1").append(categoryCard)
					}
					else{
						$("#categoriesSection2").append(categoryCard)
					}
				}
			}
		},
		error : function (error) {
		  console.log("Error: " + error);
		}
	})
}