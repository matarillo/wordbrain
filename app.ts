import Vue from 'vue';
import { allWordList } from './word';

const SIZE: number = 4;

class App {
    private _cells: string;
    private _wordList: string[] = allWordList;
    private _wordsLength: number;
    vueModel = {
        el: "#container",
        data: {
            cells: "",
            c00: "",
            c10: "",
            c20: "",
            c30: "",
            c01: "",
            c11: "",
            c21: "",
            c31: "",
            c02: "",
            c12: "",
            c22: "",
            c32: "",
            c03: "",
            c13: "",
            c23: "",
            c33: "",
            wordsLength: "0",
            words: [] as string[]
        },
        methods: {
            updateCells: () => {
                this.updateCells(this.vueModel.data.cells);
                this.updateVueModelCells();
            },
            findWords: () => {
                this.findWords(this.vueModel.data.wordsLength);
            }
        }
    };
    constructor() {
        this._cells = "ABCD,EFGH,IJKL,MNOP";
        this._wordsLength = 0;
        this.updateVueModelCells();
    }
    private updateCells(value: string) {
        let arr: string[] = value.split(",");
        if (arr.length == SIZE && arr.every(x => x.length === SIZE)) {
            this._cells = value;
        }
    }
    private updateVueModelCells() {
        let arr: string[] = this._cells.split(",");
        this.vueModel.data.cells = this._cells;
        this.vueModel.data.c00 = arr[0].charAt(0);
        this.vueModel.data.c10 = arr[0].charAt(1);
        this.vueModel.data.c20 = arr[0].charAt(2);
        this.vueModel.data.c30 = arr[0].charAt(3);
        this.vueModel.data.c01 = arr[1].charAt(0);
        this.vueModel.data.c11 = arr[1].charAt(1);
        this.vueModel.data.c21 = arr[1].charAt(2);
        this.vueModel.data.c31 = arr[1].charAt(3);
        this.vueModel.data.c02 = arr[2].charAt(0);
        this.vueModel.data.c12 = arr[2].charAt(1);
        this.vueModel.data.c22 = arr[2].charAt(2);
        this.vueModel.data.c32 = arr[2].charAt(3);
        this.vueModel.data.c03 = arr[3].charAt(0);
        this.vueModel.data.c13 = arr[3].charAt(1);
        this.vueModel.data.c23 = arr[3].charAt(2);
        this.vueModel.data.c33 = arr[3].charAt(3);
    }
    private findWords(length: string) {
        let num: number = parseInt(length);
        if (isNaN(num)) {
            return;
        }
        this._wordsLength = num;
        if (num <= 0) {
            return;
        }
        let cells: string[] = this._cells.split(",");
        let m: boolean[][] = [[false, false, false, false], [false, false, false, false], [false, false, false, false], [false, false, false, false]];
        let words: string[][] = new Array(16);
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                let i = y * 4 + x;
                words[i] = this.searchRecc(cells, m, [], num, x, y);
            }
        }
        this.vueModel.data.words = words.reduce((prev, curr) => prev.concat(curr));
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
        return (0 <= x && x < SIZE && 0 <= y && y < SIZE);
    }
}


document.addEventListener("DOMContentLoaded", function () {
    // document.getElementById('el').innerHTML = words[0];
    new Vue(new App().vueModel);
});
