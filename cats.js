
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
    let new_x = canvas.width / 2 + x*horizontalScale*spacing;
    let new_y = canvas.height / 2 - y*spacing;

    if(sleeping) {
        cat = sleeping_cat;
        desired_width = spacing * 0.8;
    }
    else {
        cat = running_cat;
        desired_width = spacing * 1.2;
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