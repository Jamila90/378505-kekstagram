'use strict';
(function () {

  var pictures = document.querySelector('.pictures');
  document.querySelector('.social__comment-count').classList.add('visually-hidden');
  document.querySelector('.social__comment-loadmore').classList.add('visually-hidden');

  function onClickPicture(evt) {
    var target;
    if (target === 'picture__link') {
      target = evt.target;
    } else if (evt.target.parentElement.className === 'picture__link') {
      target = evt.target.parentElement;
    } else {
      return;
    }

    var index = identifyPictureIndex(target.firstElementChild.src);
    window.preview.displayBigPicture(window.data.objectArrays[index]);
  }

  function identifyPictureIndex(src) {
    var index = null;
    window.data.objectArrays.forEach(function (item, i) {
      if (src.indexOf(item.url) >= 0) {
        index = i;
      }
    });
    return index;
  }

  pictures.addEventListener('click', onClickPicture);

  window.pictures = {
    onClickPicture: onClickPicture
  };
})();

