var last_mouse_x = 0;
var last_mouse_y = 0;
var spaceships = [];
var bullets = [];
var EXPL = 4;

var ammo = 0;
var score = 0;
var shaking = 0;
var shipLeft = new Image();
var shipRight = new Image();
var shipUp = new Image();

var drawCollisionRects = false;

var ended = false;

var canvas=document.getElementById("can");
var updateInt;
var repaintInt;

function startGame(){
    console.log("Game Begins Now!");
    canvas.setAttribute("tabIndex",0);
    canvas.style.cursor = "none";
    repaintInt = setInterval(repaint,30);
    updateInt = setInterval(update,30);
    shipLeft.src="static/images/ship_left.png";
    shipRight.src="static/images/ship_right.png";
    shipUp.src="static/images/ship_up_red.png";

    ammo = 10;
    ended = false;
    score = 0;
    
}
function repaint(){
    var ctx= canvas.getContext("2d");

    // flash white on ship explosion
    if (shaking >= .85){
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        console.log("Flash!");
        return
    }

    // shake
    var translation_x = (Math.random()*50 - 25)*shaking;
    var translation_y = (Math.random()*50 - 25)*shaking;
    ctx.translate(translation_x,translation_y);

    var rotation_ang = 0; //(Math.random()*Math.PI/4 - Math.PI/8)*shaking*0.5;
    ctx.translate(canvas.width/2,canvas.height/2);
    ctx.rotate(rotation_ang);
    ctx.translate(-canvas.width/2,-canvas.height/2);

    // clear the sceen
    ctx.fillStyle = "#000000";
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // draw the enemies
    ctx.fillStyle = "#FF0000";
    for (var i = spaceships.length - 1; i >= 0; i--) {
        if (drawCollisionRects) {
            ctx.strokeRect(spaceships[i][0],spaceships[i][1],40,40);
        }
        if (spaceships[i][2]>0){
            ctx.drawImage(shipRight,spaceships[i][0]-15,spaceships[i][1]-10,60,60);
        }
        else{
            ctx.drawImage(shipLeft,spaceships[i][0]-5,spaceships[i][1]-10,60,60);
        }
    }

    // draw the bullets
    ctx.fillStyle = "#00FF00";
    for (var i = bullets.length - 1; i >= 0; i--) {
        ctx.fillRect(bullets[i][0],bullets[i][1],10,10);
    }

    // draw the hero
    ctx.fillStyle = "#0000FF";
    ctx.drawImage(shipUp, last_mouse_x - 30,last_mouse_y - 30, 60, 60);
    ctx.strokeStyle = "#FFFFFF";
    if (drawCollisionRects) {
        ctx.strokeRect(last_mouse_x - 20,last_mouse_y - 20,40,40);
    }

    // unshake
    ctx.translate(canvas.width/2,canvas.height/2);
    ctx.rotate(-rotation_ang);
    ctx.translate(-canvas.width/2,-canvas.height/2);

    ctx.translate(-translation_x,-translation_y);

    // keep score
    ctx.fillStyle = "white";
    ctx.font="28px serif";
    ctx.fillText("# of Spaceships: " + spaceships.length, 10,30);
    ctx.fillText("Ammo: " + ammo, 10,60);
    ctx.fillText("Score: " + score, 10,90);

}
function update(){
    if (shaking>=0.1){
        shaking -= 0.1;
    }
    // Move the spaceships forward
    for (var i = spaceships.length - 1; i >= 0; i--) {
        spaceships[i][0] += spaceships[i][2];
        if (spaceships[i][0] > 1000){
            spaceships.splice(i,1);
        }
        else if (spaceships[i][0] < -80){
            spaceships.splice(i,1);
        }
    }

    // Generate new spaceships
    if (Math.random() > 0.95){
        var newShip = [0,0,0]
        if (Math.random()>0.5){
            newShip= [960,Math.random()*400,-4];
        } else {
            newShip= [-40,Math.random()*400,4];
        }
        spaceships.push(newShip);
    }

    // Move the bullets forward
    for (var i = bullets.length - 1; i >= 0; i--) {
        bullets[i][0] += bullets[i][2];
        bullets[i][1] += bullets[i][3];
        if (bullets[i][1] < 0 ||
            bullets[i][1] > 600 ||
            bullets[i][0] < 0 ||
            bullets[i][0] > 1000) {
            bullets.splice(i,1);
            continue;
        }
        // check for collision with ships
        for (var j = spaceships.length - 1; j >= 0; j--) {
            if (bullets[i][0]+10  > spaceships[j][0] &&
                bullets[i][0] < spaceships[j][0]+40 &&
                bullets[i][1]+10 > spaceships[j][1] &&
                bullets[i][1] < spaceships[j][1]+40)
            {
                // make ship explode with debris
                for (var i = 0; i < EXPL; i++) {
                    var angle=Math.random()*2*3.14159;
                    bullets.push([
                        spaceships[j][0]+20,
                        spaceships[j][1]+20,
                        Math.cos(angle)*4,
                        Math.sin(angle)*4])
                }
                spaceships.splice(j,1);
                bullets.splice(i,1);
                score += 10
                shaking = 1.0
                break;
            }
        }

        // check for collision with the hero
        if (bullets[i][0]+10 > last_mouse_x - 30 &&
            bullets[i][0] < last_mouse_x + 30 &&
            bullets[i][1]+10 > last_mouse_y &&
            bullets[i][1] < last_mouse_y + 30)
        {
            bullets.splice(i, 1);
            shaking = 1.0;
        }
    }

    // check each ship against the hero
    for (var j = spaceships.length - 1; j >= 0; j--) {
        if (last_mouse_x + 20 > spaceships[j][0] &&
            last_mouse_x - 20 < spaceships[j][0] + 40 &&
            last_mouse_y + 20 > spaceships[j][1] &&
            last_mouse_y - 20 < spaceships[j][1] + 40)
        {
            spaceships.splice(j, 1);
            shaking = 1.0;
        }
    }

    if (bullets.length === 0 && ammo === 0){
        endgame();
    }
}
function endgame(){
    clearInterval(updateInt);
    clearInterval(repaintInt);
    console.log("Game over!");
    ended = true;
    var canvas=document.getElementById("can");
    var ctx= canvas.getContext("2d");

    // Display Final Score
    ctx.fillStyle = "#282828";
    ctx.fillRect(canvas.width/2-100, canvas.height/2 - 50, 200, 120);
    ctx.fillStyle = "#FFFFFF";
    ctx.font="20px serif";
    ctx.fillText("Final Score:", canvas.width/2 - 50, canvas.height/2 - 10);
    ctx.fillText("" + score, canvas.width/2 - 50, canvas.height/2 + 15);

    // Restart Button
    drawResetButton(false);

    // free the cursor!
    var canvas=document.getElementById("can");
    canvas.style.cursor = "default";

}
function mouseMoved(event){
    last_mouse_x = event.clientX;
    last_mouse_y = event.clientY;

    if (ended) {
        if ((last_mouse_x > canvas.width/2 - 70 && last_mouse_x < canvas.width/2 + 70) && 
            (last_mouse_y > canvas.height/2 + 30 && last_mouse_y < canvas.height/2 + 60)){
            drawResetButton(true);   
        } else {
            drawResetButton(false);
        }
        console.log("MRB");
    }
}

function mouseDown(event){
    console.log(event);
    if (ended) {
        if ((last_mouse_x > canvas.width/2 - 70 && last_mouse_x < canvas.width/2 + 70) && 
            (last_mouse_y > canvas.height/2 + 30 && last_mouse_y < canvas.height/2 + 60)){
            console.log("Restarted!");
            startGame();
        }
    }
}

function drawResetButton(mousedOver){
    var ctx= canvas.getContext("2d");
    var rectColor = "#555555";
    var textColor = "#FFFFFF";
    if (mousedOver){
        rectColor = "red";
        textColor = "blue";
    }

    ctx.fillStyle = rectColor;
    ctx.fillRect(canvas.width/2-70, canvas.height/2 + 30, 140, 30);
    ctx.fillStyle = textColor;
    ctx.font="18px serif";
    ctx.fillText("Restart Game", canvas.width/2 - 50, canvas.height/2 + 50);
}

function keyPress(event){
    if (event.code === "Space"){
        if (ammo >= 1){
            bullets.push([last_mouse_x-5, last_mouse_y -10, 0, -4]);
            ammo -= 1;
        }else {
            console.log("Out of ammo.")
        }
    }
}
