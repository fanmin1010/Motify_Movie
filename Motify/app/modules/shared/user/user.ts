import { Injectable } from '@angular/core';

@Injectable()
export class User {
    public token: string = '';
    public name: string = '';
    public id: string = '';
    public photoUrl: string = '';
    public constructor() {}
    public MapId: string = '';
}