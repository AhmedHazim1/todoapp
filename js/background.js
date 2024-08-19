const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

// canvs size
function resizeCan(){
    canvas.width = innerWidth
    canvas.height = innerHeight
}
addEventListener("resize",resizeCan)
resizeCan()

// get mouse coordinates
let mouse = {
    x: undefined,
    y: undefined,
}
addEventListener("mousemove",e=>{
    mouse.x = e.clientX
    mouse.y = e.clientY
})

// particles class
class particels{
    constructor(x, y, dx, dy, raduis, color){
        this.x = x
        this.y = y
        this.dx = dx
        this.dy = dy
        this.raduis = raduis
        this.color = color
    }
    draw(){
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.raduis, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
    }
    update(){
        if(this.x - this.raduis <= 0 || this.x + this.raduis >= canvas.width){
            this.dx = -this.dx
        }
        if(this.y - this.raduis <= 0 || this.y + this.raduis >= canvas.height){
            this.dy = -this.dy
        }

        this.x += this.dx
        this.y += this.dy
        this.draw()
    }
}

function connect(){
    for(let a = 0; a < particlesArr.length; a++){
        for(let b = a; b < particlesArr.length; b++){
            let x = particlesArr[a].x - particlesArr[b].x
            let y = particlesArr[a].y - particlesArr[b].y
            let dis = Math.hypot(y, x)

            if(dis < 100){
                ctx.lineWidth = .1
                ctx.beginPath()
                ctx.moveTo(particlesArr[a].x, particlesArr[a].y)
                ctx.lineTo(particlesArr[b].x, particlesArr[b].y)
                ctx.strokeStyle = "white"
                ctx.stroke()
            }
        }
    }
}

let particlesArr = []
function init(particelsNum){
    for(let i=0; i < particelsNum; i++){
        let raduis = 3;
        let x = Math.random() * (canvas.width - raduis)
        let y = Math.random() * (canvas.height - raduis)
        let dx = Math.random() * (1 - -1) -1
        let dy = Math.random() * (1 - -1) -1
        let color = "gray"

        let part = new particels(x, y, dx, dy, raduis, color)
        particlesArr.push(part)
    }
}

function animate(){
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particlesArr.forEach(part=>{
        part.update()
        connect()
    })
}

init(30)
animate()