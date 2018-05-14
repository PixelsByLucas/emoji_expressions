//██████████ APP SETUP ██████████
const app = {};
//██████████ API CALLS ██████████

// Two API calls within app.getFaceData()
    // if image is submitted by url, first ajax call runs.
    // if image is submitted by file, second one runs.
app.getFaceData = function (image) {
    const endpoint = 'https://eastus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=ptrue&returnFaceLandmarks=false&returnFaceAttributes=age,glasses,emotion,hair,makeup';
    //API CALL
    if(typeof image === 'string'){
        $.ajax({
            url: endpoint,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Ocp-Apim-Subscription-Key": "d4200ef51ed143d29345415ba54ad725"
            },
            method: "POST",
            data: '{"url": ' + '"' + image + '"}'
        }).then(function(res){
            app.processRes(res);
        });
    } else {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (e) {
            if (4 == this.readyState) {
                app.processRes(xhr.response);
            }
        }
        xhr.open('POST', endpoint, true);
        xhr.responseType = 'json';
        xhr.setRequestHeader('Content-Type', 'application/octet-stream');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Ocp-Apim-Subscription-Key', 'd4200ef51ed143d29345415ba54ad725');
        xhr.send(image);
    }
};

//██████████ PROCESS RES FROM API ██████████
app.processRes = function(res) {
    // verify res only had one face submitted to it
    if (res.length === 1) {
        const person1 = res[0];
        app.processEmotions(person1);
        app.processAppearance(person1);
    // error handling: res detected more than once face
    } else if (res.length > 1) {
        $(".userEmoji p").html(app.emojis.error[Math.floor(Math.random() * app.emojis.error.length)]);
        $('h2').text(`Error, please upload an image with a single face in it`);
    // error handling: res couldn't detect a face.
    } else {
        $(".userEmoji p").html(app.emojis.error[Math.floor(Math.random() * app.emojis.error.length)]);
        $('h2').text(`Error, could not recognize your face`);
    }
}

//██████████ PROCESS EMOTION DATA ██████████
app.processEmotions = function(person) {
    const emotionObj = person.faceAttributes.emotion;
    const emotionArr = Object.values(emotionObj);
    const emotionMaxValue = Math.max.apply(Math, emotionArr);

    for(emotion in emotionObj){
        if (emotionObj[emotion] === emotionMaxValue) {
            return app.selectEmoji(emotion, emotionMaxValue);
        }  
    }
};

//██████████ PROCESS APPEARANCE DATA ██████████
app.processAppearance = function(person) {
    let age = person.faceAttributes.age;
    let glasses = "";
    let bald = false;
    let hairValArr = [];
    let hairColor = "";
    const makeup = person.faceAttributes.makeup;

    if (person.faceAttributes.glasses !== "NoGlasses"){
        glasses = person.faceAttributes.glasses;
    }
    if (person.faceAttributes.hair.bald > 0.5){
        bald = true;
    }
    
    for(value in person.faceAttributes.hair.hairColor){
        hairValArr.push(person.faceAttributes.hair.hairColor[value].confidence);
    }
    let hairMaxValue = Math.max.apply(Math, hairValArr);

    for (val in person.faceAttributes.hair.hairColor) {
        if (person.faceAttributes.hair.hairColor[val].confidence === hairMaxValue) {
            hairColor = person.faceAttributes.hair.hairColor[val].color
        }
    }
    app.populateUserAppearance(age, glasses, bald, hairColor, makeup);
}

//██████████ SELECT EMOJI FROM DATA ██████████
app.selectEmoji = function(emotion, val) {
    // entire array of emotionMaxValue
    const emotionArr = app["emojis"][emotion];
    // emojiIndex = index number of emoji we want to display
    const emojiIndex = Math.round((app["emojis"][emotion].length -1) * val);
    // actual HTML code for emoji we want to display
    const emojiCode = emotionArr[2];
    app.displayEmoji(emojiCode);
}
//██████████ INSERT DATA ██████████
app.displayEmoji = function(emojiCode) {
    $(".userEmoji p").html(emojiCode);
    $('h2').text(`You've got a lot of ${emotion} in you.`);
}

//██████████ EMOJI RANGE ██████████
app.emojis = {
    anger: ['&#x01F623;', '&#x01F620;', '&#x01F624;', '&#x01F621;', '&#x01F92C;', '&#x01F608;', '&#x01F47F;', '&#x01F479;'],
    contempt: ['&#x01F644;', '&#x01F928;', '&#x01F612;'],
    disgust: ['&#x01F62C;', '&#x01F922;', '&#x01F92E;'],
    fear: ['&#x01F61F;', '&#x01F633;', '&#x01F627;', '&#x01F628;', '&#x01F628;', '&#x01F630;', '&#x01F631;'],
    happiness: ['&#x01F642;', '&#x01F60A;', '&#x01F600;', '&#x01F604;', '&#x01F601;', '&#x01F929;'],
    neutral: ['&#x01F610;', '&#x01F611;', '&#x01F636;'],
    sadness: ['&#x01F614;', '&#x01F613;', '&#x01F622;', '&#x01F625;', '&#x01F62D;'],
    surprise: ['&#x01F62F;', '&#x01F62E;', '&#x01F632;', '&#x01F635;', '&#x01F92F;'],
    error: ['&#x01F468;&#x01F3FE;&#x200D;&#x01F4BB;', '&#x01F423;', '&#x01F439;', '&#x01F926;&#x01F3FB;', '&#x01F47D;']
}

//██████████ POPULATE .userAppearance SECTION ██████████
app.populateUserAppearance = function(age, glasses, bald, hairColor, makeup){
    $('.userAppearance ul').append(`<li><span>Approximate age:</span> ${age} years old.</li>`);
    if(glasses){
        $('.userAppearance ul').append(`<li><span>Glasses:</span> ${glasses}</li>`);
    }
    if(bald){
        $('.userAppearance ul').append(`<li><span>You're bald!</span></li>`);
    } else {
    $('.userAppearance ul').append(`<li><span>Hair color:</span> ${hairColor}</li>`);
    }
    
    if(makeup.eyeMakeup || makeup.lipMakup){
        if(makeup.eyeMakup){
            $('.userAppearance ul').append(`<li><span>You're wearing eye makeup!</span></li>`);
        } else {
            $('.userAppearance ul').append(`<li><span>You're wearing lip makeup!</span></li>`);
        }
    } 
}

//██████████ DISPLAY FILE UPLOAD IMAGE ██████████
// heavily influenced by: https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
app.displayImg = function() {
    const file = document.querySelector('input[type=file]').files[0];
    const reader = new FileReader();

    reader.addEventListener('load', function() {
        $('#imgDisplay').attr('src', reader.result);
    }, false);
    if(file){
        reader.readAsDataURL(file);
    }
}

//██████████ EVENT LISTENERS ██████████
app.eventListeners = function(){
    // === url upload listener ===
    $(".inputSubmit").on("click", function() {
        // empty .userAppearance list
        $('.userAppearance ul').empty();
        // grab url
        const userURL = $(".inputImage").val();
        // display url img
        $('.imageInput').attr("src", userURL);
        // make API call
        app.getFaceData(userURL);
    });

    // === file upload listener
    $('.inputFile').on('change', function (e) {
        // empty .userAppearance list
        $('.userAppearance ul').empty();
        // extract file to send to API
        let userFile = this.files[0];
        const formData = new FormData();
        formData.append("userFile", userFile);
        // make API call
        app.getFaceData(userFile);
        // display image on screen
        app.displayImg();
    });
}
//██████████ INIT SETUP ██████████
app.init = function(){
    app.eventListeners();
}
//██████████ INITIALIZE ██████████
$(function(){
  app.init();
});
