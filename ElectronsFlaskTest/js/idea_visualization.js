
var nodeDataArray = []
var linkedDataArray = []

SESSION_ID = localStorage.getItem("SessionId")

$(document).ready(function(){
  getSessionStructureMatrix(SESSION_ID)
  getMatrixValue(SESSION_ID)

  console.log(nodeDataArray)
  $('#chart-container').orgchart({
      'data' : nodeDataArray,
      'direction' : 'l2r',
      'nodeContent': 'title',
      'verticalLevel': 100,
      'visibleLevel': 100
      });
})

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

