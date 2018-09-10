$("#register_user").click(function(e){
  e.preventDefault()
  var email = $("#inputEmail").val()
  var name = $("#inputName").val()
  var password = $("#inputPassword").val()
  var passwordConfirmation = $("#inputPasswordConfirmation").val()
  if (password == passwordConfirmation){
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
      },
      error : function(error){
        console.log("Error: " + error);
      }
    });
  }
  else{
    $("#errorMessage").html("Password and password confirmation do not match.")
  }
})