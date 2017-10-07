/*
 movie.ts is not yet in use, please notify
 */
import { Injectable } from '@angular/core';
@Injectable()
export class Movie {
    public title: string = '';
    public id: string = '';
    public posterUrl: string = '';
    public overview: string = '';
    public voteavg: number = 0.0;
    public releaseDate: string = '';
    public genre : [number] = [0];
    public constructor() {}
}