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
//██████████ PROCESS EMOTION DATA ██████████
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
    $('h2').text(`You're looking pretty ${emotion}.`);
}
//██████████ EMOJI RANGE ██████████
app.emojis = {
    anger: ['&#x01F479;', '&#x01F47F;', '&#x01F608;', '&#x01F92C;', '&#x01F621;', '&#x01F624;', 
            '&#x01F620;', '&#x01F623;'],
    contempt: ['&#x01F612;', '&#x01F928;', '&#x01F644;'],
    disgust: ['&#x01F92E;', '&#x01F922;', '&#x01F62C;'],
    fear: ['&#x01F631;', '&#x01F630;', '&#x01F628;', '&#x01F627;', '&#x01F633;', '&#x01F61F;'],
    happiness: ['&#x01F929;', '&#x01F601;', '&#x01F604;', '&#x01F600;', '&#x01F60A;', '&#x01F642;'],
    neutral: ['&#x01F636;', '&#x01F611;', '&#x01F610;'],
    sadness: ['&#x01F62D;', '&#x01F625;', '&#x01F622;', '&#x01F613;', '&#x01F614;'],
    surprise: ['&#x01F92F;', '&#x01F635;', '&#x01F632;', '&#x01F62E;', '&#x01F62F;']
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