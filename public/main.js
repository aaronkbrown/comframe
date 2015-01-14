

  // Variable that determines the total number of pages
  // As new content pages are added, this variable should be manually updated
  var pageCount = 20;

  // Variable for whether website should have a cover image
  // If the latest page of content should be displayed on the front, set to false
  // If the front page should have a cover instead, set to true
  var hasCover = true;

  // Array that contains all the pages that begin new chapters
  // If we do not wish to break up the content by chapters, then leave this array empty, i.e.
  // var chapterBreaks = [];
  var chapterBreaks = [4, 9, 13, 17];

  var introduction = "Introduction";

  // sort chapterBreaks[] in numeric fashion
  chapterBreaks.sort(function(a, b){return a - b;});

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
      // Fallback sends browser to front page in case requested page does not exist
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
    // If we're already at page 1 or index, calling this function again won't track in the browser history
    if(parseInt(pageNumber) > 1){
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

  // Function to go directly to a page number specified by toPage
  function goToPage(toPage){
    // Make sure toPage is an integer for comparing to pageCount
    toPage = parseInt(toPage);
    pageNumber = getQueryVariable("page");
    var navTo = window.location.href;
    navTo = navTo.replace(window.location.search, "");
    if(toPage !== parseInt(pageNumber)){
      // If there's no cover and we're going directly to the latest page, i.e. front page
      if(!hasCover && toPage === pageCount){
        if(Modernizr.history){
          history.pushState(null, null, navTo);
          printPage();
        } else {
          window.location.assignTo(navTo);
        }
      } else {
        // all other cases
        navTo = navTo + "?page=" + toPage;
        if(Modernizr.history){
          history.pushState(null, null, navTo);
          printPage(toPage);
        } else {
          window.location.assignTo(navTo);
        }
      }
    }
  }

  // return the current chapter of the current page view
  function getCurrentChapter(){
    pageNumber = getQueryVariable("page");
    var currentPage = parseInt(pageNumber);
    var chapterNumber = 0;
    if(hasCover && currentPage){
      // If our chapter pages array has values in it
      if(chapterBreaks.length > 0){
        // cycle through array of chapters starts, and so long as the chapter start page is less than or equal to the current page, update chapterNumber to be that chapter
        for(var i = 0; i < chapterBreaks.length; i++){
          var chapterPage = chapterBreaks[i];
          if(chapterPage <= currentPage){
            chapterNumber = i + 1;
          }
        }
      // just in case we don't have chapter breaks
      } else {
        chapterNumber = false;
      }
    // In case we are on the cover page
    } else if(hasCover && !currentPage){
      if(chapterBreaks.length > 0){
        // Set chapter to one more than the current total chapter count
        chapterNumber = chapterBreaks.length + 1;
      } else {
        chapterNumber = false;
      }
    // If we don't have a cover and we're on a page other than the front
    } else if(!hasCover && currentPage) {
      if(chapterBreaks.length > 0){
        for(var i = 0; i < chapterBreaks.length; i++){
          var chapterPage = chapterBreaks[i];
          if(chapterPage <= currentPage){
            chapterNumber = i + 1;
          }
        }
      } else {
        chapterNumber = false;
      }
    // In case we're on the front page and there is no cover, i.e. front page is the latest page of content
    } else {
      if(chapterBreaks.length > 0){
        chapterNumber = chapterBreaks.length;
      } else {
        chapterNumber = false;
      }
    }
    //console.log("Current chapter is " + chapterNumber);
    return chapterNumber;
  }

  // Navigate by chapters
  function nextChapter(){
    var currentChapter = getCurrentChapter();
    var chapterCount = chapterBreaks.length;
    // Make sure we're not already on the last chapter
    if(chapterCount > 0 && currentChapter < chapterCount){
      var toPage = chapterBreaks[currentChapter];
      goToPage(toPage);
    }
  }

  function prevChapter(){
    var currentChapter = getCurrentChapter();
    var chapterCount = chapterBreaks.length;
    if(chapterCount > 0 && currentChapter > 1){
      var toPage = chapterBreaks[currentChapter - 2];
      goToPage(toPage);
    }
  }

  function firstChapter(){
    var currentChapter = getCurrentChapter();
    var chapterCount = chapterBreaks.length;
    pageNumber = getQueryVariable("page");
    // Make sure we're not already on the start of the first chapter
    if(chapterCount > 0){
      var toPage = chapterBreaks[0];
      if(toPage !== parseInt(pageNumber)){
        goToPage(toPage);
      }
    }
  }

  function latestChapter(){
    var currentChapter = getCurrentChapter();
    var chapterCount = chapterBreaks.length;
    pageNumber = getQueryVariable("page");
    // Make sure we're not already on the last chapter break
    if(chapterCount > 0){
      var toPage = chapterBreaks[chapterCount - 1];
      if(toPage !== parseInt(pageNumber)){
        goToPage(toPage);
      }
    }
  }

  /**
  function printIndex(){
    //var contentIndex = document.getElementById("contentindex");
    var contentIndex = document.getElementById("content");
    //if(document.readyState == "interactive"){
      //alert("DOMContentLoaded");
      if(pageCount > 0){
        if(chapterBreaks.length > 0){
          var pageToPrint = 1;
          if(pageToPrint < chapterBreaks[0]){
            var introCell = document.createElement("DIV");
            $(introCell).attr("id", "intro");
            contentIndex.appendChild(introCell);
            var introHeader = document.createElement("H2");
            var headerText = document.createTextNode(introduction);
            introHeader.appendChild(headerText);
            introCell.appendChild(introHeader);
            alert("Hi");
          }
        } else {

        }
      //}
    }
  }

  function goToIndex(){
    pageNumber = getQueryVariable("page");
    if(parseInt(pageNumber) !== 0){
      goToPage(0);
      printIndex();
    }
  }
  */

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

  $("#firstchapter").click(function(){
    firstChapter();
  });

  $("#prevchapter").click(function(){
    prevChapter();
  });

  $("#nextchapter").click(function(){
    nextChapter();
  });

  $("#latestchapter").click(function(){
    latestChapter();
  });

  /**
  $("#index").click(function(){
    goToIndex();
  });
  */

  // Popstate event listener for back button functionality in HTML5 History API
  window.addEventListener("popstate", function(e){
    printPage(getQueryVariable("page"));
  });


