'use strict';

(function () {

  var pictures = document.querySelector('.pictures');
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureClose = bigPicture.querySelector('.big-picture__cancel');
  var socialComments = document.querySelector('.social__comments');
  var fragment = document.createDocumentFragment();

  function displayBigPicture(obj) {
    bigPicture.classList.remove('hidden');

    bigPicture.querySelector('.big-picture__img img').src = obj.url;
    bigPicture.querySelector('.likes-count').textContent = obj.likes;
    bigPicture.querySelector('.comments-count').textContent = obj.comments.length;

    for (var i = 0; i < obj.comments.length; i++) {
      var comment = document.querySelector('.social__comment').cloneNode();
      var userSocialPicture = document.querySelector('.social__picture').cloneNode(true);
      var text = document.createTextNode(obj.comments[i]);

      userSocialPicture.src = 'img/avatar-' + window.data.getRandomNumber(1, 6) + '.svg';
      comment.appendChild(userSocialPicture);
      comment.appendChild(text);
      fragment.appendChild(comment);
    }
    removeFirstChild(socialComments);
    socialComments.appendChild(fragment);
    pictures.removeEventListener('click', window.pictures.onClickPicture);
  }

  function removeFirstChild(firstChildRemove) {
    while (firstChildRemove.firstChild) {
      firstChildRemove.removeChild(firstChildRemove.firstChild);
    }
  }

  function onBigPictureClose() {
    if (bigPicture) {
      bigPicture.classList.add('hidden');
    }
    pictures.addEventListener('click', window.pictures.onClickPicture);
  }

  bigPictureClose.addEventListener('click', onBigPictureClose);

  window.preview = {
    onBigPictureClose: onBigPictureClose,
    displayBigPicture: displayBigPicture
  };
})();
