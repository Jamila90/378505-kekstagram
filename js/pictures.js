'use strict';

var LIKES = [15, 200];

var COMMENTS = [
  'Всё отлично!',
  'В целом всё не плохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var DESCRIPTIONS = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

var ESC_KEYCODE = 27;
// var ENTER_KEYCODE = 13;
var MIN_SCALE = 25;
var MAX_SCALE = 100;
var STEP_SCALE = 25;

var fragment = document.createDocumentFragment();
var picturesTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
var pictures = document.querySelector('.pictures');
var bigPicture = document.querySelector('.big-picture');
var bigPictureClose = bigPicture.querySelector('.big-picture__cancel');
var socialComments = document.querySelector('.social__comments');
document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.social__comment-loadmore').classList.add('visually-hidden');

function getRandomNumber(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

function shuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var rand = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[rand];
    arr[rand] = temp;
  }
  return arr;
}

var objectArrays = generatePhotoCards(25);

function generatePhotoCards(amount) {

  var photoLists = [];

  for (var i = 0; i < amount; i++) {
    var descriptions = shuffle(DESCRIPTIONS);
    var comments = shuffle(COMMENTS);

    var photoAd = {
      url: 'photos/' + (i + 1) + '.jpg',
      likes: getRandomNumber(LIKES[0], LIKES[1]),
      comments: getRandomNumber(0, 1) ? comments.slice(0, 1) : comments.slice(0, 2),
      description: descriptions[getRandomNumber(0, descriptions.length)]
    };
    photoLists.push(photoAd);
  }
  return photoLists;
}

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

function displayBigPicture(obj) {
  bigPicture.classList.remove('hidden');

  bigPicture.querySelector('.big-picture__img img').src = obj.url;
  bigPicture.querySelector('.likes-count').textContent = obj.likes;
  bigPicture.querySelector('.comments-count').textContent = obj.comments.length;

  for (var i = 0; i < obj.comments.length; i++) {
    var comment = document.querySelector('.social__comment').cloneNode();
    var userSocialPicture = document.querySelector('.social__picture').cloneNode(true);
    var text = document.createTextNode(obj.comments[i]);

    userSocialPicture.src = 'img/avatar-' + getRandomNumber(1, 6) + '.svg';
    comment.appendChild(userSocialPicture);
    comment.appendChild(text);
    fragment.appendChild(comment);
  }
  removeFirstChild(socialComments);
  socialComments.appendChild(fragment);
  pictures.removeEventListener('click', onClickPicture);
}

function removeFirstChild(firstChildRemove) {
  while (firstChildRemove.firstChild) {
    firstChildRemove.removeChild(firstChildRemove.firstChild);
  }
}

renderPictures(objectArrays);

// <----------------------------------------  Загрузка изображения показ формы редактирования и изображения в полноэкранном режиме  -------------------------------------------------->

var imgUploadForm = document.querySelector('.img-upload__form');
var imgUploadInput = imgUploadForm.querySelector('.img-upload__input');
var imgUploadCancel = imgUploadForm.querySelector('.img-upload__cancel');
var imgUploadOverlay = imgUploadForm.querySelector('.img-upload__overlay');

var imagePreview = imgUploadForm.querySelector('.img-upload__preview img');
var imgUploadScale = imgUploadOverlay.querySelector('.img-upload__scale');


function onUploadFormOpen() {
  pictures.removeEventListener('click', onClickPicture);
  imgUploadOverlay.classList.remove('hidden');
  scaleLevel.style.width = '100%';
  scalePin.style.left = '100%';
  resizeControl.value = '100%';

}

function onUploadFormClose() {
  if (imgUploadOverlay) {
    imgUploadOverlay.classList.add('hidden');
  }
  imgUploadInput.value = '';
  pictures.addEventListener('click', onClickPicture);
}

function onUploadFormEscPress(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    onUploadFormClose();
    onBigPictureClose();
  }
}

function onBigPictureClose() {
  if (bigPicture) {
    bigPicture.classList.add('hidden');
  }
  pictures.addEventListener('click', onClickPicture);
}

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
  displayBigPicture(objectArrays[index]);
}

function identifyPictureIndex(src) {
  var index = null;
  objectArrays.forEach(function (item, i) {
    if (src.indexOf(item.url) >= 0) {
      index = i;
    }
  });
  return index;
}

// Маштабирование.

var resizeControlMinus = imgUploadForm.querySelector('.resize__control--minus');
var resizeControlPlus = imgUploadForm.querySelector('.resize__control--plus');
var resizeControl = imgUploadForm.querySelector('.resize__control--value');
var scaleValueNumber = parseInt(resizeControl.value, 10);

function onScaleMinus() {
  if (scaleValueNumber > MIN_SCALE) {
    scaleValueNumber = scaleValueNumber - STEP_SCALE;
    imagePreview.style.transform = 'scale(' + scaleValueNumber / 100 + ')';
    resizeControl.value = (scaleValueNumber + '%');

  }
}

function onScalePlus() {
  if (scaleValueNumber < MAX_SCALE) {
    scaleValueNumber = scaleValueNumber + STEP_SCALE;
    imagePreview.style.transform = 'scale(' + scaleValueNumber / 100 + ')';
    resizeControl.value = (scaleValueNumber + '%');

  }
}

// Эффекты.

var scaleLevel = document.querySelector('.scale__level');
var scalePin = document.querySelector('.scale__pin');
var imgUploadEffects = document.querySelector('.img-upload__effects');

function onClickEffects(evt) {
  var target = evt.target.closest('.img-upload__effects');
  if (target) {
    imagePreview.className = 'effects__preview--' + evt.target.value;
    imgUploadScale.classList.remove('hidden');
  }
  var addEffect = document.querySelector('.effects__radio:checked').value;

  imgUploadScale.classList.toggle('hidden', addEffect === 'none');
  setEffectCalculated();
}

var hashtag = document.querySelector('.text__hashtags');
var textComment = document.querySelector('.text__description');
var MAX_HASHTAG = 20;
var MAX_ELEMENTS = 5;

function getSortingHashtags(arr) {
  for (var i = 0; i < arr.length - 1; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i].toUpperCase() === arr[j].toUpperCase()) {
        hashtag.setCustomValidity('"Хеш-теги не должны повторяться."');
      }
    }
  }
  return;
}

function getEntriesCount(str, symbol) {
  var count = 0;
  var strArray = str.split('');

  for (var i = 0; i < strArray.length; i++) {
    if (strArray[i] === symbol) {
      count++;
    }
  }
  return count;
}

function onClickHashtag() {
  hashtag.setCustomValidity('');
  var hashtagArrays = hashtag.value.split(' ');
  if (hashtagArrays.length > MAX_ELEMENTS) {
    hashtag.setCustomValidity('Разрешено использовать не больше 5 "Хеш-тегов".');
  } else {
    for (var i = 0; i < hashtagArrays.length; i++) {
      if (hashtagArrays[i] > MAX_HASHTAG) {
        hashtag.setCustomValidity('Хэш-тег не должен быть больше 20 символов.');
      } else if (hashtagArrays[i] === '#') {
        hashtag.setCustomValidity('Хэш-тег не должен состоять из одной "#".');
      } else if (hashtagArrays[i].slice(0, 1) !== '#') {
        hashtag.setCustomValidity('"Хештег" должен начинаться с символа "#".');
      } else if (getEntriesCount(hashtagArrays[i], '#') > 1) {
        hashtag.setCustomValidity('Между Хеш-тегами должен быть пробел.');
      }
    }
  }
  return getSortingHashtags(hashtagArrays);
}

function removeEvent() {
  document.removeEventListener('keydown', onUploadFormEscPress);
}

// Слайдер

var CHROME_MIN = 0;
var CHROME_MAX = 1;
var SEPIA_MIN = 0;
var SEPIA_MAX = 1;
var MARVIN_MIN = 0;
var MARVIN_MAX = 100;
var PHOBOS_MIN = 0;
var PHOBOS_MAX = 3;
var HEAT_MIN = 1;
var HEAT_MAX = 3;
var MIN_X = 0;
var MAX_X = 453;
var startCoords;

function effectsCalculate(min, max) {
  var effectIndex = min + ((max - min) / 100 * parseInt(scalePin.style.left, 10));
  return effectIndex;
}

function setEffectCalculated() {
  switch (imagePreview.className) {
    case 'effects__preview--none':
      imagePreview.style.filter = 'none';
      break;
    case 'effects__preview--chrome':
      imagePreview.style.filter = 'grayscale(' + effectsCalculate(CHROME_MIN, CHROME_MAX) + ')';
      break;
    case 'effects__preview--sepia':
      imagePreview.style.filter = 'sepia(' + effectsCalculate(SEPIA_MIN, SEPIA_MAX) + ')';
      break;
    case 'effects__preview--marvin':
      imagePreview.style.filter = 'invert(' + effectsCalculate(MARVIN_MIN, MARVIN_MAX) + '%)';
      break;
    case 'effects__preview--phobos':
      imagePreview.style.filter = 'blur(' + effectsCalculate(PHOBOS_MIN, PHOBOS_MAX) + 'px)';
      break;
    case 'effects__preview--heat':
      imagePreview.style.filter = 'brightness(' + effectsCalculate(HEAT_MIN, HEAT_MAX) + ')';
      break;
  }
}

function onMouseDown(evt) {
  evt.preventDefault();

  startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

function onMouseMove(moveEvt) {
  moveEvt.preventDefault();

  var shift = {
    x: startCoords.x - moveEvt.clientX,
  };

  startCoords = {
    x: moveEvt.clientX,
  };
  if ((scalePin.offsetLeft - shift.x) >= MIN_X && (scalePin.offsetLeft - shift.x) <= MAX_X) {
    scalePin.style.left = (scalePin.offsetLeft - shift.x) + 'px';
    scaleLevel.style.width = (scaleLevel.offsetWidth - shift.x) + 'px';
    setEffectCalculated();
  }
}

function onMouseUp(upEvt) {
  upEvt.preventDefault();

  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
}

scalePin.addEventListener('mousedown', onMouseDown);
hashtag.addEventListener('input', onClickHashtag);
hashtag.addEventListener('focus', removeEvent);
textComment.addEventListener('focus', removeEvent);
imgUploadEffects.addEventListener('click', onClickEffects);
imgUploadForm.addEventListener('change', onUploadFormOpen);
imgUploadCancel.addEventListener('click', onUploadFormClose);
document.addEventListener('keydown', onUploadFormEscPress);
resizeControlMinus.addEventListener('click', onScaleMinus);
resizeControlPlus.addEventListener('click', onScalePlus);
pictures.addEventListener('click', onClickPicture);
bigPictureClose.addEventListener('click', onBigPictureClose);
