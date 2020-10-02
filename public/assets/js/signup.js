$(document).ready(function() {
  // Getting references to our form and input
  var signUpForm = $("form.signup");
  var firstNameInput = $("input#first-name-input")
  var lastNameInput = $("input#last-name-input")
  var emailInput = $("input#email-input");
  var passwordInput = $("input#password-input");

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", function(event) {
    event.preventDefault();
    var userData = {
      firstName: firstNameInput.val().trim(),
      lastName: lastNameInput.val().trim(),
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };

    if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData.firstName, userData.lastName, userData.email, userData.password);
    emailInput.val("");
    passwordInput.val("");
    firstNameInput.val("");
    lastNameInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(first, last, email, password) {
    $.post("/api/signup", {
      firstName: first,
      lastName: last,
      email: email,
      password: password
    })
      .then(function(data) {
      
        window.location.replace("/profilePic?"+data.id)
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text("This email account is already in use.");
    $("#alert").fadeIn(500);
  }
});
