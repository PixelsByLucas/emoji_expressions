//██████████ APP SETUP ██████████
const app = {};
//██████████ SETUP API ██████████
app.setup = function() {
    //IMAGE TO POST
    const sourceImageUrl = $(".inputImage").val();
    const requests = [];
    //API CALL
$.ajax({
        url: "https://eastus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,smile,facialHair,glasses,emotion,hair,makeup",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Ocp-Apim-Subscription-Key": "d4200ef51ed143d29345415ba54ad725"
        },
        method: "POST",
        data: '{"url": ' + '"' + sourceImageUrl + '"}', //TODO: TEMPLATE LITERAL THIS
    }).then(function(res){
        console.log(res);
    });
    console.log("API CALLED");
    console.log(sourceImageUrl);
}
$(".inputSubmit").on("click", app.setup);
//██████████ EMOJI DATA ██████████
app.emojis = function() {
    const emoji = {
        'happy': 'INPUT HAPPY EMOJI HERE',
        'happy': 'INPUT HAPPY EMOJI HERE',
        'happy': 'INPUT HAPPY EMOJI HERE',
        'happy': 'INPUT HAPPY EMOJI HERE'
    }
}
//██████████ INIT SETUP ██████████
//██████████ INIT SETUP ██████████
app.init = function(){
    app.setup();
    app.emojis();
}
//██████████ INITIALIZE ██████████
$(function(){
  app.init();
});