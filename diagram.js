const canvas = document.getElementById('minkowski');
const ctx = canvas.getContext('2d');
const [running_cat, sleeping_cat] = init_cats();


let HEIGHT = Math.min(window.innerHeight, window.innerWidth) * 0.9;


let horizontalScale = 1;
let objectSpeed = 0; // as a fraction of the speed of light
let frameSpeed = 0;
let spacing = canvas.height / 20;

let scale_slider_id = createSliderWithHeader('slider-container', 'Scale', 1, 100, 1, 0.01, '', update);
let obj_slider_id = createSliderWithHeader('slider-container', 'Object speed', -0.99, 0.99, 0, 0.001, ' c', update);
let frame_speed_slider_id = createSliderWithHeader('slider-container', 'Frame speed', -0.99, 0.99, 0, 0.001, ' c', update);

// Call resizeCanvas initially to ensure proper sizing
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // This ensures the canvas is sized before the first draw

function update(){
    horizontalScale = ((parseFloat(sliders[scale_slider_id].value)-1) ** 5 / 10000000) + 1;
    objectSpeed = parseFloat(sliders[obj_slider_id].value);
    frameSpeed = parseFloat(sliders[frame_speed_slider_id].value);
    drawMinkowski();
}


// Set canvas size
function resizeCanvas() {
    HEIGHT = Math.min(window.innerHeight, window.innerWidth) * 0.9;
    canvas.width = HEIGHT;
    canvas.height = HEIGHT;
    console.log(HEIGHT);
    // canvas.moveTo(window.innerHeight/2, window.innerHeight/2)
    drawMinkowski(); 
}


function drawMinkowski() {

    // Clear and reset the transform to avoid scaling on each draw
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    HEIGHT = Math.min(window.innerHeight, window.innerWidth) * 0.9;
    spacing = canvas.height / 20;

    // Grid
    drawGrid();

    // Time-like and space-like hyperbolas
    drawHyperbolas();

    // Light cones
    drawLine([-canvas.height / 2, -canvas.height / 2], [canvas.height / 2, canvas.height / 2], 'orange', 3);
    drawLine([-canvas.height / 2, canvas.height / 2], [canvas.height / 2, -canvas.height / 2], 'orange', 3);

    // Horizontal and vertical axes
    drawLine([-canvas.height / 2, 0], [canvas.height / 2, 0], 'black', 3);

    // Rectangle
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, HEIGHT, HEIGHT);
    ctx.stroke();

    sum_speed = vel_addition(frameSpeed, -objectSpeed);
    sleeping = drawSegmentWithCats(ctx, [0, 0], [0, 10], 11, frameSpeed, 'red', sleeping = true);
    running = drawSegmentWithCats(ctx, [0, 0], [0, 10], 11, sum_speed, 'blue', sleeping = false);
}


function MT(x, y){ // in spacings (light seconds)
    ctx.moveTo(canvas.width / 2 + x*spacing*horizontalScale, canvas.height/2 - y*spacing);
}

function LT(x, y){ // in spacings (light seconds)
    ctx.lineTo(canvas.width / 2 + x*spacing*horizontalScale, canvas.height/2 - y*spacing);
}

function drawGrid(){
    // Draw grid
    ctx.beginPath();
    ctx.strokeStyle = '#ccc'; // Light grey for the grid lines
    ctx.lineWidth = 2;

    // Vertical grid lines
    for (let x = 0; x < 10; x += 1) {
        MT(x, -canvas.height/2);
        LT(x, canvas.height/2);
        MT(-x, -canvas.height/2);
        LT(-x, canvas.height/2);
    }

    // Horizontal grid lines
    for (let y = 0; y < 10; y += 1) {
        MT(-canvas.height / 2, y);
        LT(canvas.height / 2, y);
        MT(-canvas.height / 2, -y);
        LT(canvas.height / 2, -y);
    }

    ctx.stroke();
}

function drawHyperbolas() {
    let maxRange = 10/horizontalScale;
    // Set styles for hyperbolas
    ctx.strokeStyle = 'blue'; // Green for time-like hyperbolas
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    
  
    // Time-like hyperbolas (ct)^2 - x^2 = a^2
    for (let a = 1; a < 10; a += 1) {
        ctx.beginPath(); // upper
        MT(-maxRange, Math.sqrt(maxRange * maxRange + a * a));
        for (let x = -maxRange; x <= maxRange; x += 0.1) {
            LT((x + 1), Math.sqrt((x + 1) * (x + 1) + a * a));
        }
        ctx.stroke();

        ctx.beginPath(); // lower
        MT(-maxRange, -Math.sqrt(maxRange * maxRange + a * a));
        for (let x = -maxRange; x <= maxRange; x += 0.1) {
            LT((x + 1), -Math.sqrt((x + 1) * (x + 1) + a * a));
        }
        ctx.stroke();
    }
  
    // Space-like hyperbolas x^2 - (ct)^2 = a^2
    let started = false
    for (let a = 1; a < 10; a += 1) {
        ctx.beginPath(); // right
        for (let ct = -maxRange; ct <= maxRange; ct += 0.1) {
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
        for (let ct = -maxRange; ct <= maxRange; ct += 0.1) {
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

function drawLine(p1, p2, color, width){
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    MT(p1[0], p1[1]);
    LT(p2[0], p2[1]);
    ctx.stroke();
}
