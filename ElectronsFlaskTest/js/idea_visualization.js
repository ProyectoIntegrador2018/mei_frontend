const server = require('../js/main')

let ideas = {}

SESSION_ID = localStorage.getItem("SessionId")

function renderSquare(r, n) {
  //console.log(r, n.label, n.tooltipText)
  /* the Raphael set is obligatory, containing all you want to display */
  var set = r.set().push(
	  /* custom objects go here */
	  r.rect(n.point[0], n.point[1], 1, 1).attr({"fill": "#ffffff", "stroke-width": 2, "fill-opacity": 1, r : "9px"})).push
		(r.text(n.point[0], n.point[1], n.label).attr({"font-size":"14px"}));

	  set.items.forEach(function(el) {
		el.tooltip(
		  r.set().push(
		  	r.text(5, 5, n.tooltipText).attr({"font-size":"14px"})
		  )
		)
	  });

  set[0].attr({width: set[1].getBBox()['width'] + 20, height: set[1].getBBox()['height'] + 20})
  set[1].attr({x: set[1].attrs['x'] + set[0].attrs['width']/2.0})
  set[1].attr({y: set[1].attrs['y'] + set[0].attrs['height']/2.0})
  return set;
}

let g = new Graph()

$(document).ready(function(){
	sessionHasStructure()
});

function sessionHasStructure(){
  $.ajax({
    url : server.server_url + "/session_has_structure",
    type : "POST",
    data : {
      sessionID : localStorage.getItem("SessionId")
    },
    success : function (response) {
      if (response['Success']) {
        if (response['hasStructure']) {
        	getSessionIdeas()
        }
        else{
        	$("#warning").css("display", "inline");
	  		$("#canvas").css("display", "none");
        }
      }
    },
    error : function (error) {
      console.log("Error: " + error);
    }
  });
}

function getSessionIdeas(){
  $.ajax({
	url : server.server_url + "/get_all_session_ideas",
	type : "POST",
	data : {
	  sessionID : SESSION_ID,
	},
	success : function (response) {
	  if (response['Success']){
		for (idea in response['Ideas']){
		  ideas[response['Ideas'][idea]['ideaID']] = response['Ideas'][idea]
		}

		console.log(ideas)
		getSessionStructureMatrix(SESSION_ID)
	  }
	},
	error : function (error) {
	  console.log("Error: " + error);
	}
  });
}

function getMatrixValue(sessionID) {
  $.ajax({
	async:false,
	url : server.server_url + "/get_structure_matrix",
	type : "POST",
	data : {
	  sessionID : sessionID,
	},
	success : function (response) {
	  if (response['Success']){
		 matrix = response.MatrixValue
		 for (var i = 0; i < matrix.length; i++) {
		 	let firstID = String(matrix[i][1])
		 	let secondID = String(matrix[i][2])
		 	console.log(firstID, secondID)
		 	g.addEdge(firstID, secondID, { directed: true})
		 }

		 console.log(matrix)

		 var width = screen.width;
		 var height = screen.height;

		 var layouter = new Graph.Layout.Tree(g);
		 var renderer = new Graph.Renderer.Raphael('canvas', g, width, height);

		 layouter.layout();
		 renderer.draw();
	  }
	},
	error : function (error) {
	  console.log("Error: " + error);
	}
  });
}

function getSessionStructureMatrix(sessionID) {
  var multiple_items =[]
  $.ajax({
  async:false,
  url : server.server_url + "/get_session_structure",
  type : "POST",
  data : {
	sessionID : sessionID,
  },
  success : function (response) {
	structure_matrix = JSON.parse(response.GeneralStructure[0][2])
	// console.log(JSON.stringify(structure_matrix, null, 1))
	keys = Object.keys(structure_matrix)
	for (var i = 0; i < keys.length; i++) {
	  ideasInLevel = structure_matrix[keys[i]]
	  for (let ideaInLevel in ideasInLevel){
		nodeLabel = ""
		tooltipText = ""
		let nodeID = String(ideas[ideasInLevel[ideaInLevel][0]]['ideaID'])
		for (var j = 0; j < ideasInLevel[ideaInLevel].length; j++) {
		  statement = ideas[ideasInLevel[ideaInLevel][j]]['idea']
		  labelStatement = statement
		  ideaSessionNumber = ideas[ideasInLevel[ideaInLevel][j]]['ideaSessionNumber']
		  if (labelStatement.length > 25) {
		  	labelStatement = labelStatement.substring(0, 25) + "..."
		  }
		  nodeLabel = nodeLabel + (ideaSessionNumber + " " + labelStatement + "\n")
		  tooltipText = tooltipText + (ideaSessionNumber + " " + statement + "\n")
		}

		g.addNode(nodeID, {label: nodeLabel, render: renderSquare, tooltipText: tooltipText})
	  }
	}
	
	getMatrixValue(SESSION_ID)
  },
  error : function (error) {
	console.log("Error: " + error);
  }
  });
}
