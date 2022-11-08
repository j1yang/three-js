// import fs from './../node_modules/fs.realpath';
// import { SpeechConfig, SpeechRecognizer } from "./../node_modules/microsoft-cognitiveservices-speech-sdk";
// const speechConfig = sdk.SpeechConfig.fromSubscription(env.process.SPEECH_KEY, env.process.SPEECH_REGION);



const fs = require("fs");
const sdk = require("microsoft-cognitiveservices-speech-sdk");

const speechConfig = SpeechConfig.fromSubscription("e77190fafa854380bc05aa3b6ebeb52a", "eastus2");

const displayText = 'speak into your microphone...';
console.log(displayText)
let audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
let recognizer = new SpeechRecognizer(speechConfig, audioConfig);
console.log('hi')


recognizer.recognizeOnceAsync(result => {
if (result.reason === ResultReason.RecognizedSpeech) {
    displayText = `RECOGNIZED: Text=${result.text}`
} else {
    displayText = 'ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.';
}
    console.log(displayText)
});