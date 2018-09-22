$("#login_user").click(function(e){
  e.preventDefault()
  var errorMessage = ""
  var emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  var email = $("#inputEmail").val()
  var password = $("#inputPassword").val()

  if (emailPattern.test(email) == false){
    errorMessage += "<li>Invalid email</li>"
  }

  if (password == ""){
    errorMessage += "<li>Password required</li>"
  }

  if (errorMessage == ""){
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
        else{
          $("#errorMessage").html(`<li>${response['Error']}</li>`)
        }
      },
      error : function(error){
        console.log("Error: " + error);
      }
    });
  }
  else{
    $("#errorMessage").html(errorMessage)
  }
})