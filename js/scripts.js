var url = new URL(window.location.href);
var bundle = url.searchParams.get("bundle");
var current = url.searchParams.get("current");
var container = document.querySelector('.container');

console.log(current)

// Add 20 items.
var nextItem = 1;
var loadMore = function() {
  for (var i = 0; i < 4; i++) {
    var item = document.createElement('li');
    item.innerText = 'Item ' + nextItem++;
    container.appendChild(item);
  }
}

// Detect when scrolled to bottom.
container.addEventListener('scroll', function() {
  if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
    //loadMore();
  }
});

var loadSmth = function() {
    while(container.scrollTop + container.clientHeight >= container.scrollHeight){
        loadMore();
    }
}

// Initially load some items.
//loadMore();
//loadSmth();