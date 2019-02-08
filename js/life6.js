/*
    1. Any live cell with fewer than two live neighbors dies, as if by underpopulation.
    2. Any live cell with two or three live neighbors lives on to the next generation.
    3. Any live cell with more than three live neighbors dies, as if by overpopulation.
    4. Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
*/

var canvas = null
var ticker = null

class Cell {
    constructor (id, x, y, w, h, alive) {
        this.id = id
        this.alive = alive
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }
    draw (ctx) {
        ctx.fillStyle = this.alive ? "yellow" : "grey"
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }
    containsPoint(pointerX, pointerY) {
        return  (this.x <= pointerX) && (this.x + this.w >= pointerX) && (this.y <= pointerY) && (this.y + this.h >= pointerY)
    }
}

class CellService {
    constructor (canvas) {
        this.canvas = canvas
        this.width = canvas.width
        this.height = canvas.height
        this.ctx = canvas.getContext("2d")
        this.cells = {}
        this.tickCount = 0
    }
    initialize () {
        for (let z = 0; z < this.height/10; z++){
            for (let i = 0; i < this.width/10; i++) {
                let id = i + "_" + z
                let cell = new Cell(id, i*10, z*10, 9, 9, false)
                cell.draw(this.ctx)
                this.cells[id] = cell
            }
        }
        const state = this
        this.canvas.addEventListener("mousedown", function(e) {
            const pointerX = e.pageX - 10
            const pointerY = e.pageY - 10
            let cells = state.cells
            for (let cellId in cells) {
                if (cells[cellId].containsPoint(pointerX, pointerY)) {
                    let cell = cells[cellId]
                    cell.alive = !cell.alive
                    cell.draw(state.ctx)
                    return
                }
            }
        }, true)
    }
    summon (cellId) {
        let cell = this.cells[cellId]
        cell.alive = true
        cell.draw(this.ctx)
    }
    kill (cellId) {
        let cell = this.cells[cellId]
        cell.alive = false
        cell.draw(this.ctx)
    }
    stop () {
        if (ticker) {
            clearInterval(ticker)
            ticker = null
        }
    }
    setTickCount () {
        this.tickCount += 1
        document.getElementById("tickCount").innerHTML = this.tickCount
    }
    playTick () {
        let cellsToKill = []
        let cellsToSummon = []
        
        for (let cellId in this.cells) {
            let x = parseInt(cellId.substring(0, cellId.indexOf("_")))
            let y = parseInt(cellId.substring(cellId.indexOf("_")+1))
            let neighborCount = 0
            for (let k = -1; k <= 1; k++){
                for (let v = -1; v <= 1; v++){
                    if (k === 0 && v === 0) {
                        continue
                    }
                    let nx = x-k
                    let ny = y-v
                    if (nx > -1 && ny > -1 && nx < this.width/10 && ny < this.height/10) {
                        let nid = nx + "_" + ny
                        let neighbor = this.cells[nid]
                        if (neighbor.alive) {
                            neighborCount += 1
                        }
                    }
                }
            }
            let cell = this.cells[cellId]
            if (cell.alive) {
                if (neighborCount < 2 || neighborCount > 3) {
                    cellsToKill.push(cell.id)
                }
            } else {
                if (neighborCount === 3) {
                    cellsToSummon.push(cell.id)
                }
            }
        }

        if (cellsToKill.length < 1 && cellsToSummon.length < 1) {
            this.stop()
            return
        }

        for (const cellId of cellsToKill) {
            this.kill(cellId)
        }
        for (const cellId of cellsToSummon) {
            this.summon(cellId)
        }
        this.setTickCount()
    }
}

function init(speed) {
    if (canvas) {
        if (ticker) {
            clearInterval(ticker)
            ticker = null
        }
        ticker = setInterval(function(){
            canvas.playTick()
        }, speed)
    }
}

function summon(type) {
    if (ticker) {
        clearInterval(ticker)
        ticker = null
    }
    canvas = new CellService(document.getElementById("canvas"))
    canvas.initialize()
    if (type === "diehard") {    
        canvas.summon("35_15")
        canvas.summon("36_15")
        canvas.summon("36_16")
        canvas.summon("40_16")
        canvas.summon("41_16")
        canvas.summon("42_16")
        canvas.summon("41_14")
    }
    if (type === "bar") {    
        canvas.summon("25_15")
        canvas.summon("25_16")
        canvas.summon("25_17")
        canvas.summon("25_18")
        canvas.summon("25_19")
        canvas.summon("25_20")
        canvas.summon("25_21")
        canvas.summon("25_22")
        canvas.summon("25_23")
        canvas.summon("25_24")
    }
    if (type === "glider") {    
        canvas.summon("20_19")
        canvas.summon("21_19")
        canvas.summon("22_19")
        canvas.summon("21_17")
        canvas.summon("22_18")
    }
    if (type === "cgg") {    
        canvas.summon("20_18")
        canvas.summon("21_18")
        canvas.summon("20_19")
        canvas.summon("21_19")

        canvas.summon("28_19")
        canvas.summon("28_20")
        canvas.summon("29_18")
        canvas.summon("29_20")
        canvas.summon("30_18")
        canvas.summon("30_19")

        canvas.summon("36_20")
        canvas.summon("36_21")
        canvas.summon("36_22")
        canvas.summon("37_20")
        canvas.summon("38_21")

        canvas.summon("42_17")
        canvas.summon("42_18")
        canvas.summon("43_16")
        canvas.summon("43_18")
        canvas.summon("44_16")
        canvas.summon("44_17")

        canvas.summon("44_28")
        canvas.summon("44_29")
        canvas.summon("45_28")
        canvas.summon("45_30")
        canvas.summon("46_28")

        canvas.summon("54_16")
        canvas.summon("54_17")
        canvas.summon("55_16")
        canvas.summon("55_17")

        canvas.summon("55_23")
        canvas.summon("55_24")
        canvas.summon("55_25")
        canvas.summon("56_23")
        canvas.summon("57_24")
    }
}

function clearOnLoad() {
    if (ticker) {
        clearInterval(ticker)
        ticker = null
    }
    canvas = new CellService(document.getElementById("canvas"))
    canvas.initialize()
}

function clear2() {
    if (ticker) {
        clearInterval(ticker)
        ticker = null
    }
    canvas = new CellService(document.getElementById("canvas"))
    canvas.initialize()
}
