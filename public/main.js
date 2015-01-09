

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
      content.innerHTML = "<object type='text/html' data='content/current.html'></object>";
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

  function nextPage(){
    pageNumber = getQueryVariable("page");
    // Get current URL
    var navTo = window.location.href;
    // Check that we're currently on a numbered page
    if(pageNumber && !isNaN(parseInt(pageNumber))){
      var pageInt = parseInt(pageNumber) + 1;
      // Truncate query string from URL
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

  function prevPage(){
    pageNumber = getQueryVariable("page");
    var navTo = window.location.href;
    if(pageNumber && !isNaN(parseInt(pageNumber))){
      var pageInt = parseInt(pageNumber);
      if(pageInt - 1 > 0){
        pageInt = pageInt - 1;
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

  function firstPage(){
    var navTo = window.location.href;
    navTo = navTo.replace(window.location.search, "");
    navTo = navTo + "?page=1";
    if(Modernizr.history){
      history.pushState(null, null, navTo);
      printPage(1);
    } else {
      window.location.assignTo(navTo);
    }
  }

  function latestPage(){
    var navTo = window.location.href;
    navTo = navTo.replace(window.location.search, "");
    if(Modernizr.history){
      history.pushState(null, null, navTo);
      printPage();
    } else {
      window.location.assignTo(navTo);
    }
  }

  printPage(pageNumber);

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


