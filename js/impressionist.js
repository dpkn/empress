// This class handles the computer impressions:
// Loading and setting up face-api.js and audio-meter,
// as well as piping it to all the right places.
class Impressionist {
    constructor(webcamEl, emojiEl, expressionist, callback) {
        this.webcamEl = webcamEl;
        this.emojiEl = emojiEl;
        this.expressionist = expressionist;
        this.callback = callback;

        this.state = 0;
        this.faceDetected = false;

        this.loadModels();
    }

    // Loads all Faceapi models 
    loadModels() {
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('models'),
            faceapi.nets.faceExpressionNet.loadFromUri('models')
        ]).then(() => {
            this.state++;
        })
    }

    // Prompt the user for Webcam and Microphone access
    requestUserMedia(webcamEl) {
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: { width: 360, height: 280 } // Small video pls! 
        }).then((mediaStream) => {

            // Pipe the video stream into the <video> webcam element 
            webcamEl.srcObject = mediaStream;

            // Create an audio context and pipe the audio into it
            this.audioContext = new(window.AudioContext || window.webkitAudioContext)();
            let mediaStreamSource = this.audioContext.createMediaStreamSource(mediaStream);

            // Instantiate Volume Meter and connect it to the Audio context 
            this.audioMeter = createAudioMeter(this.audioContext);
            mediaStreamSource.connect(this.audioMeter);

            // After the webcam has started playing, start the face detection loop
            // and kick off the audio measurement loop
            webcamEl.addEventListener('play', () => {
                console.log('webcam started playing');
                setInterval(() => { this.getWebcamImpression() }, 500);
                this.measureAudio();
            });

            this.state++;

        }).catch(error => alert('Getting camera access failed: \n' + error));
    }

    // Measure audio as often as possible
    measureAudio() {
        this.expressionist.audioLevel = this.audioMeter.volume;
        requestAnimationFrame(() => { this.measureAudio() })
    }

    // Tries to find a face and facial expression
    async getWebcamImpression() {
        const detections = await faceapi.detectAllFaces(this.webcamEl, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions()

        if (detections[0]) {

            let emoji;

            // Get the facial expression with the highest certainty
            let expression = detections[0].expressions.asSortedArray()[0].expression;
            switch (expression) {
                case 'neutral':
                    emoji = '😐';
                    break;
                case 'angry':
                    emoji = '😡';
                    break;
                case 'sad':
                    emoji = '😔';
                    break;
                case 'surprised':
                    emoji = '😮';
                    break;
                default:
                    emoji = '😐';
                    expression = 'neutral';
                    break;
            }
            this.expressionist.mood = expression;

            this.callback(expression);

            this.emojiEl.innerHTML = emoji;

        } else {
            // No face! :(
            this.emojiEl.innerHTML = '';
        }

    }
}