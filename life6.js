/*
    1. Any live cell with fewer than two live neighbors dies, as if by underpopulation.
    2. Any live cell with two or three live neighbors lives on to the next generation.
    3. Any live cell with more than three live neighbors dies, as if by overpopulation.
    4. Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
*/

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
}

class CellService {
    constructor (canvas) {
        this.canvas = canvas
        this.width = canvas.width
        this.height = canvas.height
        this.ctx = canvas.getContext("2d")
        this.cells = {}
    }
    initialize () {
        for (let z = 0; z < 50; z++){
            for (let i = 0; i < 50; i++) {
                let id = i + "_" + z
                let cell = new Cell(id, i*10, z*10, 9, 9, false)
                cell.draw(this.ctx)
                this.cells[id] = cell
            }
        }
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
    playTick () {
        let cellsToKill = []
        let cellsToSummon = []
        for (const cellId in this.cells) {
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
                    if (nx > -1 && ny > -1 && nx < 50 && ny < 50) {
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
        if (cellsToKill.length > 0) {
            console.log(cellsToKill)
            for (const cellId of cellsToKill) {
                let cell2 = this.cells[cellId]
                cell2.alive = false
                cell2.draw(this.ctx)
            }
        }
        if (cellsToSummon.length > 0) {
            console.log(cellsToSummon)
            for (const cellId of cellsToSummon) {
                let cell = this.cells[cellId]
                cell.alive = true
                cell.draw(this.ctx)
            }
        }
    }
}

var canvas = null
var ticker = null

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
}