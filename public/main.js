
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
    //content.setAttribute("data", "content/current.html");
  } else {
    // get a string value of html file we want
    var url = "content/" + pageVar + ".html";
    // string value of error page
    //var errorURL = "content/error.html";
    // AJAX get request takes content file in question and prints to page
    // Prints error page in case requested page does not exist
    $.get(url).done(function(){
      content.innerHTML = "<object type='text/html' data=" + url + "></object>";
    }).fail(function(){
      content.innerHTML = "<object type='text/html' data='content/current.html'></object>";
    });

    /**
    var url = "content/" + pageVar + ".html";
    content.innerHTML = "<object type='text/html' data=" + url + "></object>";
    //content.setAttribute("data", url);
    */
  }
}

function nextPage(){
  pageNumber = getQueryVariable("page");

  if(Modernizr.history){
    // Use HTML5 history magic
  } else {
    // Use older transition method
  }
  /**
  printPage(parseInt(pageNumber) + 1);
  */
}

function prevPage(){
  pageNumber = getQueryVariable("page");

  if(Modernizr.history){
    // Use HTML5 history magic
  } else {
    // Use older transition method
  }
  /**
  if(pageNumber - 1 > 0){
    printPage(pageNumber - 1);
  } else {
    printPage(1);
  }
  */
}


printPage(pageNumber);


$("#prev").click(function(){
  prevPage();
});

$("#next").click(function(){
  nextPage();
});
