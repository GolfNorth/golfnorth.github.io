var url = new URL(window.location.href);
var bundle = url.searchParams.get("bundle");
var current = url.searchParams.get("current");
var containerElement = document.querySelector('.container');
var avatarElement = document.querySelector('.avatar');
var columnCount = 5;
var scrollOffset = 10;

var nextItem = 0;
var loadMore = function () {
  for (var i = 0; i < columnCount; i++) {
    var cloneElement = avatarElement.cloneNode(true);
    cloneElement.classList.remove("hidden");
    cloneElement.classList.add("loading")
    containerElement.appendChild(cloneElement);
  }
}

window.addEventListener("scroll", function () {
  if ((window.innerHeight + window.scrollY + scrollOffset) >= document.body.offsetHeight) {
    loadMore();
  }
}, false);

var loadSmth = function () {
  while (document.body.offsetHeight < window.innerHeight + scrollOffset) {
    loadMore();
  }
}

loadSmth();