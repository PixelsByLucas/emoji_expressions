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
        data: '{"url": ' + '"' + app.imgUrl + '"}', //TODO: TEMPLATE LITERAL THIS
    }).then(function(res){
        if(res.length <= 1) {
            const person1 = res[0];
            console.log(person1);
            app.processEmotions(person1);
        }
    });
}

app.processEmotions = function(person) {
    const emotions = person.faceAttributes.emotion;
    console.log(emotions);

}

//██████████ EMOJI DATA ██████████
app.emojis = function() {
    const emoji = {
        'happy': 'INPUT HAPPY EMOJI HERE',
        'happy': 'INPUT HAPPY EMOJI HERE',
        'happy': 'INPUT HAPPY EMOJI HERE',
        'happy': 'INPUT HAPPY EMOJI HERE'
    }
}

app.eventListeners = function(){

    $(".inputSubmit").on("click", function() {
        app.imgUrl = $(".inputImage").val();
        app.getFaceData();
    });

    
}

//██████████ INIT SETUP ██████████
//██████████ INIT SETUP ██████████
app.init = function(){
    app.eventListeners();
    app.emojis();
}
//██████████ INITIALIZE ██████████
$(function(){
  app.init();
});