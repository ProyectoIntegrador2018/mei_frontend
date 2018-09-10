$("#login_user").click(function(e){
  e.preventDefault()
  var email = $("#inputEmail").val()
  var password = $("#inputPassword").val()

  $.ajax({
    url : "http://127.0.0.1:5000/login_user",
    type : "POST",
    data : {
      email : email,
      password : password
    },
    success : function(response){
      if (response["Success"]){
        window.location.replace("projects.html")
      }
    },
    error : function(error){
      console.log("Error: " + error);
    }
  });
})