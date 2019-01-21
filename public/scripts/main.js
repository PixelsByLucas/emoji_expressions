"use strict";

var emojiCodes = {
  anger: ['&#x01F623;', '&#x01F620;', '&#x01F624;', '&#x01F621;', '&#x01F92C;', '&#x01F608;', '&#x01F47F;', '&#x01F479;'],
  contempt: ['&#x01F644;', '&#x01F928;', '&#x01F612;'],
  disgust: ['&#x01F62C;', '&#x01F922;', '&#x01F92E;'],
  fear: ['&#x01F61F;', '&#x01F633;', '&#x01F627;', '&#x01F628;', '&#x01F628;', '&#x01F630;', '&#x01F631;'],
  happiness: ['&#x01F642;', '&#x01F60A;', '&#x01F600;', '&#x01F604;', '&#x01F601;', '&#x01F929;'],
  neutral: ['&#x01F610;', '&#x01F611;', '&#x01F636;'],
  sadness: ['&#x01F614;', '&#x01F613;', '&#x01F622;', '&#x01F625;', '&#x01F62D;'],
  surprise: ['&#x01F62F;', '&#x01F62E;', '&#x01F632;', '&#x01F635;', '&#x01F92F;'],
  error: ['&#x01F468;&#x01F3FE;&#x200D;&#x01F4BB;', '&#x01F423;', '&#x01F439;', '&#x01F926;&#x01F3FB;', '&#x01F47D;']
};
"use strict";

var app = {
  // if image is submitted by url, first ajax call runs.
  // if image is submitted by file, second xmlhttprequest runs.
  getFaceData: function getFaceData(image) {
    var endpoint = 'https://eastus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=ptrue&returnFaceLandmarks=false&returnFaceAttributes=age,glasses,emotion,hair,makeup';
    var _config = config,
        API_KEY = _config.API_KEY;

    if (typeof image === 'string') {
      $.ajax({
        url: endpoint,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Ocp-Apim-Subscription-Key': "".concat(API_KEY)
        },
        method: 'POST',
        data: "{\"url\": \"".concat(image, "\"}"),
        error: app.processErr.bind(app)
      }).then(function (res, status) {
        if (status === 'success') {
          app.processRes(res);
        }
      });
    } else {
      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function (e) {
        if (this.readyState === 4) {
          app.processRes(xhr.response);
        }
      };

      xhr.open('POST', endpoint, true);
      xhr.responseType = 'json';
      xhr.setRequestHeader('Content-Type', 'application/octet-stream');
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('Ocp-Apim-Subscription-Key', "".concat(API_KEY));
      xhr.send(image);
    }
  },
  // process raw res data
  processRes: function processRes(res) {
    // verify res only had one face submitted to it
    if (res.length === 1) {
      var person1 = res[0];
      this.processEmotions(person1);
      this.processAppearance(person1); // error handling: res detected more than once face
    } else {
      this.processErr(res);
    }
  },
  processErr: function processErr(res) {
    //$ajax returns an object so it wont have a length 
    if (res.length === undefined) {
      this.renderImgs('./images/upload.png', '‍👨‍💻');
      this.renderMsg("Error, invalid image", true);
    } //xmlhttprequest returns an array.  Its errors are handled below 
    // more than one face detected


    if (res.length > 1) {
      this.renderImgs('./images/upload.png', '👩‍👩‍👧');
      this.renderMsg('Error, please upload an image with a single face', true); // no face detected
    } else if (res.length < 1) {
      this.renderImgs('./images/upload.png', '🕵️‍');
      this.renderMsg('Error, could not recognize your face', true);
    }
  },
  // process emotion data
  processEmotions: function processEmotions(person) {
    var emotionObj = person.faceAttributes.emotion;
    var emotionArr = Object.values(emotionObj);
    var emotionMaxValue = Math.max.apply(Math, emotionArr);

    for (var emotion in emotionObj) {
      if (emotionObj[emotion] === emotionMaxValue) {
        this.selectEmoji(emotion, emotionMaxValue);
        this.renderMsg("You've got a lot of ".concat(emotion, " in you."), false);
        break;
      }
    }
  },
  // process appearance data
  processAppearance: function processAppearance(_ref) {
    var faceAttributes = _ref.faceAttributes;
    var age = faceAttributes.age;
    var makeup = faceAttributes.makeup;
    var glasses = '';
    var bald = false;
    var hairValArr = [];
    var hairColor = '';

    if (faceAttributes.glasses !== 'NoGlasses') {
      glasses = faceAttributes.glasses;
    }

    if (faceAttributes.hair.bald > 0.5) {
      bald = true;
    }

    for (var value in faceAttributes.hair.hairColor) {
      hairValArr.push(faceAttributes.hair.hairColor[value].confidence);
    }

    var hairMaxValue = Math.max.apply(Math, hairValArr);

    for (var val in faceAttributes.hair.hairColor) {
      if (faceAttributes.hair.hairColor[val].confidence === hairMaxValue) {
        hairColor = faceAttributes.hair.hairColor[val].color;
      }
    }

    this.populateUserAppearance(age, glasses, bald, hairColor, makeup);
  },
  selectEmoji: function selectEmoji(emotion, val) {
    // entire array of emotionMaxValue
    var emotionArr = emojiCodes[emotion]; // emojiIndex = index number of emoji we want to display

    var emojiIndex = Math.round((emojiCodes[emotion].length - 1) * val); // actual HTML code for emoji we want to display

    var emojiCode = emotionArr[2];
    this.renderImgs(null, emojiCode);
  },
  populateUserAppearance: function populateUserAppearance(age, glasses, bald, hairColor, makeup) {
    $('.userAppearance ul').append("<li><span>Approximate age:</span> ".concat(age, " years old.</li>"));

    if (glasses) {
      $('.userAppearance ul').append("<li><span>Glasses:</span> ".concat(glasses, "</li>"));
    }

    if (bald) {
      $('.userAppearance ul').append("<li><span>You're bald!</span></li>");
    } else {
      $('.userAppearance ul').append("<li><span>Hair color:</span> ".concat(hairColor, "</li>"));
    }

    if (makeup.eyeMakup) {
      $('.userAppearance ul').append("<li><span>You're wearing eye makeup!</span></li>");
    }

    if (makeup.lipMakup) {
      $('.userAppearance ul').append("<li><span>You're wearing lip makeup!</span></li>");
    }
  },
  prepFileToRender: function prepFileToRender() {
    var _this = this;

    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      _this.renderImgs(reader.result, null);
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  },
  // ensures both userImg and emoji are available before rendering
  renderImgs: function renderImg(userImg, emoji) {
    if (userImg) {
      renderImg.userImg = userImg;
    }

    if (emoji) {
      renderImg.emoji = emoji;
    }

    if (renderImg.emoji && renderImg.userImg) {
      $('.userEmoji p').html(renderImg.emoji);
      $('#imgDisplay').attr('src', renderImg.userImg);
      renderImg.userImg = "";
      renderImg.emoji = "";
    }
  },
  renderMsg: function renderMsg(msg, isError) {
    if (isError) {
      $('#message').text(msg).css({
        color: 'red'
      });
    } else {
      $('#message').text(msg).css({
        color: '#F1F0EB'
      });
    }
  },
  validateForm: function validateForm() {
    var $inputImage = $('.inputImage');
    var userURL = $inputImage.val();
    var valid = $inputImage[0].validity.valid;

    if (valid && userURL) {
      $inputImage.css({
        border: 'none'
      }).attr('placeholder', 'Paste image URL here!');
      this.getFaceData(userURL);
      this.renderImgs(userURL, null);
    } else {
      $inputImage.css({
        border: '1px solid red'
      }).attr('placeholder', 'Please enter a valid URL');
    } // empty url input


    $inputImage.val('');
  },
  eventListeners: function eventListeners() {
    // === url upload listener ===
    $('.inputSubmit').on('click', function (e) {
      e.preventDefault();
      $('.userAppearance ul').empty();
      app.validateForm();
    }); // === file upload listener ===

    $('.inputFile').on('change', function (e) {
      // empty .userAppearance list
      $('.userAppearance ul').empty(); // extract file to send to API

      var userFile = this.files[0];
      var formData = new FormData();
      formData.append('userFile', userFile); // make API call

      app.getFaceData(userFile); // prepare file to render

      app.prepFileToRender();
    });
  },
  init: function init() {
    this.eventListeners();
  }
};
$(function () {
  app.init();
});