
let ideas = {}

SESSION_ID = localStorage.getItem("SessionId")

function renderSquare(r, n) {
  //console.log(r, n.label)
  /* the Raphael set is obligatory, containing all you want to display */
  var set = r.set().push(
	  /* custom objects go here */
	  r.rect(n.point[0], n.point[1], 1, 1).attr({"fill": "#007bff", "stroke-width": 2, "fill-opacity": 1, r : "9px"})).push
		(r.text(n.point[0], n.point[1], n.label).attr({"font-size":"14px"}));

	  /*
	  set.items.forEach(function(el) {
		el.tooltip(
		  r.set().push(
			r.rect(0, 0, 30, 30).attr(
			  {"fill": "#fec", "stroke-width": 1, r : "9px"})
			)
		  )
	  });
	  */

  set[0].attr({width: set[1].getBBox()['width'] + 20, height: set[1].getBBox()['height'] + 20})
  set[1].attr({x: set[1].attrs['x'] + set[0].attrs['width']/2.0})
  set[1].attr({y: set[1].attrs['y'] + set[0].attrs['height']/2.0})
  return set;
}

let g = new Graph()

$(document).ready(function(){
	sessionHasPriority()
});

function sessionHasPriority() {
	$.ajax({
	url : "http://127.0.0.1:5000/session_has_priority",
	type : "POST",
	data : {
	  sessionID : SESSION_ID,
	},
	success : function (response) {
	  if (response['Success']){
	  	if (response['hasPriority']) {
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
	url : "http://127.0.0.1:5000/get_all_session_ideas",
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
		getSessionPriority(SESSION_ID)
	  }
	},
	error : function (error) {
	  console.log("Error: " + error);
	}
  });
}

function getSessionPriority(sessionID) {
  $.ajax({
	  url : "http://127.0.0.1:5000/get_session_priority",
	  type : "POST",
	  data : {
		sessionID : sessionID,
	  },
	  success : function (response) {
		priority = JSON.parse(response['Priority'])
		console.log(priority)
		let prevNodeID = null
		for (var i = 0; i < priority.length; i++) {
			ideasInPriority = priority[i]
			console.log("Priority", i + 1)
			console.log(ideasInPriority[0])
			console.log(ideas)
			let nodeLabel = ""
			let nodeID = String(ideas[ideasInPriority[0]]['ideaID'])
			for (let idea in ideasInPriority){
				console.log(ideas[ideasInPriority[idea]])
				nodeLabel = nodeLabel + (ideas[ideasInPriority[idea]]['ideaSessionNumber'] + " " + ideas[ideasInPriority[idea]]['idea'] + "\n")
			}

			g.addNode(nodeID, {label: nodeLabel, render: renderSquare})
			if (i > 0) {
				g.addEdge(prevNodeID, nodeID, { directed: true})
			}

			prevNodeID = nodeID
		}

		var width = (screen.width * 1).toFixed(0);
		var height = (screen.height * 1).toFixed(0);

		var layouter = new Graph.Layout.Spring(g);
		var renderer = new Graph.Renderer.Raphael('canvas', g, 1200, 1000);

		layouter.layout();
		renderer.draw();
	  },
	  error : function (error) {
		console.log("Error: " + error);
	  }
  });
}
