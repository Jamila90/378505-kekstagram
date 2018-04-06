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

var DESCRIPTION = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

var photoList = [];

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

function createPhoto(amount) {

  for (var i = 0; i < amount; i++) {
    var description = shuffle(DESCRIPTION).slice(0, getRandomNumber(1, DESCRIPTION.length));
    var comments = shuffle(COMMENTS).getRandomNumber(1, 2);

    var photoAd = {
      url: 'photos/' + getRandomNumber(1, 25),
      likes: getRandomNumber(LIKES),
      comments: comments,
      description: description
    };
    photoList.push(photoAd);
  }
  return photoList;
}

photoList = createPhoto(25);
