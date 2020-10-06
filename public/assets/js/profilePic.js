$(document).ready(function() {
  var profilePic = $(".btn");
  $(profilePic).on("click", handleFormSubmit);
  var url = window.location.search

  if (url.indexOf("?") !== -1) {
    var userID = url.split("?")[1];
  }

  function handleFormSubmit() {
    $.post("/api/profile:id")
    .then(function(){
      window.location.href = "/profile?"+ userID;
    });
  };


    let imagesPreview = function(input, placeToInsertImagePreview) {
      if (input.files) {
        let filesAmount = input.files.length;
        for (i = 0; i < filesAmount; i++) {
          let reader = new FileReader();
          reader.onload = function(event) {
            $($.parseHTML("<img>"))
              .attr("src", event.target.result)
              .attr("id", "preview")
              .appendTo(placeToInsertImagePreview);
          };
          reader.readAsDataURL(input.files[i]);
        }
      }
    };
    $("#input-files").on("change", function() {
      imagesPreview(this, "div.preview-images");
    });
  
  });
  ;