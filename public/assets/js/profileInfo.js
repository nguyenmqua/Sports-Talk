$(document).ready(function() {
    var profile = $("#profileForm");
    var interestInput = $("#interest")
    var locationInput = $("#location")
    var relationshipInput =$("#relationship")
  
    
    var url = window.location.search

    if (url.indexOf("?") !== -1) {
      var userID = url.split("?")[1];
    }
      
    $(profile).on("submit", handleFormSubmit);
  
  function handleFormSubmit(event) {
      event.preventDefault()

      var newProfile = {
        interest: interestInput
          .val()
          .trim(),
        relationship: relationshipInput
          .val(),
        location: locationInput
          .val()
          .trim(),  
        UserId: userID
      };
      
        $.ajax({
            method: "PUT",
            url: "/api/profile" + userID,
            data: newProfile
          })
        .then(function(data) {
            console.log(data)
            window.location.href = "/members?"+userID;
        });
    }
});