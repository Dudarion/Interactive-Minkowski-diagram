const canvas = document.getElementById('minkowski');
const ctx = canvas.getContext('2d');
const [running_cat, running_flipped, sleeping_cat, arrow, galaxy, watch, awake_cat] = init_cats();


let HEIGHT = Math.min(window.innerHeight, window.innerWidth) * 0.9;


let horizontalScale = 1;
let objectSpeed = 0; // as a fraction of the speed of light
let frameSpeed = 0;
// let frameMovement = 0;
let triangleChecked = false;
let switch_checked = false;
let twins_switch_checked = false;
let zoomChecked = false;
let light_checked = false;
let globalShift = false;
let clocks_checked = false;
let spacing = canvas.height / 20;
let lightcone = true;
const twin_speed = 0.7;

let half_canvas = false;
let twins_animation_state = 0;

let MODE = 1;

const mode_header = createHeader('slider-container', "Coordinate transform");
const scale_slider = new createSlider('slider-container', 'Scale', 1, 100, 1, 0.01, '', update);
const frame_speed_slider =  new createSlider('slider-container', 'Frame speed', -0.99, 0.99, 0, 0.001, ' c', update);
const obj_slider =  new createSlider('slider-container', 'Object speed', -0.99, 0.99, 0.5, 0.001, ' c', update);
// const frame_movement_slider =  new createSlider('slider-container', 'Frame movement', -10, 10, 0, 0.01, '', update);
const triangle_checkbox = new createCheckbox('slider-container', " Triangle", 1, update);
const zoom_checkbox = new createCheckbox('slider-container', " Zoom", 2, update);
const light_checkbox = new createCheckbox('slider-container', " Speed of light cats", 3, update);
const clocks_checkbox = new createCheckbox('slider-container', " Clocks", 4, update);
const length_switcher = new createSwitch('slider-container', "Length measurement:", "Global time", "Local time", update);
// const twins_switcher = new createSwitch('slider-container', false, "Twins paradox", false, update);
const animator = new animations('slider-container');

// Call resizeCanvas initially to ensure proper sizing
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // This ensures the canvas is sized before the first draw


function update(){
    horizontalScale = ((scale_slider.value-1) ** 5 / 10000000) + 1;
    objectSpeed = obj_slider.value;
    frameSpeed = frame_speed_slider.value;
    // frameMovement = frame_movement_slider.value;
    // console.log("scale ", horizontalScale);
    
    if(Math.abs(objectSpeed) < 0.05/horizontalScale) objectSpeed = 0;

    triangleChecked = triangle_checkbox.checked;
    zoomChecked = zoom_checkbox.checked;
    switch_checked = !length_switcher.checked;
    clocks_checked = clocks_checkbox.checked;
    light_checked = light_checkbox.checked;

    drawMinkowski();
}


// Set canvas size
function resizeCanvas() {
    HEIGHT = Math.min(window.innerHeight, window.innerWidth) * 0.9;
    canvas.width = HEIGHT;
    canvas.height = HEIGHT/(half_canvas+1);
    // canvas.moveTo(window.innerHeight/2, window.innerHeight/2)
    update(); 
}


function setYaxesPosition() {
    const windowHeight = window.innerHeight;  // Get the height of the window
    const fraction = -0.48;                    // For example, 50% of the window height

    const element = document.getElementById('y-axis-label');
    const horizontalPosition = windowHeight * fraction;

    element.style.left = horizontalPosition + 'px'; // Set the left property
}


function drawMinkowski() {

    // Clear and reset the transform to avoid scaling on each draw
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    HEIGHT = Math.min(window.innerHeight, window.innerWidth) * 0.9;
    
    if(half_canvas) globalShift = true;

    setYaxesPosition();

    if(zoomChecked) spacing = canvas.height * (half_canvas+1) / 10;
    else spacing = canvas.height * (half_canvas+1) / 20;

    // console.log("spacing", spacing);
    // Grid
    drawGrid();

    // Time-like and space-like hyperbolas
    drawHyperbolas();

    // Light cones
    if(lightcone){
        drawLine([-10, -10], [10, 10], 'orange', 3);
        drawLine([-10, 10], [10, -10], 'orange', 3);
    }

    // Horizontal and vertical axes
    drawLine([-10, 0], [10, 0], 'black', 2);

    if (MODE == 1){ // running and sleeping
        drawLine([0, -10], [0, 10], 'black', 2);
        sum_speed = vel_addition(frameSpeed, -objectSpeed);

        let left_dir = objectSpeed < 0;

        if(light_checked){
            drawSegmentWithCats(ctx, [-30, -30], [30, 30], 61, frameSpeed, 'orange', 'running', inverse=false, skip=30);
            drawSegmentWithCats(ctx, [30, -30], [-30, 30], 61, frameSpeed, 'orange', 'running', inverse=true, skip=30);
            // drawSegmentWithCats(ctx, [-0.03, -30], [0.03, 30], 61, frameSpeed, 'orange', 'running', inverse=false, skip=30);
            // drawSegmentWithCats(ctx, [0.03, -30], [-0.03, 30], 61, frameSpeed, 'orange', 'running', inverse=true, skip=30);
        }

        // if(!light_checked || Math.abs(objectSpeed) > 0.1/horizontalScale){
        if(!light_checked && Math.abs(objectSpeed) > 0.1/horizontalScale){
            running_points = drawSegmentWithCats(ctx, [0, 0], [0, 10], 11, sum_speed, 'blue', 'running', inverse=left_dir, skip=0);
            if (clocks_checked) draw_clocks(ctx, running_points, left=left_dir, step=1, init=0);

            if(triangleChecked){
                [x1, y1] = running_points[6];
                [x2, y2] = sleeping_points[6];
                drawLine([x1, y1], [x2, y2], 'green', 4);
                drawLine([x1, y1], [x1, y2], 'red', 4);
                drawLine([x1, y2], [x2, y2], 'blue', 4);
            }
        }

        sleeping_points = drawSegmentWithCats(ctx, [0, 0], [0, 10], 11, frameSpeed, 'red', 'sleeping');
        if (clocks_checked) draw_clocks(ctx, sleeping_points, left=!left_dir, step=1, init=0);
    }

    else if (MODE == 2){ // twins paradox
        sum_speed_forward = vel_addition(frameSpeed, -objectSpeed);
        sum_speed_backward = vel_addition(frameSpeed, +objectSpeed);
        let left_dir = objectSpeed < 0;

        if(twins_animation_state == 0){
            sleeping_points = drawSegmentWithCats(ctx, [0, 0], [0, 20], 21, frameSpeed, 'red', 'sleeping');
            if (clocks_checked) draw_clocks(ctx, sleeping_points, left=!left_dir, step=1, init=0);

            running_points = drawSegmentWithCats(ctx, [0, 0], [0, 4], 5, sum_speed_forward, 'blue', 'running', inverse=left_dir, skip=0);
            if (clocks_checked) draw_clocks(ctx, running_points, left=left_dir, step=1, init=0);


            rotate_point = running_points[4];
            const L_p1 = Lorentz([0, 0], sum_speed_backward);
            const L_p2 = Lorentz([0, 4], sum_speed_backward);
            let p1 = [L_p1[0] + rotate_point[0], L_p1[1] + rotate_point[1]];
            let p2 = [L_p2[0] + rotate_point[0], L_p2[1] + rotate_point[1]];

            returning_points = drawSegmentWithCats(ctx, p1, p2, 5, 0, 'blue', 'running', inverse=!left_dir, skip=0);
            if (clocks_checked) draw_clocks(ctx, returning_points, left=left_dir, step=1, init=4);
        }

        else twins_animation(twins_animation_state, twin_speed);
    }

    else if (MODE == 3){ // many cats
        if (clocks_checked){
            for(let i=-8; i<=8; i+=4){
                sleeping_points1 = drawSegmentWithCats(ctx, [i, -10], [i, 0], 6, frameSpeed, 'blue', 'sleeping');
                sleeping_points2 = drawSegmentWithCats(ctx, [i, 0], [i, 10], 6, frameSpeed, 'blue', 'awake_cat');
                draw_clocks(ctx, sleeping_points1, left=true, step=2, init=-10);
                draw_clocks(ctx, sleeping_points2, left=true, step=2, init=0);
            }
        }

        else{
            for(let i=-8; i<=8; i+=4){
                sleeping_points = drawSegmentWithCats(ctx, [i, -10], [i, 10], 11, frameSpeed, 'blue', 'sleeping');
                if (clocks_checked) draw_clocks(ctx, sleeping_points, left=true, step=2, init=-10);
            }
        }
    }

    else if (MODE == 4){ // arrow
        sum_speed = vel_addition(frameSpeed, -objectSpeed);
        drawSegmentWithLongArrows(ctx, [0, -10], [0, 10], 21, sum_speed, triangleChecked, switch_checked);
    }

    else if (MODE == 5){ // galaxy
        drawLine([0, -10], [0, 10], 'black', 3);

        sleeping_points = drawSegmentWithCats(ctx, [0, -10], [0, 10], 21, frameSpeed, 'red', 'sleeping');
        if (clocks_checked) draw_clocks(ctx, sleeping_points, left=true, step=1, init=-10);

        galaxy_points = drawSegmentWithCats(ctx, [7, -14], [7, 14], 29, frameSpeed, 'red', 'galaxy');
        if (clocks_checked) draw_clocks(ctx, galaxy_points, left=false, step=1, init=-14);

        if(triangleChecked){
            let [x1, y1] = galaxy_points[0];
            let [x2, y2] = galaxy_points[1];
            new_right_x = ((- y1) * (x2 - x1) / (y2 - y1)) + x1;
            new_right_y = y1 - x1*(y2 - y1) / (x2 - x1);
            drawLine([0, 0], [new_right_x, 0], 'green', 6);
            drawLine([0, 0], [0, new_right_y], 'blue', 6);
        }
    }


    // Rectangle
    ctx.beginPath();
    ctx.strokeStyle = "#a28fe6";
    // ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, HEIGHT-1, HEIGHT/(half_canvas+1)-1);
    ctx.stroke();
}


function convertCanvas(x, y){
    let new_x = canvas.width / 2 + x*spacing*horizontalScale;
    let new_y = (globalShift*0.9+1) * canvas.height / 2 - y*spacing + zoomChecked*spacing*5;
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
    ctx.lineWidth = 2;

    if(horizontalScale > 150){
        // Vertical grid lines
        ctx.beginPath();
        const color = 255-Math.round((horizontalScale-150)*0.318/3);
        ctx.strokeStyle = "rgb(" + color +"," + color +"," + color +")";
        for (let x = 0; x < 0.1; x += 0.001) {
            MT(x, -10);
            LT(x, 20);
            MT(-x, -10);
            LT(-x, 20);
        }
        ctx.stroke();
    }

    else{
        // Vertical grid lines
        ctx.beginPath();
        ctx.strokeStyle = '#ccc'; // Light grey for the grid lines
        for (let x = 0; x < 10; x += 1) {
            MT(x, -10);
            LT(x, 20);
            MT(-x, -10);
            LT(-x, 20);
        }
        ctx.stroke();
    }

    // Horizontal grid lines
    ctx.beginPath();
    ctx.strokeStyle = '#ccc'; // Light grey for the grid lines
    for (let y = 0; y < (10 + globalShift*10); y += 1) {
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
    num_of_upper = 10 + globalShift*10;
    for (let a = 0; a < num_of_upper; a += 1) {
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
