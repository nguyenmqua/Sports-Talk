$(document).ready(function() {

  var url = window.location.search;
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function(data) {
    console.log(data)
    $(".member-name").text(data.firstName);
    userID = data.id
    console.log(data.id)
    $(cmsForm).on("submit", handleFormSubmit);
    // A function for handling what happens when the form to create a new post is submitted
function handleFormSubmit(event) {
  event.preventDefault();
  // Wont submit the post if we are missing a body, title, or user
  if (!titleInput.val().trim() || !bodyInput.val().trim()) {
    return;
  }
  // Constructing a newPost object to hand to the database
  var newPost = {
    title: titleInput
      .val()
      .trim(),
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
}

// Submits a new post and brings user to blog page upon completion
function submitPost(post) {
  $.post("/api/posts", post, function() {
    window.location.href = "/blog";
  });
}
 });
// Getting jQuery references to the post body, title, form, and user select
var bodyInput = $("#body");
var titleInput = $("#title");
var cmsForm = $("#cms");
// Adding an event listener for when the form is submitted

// Gets the part of the url that comes after the "?" (which we have if we're updating a post)

// Sets a flag for whether or not we're updating a post to be false initially
var updating = false;

if (url.indexOf("?post_id=") !== -1) {
  postId = url.split("=")[1];
  getPostData(postId, "post");
}

// Getting the users, and their posts
// getusers();
// Update a given post, bring user to the blog page when done
function updatePost(post) {
  $.ajax({
    method: "PUT",
    url: "/api/posts",
    data: post
  })
    .then(function() {
      window.location.href = "/blog";
    });
}

function getPostData(id, type) {
  var queryUrl;
  switch (type) {
  case "post":
    queryUrl = "/api/posts/" + id;
    break;
  case "author":
    queryUrl = "/api/authors/" + id;
    break;
  default:
    return;
  }
  $.get(queryUrl, function(data) {
    if (data) {
      console.log(data.AuthorId || data.id);
      // If this post exists, prefill our cms forms with its data
      titleInput.val(data.title);
      bodyInput.val(data.body);
      authorId = data.AuthorId || data.id;
      // If we have a post with this id, set a flag for us to know to update the post
      // when we hit submit
      updating = true;
    }
  });
}

});
