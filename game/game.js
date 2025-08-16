let gameEle = document.getElementById("game")
let heightPos, widthPos

let maxSpeed = 2
let acceleration = 0.1

function updatePosition() {
    gameEle.style.top = heightPos + "px";
    gameEle.style.left = widthPos + "px";
}

function animate(newX, newY) {
    let id = null;

    let xDiff = newX - widthPos - 100
    let yDiff = newY - heightPos - 100

    let pythagoras = Math.floor(Math.sqrt( (xDiff ** 2) + (yDiff ** 2) ))
    let xRate = xDiff / pythagoras
    let yRate = yDiff / pythagoras

    let pos = Math.floor(pythagoras / maxSpeed)
    let accelTime = 0
    let speed = 0
    let reachedMaxSpeed = false

    clearInterval(id);
    id = setInterval(frame, 5);
    function frame() {
        if (!reachedMaxSpeed) {
            accelTime += 1
            if (speed === 0) {
                speed += acceleration
            } else if (maxSpeed >= speed) {
                speed += speed * acceleration
            } else if (maxSpeed <= speed) {
                reachedMaxSpeed = true
            }
        }

        if (reachedMaxSpeed) {
            if (pos <= accelTime) {
                speed -= speed * acceleration
            }
        }
        console.log(accelTime, pos, speed)

        if (pos === 0) {
            clearInterval(id);
        } else {
            pos--;
            widthPos += xRate * speed;
            heightPos += yRate * speed;
            updatePosition();
        }
    }
}

document.addEventListener('click', function (event) {
    animate(event.clientX, event.clientY)
})

function run() {
    heightPos = 50;
    widthPos = 100;

    updatePosition()
}

run()