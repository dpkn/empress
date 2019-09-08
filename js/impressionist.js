class Impressionist {
  constructor(webcamEl,emojiEl,expressionist){
    this.webcamEl = webcamEl;
    this.emojiEl = emojiEl;
    this.expressionist = expressionist;

    this.loadModels();
  }

  requestUserMedia(webcamEl){
    navigator.mediaDevices.getUserMedia(

      { audio: true, video:{width:360, height:280 } }

    ).then((mediaStream)=> {

      // Pipe the video stream into the <video> webcam element 
      webcamEl.srcObject = mediaStream;

      // Create an audio context and pipe the audio into it
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      let mediaStreamSource = this.audioContext.createMediaStreamSource(mediaStream);
    
      // Instantiate Volume Meter and connect it to the Audio context 
      this.audioMeter = createAudioMeter(this.audioContext);
      mediaStreamSource.connect(this.audioMeter);

      // After the webcam has played, start the face detection loop
      webcamEl.addEventListener('play', ()=>{ console.log('webcam started playing'); 
        setInterval(()=>{this.getWebcamImpression()},500);
      });

    }).catch(error => console.error(error));
  }

  // loads all faceapi models 
  loadModels(){
    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models')
    ]).then(()=>console.log('loaded models'))
  }

 async getWebcamImpression(){
      const detections = await faceapi.detectAllFaces(this.webcamEl, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
      if(detections[0]){

          let emoji;
          let expression = detections[0].expressions.asSortedArray()[0].expression;
          switch(expression){
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
          this.expressionist.mood = expression ? expression : 'neutral';

          this.emojiEl.innerHTML = emoji;
          
      }else{
        this.emojiEl.innerHTML = '';
      }

  }
}