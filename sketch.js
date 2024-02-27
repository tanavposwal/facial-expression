let video;
let faceapi;
let detections;

let cocossd; // Replace with your desired object detection model


function setup() {
    createCanvas(640, 480); // Adjust dimensions as needed
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide(); // Hide the video element

    cocossd = loadModel('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd/dist/uncompressed/mobilenet_v2/model.json');
    faceapi = ml5.faceApi(video, {
        withLandmarks: true, // For expression detection
        withDescriptors: true, // Not strictly needed for this
        withAgeAndGender: true
    }, modelReady);
}

async function detectObjects() {
    const predictions = await cocossd.detect(video);
    draw(predictions);
    setTimeout(detectObjects, 100); // Call again after 100ms for continuous detection
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
            console.log(face)

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
            text(`Expression: ${face.expressions.asSortedArray()[0].expression}`, face.alignedRect._box._x, face.alignedRect._box._y - 20);
            
        }
    }
}