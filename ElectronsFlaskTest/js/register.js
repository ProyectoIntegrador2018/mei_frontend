$("#register_user").click(function(e){
  e.preventDefault()

  var errorMessage = ""
  var emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  var email = $("#inputEmail").val()
  var name = $("#inputName").val()
  var password = $("#inputPassword").val()
  var passwordConfirmation = $("#inputPasswordConfirmation").val()

  if (emailPattern.test(email) == false){
    errorMessage += "<li>Invalid email</li>"
  }

  if (name == ""){
    errorMessage += "<li>Name required</li>"
  }

  if (password == ""){
    errorMessage += "<li>Password required</li>"
  }

  if (passwordConfirmation == ""){
    errorMessage += "<li>Password confirmation required</li>"
  }

  if (password != passwordConfirmation){
    errorMessage += "<li>Password and password confirmation do not match</li>"
  }

  if (errorMessage == ""){
    $.ajax({
      url : "http://127.0.0.1:5000/create_user",
      type : "POST",
      data : {
        email : email,
        name : name,
        password : password
      },
      success : function(response){
        if (response['Success']){
          window.location.replace("index.html")
        }
        else{
          $("#errorMessage").html(response["Error"])
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