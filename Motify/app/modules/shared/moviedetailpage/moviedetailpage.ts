import { Injectable } from '@angular/core';

@Injectable()
export class MovieDetailPage {
    public rank: string = '';
    public overview: string = '';
    public id: string = '';
    public thumbposterUrl: string = '';
    public releasedate: string = '';
    public title: string = '';
    public vote: string = '';
}