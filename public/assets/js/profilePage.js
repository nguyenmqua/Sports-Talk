$(document).ready(function() {
var url = window.location.search;
var team = $("#team")
var sport =$("#sport")
var location =$("#location")
var name =$("#name")
var profilePic = $(".avatar-flip")

if (url.indexOf("?") !== -1) {
    var userID = url.split("?")[1];
}

$.get("/api/profile"+userID).then(function(data) {

    console.log(data)
    team.html("Favorite Team: " + data.teams);
    sport.html("Favorite Sport: " + data.sports);
    location.html("Location: " + data.location);
    name.text(data.User.firstName + " " +data.User.lastName)
    profilePic

    var filepath = data.User.Image.filepath
   profilePic.append('<img src=' +filepath+ ' style= "width: 200px; height: auto" >')
});  
})
