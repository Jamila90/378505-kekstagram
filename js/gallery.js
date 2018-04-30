'use strict';

(function () {

  var fragment = document.createDocumentFragment();
  var picturesTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
  var pictures = document.querySelector('.pictures');


  function renderPictures(arr) {

    for (var i = 0; i < arr.length; i++) {
      var picturesElement = picturesTemplate.cloneNode(true);
      picturesElement.querySelector('img').src = arr[i].url;
      picturesElement.querySelector('.picture__stat--likes').textContent = arr[i].likes;
      picturesElement.querySelector('.picture__stat--comments').textContent = arr[i].comments.length;
      fragment.appendChild(picturesElement);
    }
    pictures.appendChild(fragment);
  }

  window.gallery = {
    renderPictures: renderPictures
  };
})();
