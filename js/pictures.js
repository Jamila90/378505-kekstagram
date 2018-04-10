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

var ShowAllPhoto = generatePhotoCards(25);

function generatePhotoCards(amount) {

  var photoList = [];

  for (var i = 0; i < amount; i++) {
    var description = shuffle(DESCRIPTIONS);
    var comments = shuffle(COMMENTS);

    var photoAd = {
      url: 'photos/' + (i + 1) + '.jpg',
      likes: getRandomNumber(LIKES[0], LIKES[1]),
      comments: getRandomNumber(0, 1) ? comments.slice(0, 1) : comments.slice(0, 2),
      description: description[getRandomNumber(0, description.length)]
    };
    photoList.push(photoAd);
  }
  return photoList;
}

function renderPictures(arr) {
  var picturesTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
  var pictures = document.querySelector('.pictures');

  var fragment = document.createDocumentFragment();

  for (var i = 0; i < arr.length; i++) {
    var picturesElement = picturesTemplate.cloneNode(true);
    picturesElement.querySelector('img').src = arr[i].url;
    picturesElement.querySelector('.picture__stat--likes').textContent = arr[i].likes;
    picturesElement.querySelector('.picture__stat--comments').textContent = arr[i].comments.length;
    fragment.appendChild(picturesElement);
  }
  pictures.appendChild(fragment);
}

renderPictures(ShowAllPhoto);
