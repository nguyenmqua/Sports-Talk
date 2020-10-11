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
    $(".member-name").text(data.firstName);
    $(".link").attr("href", "/members?"+currentUserId)
    $("#profile").attr("href", "/profilePage?"+currentUserId)
    getPosts(currentUserId, data.firstName);
  
  });
  // This function grabs posts from the database and updates the view
  
  function getPosts(userID, name) {
    $.get("/api/posts", function(data) {
      posts = data.reverse();
      console.log(posts)
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
    blogContainer.append(postsToAdd);
  }
  // This function constructs a post's HTML
  function createNewRow(post,userID) {
    var formattedDate = new Date(post.createdAt);
    formattedDate = moment(formattedDate).fromNow();
    var newPostCard = $("<div>");
    newPostCard.addClass("card Profilecontainer");
    var newPostCardHeading = $("<div>");
    newPostCardHeading.addClass("card-header");
    var newPostCardFooter = $("<div>");
    newPostCardFooter.addClass("card-footer");
    var deleteBtn = $("<button>");
    deleteBtn.html("<i class='far fa-trash-alt' style='font-size:20px;color:red'></i>")
    deleteBtn.addClass("delete btn btn-info");
    var editBtn = $("<button>");
    editBtn.addClass("edit btn btn-info");
    editBtn.html("<i style='font-size:20px' class='far'>&#xf044;</i>")
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
    newPostDate.text("Posted- " + formattedDate);
    var comment = $("<button type='button' class='comment btn btn-info' data-toggle='modal' data-target='#exampleModal'>Reply</button>")
    comment.css({
      float: "right"
    })
    var modal = $(".modal-body")
    modal.html('<form id="commentForm"><div class="form-group"><textarea class="form-control" placeholder="Start typing to respond" id="commentInput"></textarea></div>      <div class="modal-footer"><button type="submit" class="btn btn-primary" id="commentReply">Reply</button></div></form>')
    
    var commentLength = post.Comments
    for (i = 0; i < commentLength.length; i++) {

    var commentDiv = $("<div>")
    commentDiv.addClass("hidden commentDiv")
    commentDiv.html(post.Comments[i].body)
    newPostCardFooter.append(commentDiv)
    var commentUser = $("<div>")

    var cformattedDate = new Date(post.Comments[i].User.createdAt)
    cformattedDate = moment(cformattedDate).fromNow();
    commentUser.html("<img src ='"+ post.Comments[i].User.Image.filepath + "'class = 'commentPic'> <p>" + "<a href ='/profilePage?"+ post.Comments[i].UserId + "'>" + post.Comments[i].User.firstName + " " + post.Comments[i].User.lastName + "</a> -" + cformattedDate)
    commentUser.addClass("comment")
    commentDiv.append(commentUser)
    }
    

    if (userID === post.UserId) {
      newPostCardHeading.append(editBtn);
      newPostCardHeading.append(deleteBtn);
    }
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
    postComment(currentPost.id);
  }

  function handleViewComment(){
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
      console.log(currentPost)
      // viewComment(currentPost.id)
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
    $.get("/api/user_data").then(function(data) {
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
        UserId: data.id,
      };
      sumbitComment(newPost)    
    };  
    function sumbitComment(post){
    $.post("/api/comment", post).then(function(data){
      window.location.href = "/blog?"+data;
      });
    };
  });
};

  $(window).scroll(function(){
    var navbar = $("#navbar");
    var sticky = navbar.offset()
    if ($(window).scrollTop() >= sticky.top) {
      navbar.addClass("sticky")
    } else {
      navbar.removeClass("sticky");
    }
  }) 

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://sportspage-feeds.p.rapidapi.com/games",
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "sportspage-feeds.p.rapidapi.com",
      "x-rapidapi-key": "8fc8315f1amsh70aff4e1a3ba621p1d89e4jsn59ed596832c4"
    }
  }
  
  $.ajax(settings).done(function (response) {
    console.log(response);
    var x = response.games

    for (i = 0; i < x ; i++){
    var data = response.results[i]
     var cardDiv = $("<div>");
     cardDiv.addClass("card  scores")
     var group = $(".card-group")
     group.append(cardDiv)
     var cardBody = $("<div>")
     cardBody.addClass("card-body")
     cardDiv.append(cardBody)
     var h5 = $("<h5>")
     h5.addClass("card-title")
     cardBody.append(h5)
     var p1 = $("<p>")
     p1.addClass("card-text")
     cardBody.append(p1)
     var footer = $("<div>")
     footer.addClass("card-footer")
     cardDiv.append(footer)
     var small = $("<small>")
     small.addClass("text-muted")
     footer.append(small)
     if (data.status === "in progress"){ 
     h5.text(data.details.league + ": " + data.summary)
     p1.html(data.teams.away.team +"'s Score: " + data.scoreboard.score.away + "<br>" + data.teams.home.team+"'s Score: " + data.scoreboard.score.home)
        if(data.details.league === "MLB" ){
          small.html("Inning: " + data.scoreboard.currentPeriod )
        } else if (data.details.league === "NBA" ){
          small.html("Period: " + data.scoreboard.currentPeriod )
        } else if (data.details.league === "NFL"){
          small.html("Quarter: " + data.scoreboard.currentPeriod )
        } else if (data.details.league === "NCAAF"){
          small.html("Quarter: " + data.scoreboard.currentPeriod )
        }
    } else if (data.status==="scheduled"){
     h5.html("Scheduled: <br>" + data.details.league + ": " + data.summary + " at " + data.venue.name )
     var formattedDate = data.schedule.date
    formattedDate = moment(formattedDate).fromNow();
     small.html("<b>Schedule to play </b>" + formattedDate)
    } else if (data.status === "final"){
      h5.text(data.details.league + ": " + data.summary)
      p1.html( data.teams.away.team+"'s Score: " + data.scoreboard.score.away + "<br>" + data.teams.home.team+"'s Score: " + data.scoreboard.score.home)
      small.html("<b>Final Result</b>")
     } 
    }
  });

});
