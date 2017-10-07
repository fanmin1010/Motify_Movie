import { Injectable } from '@angular/core';

@Injectable()
export class Recommendation {
    // index is the key indicating which movie recommendation service is working on
    // index is not used
    public index = 0;
    public MovieIndex: number = 0;
    public MovieNameOriginal: string = '';
    public MovieRecomm: string = '';
}