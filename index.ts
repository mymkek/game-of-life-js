enum CellStates {
    DEATH = 0,
    LIVE = 1
}

class RectGrid {
    private readonly X_DIM: number;
    private readonly Y_DIM: number;
    private readonly _grid: CellStates[][];

    get grid() {
        return this._grid;
    }

    constructor(xDim: number, yDim: number) {
        this.X_DIM = xDim;
        this.Y_DIM = yDim;
        this._grid = new Array(this.X_DIM).fill(null).map(() =>
            new Array(this.Y_DIM).fill(CellStates.DEATH)
        );
    }

    public forEvery(callback: (x: number, y: number, elem: CellStates) => void) {
        for (let i = 0; i < this.X_DIM; i++) {
            for (let j = 0; j < this.Y_DIM; j++) {
                callback(i, j, (this.grid)[i][j]);
            }
        }
    }

    public setElement(x: number, y: number, elem: CellStates): void {
        this._grid[x][y] = elem;
    }

}

class GameOfLife {
    private readonly X_DIM: number;
    private readonly Y_DIM: number;
    private grid: RectGrid;
    private gen: number;

    constructor(xDim: number, yDim: number) {
        this.X_DIM = xDim;
        this.Y_DIM = yDim;
        this.gen = 0;
        this.grid = new RectGrid(xDim, yDim)
    }

    private countLiveCells(): number {
        let liveCells = 0;

        this.grid.forEvery((x, y, elem) => {
            if (elem === CellStates.LIVE) liveCells++;
        })

        return liveCells;
    }

    private nextLiveCells(x: number, y: number): number {
        let lives = 0;
        for (let k = -1; k <= 1; k++) {
            for (let h = -1; h <= 1; h++) {
                if (k === 0 && h === 0) continue;

                let _x = (k + x + this.X_DIM) % this.X_DIM;
                let _y = (h + y + this.Y_DIM) % this.Y_DIM;
                lives += this.grid.grid[_x][_y];
            }
        }
        return lives;
    }

    private nextGen(): void {
        const tmpGrid = new RectGrid(this.X_DIM, this.Y_DIM);

        this.grid.forEvery((x, y, elem) => {
            const liveCells = this.nextLiveCells(x, y);

            if (elem === CellStates.LIVE && liveCells === 2 || liveCells === 3)
                tmpGrid.setElement(x, y, CellStates.LIVE);
            else if (elem === CellStates.DEATH && liveCells === 3)
                tmpGrid.setElement(x, y, CellStates.LIVE);
            else
                tmpGrid.setElement(x, y, CellStates.DEATH);
        })

        this.grid = tmpGrid;
    }

    public randomizeData(): void {
        this.grid.forEvery((x, y, elem) => {
            this.grid.setElement(x, y, Math.random() > 0.5 ? CellStates.LIVE : CellStates.DEATH);
        })
    }

    public iterate(): { grid: CellStates[][], liveCells: number, gen: number } {

        this.nextGen();
        this.gen++;
        const liveCells = this.countLiveCells();
        console.log("title Tugamer89's Game of Life - Gen: " + this.gen + " - Live cells: " + liveCells);

        return {
            grid: this.grid.grid,
            liveCells,
            gen: this.gen
        };

    }
}


