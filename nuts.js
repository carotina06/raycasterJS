const schermo=document.getElementById("scrin");
const cxt = schermo.getContext("2d")
const mappa =document.getElementById("mappa")
const smap = mappa.getContext("2d")

const pi = 3.14159265358979
const dPi = pi * 2

let posX = 300
let posY = 300
let speed = 60
let angle = 0
let rotSpeed = pi/4
let map = [
    [1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,1,0,1],
    [1,0,0,0,0,1,0,1],
    [1,0,0,0,0,1,1,1],
    [1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1],
    
]

let nRays = 50
let FOV = pi/2 
let HalfFOV = FOV/2

function checkAngle(angol){
    if (angol<0) { return angol + dPi }
    else if(angol>=dPi) {return angol-dPi}
    else {return angol}
}

function linea(x1,y1,x2,y2){
    smap.moveTo(x1,y1)
    smap.lineTo(x2,y2)
    smap.stroke()
}

function castRay(startX,startY,angel){
    let stepX = Math.cos(angel)
    let stepY = Math.sin(angel)

    let x = startX
    let y = startY

    while(x>=0 && x<=schermo.clientWidth && y>=0 && y<=schermo.clientHeight){
        let mapX = Math.floor((x/schermo.clientWidth * map.length))
        let mapY = Math.floor((y/schermo.clientHeight * map.length))
        if(map[mapY] && map[mapY][mapX] && map[mapY][mapX]==1){
            return [x, y, map[mapY][mapX]]
        }
        x+=stepX
        y+=stepY
    }
    return [null,null,null]
}

function update(){
    angle = checkAngle(angle)
    cxt.clearRect(0,0,schermo.clientWidth,schermo.clientHeight)
    smap.clearRect(0,0,schermo.clientWidth,schermo.clientHeight)
    smap.beginPath()

    for(let y=0;y<map.length;y++){
        for(let x=0;x<map[y].length;x++){
            if(map[y][x]==1){
                smap.fillStyle = "rgb(255,0,0)"
                smap.fillRect(x*schermo.clientWidth/map[y].length,y*schermo.clientHeight/map.length,schermo.clientWidth/map[y].length,schermo.clientHeight/map.length)
            }
        }
    }

    smap.fillStyle = "rgb(255,255,255)"
    smap.fillRect(posX-5,posY-5,10,10)
    for(let ray=angle-HalfFOV;ray<=angle+HalfFOV;ray+=FOV/nRays){
        let hitX, hitY, wallType, distance, currentX, wallTop, betterDist, wallHeight
        let casted = castRay(posX,posY,ray)
        hitX = casted[0]
        hitY = casted[1]
        wallType = casted[2]

        distance = Math.sqrt(Math.pow(posX - hitX,2) + Math.pow(posY - hitY,2))
        betterDist = distance * Math.cos(ray - angle)
        wallHeight = schermo.clientHeight / betterDist * 70

        currentX = (ray-(angle-HalfFOV)) / FOV * schermo.clientWidth
        wallTop = schermo.clientHeight/2 - wallHeight/2

        let a = wallHeight/600 * 255
        cxt.fillStyle = `rgb(0,${a},0)`;
        cxt.fillRect(currentX,wallTop,schermo.clientWidth/nRays,wallHeight)
        smap.fillStyle = 'rgb(255,2552,255)'
        linea(posX,posY,hitX,hitY)

    }

    linea(posX,posY,posX+Math.cos(angle)*20,posY+Math.sin(angle)*20)

    document.getElementById("test").innerHTML = angle
    requestAnimationFrame(update)
}
update()
document.addEventListener('keydown',function(info){
    
    if(info.code=="KeyD"){
        angle += rotSpeed
    }
    if(info.code=="KeyA"){
        angle -= rotSpeed
    }

    if(info.code=="KeyW"){
        posX = posX + Math.cos(angle)*speed
        posY = posY + Math.sin(angle)*speed
    }
    if(info.code=="KeyS"){
        posX = posX - Math.cos(angle)*speed
        posY = posY - Math.sin(angle)*speed
    }
    
})

