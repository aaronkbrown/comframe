

  // Variable that determines the total number of pages
  // As new content pages are added, this variable should be manually updated
  var pageCount = 4;

  // Variable for whether website should have a cover image
  // If the latest page of content should be displayed on the front, set to false
  // If the front page should have a cover instead, set to true
  var hasCover = false;

  // central element of page
  var content = document.getElementById("content");

  // function to get value of key (variable) in URL query string
  // Thank you, CSS-Tricks.com
  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var values = query.split("&");
    for (var i = 0; i < values.length; i++){
      var datapair = values[i].split("=");
      if(datapair[0] == variable) {
        return datapair[1];
      }
    }
    return(false);
  }

  // Get current page value of URL query string
  var pageNumber = getQueryVariable("page");


  // Display content of page determined by page number in query string
  // If there is no current page number, print most current page
  function printPage(pageVar) {
    if(pageVar === false){
      // print latest page
      if(hasCover){
        content.innerHTML = "<object type='text/html' data='content/cover.html'></object>";
      } else {
        content.innerHTML = "<object type='text/html' data='content/" + pageCount + ".html'></object>";
      }
    } else {
      // get a string value of html file we want
      var url = "content/" + pageVar + ".html";
      // AJAX get request takes content file in question and prints to page
      // Prints error page in case requested page does not exist
      $.get(url).done(function(){
        content.innerHTML = "<object type='text/html' data=" + url + "></object>";
      }).fail(function(){
        // If the page does not exist, redirect to root and remove from browser history
        var navTo = window.location.href;
        navTo = navTo.replace(window.location.search, "");
        window.location.replace(navTo);
      });
    }
  }

  // Function for navigating to the next page in the sequence
  function nextPage(){
    pageNumber = getQueryVariable("page");
    // Get current URL
    var navTo = window.location.href;
    // Check that we're currently on a numbered page
    if(pageNumber && !isNaN(parseInt(pageNumber))){
      var pageInt = parseInt(pageNumber) + 1;
      // Truncate query string from URL
      navTo = navTo.replace(window.location.search, "");
      // Set new query string to navigate to assuming next page is not latest page
      if(hasCover){
        if(pageInt <= pageCount){
          navTo = navTo + "?page=" + pageInt;
        }
      } else {
        if(pageInt < pageCount){
          navTo = navTo + "?page=" + pageInt;
        }
      }
    }
    // If we're already on the front page, calling this function again won't track in the browser history
    if(pageNumber){ // && parseInt(pageNumber) !== pageCount){
      if(Modernizr.history){
        // Use HTML5 history magic
        history.pushState(null, null, navTo);
        printPage(pageInt);
      } else {
        // Use older transition method as fallback
        window.location.assign(navTo);
      }
    }
  }

  // Navigate to previous page in sequence
  function prevPage(){
    pageNumber = getQueryVariable("page");
    var navTo = window.location.href;
    var pageInt;
    // If we're already at page 1, calling this function again won't track in the browser history
    if(parseInt(pageNumber) !== 1){
      if(pageNumber && !isNaN(parseInt(pageNumber))){
        pageInt = parseInt(pageNumber);
        if(pageInt - 1 > 0){
          pageInt = pageInt - 1;
        }
        navTo = navTo.replace(window.location.search, "");
        navTo = navTo + "?page=" + pageInt;
      } else if(!pageNumber){
        // In case function is called while on front page
        if(hasCover){
          // If hasCover is true, function takes us to latest page
          pageInt = pageCount;
        } else {
          // Otherwise, function takes us to next to last page
          pageInt = pageCount - 1;
        }
        navTo = navTo.replace(window.location.search, "");
        navTo = navTo + "?page=" + pageInt;
      }
      if(Modernizr.history){
        // Use HTML5 history magic
        history.pushState(null, null, navTo);
        printPage(pageInt);
      } else {
        // Use older transition method as fallback
        window.location.assign(navTo);
      }
    }
  }

  // Navigate straight to the first page in the sequence
  function firstPage(){
    pageNumber = getQueryVariable("page");
    var navTo = window.location.href;
    navTo = navTo.replace(window.location.search, "");
    navTo = navTo + "?page=1";
    // If we're already at page 1, calling this function again won't track in the browser history
    if(parseInt(pageNumber) !== 1){
      if(Modernizr.history){
        history.pushState(null, null, navTo);
        printPage(1);
      } else {
        window.location.assignTo(navTo);
      }
    }
  }

  // Navigate to the most current page, i.e. front landing page
  function latestPage(){
    var navTo = window.location.href;
    navTo = navTo.replace(window.location.search, "");
    if(hasCover){
      navTo = navTo + "?page=" + pageCount;
    }
    // If we're already at the latest page, calling this function again won't track in the browser history
    if(navTo !== window.location.href){
      if(Modernizr.history){
        history.pushState(null, null, navTo);
        if(hasCover){
          printPage(pageCount);
        } else {
          printPage();
        }
      } else {
        window.location.assignTo(navTo);
      }
    }
  }

  printPage(pageNumber);

  // Navigational click events
  $("#first").click(function(){
    firstPage();
  });

  $("#prev").click(function(){
    prevPage();
  });

  $("#next").click(function(){
    nextPage();
  });

  $("#latest").click(function(){
    latestPage();
  });

  // Popstate event listener for back button functionality in HTML5 History API
  window.addEventListener("popstate", function(e){
    printPage(getQueryVariable("page"));
  });


