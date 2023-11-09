
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
    new_x = canvas.width / 2 + x*horizontalScale*spacing;
    new_y = canvas.height/2 - y*spacing;
    
    if(sleeping){
        ctx.drawImage(sleeping_cat, new_x - sleeping_cat.width/2, new_y - sleeping_cat.height/2);
    }
    else{
        ctx.drawImage(running_cat, new_x - running_cat.width/2, new_y - running_cat.height/2);
    }
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