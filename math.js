function Lorentz(point, speed) {
    const gamma = 1 / Math.sqrt(1 - speed ** 2);
    const x = point[0];
    const y = point[1];

    const new_x = gamma * (x - speed * y);
    const new_y = gamma * (y - speed * x);

    return [new_x, new_y];
}


function vel_addition(vel1, vel2){
    sum_speed = (vel1 + vel2) / (1 + vel1*vel2);
    return sum_speed;
}


function distributePointsOnLine(startPoint, endPoint, numPoints) {
    const x1 = startPoint[0];
    const y1 = startPoint[1];
    const x2 = endPoint[0];
    const y2 = endPoint[1];

    const dx = (x2 - x1) / (numPoints - 1);
    const dy = (y2 - y1) / (numPoints - 1);

    const points = [];
    for (let i = 0; i < numPoints; i++) {
        points.push([x1 + i * dx, y1 + i * dy]);
    }

    return points;
}

