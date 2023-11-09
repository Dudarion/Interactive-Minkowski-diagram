const canvas = document.getElementById('minkowski');
const ctx = canvas.getContext('2d');

running_cat = new Image();
running_cat.src = 'running_cat_small.png';
sleeping_cat = new Image();
sleeping_cat.src = 'sleeping_small.png';

let HEIGHT = Math.min(window.innerHeight, window.innerWidth) * 0.9;

// Set canvas size
function resizeCanvas() {
    HEIGHT = Math.min(window.innerHeight, window.innerWidth) * 0.9;
    canvas.width = HEIGHT;
    canvas.height = HEIGHT;
    console.log(HEIGHT);
    // canvas.moveTo(window.innerHeight/2, window.innerHeight/2)
    drawMinkowski(); // Draw the diagram after resizing
}

let horizontalScale = 1;
let objectSpeed = 0; // as a fraction of the speed of light
let spacing = canvas.height / 20;


function drawMinkowski() {

    // Clear and reset the transform to avoid scaling on each draw
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    HEIGHT = Math.min(window.innerHeight, window.innerWidth) * 0.9;

    // Rectangle
    // ctx.rect(canvas.width/2 - (canvas.height/2)*0.9, canvas.height/2 - (canvas.height/2)*0.9, HEIGHT, HEIGHT);

    spacing = canvas.height / 20;

    // Grid
    drawGrid();

    // Time-like and space-like hyperbolas
    drawHyperbolas();
    console.log('Start');
    console.log(HEIGHT);

    // Light cones
    ctx.strokeStyle = 'orange';
    ctx.lineWidth = 3;
    ctx.beginPath();
    MT(-canvas.height / 2, -canvas.height / 2); LT(canvas.height / 2, canvas.height / 2);
    MT(-canvas.height / 2, canvas.height / 2); LT(canvas.height / 2, -canvas.height / 2);
    ctx.stroke();

    draw_cat(0, 0, true);
    draw_cat(150, 150, false);

    // Worldline of the object
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    MT(0, 0); LT(500, -500*objectSpeed);
    ctx.stroke();

    // Horizontal and vertical axes
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.beginPath();
    MT(-canvas.height / 2, 0);
    LT(canvas.height / 2, 0);
    // MT(0, -canvas.height/2);
    // LT(0, canvas.height/2);
    ctx.stroke();

    // Rectangle
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, HEIGHT, HEIGHT);
    ctx.stroke();
}

// Call resizeCanvas initially to ensure proper sizing
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // This ensures the canvas is sized before the first draw

// Scaling
const scaleSlider = document.getElementById('scaleSlider');
const scaleValue = document.getElementById('scaleValue');
scaleSlider.oninput = function() {
    horizontalScale = ((parseFloat(this.value)-1) ** 5 / 10000000) + 1;
    scaleValue.textContent = this.value;
    drawMinkowski();
};

// Object Speed
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');
speedSlider.oninput = function() {
    objectSpeed = parseFloat(this.value);
    speedValue.textContent = this.value;
    drawMinkowski();
};




function MT(x, y){
    ctx.moveTo(canvas.width / 2 + x*horizontalScale, canvas.height/2 - y);
}
function LT(x, y){
    ctx.lineTo(canvas.width / 2 + x*horizontalScale, canvas.height/2 - y);
}

function drawGrid(){
    // Draw grid
    ctx.beginPath();
    ctx.strokeStyle = '#ccc'; // Light grey for the grid lines
    ctx.lineWidth = 2;

    // Vertical grid lines
    for (let x = 0; x < canvas.height/2; x += spacing) {
        MT(x, -canvas.height/2);
        LT(x, canvas.height/2);
        MT(-x, -canvas.height/2);
        LT(-x, canvas.height/2);
    }

    // Horizontal grid lines
    for (let y = 0; y < canvas.height; y += spacing) {
        MT(-canvas.height / 2, y);
        LT(canvas.height / 2, y);
        MT(-canvas.height / 2, -y);
        LT(canvas.height / 2, -y);
    }

    ctx.stroke();
}

function drawHyperbolas() {
    let maxRange = canvas.height/(2*horizontalScale);
    // Set styles for hyperbolas
    ctx.strokeStyle = 'blue'; // Green for time-like hyperbolas
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    
  
    // Time-like hyperbolas (ct)^2 - x^2 = a^2
    for (let a = spacing; a < canvas.height; a += spacing) {
        ctx.beginPath(); // upper
        MT(-maxRange, Math.sqrt(maxRange * maxRange + a * a));
        for (let x = -maxRange; x <= maxRange; x += 1) {
            LT((x + 1), Math.sqrt((x + 1) * (x + 1) + a * a));
        }
        ctx.stroke();

        ctx.beginPath(); // lower
        MT(-maxRange, -Math.sqrt(maxRange * maxRange + a * a));
        for (let x = -maxRange; x <= maxRange; x += 1) {
            LT((x + 1), -Math.sqrt((x + 1) * (x + 1) + a * a));
        }
        ctx.stroke();
    }
  
    // Space-like hyperbolas x^2 - (ct)^2 = a^2
    let started = false
    for (let a = spacing; a < canvas.height; a += spacing) {
        ctx.beginPath(); // right
        for (let ct = -maxRange; ct <= maxRange; ct += 1) {
            let x = Math.sqrt((ct + 1) * (ct + 1) + a * a)
            if(x < maxRange) {
                if (!started) {
                    MT(x, -(ct + 1) );
                    started = true;
                }
                else LT(x, -(ct + 1) );
            }
        }
        ctx.stroke();

        ctx.beginPath(); // left
        for (let ct = -maxRange; ct <= maxRange; ct += 1) {
            let x = Math.sqrt((ct + 1) * (ct + 1) + a * a)
            if(x < maxRange) {
                if (!started) {
                    MT(-x, -(ct + 1) );
                    started = true;
                }
                else LT(-x, -(ct + 1) );
            }
        }
        ctx.stroke();
    }
    

    ctx.setLineDash([]);
}
  


function draw_cat(x, y, sleeping)
{
    nex_x = canvas.width / 2 + x*horizontalScale*spacing/50;
    new_y = canvas.height/2 - y*spacing / 50;
    
    if(sleeping){
        ctx.drawImage(sleeping_cat, nex_x, new_y);
        sleeping_cat.onload = function () { 
            ctx.drawImage(sleeping_cat, nex_x, new_y);
        }
    }
    else{
        ctx.drawImage(running_cat, nex_x, new_y);
        running_cat.onload = function () { 
            ctx.drawImage(running_cat, nex_x, new_y);
        }
    }
}






// Select the container where the sliders will be added
const container = document.getElementById('slider-container');

// Function to create a slider with a label
function createSliderWithLabel(id, labelText) {
  // Create a div to hold the slider and label
  const sliderDiv = document.createElement('div');
  sliderDiv.classList.add('slider-group');
  
  // Create the label
  const label = document.createElement('label');
  label.htmlFor = id;
  label.textContent = labelText;
  sliderDiv.appendChild(label);
  
  // Create the slider
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.id = id;
  slider.name = id;
  slider.value = 0; // Default value
  // Set any attributes for the slider as needed
  slider.setAttribute('min', '0');
  slider.setAttribute('max', '100');
  slider.setAttribute('step', '1');
  sliderDiv.appendChild(slider);

  // Append the div to the container
  container.appendChild(sliderDiv);
}

// Function to add text between sliders
function addTextBetweenSliders(text) {
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  container.appendChild(paragraph);
}

// Create the first slider
createSliderWithLabel('first-slider', 'First Slider:');

// Add text between the first and second slider
addTextBetweenSliders('Adjust the parameters as needed.');

// Create the second slider
createSliderWithLabel('second-slider', 'Second Slider:');
