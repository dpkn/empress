let impressionist,
    expressionist;

window.onload = function() {
    const canvas = document.getElementById('canvas');
    const webcam = document.getElementById('webcam');
    const emoji = document.getElementById('emoji');

    expressionist = new Expressionist(canvas);
    impressionist = new Impressionist(webcam, emoji, expressionist, detectCallback);
}

// Saves the canvas to a .png file and downloads it
// A <a> element is created because there is no other simple way to
// save a file _with_ custom filename 
function saveCanvas() {
    let link = document.createElement('a');
    let uri = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');

    // If the browser support the download attribute
    if (typeof link.download === 'string') {
        link.download = 'Empress.png';
        link.href = uri;

        // Simulate click on link
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        window.open(uri);
    }
}

// Below follow hacky functions for the onboarding process
// TO-DO: make this make more sense
let button = document.getElementById('theButton')
button.addEventListener('click', () => { clickButton() });

let expressed = [];
let finished = false;

function clickButton() {
    if (!finished) {
        impressionist.requestUserMedia(webcam)
        button.innerHTML = 'TRY TO MAKE ALL FACES'
        button.disabled = true;
    } else {
        let modal = document.getElementById('intro-modal')
        modal.remove();
    }
}

function detectCallback(emotion) {
    if (!finished) {
        document.getElementById(emotion).classList.add('expressed');
        if (!expressed.includes(emotion))
            expressed.push(emotion)

        if (expressed.length >= 4) {
            console.log('finished')
            finished = true;
            button.innerHTML = 'CLICK TO START DRAWING'
            button.disabled = false;
        }
    }
}