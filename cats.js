
function init_cats(){
    const running_cat = new Image();
    running_cat.src = 'running_cat_small.png';
    const sleeping_cat = new Image();
    sleeping_cat.src = 'sleeping_small.png';
    running_cat.onload = function () { 
        drawMinkowski();
    }
    sleeping_cat.onload = function () { 
        drawMinkowski();
    }
    return [running_cat, sleeping_cat];
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


function draw_long_cat(ctx, x, y, rotation){
    let [new_x, new_y] = convertCanvas(x, y);
    desired_width = spacing * 2 / (zoomChecked+1);
    ratio = running_cat.height / running_cat.width;

    new_x = new_x - desired_width/2;
    new_y = new_y - desired_width*ratio/2;

    ctx.save();
    ctx.translate(new_x + running_cat.width / 2, new_y + running_cat.height / 2);
    ctx.rotate(rotation);
    ctx.drawImage(running_cat, -running_cat.width / 2, -running_cat.height / 2, desired_width, desired_width*ratio);
    ctx.restore();
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


function drawSegmentWithLongCats(ctx, p1, p2, num, speed, color, rotation) {
    const L_p1 = Lorentz(p1, speed);
    const L_p2 = Lorentz(p2, speed);
    drawLine(L_p1, L_p2, color, 3);
    
    const points = distributePointsOnLine(L_p1, L_p2, num);
    for (let i = 0; i < points.length; i++) {
        draw_long_cat(ctx, points[i][0], points[i][1], rotation)
    }

    return points;
}

