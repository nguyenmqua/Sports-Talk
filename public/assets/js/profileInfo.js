$(document).ready(function() {
    var profile = $("#profileForm");
    var teamInput = $("#team")
    var locationInput = $("#location")
    var sportsInput =$("#sports")
  
    
    var url = window.location.search

    if (url.indexOf("?") !== -1) {
      var userID = url.split("?")[1];
    }
      
  $(profile).on("submit", handleFormSubmit);
  
  function handleFormSubmit(event) {
      event.preventDefault()

      var newProfile = {
        teams: teamInput
          .val()
          .trim(),
        sports: sportsInput
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