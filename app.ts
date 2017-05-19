import Vue from 'vue';
import { allWordList } from './word';

type VueData = {
    cellSize: string;
    cellData: string;
    cells: string[][];
    wordsLength: string;
    words: string[];
}

class App {
    private _cellSize: number;
    private _cellData: string;
    private _wordList: string[] = allWordList;
    private _wordsLength: number;
    constructor() {
        this._cellSize = 4;
        this._cellData = "ABCD,EFGH,IJKL,MNOP";
        this._wordsLength = 0;
    }
    getData(): VueData {
        return {
            cellSize: this._cellSize.toString(),
            cellData: this._cellData,
            cells: this.getCells(),
            wordsLength: this._wordsLength.toString(),
            words: [],
        };
    }
    updateSize(data: VueData) {
        var size: number = parseInt(data.cellSize);
        if (isNaN(size) || size <= 0) {
            data.cellSize = this._cellSize.toString();
            return;
        }
        this.setCellSize(size);
        data.cellData = this._cellData;
        data.cells = this.getCells();
    }
    updateCells(data: VueData) {
        let arr: string[] = data.cellData.split(",");
        if (arr.length !== this._cellSize || arr.some(x => x.length !== this._cellSize)) {
            data.cellData = this._cellData;
            return;
        }
        this._cellData = data.cellData;
        data.cells = this.getCells();
    }
    updateWords(data: VueData) {
        data.words = this.findWords(data.wordsLength);
    }
    private setCellSize(size: number) {
        this._cellSize = size;
        let l = size * size;
        let arr: string[] = new Array(size);
        let counter: number = 0;
        for (let y = 0; y < size; y++) {
            arr[y] = "";
            for (let x = 0; x < size; x++) {
                arr [y] += String.fromCharCode(65 + counter);
                counter++;
                if (counter === 26) {
                    counter = 0;
                }
            }
        }
        this._cellData = arr.join(",");
    }
    private getCells(): string[][] {
        return this._cellData.split(",").map(x => x.split(""));
    }
    private findWords(length: string): string[] {
        let num: number = parseInt(length);
        if (isNaN(num)) {
            return [];
        }
        this._wordsLength = num;
        if (num <= 0) {
            return [];
        }
        let cells: string[] = this._cellData.split(",");
        let m: boolean[][] = new Array(this._cellSize);
        for (let i = 0; i < m.length; i++) {
            m[i] = new Array(this._cellSize).fill(false);
        }
        let words: string[][] = new Array(this._cellSize * this._cellSize);
        for (let y = 0; y < this._cellSize; y++) {
            for (let x = 0; x < this._cellSize; x++) {
                let i = y * this._cellSize + x;
                words[i] = this.searchRecc(cells, m, [], num, x, y);
            }
        }
        return words.reduce((prev, curr) => prev.concat(curr));
    }
    private someStartWith(prefix: string): boolean {
        let lowerPrefix = prefix.toLowerCase();
        for (let i = 0; i < this._wordList.length; i++) {
            if (this._wordList[i].startsWith(lowerPrefix)) {
                return true;
            }
        }
        return false;
    }
    private contains(word: string): boolean {
        let lower = word.toLowerCase();
        for (let i = 0; i < this._wordList.length; i++) {
            if (this._wordList[i] === lower) {
                return true;
            }
        }
        return false;
    }
    private searchRecc(cells: string[], m: boolean[][], v: string[], l: number, x: number, y: number): string[] {
        v.push(cells[y].charAt(x));
        let w: string = v.join("");
        let r: string[] = [];
        l--;
        if (l === 0 && this.contains(w)) {
            r = [w];
        } else if (l > 0 && this.someStartWith(w)) {
            m[y][x] = true;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) {
                        continue;
                    }
                    let x2 = x + dx;
                    let y2 = y + dy;
                    if (this.inside(x2, y2) && !m[y2][x2]) {
                        r = r.concat(this.searchRecc(cells, m, v, l, x2, y2));
                    }
                }
            }
            m[y][x] = false;
        }
        v.pop();
        return r;
    }
    private inside(x: number, y: number): boolean {
        return (0 <= x && x < this._cellSize && 0 <= y && y < this._cellSize);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let app: App = new App();
    let options: {
        el: string;
        data: VueData;
        methods?: { [key: string]: (this: Vue, ...args: any[]) => any };
    } = {
        el: "#container",
        data: app.getData(),
        methods: {
            updateSize: () => app.updateSize(options.data),
            updateCells: () => app.updateCells(options.data),
            findWords: () => app.updateWords(options.data),
        },
    };
    new Vue(options);
});
