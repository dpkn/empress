class Expressionist{
  constructor(canvasEl){
    this.canvasEl = canvasEl;
    paper.setup(canvasEl);

    this.pencil = new paper.Tool();
    this.pencil.minDistance = 10;
    this.pencil.maxDistance = 45;
    
    this.mood = 'neutral';

    // this atrocious way of registering callbacks is so that the
    // this. inside the callbacks reference to the class instance    
		this.pencil.onMouseDown = (event) => {this.mouseDown(event)};
		this.pencil.onMouseDrag = (event) => {this.mouseDrag(event)};
    this.pencil.onMouseUp = (event) => {this.mouseUp(event)};

    this.strokeTicker = 0;
    this.mouseDownTicker = 0

    this.colors = {'neutral':'black','angry':'red','sad':'blue','surprised':'yellow'}
    this.moods = {
      neutral:{
        color:'black',
        strokeTickFactor:3
      },
      angry:{
        color:'red',
        strokeTickFactor:5
      },
      sad:{
        color:'blue',
        strokeTickFactor:0.5
      },
      surprised:{
        color:'yellow',
        strokeTickFactor:10
      }
    }
  }

  mouseDown(event){
    this.path = new paper.Path();
    this.path.fillColor = this.moods[this.mood].color;

    this.path.add(event.point);
    this.strokeTicker = 0;
    this.mouseDownTicker = 0;
    this.passedTicker = false;
  }

  mouseDrag(event){

    let drunkOffset = 0 //(1 + Math.sin(this.strokeTicker - .5*Math.PI))*100;
    let step = event.delta;
    step.angle += 90;
    step.length = this.startStroke(20)

    var top = event.middlePoint.add(step).add(drunkOffset,0);
    var bottom = event.middlePoint.subtract(step).add(drunkOffset,0);
    
    this.path.add(top);
    this.path.insert(0, bottom);
    this.path.smooth();
    this.strokeTicker+=1;
    this.mouseDownTicker+=1;

    if(this.strokeTicker>50){
      this.path.add(event.point);
      this.path.closed = true;
      this.path.smooth();
      console.log('newpath')

      this.path = new paper.Path();
      this.path.add(event.point);
      this.path.fillColor = this.moods[this.mood].color;
      this.strokeTicker = 0;
    }
  }

  mouseUp(event){
    this.path.add(event.point);
    this.path.closed = true;
    this.path.smooth();
  }

  startStroke(width){
    let stroke = Math.round(this.mouseDownTicker*this.moods[this.mood].strokeTickFactor)//(1+ Math.sin(this.path.length/40 - .5*Math.PI))*width
    if(stroke < 1){
      stroke = 1;
    }
    return stroke >= width ? width : stroke;
    
  }
}