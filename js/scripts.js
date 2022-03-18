var init = function (data) {
  let url = new URL(window.location.href);
  let bundle = new Bundle(url, data);
  let currentAvatar = url.searchParams.get('current');
  let avatars = [];
  let index = 0;

  data.avatars.sort(function compare(a, b) {
    if (a.bundle == 'Default' || (a.bundle == bundle.name && b.bundle != 'Default')) {
      return -1;
    }

    if (b.bundle == 'Default' || (b.bundle == bundle.name && a.bundle != 'Default')) {
      return 1;
    }

    return 0;
  });

  for (bundleAvatars of data.avatars) {
    for (avatarData of bundleAvatars.avatars) {
      avatars[index] = new Avatar(avatarData, currentAvatar);

      index++;
    }
  }

  initLoader(bundle, avatars);
}

var initLoader = function (bundle, avatars) {
  let containerElement = document.querySelector('.container');
  let avatarElement = document.querySelector('.avatar');
  let gapElement = document.querySelector('.gap');
  let scrollOffset = window.innerHeight * 0.05;
  let columnCount = bundle.columnCount;
  let totalCount = avatars.length;
  let nextIndex = 0;

  let isPageFilled = function () {
    return document.body.offsetHeight > window.innerHeight + scrollOffset;
  }

  let isScrolledToBottom = function () {
    return (window.innerHeight + window.scrollY + scrollOffset) >= document.body.offsetHeight;
  }

  let isAllLoaded = function () {
    return nextIndex >= totalCount;
  }

  let loadPage = function () {
    while (!isAllLoaded() && !isPageFilled()) {
      loadMore();
    }
  }

  let loadMore = function () {
    let count = nextIndex + columnCount;

    for (; nextIndex < count; nextIndex++) {
      if (!isAllLoaded()) {
        loadAvatar(avatars[nextIndex]);
      } else {
        fillGap();
      }
    }
  }

  let loadAvatar = function (avatar) {
    let cloneElement = avatarElement.cloneNode(true);
    cloneElement.classList.remove('hidden');
    cloneElement.classList.add('loading');
    cloneElement.addEventListener('click', function () {
      selectAvatar(cloneElement);

      console.log(`selected:${avatar.url}`);
    })

    if (avatar.selected) {
      cloneElement.classList.add('selected');
    }

    let imageElement = cloneElement.querySelector('.avatar-image');
    imageElement.src = avatar.url;
    imageElement.addEventListener('load', function () {
      cloneElement.classList.remove('loading');
    });

    containerElement.appendChild(cloneElement);
  }

  let selectAvatar = function (selectedElement) {
    let oldSelectedElement = containerElement.querySelector('.avatar.selected');
    oldSelectedElement.classList.remove('selected');

    selectedElement.classList.add('selected');
  }

  let fillGap = function () {
    let cloneElement = gapElement.cloneNode(true);
    cloneElement.classList.remove('hidden');
    containerElement.appendChild(cloneElement);
  }

  window.addEventListener('scroll', function () {
    if (!isAllLoaded() && isScrolledToBottom()) {
      loadMore();
    }
  }, false);

  loadPage();
}

function Bundle(url, data) {
  this.name = url.searchParams.get('bundle');
  this.stylesheet = '';
  this.columnCount = 5;

  for (alias of data.aliases) {
    if (alias.bundle == this.name) {
      this.name = alias.alias;

      break;
    }
  }

  for (style of data.styles) {
    if (style.bundle == this.name) {
      this.stylesheet = style.stylesheet;
      this.columnCount = style.columnCount;

      break;
    }
  }
}

function Avatar(avatarData, currentAvatar) {
  this.name = avatarData.name;
  this.url = avatarData.url;
  this.selected = avatarData.url == currentAvatar;

  if (currentAvatar == 'Default') {
    this.selected = true;
  }
}

fetch('js/data.json')
  .then(response => response.json())
  .then(data => init(data))
  .catch(error => console.log(error));