//██████████ APP SETUP ██████████
const app = {};
//██████████ SETUP API ██████████

app.getFaceData = function() {
    //API CALL
    $.ajax({
        url: "https://eastus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=ptrue&returnFaceLandmarks=false&returnFaceAttributes=age,gender,smile,facialHair,glasses,emotion,hair,makeup",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Ocp-Apim-Subscription-Key": "d4200ef51ed143d29345415ba54ad725"
        },
        method: "POST",
        data: '{"url": ' + '"' + app.imgUrl + '"}' //TODO: TEMPLATE LITERAL THIS
    }).then(function(res){
        if(res.length <= 1) {
            const person1 = res[0];
            app.processEmotions(person1);
        }
    });
}

app.processEmotions = function(person) {
    const emotionObj = person.faceAttributes.emotion;
    const emotionArr = Object.values(emotionObj);
    const emotionMaxValue = Math.max.apply(Math, emotionArr);
    // console.log(emotionMaxValue);

    for(emotion in emotionObj){
        if (emotionObj[emotion] === emotionMaxValue) {
            return app.selectEmoji(emotion, emotionMaxValue);
        } else {
            // TODO: handle the error
        }  
    }
};

app.selectEmoji = function(emotion, val) {
    // entire array of emotionMaxValue
    const emotionArr = app["emojis"][emotion];
    // emojiIndex = index number of emoji we want to display
    const emojiIndex = Math.round((app["emojis"][emotion].length -1) * val);
    // actual HTML code for emoji we want to display
    const emojiCode = emotionArr[2];

    app.displayEmoji(emojiCode)
}

app.displayEmoji = function(emojiCode) {
    $(".emoji p").html(emojiCode);
}


//██████████ EMOJI DATA ██████████
// app.emojis = {
//     anger:		[👹,👿,😈,🤬,😡,😤,😠,😣],
//     contempt:	[😒,🤨,🙄],
//     disgust:	    [🤮,🤢,😬],
//     fear:		[😱,😰,😨,😧,😳,😟],
//     happiness: 	[🤩,😁,😄,😀,😊,🙂],
//     neutral:	    [😶,😑,😐],
//     sadness:     [😭,😥,😢,😓,😔],
//     surprise:    [🤯,😵,😲,😮,😯]

// % x emotion.length Math.floor()
// }

app.emojis = {
    anger: ['&#x01F623;', '&#x01F620;', '&#x01F624;', '&#x01F621;', '&#x01F92C;', '&#x01F608;', '&#x01F47F;', '&#x01F479;'],
    contempt: ['&#x01F644;', '&#x01F928;', '&#x01F612;'],
    disgust: ['&#x01F62C;', '&#x01F922;', '&#x01F92E;'],
    fear: ['&#x01F61F;', '&#x01F633;', '&#x01F627;', '&#x01F628;', '&#x01F628;', '&#x01F630;', '&#x01F631;'],
    happiness: ['&#x01F642;', '&#x01F60A;', '&#x01F600;', '&#x01F604;', '&#x01F601;', '&#x01F929;'],
    neutral: ['&#x01F610;', '&#x01F611;', '&#x01F636;'],
    sadness: ['&#x01F614;', '&#x01F613;', '&#x01F622;', '&#x01F625;', '&#x01F62D;'],
    surprise: ['&#x01F62F;', '&#x01F62E;', '&#x01F632;', '&#x01F635;', '&#x01F92F;']
}

//██████████ EVENT LISTENINGERS ██████████
app.eventListeners = function(){

    $(".inputSubmit").on("click", function() {
        app.imgUrl = $(".inputImage").val();
        $('.imageInput').attr("src", app.imgUrl);
        app.getFaceData();
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









    

