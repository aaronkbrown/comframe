
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
  if(pageNumber === false){
    // print latest page
    content.innerHTML = "<object type='text/html' data='content/current.html'></object>";
    //content.setAttribute("data", "content/current.html");
  } else {
    // get a string value of html file we want
    var url = "content/" + pageVar + ".html";
    content.innerHTML = "<object type='text/html' data=" + url + "></object>";
    //content.setAttribute("data", url);
  }
}

printPage(pageNumber);

