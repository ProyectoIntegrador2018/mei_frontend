$(function(){
  $.ajax({
    url : "http://127.0.0.1:5000/",
    type : "GET",
    success : function(response){
      $('#fromfirebase').html(response);
      console.log(response);
    },
    error : function(error){
      console.log("Error: " + error);
    }
  });
}); 