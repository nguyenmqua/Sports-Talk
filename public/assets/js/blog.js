$(document).ready(function() {
  /* global moment */

  // blogContainer holds all of our posts
  var blogContainer = $(".blog-container")
  // Click events for the edit and delete buttons
  var url = window.location.search;

  $(document).on("click", "button.delete", handlePostDelete);
  $(document).on("click", "button.edit", handlePostEdit);
  $(document).on("click", "button.comment", handlePostComment)
  $(document).on("click", "button.viewComment", handleViewComment)


  // Variable to hold our posts
  var posts;
 
  if (url.indexOf("?") !== -1) {
    var userID = url.split("?")[1];
  }
  
  $.get("/api/user_data").then(function(data) {
    var currentUserId = data.id
    console.log(currentUserId)
    $(".member-name").text(data.firstName);
    $(".link").attr("href", "/members?"+currentUserId)
    $("#profile").attr("href", "/profilePage?"+currentUserId)
    getPosts(currentUserId, data.firstName);
  
  });
  // This function grabs posts from the database and updates the view
  
  function getPosts(userID, name) {
    $.get("/api/posts", function(data) {
      posts = data.reverse();
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

  function initializeRows(userID) {
    blogContainer.empty();
    var postsToAdd = [];
    for (var i = 0; i < posts.length; i++) {
      postsToAdd.push(createNewRow(posts[i],userID));
    }
    console.log(postsToAdd)
    blogContainer.append(postsToAdd);
  }
  // This function constructs a post's HTML
  function createNewRow(post,userID) {
    console.log(post)
    var formattedDate = new Date(post.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm a");
    var newPostCard = $("<div>");
    newPostCard.addClass("card Profilecontainer");
    var newPostCardHeading = $("<div>");
    newPostCardHeading.addClass("card-header");
    var newPostCardFooter = $("<div>");
    newPostCardFooter.addClass("card-footer");
    var deleteBtn = $("<button>");
    deleteBtn.html("<i class='far fa-trash-alt' style='font-size:20px;color:red'></i>")
    deleteBtn.addClass("delete btn btn-info");
    var commentBtn = $("<button>")
    commentBtn.text("Show Comment")
    commentBtn.addClass("viewComment btn btn-info");
    var editBtn = $("<button>");
    editBtn.addClass("edit btn btn-info");
    editBtn.html("<i style='font-size:20px' class='far'>&#xf044;</i>")
    var newPostTitle = $("<h2>");
    var newPostDate = $("<small>");
    var newPostuser = $("<h5>");
    var profileImage =$('<img src=' +post.User.Image.filepath+ ' id ="timelineProfilepic" class ="proPic" >')
    newPostuser.html("<a href =/profilePage?"+post.User.id +'>'+post.User.firstName + " " + post.User.lastName +'</a>');
   
    newPostuser.css({
      float: "left",
      color: "blue",
      "margin-top":
      "-10px",
    });
    var newPostCardBody = $("<div>");
    newPostCardBody.addClass("card-body");
    var newPostBody = $("<h4>");
    newPostBody.text(post.body);
    newPostDate.text(formattedDate);
    var comment = $("<button type='button' class='comment btn btn-info' data-toggle='modal' data-target='#exampleModal'>Reply</button>")
    comment.css({
      float: "right"
    })
    var modal = $(".modal-body")
    modal.html('<form id="commentForm"><div class="form-group"><textarea class="form-control" placeholder="Start typing to respond" id="commentInput"></textarea></div>      <div class="modal-footer"><button type="submit" class="btn btn-primary" id="commentReply">Reply</button></div></form>')
    
    
    if (userID === post.UserId) {
      newPostCardHeading.append(editBtn);
      newPostCardHeading.append(deleteBtn);
    }
    newPostCardFooter.append(commentBtn)
    newPostCardHeading.append(newPostTitle);

    newPostCardHeading.append(profileImage);
    newPostCardHeading.append(newPostuser);
    newPostCardBody.append(newPostBody);
    newPostCardBody.append(newPostDate);
    newPostCardBody.append(comment);
    newPostCard.append(newPostCardHeading);
    newPostCard.append(newPostCardBody);
    newPostCard.append(newPostCardFooter)
    
    newPostCard.data("post", post);
    return newPostCard;
  }
  
  function handlePostDelete() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
    deletePost(currentPost.id, currentPost.User.id, currentPost.User.firstName);

  }

  function handlePostComment() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
      console.log(currentPost)
    postComment(currentPost.id);
  }

  function handleViewComment(){
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
      viewComment(currentPost.id)
  }

  function viewComment(id){
    $.get("/api/comment", function(data){
      console.log(data)
    })
  }

  function handlePostEdit() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
    window.location.href = "/members?"+currentPost.User.id+"/post_id=" + currentPost.id;
  }

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
  function postComment(id){
    console.log(id)
    var commentForm = $("#commentForm")
    $(commentForm).on("submit",handleFormSubmit)
    var bodyInput = $("#commentInput")
    function handleFormSubmit(event) {
      event.preventDefault();
  
      if ( !bodyInput.val().trim()) {
        return;
      }
    
      var newPost = {
        body: bodyInput
          .val()
          .trim(),
        PostId: id,
        UserId: userID,
      };
      sumbitComment(newPost)
      console.log(newPost)
    
      };
    
  function sumbitComment(post){
    $.post("/api/comment", post, function(data) {
      console.log(data)
       });  
  }
  }

  // var settings = {
  //   "async": true,
  //   "crossDomain": true,
  //   "url": "https://sportspage-feeds.p.rapidapi.com/games",
  //   "method": "GET",
  //   "headers": {
  //     "x-rapidapi-host": "sportspage-feeds.p.rapidapi.com",
  //     "x-rapidapi-key": "8fc8315f1amsh70aff4e1a3ba621p1d89e4jsn59ed596832c4"
  //   }
  // }
  
  // $.ajax(settings).done(function (response) {
  //   console.log(response);
  // });

});
