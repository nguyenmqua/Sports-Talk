$(document).ready(function() {
  /* global moment */

  // blogContainer holds all of our posts
  var blogContainer = $(".blog-container")
  // Click events for the edit and delete buttons

  $(document).on("click", "button.delete", handlePostDelete);
  $(document).on("click", "button.edit", handlePostEdit);

  // Variable to hold our posts
  var posts;

  // The code below handles the case where we want to get blog posts for a specific user
  // Looks for a query param in the url for user_id
  $.get("/api/user_data").then(function(data) {

    var currentUserId = data.id
    $(".member-name").text(data.firstName);
    $(".link").attr("href", "/members?"+currentUserId)
    getPosts(currentUserId, data.firstName);
  });
  // This function grabs posts from the database and updates the view
  
  function getPosts(userID, name) {
    $.get("/api/posts", function(data) {
      posts = data;
      if (!posts || !posts.length) {
        displayEmpty(userID, name);
      }
      else {
        initializeRows(userID);
      }
    });
  }

  // This function does an API call to delete posts
  function deletePost(id,userId,name) {
    $.ajax({
      method: "DELETE",
      url: "/api/posts/" + id
    })
      .then(function() {
        getPosts(userId,name);
      });
  }

  // InitializeRows handles appending all of our constructed post HTML inside blogContainer
  
  function initializeRows(userID) {
    blogContainer.empty();
    var postsToAdd = [];
    for (var i = 0; i < posts.length; i++) {
      postsToAdd.push(createNewRow(posts[i],userID));
    }
    blogContainer.append(postsToAdd);
  }

  // This function constructs a post's HTML
  function createNewRow(post,userID) {
    var formattedDate = new Date(post.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    var newPostCard = $("<div>");
    newPostCard.addClass("card");
    var newPostCardHeading = $("<div>");
    newPostCardHeading.addClass("card-header");
    var deleteBtn = $("<button>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn btn-danger");
    var editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-info");
    var newPostTitle = $("<h2>");
    var newPostDate = $("<small>");
    var newPostuser = $("<h5>");
    newPostuser.text("Written by: " + post.User.firstName + " " + post.User.lastName);
    newPostuser.css({
      float: "right",
      color: "blue",
      "margin-top":
      "-10px"
    });
    var newPostCardBody = $("<div>");
    newPostCardBody.addClass("card-body");
    var newPostBody = $("<p>");
    newPostTitle.text(post.title + " ");
    newPostBody.text(post.body);
    newPostDate.text(formattedDate);
    newPostTitle.append(newPostDate);
  
    if (userID === post.UserId) {
      newPostCardHeading.append(editBtn);
      newPostCardHeading.append(deleteBtn);
    }
    newPostCardHeading.append(newPostTitle);
    newPostCardHeading.append(newPostuser);
    newPostCardBody.append(newPostBody);
    newPostCard.append(newPostCardHeading);
    newPostCard.append(newPostCardBody);
    
    newPostCard.data("post", post);
    return newPostCard;
  }

  // This function figures out which post we want to delete and then calls deletePost
  function handlePostDelete() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
    deletePost(currentPost.id, currentPost.User.id, currentPost.User.firstName);
  }

  // This function figures out which post we want to edit and takes it to the appropriate url
  function handlePostEdit() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
    window.location.href = "/members?"+currentPost.User.id+"/post_id=" + currentPost.id;
  }

  // This function displays a message when there are no posts
  function displayEmpty(id,name) {
    var query = window.location.search;
    var partial = "";
    if (id) {
      partial = " for user #" + name;
    }
    blogContainer.empty();
    var messageH2 = $("<h2>");
    messageH2.css({ "text-align": "center", "margin-top": "50px" });
    messageH2.html("No posts yet" + partial + ", navigate <a href='/members?" + id +"'>here</a> in order to get started.")
    blogContainer.append(messageH2);
  }

});
