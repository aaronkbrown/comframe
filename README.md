PaginatorJS
===========

PaginatorJS is a simple templating engine that utilizes client-side scripting to navigate paginated content, such as an HTML-based book. It uses the HTML5 history API so that modern browsers can navigate through the content without performing full page refreshes while still being able to bookmark pages or use the back and forward buttons, and a Modernizr fallback allows support for older browsers that lack support.

Usage
===========

PaginatorJS has a simple Index.html that serves as the main view where content gets injected, and it includes a set of navigational links at the top. Content is stored as snippets of HTML saved in numbered files within the content folder. These files must be numbered in the intended page order, i.e. 1.html, 2.html, 3.html, 4.html, etc. An optional cover.html can be used for the default front page. The file 0.html is reserved as a table of contents page that is dynamically populated based on the number of pages. The page navigation is tracked in the URL by means of the query string. If the query string is removed or an invalid page number is entered, then the navigation defaults to the front page. If a cover page is used, then the front page uses cover.html. If no cover page is used, then the front page uses the highest content page number, e.g. if there are 20 pages of content and no cover is used, then navigating to the front page displays the content of 20.html.

A main.json file is included which is required for the site to know how to navigate the content properly. The JSON file accepts 4 values: pageCount which tells it the maximum number of pages of content there are, hasCover boolean which tells it whether to use cover.html or not when navigating to the main front page, a chapterBreaks array that tells it which page numbers are the start of new chapters, and introduction which tells it what to call the section preceding the first chapter break if chapters are being used. If no chapter breaks are desired, then simply set chapterBreaks in main.json to an empty array [].

License
===========

[MIT License](http://opensource.org/licenses/MIT)
