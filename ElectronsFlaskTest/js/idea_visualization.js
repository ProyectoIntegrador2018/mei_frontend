
var nodeDataArray = []
var linkedDataArray = []

SESSION_ID = localStorage.getItem("SessionId")

let json_data = JSON.parse(`{
 "name": "1",
 "title": "71",
 "children": [
  {
   "name": "2",
   "title": "67",
   "children": [
    {
     "name": "3",
     "title": "66",
     "children": [
      {
       "name": "4",
       "title": "65",
       "children": [
        {
         "name": "5",
         "title": "64",
         "children": [
          {
           "name": "6",
           "title": "63",
           "children": [
            {
             "name": "7",
             "title": "68,69"
            },
            {
             "name": "7",
             "title": "70",
             "children": [
              {
               "name": "8",
               "title": "58,59",
               "children": [
                {
                 "name": "9",
                 "title": "60,61"
                },
                {
                 "name": "9",
                 "title": "62",
                 "children": [
                  {
                   "name": "10",
                   "title": "57",
                   "children": [
                    {
                     "name": "11",
                     "title": "55"
                    }
                   ]
                  },
                  {
                   "name": "10",
                   "title": "56",
                   "children": [
                    {
                     "name": "11",
                     "title": "55"
                    }
                   ]
                  }
                 ]
                }
               ]
              }
             ]
            }
           ]
          }
         ]
        }
       ]
      }
     ]
    }
   ]
  }
 ]
}`)

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

$(document).ready(function(){
    var width = screen.width;
    var height = screen.height;

    var g = new Graph();

    g.addNode("1", {label: "top management commitment", render: renderSquare})
    g.addNode("2", {label: "que onda que pedo", render: renderSquare})
    g.addNode("3", {label: "perroooo", render: renderSquare})
    g.addNode("4", {label: "imprimir basura", render: renderSquare})
    g.addNode("6", {label: "mierda mierda", render: renderSquare})
    g.addNode("8", {label: "me quiero morir", render: renderSquare})
    g.addNode("9", {label: "me la pelan", render: renderSquare})
    g.addNode("10", {label: "salazaaar", render: renderSquare})
    g.addNode("11", {label: "anjdsas", render: renderSquare})
    g.addNode("12", {label: "Mike mike", render: renderSquare})
    g.addNode("13", {label: "maggie maggie", render: renderSquare})
    g.addNode("14", {label: "barbara barbara", render: renderSquare})
    g.addNode("16", {label: "galvez galvez", render: renderSquare})
    g.addNode("17", {label: "luis luis", render: renderSquare})

    g.addEdge("1", "2", { directed : true });
    g.addEdge("1", "3", { directed : true });
    g.addEdge("2", "6", { directed : true });
    g.addEdge("3", "8", { directed : true });
    g.addEdge("6", "4", { directed : true });
    g.addEdge("8", "4", { directed : true });
    g.addEdge("4", "14", { directed : true });
    g.addEdge("4", "16", { directed : true });
    g.addEdge("14", "9", { directed : true });
    g.addEdge("16", "9", { directed : true });
    g.addEdge("9", "10", { directed : true });
    g.addEdge("10", "11", { directed : true });
    g.addEdge("11", "12", { directed : true });
    g.addEdge("12", "13", { directed : true });
    g.addEdge("13", "17", { directed : true });

    var layouter = new Graph.Layout.Tree(g);
    var renderer = new Graph.Renderer.Raphael('canvas', g, width, height);

    layouter.layout();
    renderer.draw();
   });

function getMatrixValue(sessionID) {
  $.ajax({
    async:false,
    url : "http://127.0.0.1:5000/get_structure_matrix",
    type : "POST",
    data : {
      sessionID : sessionID,
    },
    success : function (response) {
      if (response['Success']){
         matrix = response.MatrixValue
         console.log(matrix)
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
  url : "http://127.0.0.1:5000/get_session_structure",
  type : "POST",
  data : {
    sessionID : sessionID,
  },
  success : function (response) {
    structure_matrix = JSON.parse(response.GeneralStructure[0][2])
    console.log(structure_matrix[1])
    console.log(structure_matrix[7].length)
    nodeDataArray = createArray(structure_matrix,1)
    console.log(JSON.stringify(nodeDataArray, null, 1))
  },
  error : function (error) {
    console.log("Error: " + error);
  }
  });
}

function getIdeaById(id) {
  $.ajax({
  async:false,
  url : "http://127.0.0.1:5000/get_session_structure",
  type : "POST",
  data : {
    sessionID : sessionID,
  },
  success : function (response) {
    structure_matrix = JSON.parse(response.GeneralStructure[0][2])
    console.log(structure_matrix[1])
    console.log(structure_matrix[7].length)
    nodeDataArray = createArray(structure_matrix,1)
    console.log(JSON.stringify(nodeDataArray, null, 1))
  },
  error : function (error) {
    console.log("Error: " + error);
  }
  });

}

function createArray(structure_matrix, counter){
  if(structure_matrix != null) {
    line = []
    var name = Object.keys(structure_matrix)[0]
    var title = String(Object.values(structure_matrix)[0][0].toString())
    delete structure_matrix[counter]
    if(String(Object.values(structure_matrix)[0]) != "undefined") {
      counter  = counter + 1
      if(Object.values(structure_matrix)[0].length > 1) {
        line = (growHorizontal(structure_matrix,Object.values(structure_matrix)[0].length))
        return {'name':name, 'title': title , 'children':[line, createArray(structure_matrix, counter)]};
      }
      
      return {'name':name, 'title': title , 'children':[createArray(structure_matrix, counter)]};
    } else {
      return {'name': name, 'title': title}
    }
  }
}

function growHorizontal(structure_matrix, nodes) {
  nodes = nodes - 1
  var name = Object.keys(structure_matrix)[0]
  var title = String(Object.values(structure_matrix)[0][nodes])
  delete structure_matrix[nodes]
  if(nodes <= 1) {
    return {'name':name, 'title': title} 
  } else {
    growHorizontal(structure_matrix, nodes) 
  }
}

