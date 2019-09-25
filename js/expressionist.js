// This class contains all the Expressionist parts of the application:
// Managing Paper.js, the canvas and the mousetool. 
class Expressionist {
    constructor(canvasEl) {

        // Initialize paper.js
        this.canvasEl = canvasEl;
        paper.setup(canvasEl);

        // Create the mouse tool 
        this.pencil = new paper.Tool();
        this.pencil.minDistance = 5;
        this.pencil.maxDistance = 30;

        // This atrocious way of registering callbacks is so that the
        // this. inside the callbacks references to the class instance    
        this.pencil.onMouseDown = (event) => { this.mouseDown(event) };
        this.pencil.onMouseDrag = (event) => { this.mouseDrag(event) };
        this.pencil.onMouseUp = (event) => { this.mouseUp(event) };

        this.strokeTicker = 0;
        this.mood = 'neutral';
        this.audioLevel = 0;

        // Brush style settings for each detectable mood
        this.moods = {
            neutral: {
                color: 'black',
                strokeHead: 3,
                strokeLength: 5,
                volumeFactor: 50,
                baseSize: 5,
                smoothPath: true
            },
            angry: {
                color: 'red',
                strokeHead: 1,
                strokeLength: 4,
                volumeFactor: 100,
                baseSize: 8,
                smoothPath: false
            },
            sad: {
                color: 'blue',
                strokeHead: 0.5,
                strokeLength: 10,
                volumeFactor: 90,
                baseSize: 2,
                smoothPath: true
            },
            surprised: {
                color: 'yellow',
                strokeHead: 2,
                strokeLength: 6,
                volumeFactor: 90,
                baseSize: 10,
                smoothPath: false
            }
        }
    }

    // Start a new path on mouseDown
    mouseDown(event) {
        this.path = new paper.Path();
        this.path.fillColor = this.moods[this.mood].color;
        this.path.add(event.point);

        // Reset strokeTicker
        this.strokeTicker = 0;
    }

    // Close and smooth the path on mouseUp
    mouseUp(event) {
        this.path.add(event.point);
        this.path.closed = true;

        if (this.mood != 'angry')
            this.path.smooth();

        // Simplify to make it a bit more efficient
        this.path.simplify();
    }

    // Extend path on mouseDrag
    mouseDrag(event) {
        // The position of the mouse is used as the midpoint of the path
        let step = event.delta;
        step.angle += 90;
        step.length = this.calculateBrushSize();

        let right = event.middlePoint.add(step);
        let left = event.middlePoint.subtract(step);
        this.path.add(right);
        this.path.insert(0, left);

        if (this.mood != 'angry')
            this.path.smooth();

        this.strokeTicker++;

        // If the path reaches the maximum length as defined in its mood
        // settings, close it off and start a new one.
        if (this.strokeTicker > this.moods[this.mood].strokeLength) {
            this.mouseUp(event)
            this.mouseDown(event)
        }

    }

    calculateBrushSize() {
        let maxWidth = this.moods[this.mood].baseSize + this.audioLevel * this.moods[this.mood].volumeFactor

        // 
        let stroke = Math.round((maxWidth / this.moods[this.mood].strokeHead) * this.strokeTicker);

        if (stroke < 1)
            stroke = 1;

        return stroke >= maxWidth ? maxWidth : stroke;

    }
}