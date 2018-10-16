$(document).ready(function(){
  //TODO: NO SIEMPRE SE LOADEA EL CONTENIDO
  getTriggering()
})


function getTriggering(){
  $.ajax({
    url : "http://127.0.0.1:5000/get_session_data",
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
    <div id="trigQuestion" class="card mt-2 mb-2">
      <div class="card-header">Triggering Question</div>
      <div class="card-body shadow-sm">
        <h1 class="card-text">${triggeringQuestion}</h1>
        <button id="trigAdd" class="btnadd float-right" data-toggle="modal" data-target="#addIdea"><i class="fa fa-plus"></i></button>
        <button id="trigTags" class="btnadd float-right" data-toggle="modal" data-target="#addTag"><i class="fa fa-tags"></i></button>
        <button id="trigEdit" class="btnadd float-right"><i class="fas fa-edit"></i></button>
      </div>
    </div>`
  return sessionCard
}

$( "#elementSelection" ).change(function() {
  if(this.value == "Other") {
    $( "#otherOption").show()
}});

$("#elementType").click(function() {
  $("#trigQuestion").append( `<span class="badge badge-primary">${$("#elementSelection").value}</span>`)
  $( "#otherOption").hidden()
});



