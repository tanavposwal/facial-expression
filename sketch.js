let video;
let faceapi;
let detections;

function setup() {
    createCanvas(640, 480); // Adjust dimensions as needed
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide(); // Hide the video element

    faceapi = ml5.faceApi(video, {
        withLandmarks: true, // For expression detection
        withDescriptors: true, // Not strictly needed for this
        withAgeAndGender: true
    }, modelReady);
}

function modelReady() {
    console.log('Model loaded!');
    detectFaces(); // Start detection
}

function detectFaces() {
    faceapi.detect(gotResults);
}

function gotResults(err, results) {
    if (err) {
        console.error(err);
        return;
    }
    detections = results;
    draw();
    detectFaces(); // Keep detecting
}

function draw() {
    image(video, 0, 0); // Draw the video

    if (detections) {
        for (let i = 0; i < detections.length; i++) {
            const face = detections[i];
            
            // Draw a box around the face
            noFill();
            strokeWeight(3)
            stroke(161, 95, 251);
            rect(face.alignedRect._box._x, face.alignedRect._box._y, face.alignedRect._box._width, face.alignedRect._box._height);

            // Display information
            textSize(16);
            textAlign(LEFT);
            noStroke()
            fill(161, 95, 251);
            let expsn = face.expressions.asSortedArray()[0]
            text(`Expression: ${expsn.expression}`, face.alignedRect._box._x, face.alignedRect._box._y - 20);
            text(`Probability: ${Math.ceil(expsn.probability*10)}`, face.alignedRect._box._x, face.alignedRect._box._y - 5);
            
        }
    }
}