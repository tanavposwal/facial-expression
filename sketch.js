let capture;
let capturewidth = 850;
let captureheight = 480;

let emotions = ["neutral", "happy", "sad", "angry", "fearful", "disgusted", "surprised"];

let faceapi;
let detections = [];

function setup() {
    createCanvas(capturewidth, captureheight);

    capture = createCapture(VIDEO);
    capture.position(0, 0);

    capture.hide();

    const faceOptions = { withLandmarks: true, withExpressions: true, withDescriptors: false };

    faceapi = ml5.faceApi(capture, faceOptions, faceReady);

}

function faceReady() {
    faceapi.detect(gotFaces);
}

function gotFaces(error, result) {
    if (error) {
        console.log(error);
        return
    }
    detections = result;
    faceapi.detect(gotFaces);
    // console.log(detections);
}


function draw() {

    background(255);
    image(capture, 210, 0, 640, height);

    capture.loadPixels();

    push();
    fill('green');
    if (detections.length > 0) {
        for (i = 0; i < detections.length; i++) {
            var points = detections[i].landmarks.positions;

            for (j = 0; j < points.length; j++) {
                circle(210+points[j]._x, points[j]._y, 5);
            }

            var neutralLevel = detections[i].expressions.neutral;
            var happyLevel = detections[i].expressions.happy;
            var sadLevel = detections[i].expressions.sad;
            var angryLevel = detections[i].expressions.angry;
            var fearfulLevel = detections[i].expressions.fearful;
            var disgustedLevel = detections[i].expressions.disgusted;
            var surprisedLevel = detections[i].expressions.surprised;

            push();

            for (k = 0; k < emotions.length; k++) {

                var thisemotion = emotions[k];

                var thisemotionlevel = detections[i].expressions[thisemotion];

                text(thisemotion, 40, 28 + 30 * k);

                rect(40, 30 + 30 * k, thisemotionlevel * 100, 10);

            }

        }
    }
    pop();

}