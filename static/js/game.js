var last_mouse_x = 0;
var last_mouse_y = 0;
var spaceships = [];
var bullets = [];
var EXPL = 4;
var points = 0;
var shaking = 0;
var shipLeft = new Image();
var shipRight = new Image();

function startGame(){
    console.log("Game Begins Now!");
    var canvas=document.getElementById("can");
    canvas.setAttribute("tabIndex",0);
    setInterval(repaint,30);
    setInterval(update,30);
    shipLeft.src="static/images/ship_left.png";
    shipRight.src="static/images/ship_right.png";
    
}
function repaint(){
    var canvas=document.getElementById("can");
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
    
    var rotation_ang = (Math.random()*Math.PI/4 - Math.PI/8)*shaking*0.5;
    ctx.translate(canvas.width/2,canvas.height/2);
    ctx.rotate(rotation_ang);
    ctx.translate(-canvas.width/2,-canvas.height/2);

    // clear the sceen
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    // draw the enemies
    ctx.fillStyle = "#FF0000";
    for (var i = spaceships.length - 1; i >= 0; i--) {
        //ctx.fillRect(spaceships[i][0],spaceships[i][1],40,40);
        if (spaceships[i][2]>0){
            ctx.drawImage(shipRight,spaceships[i][0]-5,spaceships[i][1]-10,60,60);
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
    ctx.fillRect(last_mouse_x - 60,last_mouse_y - 10,20,20);

    // unshake
    ctx.translate(canvas.width/2,canvas.height/2);
    ctx.rotate(-rotation_ang);
    ctx.translate(-canvas.width/2,-canvas.height/2);
    
    ctx.translate(-translation_x,-translation_y);

    // keep score
    ctx.fillStyle = "white";
    ctx.font="28px serif";
    ctx.fillText("# of Spaceships: " + spaceships.length, 10,30);
    ctx.fillText("# of Bullets: " + bullets.length, 10,60);
    ctx.fillText("Score: " + points, 10,90);

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
                points += 10
                shaking = 1.0
                break;
            }
        }
    }
}
function mouseMoved(event){
    last_mouse_x = event.clientX;
    last_mouse_y = event.clientY;
}
function keyPress(event){
    if (event.code === "Space"){
        console.log('SPAAACE')
        bullets.push([last_mouse_x - 50, last_mouse_y -10, 0, -4]);
    }
}