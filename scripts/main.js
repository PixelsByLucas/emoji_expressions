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
            return app.selectEmoji(emotion, emotionMaxValue, "👹");
        } else {
            // TODO: handle the error
        }  
    }
};

app.selectEmoji = function(emotion, val, emoji) {
    console.log(emotion, val);
    console.log(emoji);
    for(emoji in app.emojis){
        console.log(emoji);
    }
}


//██████████ EMOJI DATA ██████████
// app.emojis = {
//     anger:		[👹,👿,😈,🤬,😡,😤,😠,😣],
//     contempt:	[😒,🤨,🙄],
//     disgust:	[🤮,🤢,😬],
//     fear:		[😱,😰,😨,😧,😳,😟],
//     happiness: 	[🤩,😁,😄,😀,😊],
//     neutral:	[😑,😐,😶],
//     sadness:    [😭,😥,😢,😓,😔],
//     surprise:   [🤯,😵,😲,😮,😯]
// }

app.emojis = {
    // Have to recreate the above in unicode down here.
}





//██████████ EVENT LISTENINGERS ██████████
app.eventListeners = function(){

    $(".inputSubmit").on("click", function() {
        app.imgUrl = $(".inputImage").val();
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