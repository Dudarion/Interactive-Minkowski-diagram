
function init_cats(){
    const running_cat = new Image();
    running_cat.src = 'running_cat_small.png';
    const sleeping_cat = new Image();
    sleeping_cat.src = 'sleeping_small.png';
    const arrow = new Image();
    arrow.src = 'arrow.png';
    running_cat.onload = function () { 
        drawMinkowski();
    }
    sleeping_cat.onload = function () { 
        drawMinkowski();
    }
    arrow.onload = function () { 
        drawMinkowski();
    }
    return [running_cat, sleeping_cat, arrow];
}

function draw_cat(ctx, x, y, sleeping)
{
    let [new_x, new_y] = convertCanvas(x, y);

    if(sleeping) {
        cat = sleeping_cat;
        desired_width = spacing * 0.8 / (zoomChecked+1);
    }
    else {
        cat = running_cat;
        desired_width = spacing * 1.2 / (zoomChecked+1);
    }
    
    ratio = cat.height / cat.width;

    new_x = new_x - desired_width/2;
    new_y = new_y - desired_width*ratio/2;

    ctx.drawImage(cat, new_x, new_y, desired_width, desired_width*ratio);
}


function drawSegmentWithCats(ctx, p1, p2, num, speed, color, sleeping) {
    const L_p1 = Lorentz(p1, speed);
    const L_p2 = Lorentz(p2, speed);
    drawLine(L_p1, L_p2, color, 3);
    
    const points = distributePointsOnLine(L_p1, L_p2, num);
    for (let i = 0; i < points.length; i++) {
        draw_cat(ctx, points[i][0], points[i][1], sleeping);
    }

    return points;
}


function drawSegmentWithLongArrows(ctx, p1, p2, num, speed) {
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

        drawCIrcle(ctx, left_x, left_y, 5, 'blue');
        drawCIrcle(ctx, right_x, right_y, 5, 'red');

        arrow_x = (left_x + right_x) / 2;
        arrow_y = (left_y + right_y) / 2;
        arrow_length = Math.sqrt((right_x - left_x)**2 + (right_y - left_y)**2);
        arrow_angle = Math.atan2(-right_y + left_y, (right_x - left_x) * horizontalScale);
        
        draw_arrow(ctx, arrow_x, arrow_y, arrow_length, arrow_angle);
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



function drawCIrcle(ctx, x, y, rad, color){
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = rad+2;
    [new_x, new_y] = convertCanvas(x, y);
    ctx.arc(new_x, new_y, rad, 0, 2 * Math.PI);
    ctx.stroke();
}