const canvas = document.getElementById('minkowski');
const ctx = canvas.getContext('2d');
const [running_cat, sleeping_cat] = init_cats();


let HEIGHT = Math.min(window.innerHeight, window.innerWidth) * 0.9;


let horizontalScale = 1;
let objectSpeed = 0; // as a fraction of the speed of light
let frameSpeed = 0;
let triangleChecked = false;
let zoomChecked = false;
let spacing = canvas.height / 20;

let MODE = 1;

// createButtons('slider-container');
let scale_slider_id = createSliderWithHeader('slider-container', 'Scale', 1, 100, 1, 0.01, '', update);
let obj_slider_id = createSliderWithHeader('slider-container', 'Object speed', -0.99, 0.99, 0.5, 0.01, ' c', update);
let frame_speed_slider_id = createSliderWithHeader('slider-container', 'Frame speed', -0.99, 0.99, 0, 0.01, ' c', update);
let triangle_checkbox = addCheckbox('slider-container', " Triangle", 1, update);
let zoom_checkbox = addCheckbox('slider-container', " Zoom", 2, update);

// Call resizeCanvas initially to ensure proper sizing
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // This ensures the canvas is sized before the first draw


function update(){
    horizontalScale = ((parseFloat(sliders[scale_slider_id].value)-1) ** 5 / 10000000) + 1;
    objectSpeed = parseFloat(sliders[obj_slider_id].value);
    frameSpeed = parseFloat(sliders[frame_speed_slider_id].value);

    
    if(Math.abs(objectSpeed) < 0.05) objectSpeed = 0;

    triangleChecked = triangle_checkbox.checked;
    zoomChecked = zoom_checkbox.checked;

    drawMinkowski();
}


// Set canvas size
function resizeCanvas() {
    HEIGHT = Math.min(window.innerHeight, window.innerWidth) * 0.9;
    canvas.width = HEIGHT;
    canvas.height = HEIGHT;
    // canvas.moveTo(window.innerHeight/2, window.innerHeight/2)
    update(); 
}


function drawMinkowski() {

    // Clear and reset the transform to avoid scaling on each draw
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    HEIGHT = Math.min(window.innerHeight, window.innerWidth) * 0.9;

    if(zoomChecked) spacing = canvas.height / 10;
    else spacing = canvas.height / 20;

    console.log("spacing", spacing);
    // Grid
    drawGrid();

    // Time-like and space-like hyperbolas
    drawHyperbolas();

    // Light cones
    drawLine([-10, -10], [10, 10], 'orange', 3);
    drawLine([-10, 10], [10, -10], 'orange', 3);

    // Horizontal and vertical axes
    drawLine([-10, 0], [10, 0], 'black', 3);

    if (MODE == 1){ // running and sleeping
        if(Math.abs(frameSpeed) < 0.05) frameSpeed = 0;

        sum_speed = vel_addition(frameSpeed, -objectSpeed);
        sleeping_points = drawSegmentWithCats(ctx, [0, 0], [0, 10], 11, frameSpeed, 'red', sleeping = true);
        running_points = drawSegmentWithCats(ctx, [0, 0], [0, 10], 11, sum_speed, 'blue', sleeping = false);

        if(triangleChecked){
            [x1, y1] = running_points[6];
            [x2, y2] = sleeping_points[6];
            drawLine([x1, y1], [x2, y2], 'green', 4);
            drawLine([x1, y1], [x1, y2], 'red', 4);
            drawLine([x1, y2], [x2, y2], 'blue', 4);
        }
    }

    else if (MODE == 2){ // many cats
        drawSegmentWithCats(ctx, [0, -10], [0, 10], 11, frameSpeed, 'blue', sleeping=true);
        drawSegmentWithCats(ctx, [4, -10], [4, 10], 11, frameSpeed, 'blue', sleeping = true);
        drawSegmentWithCats(ctx, [-4, -10], [-4, 10], 11, frameSpeed, 'blue', sleeping = true);
        drawSegmentWithCats(ctx, [8, -10], [8, 10], 11, frameSpeed, 'blue', sleeping = true);
        drawSegmentWithCats(ctx, [-8, -10], [-8, 10], 11, frameSpeed, 'blue', sleeping = true);
    }

    else if (MODE == 3){ // long cat
        sum_speed = vel_addition(frameSpeed, -objectSpeed);
        drawSegmentWithLongCats(ctx, [0, -10], [0, 10], 11, sum_speed, 'blue', sum_speed);
    }


    // Rectangle
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, HEIGHT, HEIGHT);
    ctx.stroke();
}


function convertCanvas(x, y){
    let new_x = canvas.width / 2 + x*spacing*horizontalScale;
    let new_y = canvas.height/2 - y*spacing + zoomChecked*spacing*5;
    return [new_x, new_y];
}


function MT(x, y){ // in spacings (light seconds)
    [new_x, new_y] = convertCanvas(x, y);
    ctx.moveTo(new_x, new_y);
}

function LT(x, y){ // in spacings (light seconds)
    [new_x, new_y] = convertCanvas(x, y);
    ctx.lineTo(new_x, new_y);
}

function drawGrid(){
    // Draw grid
    ctx.beginPath();
    ctx.strokeStyle = '#ccc'; // Light grey for the grid lines
    ctx.lineWidth = 2;

    // Vertical grid lines
    for (let x = 0; x < 10; x += 1) {
        MT(x, -10);
        LT(x, 10);
        MT(-x, -10);
        LT(-x, 10);
    }

    // Horizontal grid lines
    for (let y = 0; y < 10; y += 1) {
        MT(-10, y);
        LT(10, y);
        MT(-10, -y);
        LT(10, -y);
    }

    ctx.stroke();
}

function drawHyperbolas() {
    let maxRange = 10/horizontalScale;
    // Set styles for hyperbolas
    ctx.strokeStyle = 'blue'; // Green for time-like hyperbolas
    if(spacing < 50) ctx.lineWidth = 0.5;
    else ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    let x_step = maxRange / 100;
  
    // Time-like hyperbolas (ct)^2 - x^2 = a^2
    for (let a = 1; a < 10; a += 1) {
        ctx.beginPath(); // upper
        MT(-maxRange, Math.sqrt(maxRange * maxRange + a * a));
        for (let x = -maxRange; x <= maxRange; x += x_step) {
            LT(x, Math.sqrt(x * x  + a * a));
        }
        ctx.stroke();

        ctx.beginPath(); // lower
        MT(-maxRange, -Math.sqrt(maxRange * maxRange + a * a));
        for (let x = -maxRange; x <= maxRange; x += x_step) {
            LT(x, -Math.sqrt(x * x + a * a));
        }
        ctx.stroke();
    }
  
    // Space-like hyperbolas x^2 - (ct)^2 = a^2
    let started = false;
    for (let a = 1; a < 10; a += 1) {
        ctx.beginPath(); // right
        for (let ct = -maxRange; ct <= maxRange; ct += 0.1) {
            let x = Math.sqrt(ct * ct + a * a)
            if(x <= maxRange) {
                if (!started) {
                    MT(x, -ct );
                    started = true;
                }
                else LT(x, -ct);
            }
        }
        ctx.stroke();

        started = false;
        ctx.beginPath(); // left
        for (let ct = -maxRange; ct <= maxRange; ct += 0.1) {
            let x = Math.sqrt(ct * ct + a * a)
            if(x <= maxRange) {
                if (!started) {
                    MT(-x, -ct);
                    started = true;
                }
                else LT(-x, -ct);
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
