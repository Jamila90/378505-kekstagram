'use strict';

(function () {

  var startCoords;
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
  var ESC_KEYCODE = 27;
  // var ENTER_KEYCODE = 13;
  var MIN_SCALE = 25;
  var MAX_SCALE = 100;
  var STEP_SCALE = 25;
  var MAX_HASHTAG = 20;
  var MAX_ELEMENTS = 5;

  var pictures = document.querySelector('.pictures');
  var scaleLevel = document.querySelector('.scale__level');
  var scalePin = document.querySelector('.scale__pin');
  var imgUploadEffects = document.querySelector('.img-upload__effects');

  var imgUploadForm = document.querySelector('.img-upload__form');
  var imgUploadInput = imgUploadForm.querySelector('.img-upload__input');
  var imgUploadCancel = imgUploadForm.querySelector('.img-upload__cancel');
  var imgUploadOverlay = imgUploadForm.querySelector('.img-upload__overlay');

  var imagePreview = imgUploadForm.querySelector('.img-upload__preview img');
  var imgUploadScale = imgUploadOverlay.querySelector('.img-upload__scale');

  var hashtag = document.querySelector('.text__hashtags');
  var textComment = document.querySelector('.text__description');

  var resizeControlMinus = imgUploadForm.querySelector('.resize__control--minus');
  var resizeControlPlus = imgUploadForm.querySelector('.resize__control--plus');
  var resizeControl = imgUploadForm.querySelector('.resize__control--value');
  var scaleValueNumber = parseInt(resizeControl.value, 10);

  function onUploadFormOpen() {
    pictures.removeEventListener('click', window.pictures.onClickPicture);
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
    pictures.addEventListener('click', window.pictures.onClickPicture);
  }

  function onUploadFormEscPress(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      onUploadFormClose();
      window.preview.onBigPictureClose();
    }
  }

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

  function effectsCalculate(min, max) {
    var effectIndex = min + ((max - min) * scalePin.offsetLeft / MAX_X);
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
})();
