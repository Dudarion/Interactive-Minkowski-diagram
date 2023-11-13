
function init_cats(){
    const running_cat = new Image();
    running_cat.src = 'running_cat_small.png';
    const sleeping_cat = new Image();
    sleeping_cat.src = 'sleeping_small.png';
    const arrow = new Image();
    arrow.src = 'arrow.png';
    const galaxy = new Image();
    galaxy.src = 'Andromeda.png';
    const watch = new Image();
    watch.src = 'watch.png';
    running_cat.onload = function () { 
        drawMinkowski();
    }
    sleeping_cat.onload = function () { 
        drawMinkowski();
    }
    arrow.onload = function () { 
        drawMinkowski();
    }
    galaxy.onload = function () { 
        drawMinkowski();
    }
    watch.onload = function () { 
        drawMinkowski();
    }
    return [running_cat, sleeping_cat, arrow, galaxy, watch];
}

function draw_cat(ctx, x, y, type)
{
    let [new_x, new_y] = convertCanvas(x, y);
    let cat;

    if(type == "sleeping") {
        cat = sleeping_cat;
        desired_width = spacing * 0.8 / (zoomChecked+1);
    }
    else if(type == "running"){
        cat = running_cat;
        desired_width = spacing * 1.2 / (zoomChecked+1);
    }
    else if(type == "galaxy"){
        cat = galaxy;
        desired_width = spacing * 1.5 / (zoomChecked+1);
    }
    
    ratio = cat.height / cat.width;

    new_x = new_x - desired_width/2;
    new_y = new_y - desired_width*ratio/2;

    ctx.drawImage(cat, new_x, new_y, desired_width, desired_width*ratio);
}


function draw_watch(ctx, x, y, time){
    let [new_x, new_y] = convertCanvas(x, y);
    ctx.drawImage(watch, new_x-watch.width*0.7/2, new_y-watch.height*0.7/2, watch.width*0.7, watch.height*0.7);
    drawText(ctx, x, y-0.05, time);
}


function drawSegmentWithCats(ctx, p1, p2, num, speed, color, type, clock, left=true) {
    const L_p1 = Lorentz(p1, speed);
    const L_p2 = Lorentz(p2, speed);
    drawLine(L_p1, L_p2, color, 3);
    
    const points = distributePointsOnLine(L_p1, L_p2, num);
    for (let i = 0; i < points.length; i++) {
        draw_cat(ctx, points[i][0], points[i][1], type);
        if(clock){
            shift = (left - 0.5) * 2/horizontalScale;
            let local_time = (i-Math.floor(num/2))*2;
            if(p1[1] == 0) local_time = i;
            // drawCIrcle(ctx, points[i][0]-shift, points[i][1], 10, 'blue');
            // drawText(ctx, points[i][0]-shift, points[i][1], local_time);
            draw_watch(ctx, points[i][0]-shift, points[i][1], local_time);
        }
    }
    return points;
}


function drawSegmentWithLongArrows(ctx, p1, p2, num, speed, triangle, switcher) {
    let left_p_1 = [p1[0]-2/horizontalScale, p1[1]];
    let left_p_2 = [p2[0]-2/horizontalScale, p2[1]];
    const left1 = Lorentz(left_p_1, speed);
    const left2 = Lorentz(left_p_2, speed);

    let right_p_1 = [p1[0]+2/horizontalScale, p1[1]];
    let right_p_2 = [p2[0]+2/horizontalScale, p2[1]];
    const right1 = Lorentz(right_p_1, speed);
    const right2 = Lorentz(right_p_2, speed);

    drawLine(left1, left2, 'blue', 2);
    drawLine(right1, right2, 'red', 2);
    
    const points = distributePointsOnLine(left1, left2, num);
    const points2 = distributePointsOnLine(right1, right2, num);


    for (let i = 0; i < points.length; i++) {
        let [left_x, left_y] = points[i];
        let [right_x, right_y] = points2[i];

        draw_watch(ctx, left_x, left_y, (i-5)*2);
        draw_watch(ctx, right_x, right_y, (i-5)*2);

        if(switcher){
            let [x1, y1] = points2[4];
            let [x2, y2] = points2[5];
            new_y = (right_y + left_y) / 2;
            left_y = new_y;
            right_y = new_y;
            new_right_x = ((left_y - y1) * (x2 - x1) / (y2 - y1)) + x1;
            left_x -= new_right_x - right_x;
            right_x = new_right_x;
        }

        arrow_x = (left_x + right_x) / 2 - 0.05;
        arrow_y = (left_y + right_y) / 2;
        arrow_length = Math.sqrt((right_x - left_x)**2 + (right_y - left_y)**2)-0.3;
        arrow_angle = Math.atan2(-right_y + left_y, (right_x - left_x) * horizontalScale);

        draw_arrow(ctx, arrow_x, arrow_y, arrow_length, arrow_angle);
    }

    if(triangle){
        [x1, y1] = points[6];
        [x2, y2] = points2[6];
        drawLine([x1, y1], [x2, y2], 'green', 4);
        drawLine([x1, y1], [x1, y2], 'red', 4);
        drawLine([x1, y2], [x2, y2], 'blue', 4);
    }
}



function draw_arrow(ctx, x, y, length, angle){
    let [new_x, new_y] = convertCanvas(x, y);
    desired_width = spacing*horizontalScale * length;
    new_x = new_x - desired_width/2;
    // ratio = arrow.height / arrow.width;
    height_scale = 0.4;
    new_y = new_y - arrow.height * height_scale/2;

    let scale = desired_width / arrow.width;

    ctx.save();
    ctx.translate(new_x + arrow.width * scale / 2, new_y + arrow.height * height_scale/2);
    ctx.rotate(angle);
    ctx.translate(- new_x - arrow.width * scale / 2, - new_y - arrow.height * height_scale/2);
    ctx.drawImage(arrow, new_x, new_y, arrow.width * scale, arrow.height * height_scale);
    ctx.restore();
}


function drawText(ctx, x, y, text){
    ctx.fillStyle = 'white';
    [new_x, new_y] = convertCanvas(x, y);
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.fillText(text, new_x, new_y+7);
}


// function drawCIrcle(ctx, x, y, rad, color){
//     ctx.beginPath();
//     ctx.strokeStyle = color;
//     ctx.lineWidth = rad+2;
//     [new_x, new_y] = convertCanvas(x, y);
//     ctx.arc(new_x, new_y, rad, 0, 2 * Math.PI);
//     ctx.fillStyle = color;
//     ctx.fill();
//     ctx.stroke();
// }