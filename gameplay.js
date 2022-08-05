
var canvas = document.getElementById('canvas')
var wrap = document.getElementById('wrap')
var startButton = document.getElementById('start')
var stopButton = document.getElementById('stop')
var restartButton = document.getElementById('restart')
var generation = document.getElementById('genCount'), genCount =0;
var ctx = canvas.getContext('2d')
//variables 
var x, y
var boxSize = 20;
var startX= 0, startY = 0;
var evt = new MouseEvent('click')
size();
var row = Math.floor(canvas.height / boxSize), coll = Math.floor(canvas.width / boxSize)
var initialGrid = Array.from(Array(row), () => new Array(coll))
var tempGrid
var startTime;
grid();
render();

canvas.addEventListener('click', (evt)=> {
    x = evt.offsetX, y = evt.offsetY
  changeState(x,y)
})
canvas.addEventListener('mousedown', (evt)=> {
    x = evt.offsetX, y = evt.offsetY
   mousedown = true;
})
canvas.addEventListener('mousemove', (evt) =>  {
    if(mousedown == true){
    changeState(x,y)
    x = evt.offsetX, y = evt.offsetY
    }
})
canvas.addEventListener('mouseup', (evt)=>{
    x= 0;
    y =0;
    mousedown = false
})

startButton.addEventListener('click', () => {
     startTime = setInterval(()=>{
        findNeighbor();  
        applyChanges();
        genCount ++;
    },100)
        
})
stopButton.addEventListener('click', ()=> {
    clearInterval(startTime);
})

restartButton.addEventListener('click', ()=> {
    window.location.reload(false)
})
function findNeighbor() {
    
    for(var y = 0 ; y < row; y++) {
        for(var x = 0; x < coll; x++) {
            var countAlive = 0
                for(var i =-1 ; i <= 1; i++){
                    for(var j = -1; j <= 1; j++){
                        if((i== 0 && j==0) || (y+i < 0 || x+j < 0) || (y+i >= initialGrid.length || x+j >= initialGrid[0].length ) ){ 
                            continue;
                        }
                      
                       
                        if(initialGrid[y+i][x+j].status == 1 ){ 
                                countAlive++
                         }
                    }
                }
                if(initialGrid[y][x].status == 1) {
                              if(countAlive < 2 || countAlive > 3) {
                                tempGrid[y][x].status = 0  
                              }
                               else  if(countAlive <= 3){
                                tempGrid[y][x].status = 1
                              }
                }
                if(countAlive == 3) {
                    tempGrid[y][x].status = 1;
                }
        }
    
    }
   
 


}

function applyChanges() { 
    for(var y = 0; y < initialGrid.length; y++){ 
        for(var x = 0; x <  initialGrid[0].length; x++){ 
            initialGrid[y][x].status = tempGrid[y][x].status
        }
    }
}
function changeState(mouseX, mouseY) { 
    for(var y = 0; y < row; y++){ 
        for(var x = 0 ; x < coll ; x++){
            if((mouseX >= initialGrid[y][x].x && mouseX <= initialGrid[y][x].x+ boxSize) && (mouseY >= initialGrid[y][x].y && mouseY <= initialGrid[y][x].y + boxSize)){
                initialGrid[y][x].status = 1;
            }
        }
}
    tempGrid = JSON.parse(JSON.stringify(initialGrid))
}
function size(){ 
    canvas.width = wrap.offsetWidth;
    canvas.height = window.innerHeight- 10;
    ctx.width = wrap.offsetWidth;
    ctx.height = window.innerHeight- 10;
}
function grid() { 
    for(var y = 0; y < row; y++){ 
        for(var x = 0 ; x < coll ; x++){ 
            initialGrid[y][x] = {'status': 0, 'x': startX, 'y': startY};
            startX+=boxSize;
        }
        startY += boxSize;
        startX = 0;
    }
}
function update() { 
    ctx.fillStyle= '#393E41'
    ctx.fillRect(0,0,wrap.offsetWidth, window.innerHeight)
    for(var y = 0; y < row; y++){ 
        for(var x = 0 ; x < coll ; x++) {
            if(initialGrid[y][x].status == 1){
                ctx.fillStyle = '#ffdd19'
                ctx.strokeRect(initialGrid[y][x].x, initialGrid[y][x].y, boxSize,boxSize);
                ctx.fillRect(initialGrid[y][x].x, initialGrid[y][x].y, boxSize,boxSize);
            }
           // ctx.strokeStyle = 'white'
            ctx.strokeRect(initialGrid[y][x].x, initialGrid[y][x].y, boxSize,boxSize);
        }
    }
    }
function render() { 
    setInterval(() => {
        size();
        update();
        generation.innerHTML = genCount;
    }, 1);
}