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

var fragment = document.createDocumentFragment();
var picturesTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
var pictures = document.querySelector('.pictures');
var bigPicture = document.querySelector('.big-picture');
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
}

function removeFirstChild(firstChildRemove) {
  while (firstChildRemove.firstChild) {
    firstChildRemove.removeChild(firstChildRemove.firstChild);
  }
}

renderPictures(objectArrays);
displayBigPicture(objectArrays[0]);
