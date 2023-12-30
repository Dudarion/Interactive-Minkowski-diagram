function Lorentz(point, speed) {
    const gamma = 1 / Math.sqrt(1 - speed ** 2);
    const [x, t] = point;

    const new_x = gamma * (x - speed * t);
    const new_t = gamma * (t - speed * x);

    return [new_x, new_t];
}


function vel_addition(vel1, vel2){
    const sum_speed = (vel1 + vel2) / (1 + vel1*vel2);
    return sum_speed;
}


function distributePointsOnLine(startPoint, endPoint, numPoints) {
    const [x1, y1] = startPoint;
    const [x2, y2] = endPoint;

    const dx = (x2 - x1) / (numPoints - 1);
    const dy = (y2 - y1) / (numPoints - 1);

    const points = [];
    for (let i = 0; i < numPoints; i++) {
        points.push([x1 + i * dx, y1 + i * dy]);
    }

    return points;
}

