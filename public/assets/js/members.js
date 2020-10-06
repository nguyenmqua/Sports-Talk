$(document).ready(function() {
  var profileInput = $("#profile")
  var bodyInput = $("#body");
  var cmsForm = $("#cms");
  var newsfeed = $("#newsfeed")
  var updating = false;
  var url = window.location.search;
  $(cmsForm).on("submit", handleFormSubmit);
  $(profileInput).on("click", profilePage)
  $(newsfeed).on("click",newsfeedPage)

  if (url.indexOf("/post_id=") !== -1) {
  var postId = url.split("=")[1];
  var userID = url.split("/")[0].split("?")[1]
  getPostData(postId, "post");
  } 
  else if (url.indexOf("?") !== -1) {
    var userID = url.split("?")[1];
  }


  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.firstName);
    getProfilePic(data.id)
  });  

  function getProfilePic(id){
    $.get("/api/profilePic"+ id, function (data){

      var filepath = data.filepath
      $('#profileInfo').append('<img src=' +filepath+ ' class = "profileInfo" style= "width: 200px; height: auto" >')
    })
  }  
 
function profilePage(){
  window.location.href = "/profile?"+ userID;
}

function newsfeedPage(){
  window.location.href = "blog?" + userID;
}

  // A function for handling what happens when the form to create a new post is submitted
function handleFormSubmit(event) {
  event.preventDefault();
  // Wont submit the post if we are missing a body, title, or user
  if ( !bodyInput.val().trim()) {
    return;
  }
  // Constructing a newPost object to hand to the database
  var newPost = {
    body: bodyInput
      .val()
      .trim(),
    UserId: userID
  };

  // If we're updating a post run updatePost to update a post
  // Otherwise run submitPost to create a whole new post
  if (updating) {
    newPost.id = postId;
    updatePost(newPost);
  }
  else {
    submitPost(newPost);
  }
};
// Submits a new post and brings user to blog page upon completion
function submitPost(post) {
  $.post("/api/posts", post, function() {
    window.location.href = "/blog?"+userID;
    });
};
 
function updatePost(post) {
  $.ajax({
    method: "PUT",
    url: "/api/posts",
    data: post
  })
    .then(function() {
      window.location.href = "/blog?"+userID;
    });
};

function getPostData(id, type) {
  var queryUrl;
  switch (type) {
  case "post":
    queryUrl = "/api/posts/" + id;
    break;
  default:
    return;
  }
  $.get(queryUrl, function(data) {
    if (data) {

        // If this post exists, prefill our cms forms with its data
        bodyInput.val(data.body);
        UserId = data.id;
        // If we have a post with this id, set a flag for us to know to update the post
        // when we hit submit
        updating = true;
    }
  });
};

});
