

/**
The main.json file contains information about the content of the website
When adding new pages or chapter breaks, main.json should be updated instead of this JavaScript file to maintain a cleaner separation of data and functionality

pageCount should be the total number of pages of content and should be the same number as the highest number page of content, e.g. a site with 20 pages of content (not counting the Table of Contents) should have pageCount set to 20

hasCover should tell us if we are using the optional cover.html file for the front page; if hasCover is set to false, then going to the front page (no query string in the URL) should display the highest page of content instead of the cover.html, e.g. setting this to false and having a pageCount of 20 means navigating to the front page shows us page 20

chapterBreaks is an array of page numbers that start new chapters; if we have chapterBreaks set to [6, 12, 17] then we will have chapter 1 begin at page 6, chapter 2 start at page 12, and chapter 3 start at page 17 with pages 1 through 5 defaulting to the introduction section in the Table of Contents. If no chapter breaks are desired in the content, then set the array to empty, i.e. "chapterBreaks": [],

introduction is the title of the introductory section in the Table of Contents in case we have chapter 1 start on a higher page than 1, e.g. if we have "chapterBreaks": [6, 12, 17], and "introduction": "About the Author" then in the Table of Contents pages 1 through 5 will be under the header About the Author
*/


// Variable that determines the total number of pages
// As new content pages are added, this variable should be manually updated in the JSON file
var pageCount = 1; // 20;

// Variable for whether website should have a cover image
// If the latest page of content should be displayed on the front, set to false
// If the front page should have a cover instead, set to true in the JSON file
var hasCover = false; // true;

// Array that contains all the pages that begin new chapters
// If we do not wish to break up the content by chapters, then leave this array empty, i.e.
// var chapterBreaks = [];
var chapterBreaks = [];

// The title of the introduction
var introduction = "Introduction";

// Retrieve information from JSON file pertaining to page count, cover information, and chapter breaks
$.getJSON("main.json", function(data){
  pageCount = data.pageCount;
  hasCover = data.hasCover;
  chapterBreaks = data.chapterBreaks;
  introduction = data.introduction;
}).done(function(){

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
    var url = "";
    if(pageVar === false){
      // print latest page
      if(hasCover){
        url = "content/cover.html";
      } else {
        url = "content/" + pageCount + ".html";
      }
    } else {
      // get a string value of html file we want
      url = "content/" + pageVar + ".html";
    }
    // AJAX get request takes content file in question and prints to page
    // Fallback sends browser to front page in case requested page does not exist
    $.get(url).done(function(data){
      $(content).html(data);
      // Add index populating function here so that it runs after HTML is finished loading, lest we try to add elements to a document that does not yet fully exist
      if(parseInt(pageVar) === 0){
        printIndex();
      }
    }).fail(function(){
      // If the page does not exist, redirect to root and remove from browser history
      var navTo = window.location.href;
      navTo = navTo.replace(window.location.search, "");
      window.location.replace(navTo);
    });
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
        } else {
          pageInt = false;
        }
      } else {
        if(pageInt < pageCount){
          navTo = navTo + "?page=" + pageInt;
        } else {
          pageInt = false;
        }
      }
    }
    // If we're already on the front page, calling this function again won't track in the browser history
    if(pageNumber){
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
    if(parseInt(pageNumber) !== 1 && parseInt(pageNumber) !== 0){
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
          printPage(false);
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
    if(hasCover && currentPage >= 0){
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

  // Function to return to front page
  function goToFront(){
    pageNumber = getQueryVariable("page");
    if(pageNumber){
      var navTo = window.location.href;
      navTo = navTo.replace(window.location.search, "");
      if(Modernizr.history){
        history.pushState(null, null, navTo);
        printPage(false);
      } else {
        window.location.assignTo(navTo);
      }
    }
  }

  // Populate the TOC with links to each page and divide by chapter if necessary
  function printIndex(){
    var contentIndex = document.getElementById("contentindex");
    if(pageCount > 0){
      if(chapterBreaks.length > 0){
        var pageToPrint = 1;
        // In case we have a set of introduction pages that come before the first page of the first chapter chapterBreaks[0]
        if(pageToPrint < chapterBreaks[0]){
          // Create a block element to contain introduction page links
          var introCell = document.createElement("SECTION");
          $(introCell).attr("id", "intro");
          contentIndex.appendChild(introCell);
          // Create header for element and append to the block
          var headerText = document.createTextNode(introduction);
          var headerButton = document.createElement("BUTTON");
          introCell.appendChild(headerButton);
          headerButton.appendChild(headerText);
          // Give the header a class for JavaScript clicking
          $(headerButton).addClass("chapterHeader");
          // And a data attribute
          $(headerButton).attr("data-chapter", "chapterNumber0");
          // Create a block to contain all the links of this section
          var introBlock = document.createElement("DIV");
          introCell.appendChild(introBlock);
          // Give link block an ID
          $(introBlock).attr("id", "chapterNumber0");
          // And a styling class
          $(introBlock).addClass("chapterblock");
          // ARIA role
          $(introBlock).attr("role", "group");
          // Add the page links
          while(pageToPrint < chapterBreaks[0]){
            var linkText = document.createTextNode("Page " + pageToPrint);
            var pLink = document.createElement("A");
            pLink.appendChild(linkText);
            introBlock.appendChild(pLink);
            // Add a class to link as a JavaScript hook and a "data-page" attribute to bind it to its own page value; also add a class for click capturing
            $(pLink).addClass("pageLink");
            $(pLink).addClass("navigation");
            $(pLink).attr("href", "");
            $(pLink).attr("data-page", pageToPrint);
            $(pLink).attr("role", "treeitem");
            pageToPrint++;
          }
        }
        // Cycle through each chapter and spit out the pages for each
        for(i = 1; i <= chapterBreaks.length; i++){
          var chapterCell = document.createElement("SECTION");
          $(chapterCell).attr("id", "chapter" + i);
          contentIndex.appendChild(chapterCell);
          var chapterHeaderText = document.createTextNode("Chapter " + i);
          var headerButton = document.createElement("BUTTON");
          chapterCell.appendChild(headerButton);
          headerButton.appendChild(chapterHeaderText);
          $(headerButton).addClass("chapterHeader");
          $(headerButton).attr("data-chapter", "chapterNumber" + i);
          var chapterBlock = document.createElement("DIV");
          $(chapterBlock).attr("id", "chapterNumber" + i);
          $(chapterBlock).addClass("chapterblock");
          chapterCell.appendChild(chapterBlock);
          $(chapterBlock).attr("role", "group");
          // If there are chapter break pages remaining
          if(chapterBreaks[i]){
            while(pageToPrint < chapterBreaks[i]){
              var linkText = document.createTextNode("Page " + pageToPrint);
              var pLink = document.createElement("A");
              pLink.appendChild(linkText);
              chapterBlock.appendChild(pLink);
              $(pLink).addClass("pageLink");
              $(pLink).addClass("navigation");
              $(pLink).attr("href", "");
              $(pLink).attr("data-page", pageToPrint);
              $(pLink).attr("role", "treeitem");
              pageToPrint++;
            }
          // Or if we're on the last chapter with no further breaks remaining
          } else {
            while(pageToPrint <= pageCount){
              var linkText = document.createTextNode("Page " + pageToPrint);
              var pLink = document.createElement("A");
              pLink.appendChild(linkText);
              chapterBlock.appendChild(pLink);
              $(pLink).addClass("pageLink");
              $(pLink).addClass("navigation");
              $(pLink).attr("href", "");
              $(pLink).attr("data-page", pageToPrint);
              $(pLink).attr("role", "treeitem");
              pageToPrint++;
            }
          }
        }
      } else {
        // In case we have no chapter breaks
        var pageToPrint = 1;
        while(pageToPrint <= pageCount){
          var linkText = document.createTextNode("Page " + pageToPrint);
          var pLink = document.createElement("A");
          pLink.appendChild(linkText);
          contentIndex.appendChild(pLink);
          $(pLink).addClass("pageLink");
          $(pLink).addClass("navigation");
          $(pLink).attr("href", "");
          $(pLink).attr("data-page", pageToPrint);          
          pageToPrint++;
        }
      }
    }
  }

  function chapterExpand(headerClicked){
    var chapterId = $(headerClicked).attr("data-chapter");
    $("#" + chapterId).toggle(300);
  }

  // Take us to page 0, the index/TOC
  function goToIndex(){
    pageNumber = getQueryVariable("page");
    if(parseInt(pageNumber) !== 0){
      goToPage(0);
    }
  }

  // Take us to the page whose link we clicked on in the index
  function clickIndexLink(dataLink){
    // Retrieve page number from data bound to link
    var dataPage = $(dataLink).attr("data-page");
    goToPage(dataPage);
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

  $("#index").click(function(){
    goToIndex();
  });

  $("#frontpage").click(function(){
    goToFront();
  });

  // Because we are binding events to classes and elements that get added dynamically
  $("#content").on("click", ".pageLink", function(){
    clickIndexLink(this);
  });

  $("#content").on("click", ".chapterHeader", function(){
    chapterExpand(this);
  });

  $(document).on("click", ".navigation", function(event){
    event.preventDefault();
  });

  // Hide chapter navigation if there are no chapter breaks
  if(chapterBreaks.length === 0){
    $("#chapterNav").addClass("nochapters");
  }

  // Popstate event listener for back button functionality in HTML5 History API
  window.addEventListener("popstate", function(e){
    printPage(getQueryVariable("page"));
  });
});

