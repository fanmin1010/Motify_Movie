import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

import { User } from './user';
import { Config } from '../config';

@Injectable()
export class UserService {
    constructor(private http: Http, private user: User) {}

    getUserNameAndIdAndPhoto(user: User) {
        this.http.get( Config.GetUserInfoUrl + "me?access_token=" + user.token.toString())
            .map(res => res.json())
            .subscribe((response: any) => {
            console.log(JSON.stringify(response));
            user.name = response.name;
            user.id = response.id;
            // user.photoUrl = Config.GetUserInfoUrl + user.id.toString() + '/picture?type=large';
            user.photoUrl = Config.GetUserInfoUrl + user.id.toString() + '/picture';
            console.log("User INFO is fetched");
            console.log(JSON.stringify(user));
            });
    }

    // deprecated function
    // getUserPhoto(user: User) {
    //     console.log(Config.GetUserInfoUrl + user.id.toString() + '/picture');
    //     this.http.get( Config.GetUserInfoUrl + user.id.toString() + '/picture')
    //         // .map(res => res.json())
    //         .subscribe((response: any) => {
    //         user.photoUrl = response;
    //         console.log(response);
    //         console.log("user profile is fetched");
    //         })
    // }
}