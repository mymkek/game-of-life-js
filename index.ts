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
        if(x < 0 || x > this.X_DIM) {
            throw "Unreachable x position";
        }
        if(y < 0 || y > this.Y_DIM) {
            throw "Unreachable y position";
        }
        if(elem !== CellStates.LIVE && elem !== CellStates.DEATH) {
            throw "Wrong elem type";
        }

        this._grid[x][y] = elem;
    }

}

class GameOfLife {
    private readonly X_DIM: number;
    private readonly Y_DIM: number;
    private grid: RectGrid;
    private gen: number;
    private aliveCells: number;

    constructor(xDim: number, yDim: number) {
        this.X_DIM = xDim;
        this.Y_DIM = yDim;
        this.gen = 0;
        this.aliveCells = 0;
        this.grid = new RectGrid(xDim, yDim)
    }

    get getGrid(): { grid: CellStates[][], liveCells: number, gen: number } {
        return {
            grid: this.grid.grid,
            liveCells: this.aliveCells,
            gen: this.gen
        };
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
        this.aliveCells = 0;

        this.grid.forEvery((x, y, elem) => {
            const liveCells = this.nextLiveCells(x, y);

            if (elem === CellStates.LIVE && liveCells === 2 || liveCells === 3) {
                tmpGrid.setElement(x, y, CellStates.LIVE);
                this.aliveCells++;
            }

            else if (elem === CellStates.DEATH && liveCells === 3) {
                tmpGrid.setElement(x, y, CellStates.LIVE);
                this.aliveCells++;
            }
            else {
                tmpGrid.setElement(x, y, CellStates.DEATH);
            }

        })

        this.grid = tmpGrid;
    }

    public addItem(x: number, y: number) {
        if(this.grid.grid[x][y] !== CellStates.LIVE) {
            this.grid.setElement(x, y, CellStates.LIVE);
            this.aliveCells++;
        }
    }

    public removeItem(x: number, y: number) {
        if(this.grid.grid[x][y] !== CellStates.DEATH) {
            this.grid.setElement(x, y, CellStates.DEATH);
            this.aliveCells--;
        }
    }

    public clear(): void {
        this.grid = new RectGrid(this.X_DIM, this.Y_DIM);
        this.aliveCells = 0;
        this.gen = 1;
    }

    public randomizeData(): void {
        this.clear();

        this.grid.forEvery((x, y) => {
            const isAlive = Math.random() > 0.5;

            if(isAlive) {
                this.addItem(x, y);
            }
        })
    }

    public iterate() {
        this.nextGen();
        this.gen++;



    }
}


