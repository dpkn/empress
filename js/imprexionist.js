let impressionist,
expressionist;

window.onload = function() {
    const canvas = document.getElementById('canvas');
    const webcam = document.getElementById("webcam");
    const emoji = document.getElementById("emoji");

    expressionist = new Expressionist(canvas);
   // impressionist = new Impressionist(webcam,emoji,expressionist);
}

// Temporary hack for initializing after first click
let clicked = false
window.onclick = ()=>{
if(!clicked){
    clicked = true;
    impressionist.requestUserMedia(webcam);
}
};
