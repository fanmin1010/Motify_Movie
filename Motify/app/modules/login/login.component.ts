import { Component } from '@angular/core';
import * as tnsOAuthModule from 'nativescript-oauth';
import { Router } from '@angular/router';
import { Page } from'ui/page';
import { RouterExtensions } from "nativescript-angular";
import { User } from '../shared/user/user';
import { UserService } from "../shared/user/user.service";
import { Config } from '../shared/config';
import { Http, Headers, Response, URLSearchParams, RequestOptions} from '@angular/http';


@Component({
    selector: "login",
    templateUrl: 'modules/login/login.component.html',
    providers: [UserService]
})

export class LoginComponent {

    constructor(private router: Router, private page: Page, private routerExtensions: RouterExtensions, private user: User, private userService: UserService, private http: Http) {}

    ngOnInit() {
        this.page.actionBarHidden = true;
    }

    public onTapLogin() {
        tnsOAuthModule.ensureValidToken()
            .then((token: string) => {
                console.log('Token is ' + token);
                this.user.token = token;
                this.userService.getUserNameAndIdAndPhoto(this.user);
            })
            .catch((er) => {
                console.log('error logging in');
            })
            .then(() => {
            console.log("checking if user exists...");
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            console.log("Headers is " +  headers);
            let body =  JSON.stringify({uid:this.user.id});
            console.log("Body is " + body);
            let options = new RequestOptions({headers: headers, method: "post"});
            console.log("fetching...");
            var isNewUser = true;
            this.http.post(Config.CheckIsUserExistUrl, body, options)
                .map(res => res.json())
                .subscribe((res: any) => {
                console.log("Responding message is " + JSON.stringify(res));
                console.log("The status message is " + JSON.stringify(res.status));
                console.log(JSON.stringify(res.status).trim() === '"true"');
                console.log(JSON.stringify(res.status).trim() === '"false"');
                if (JSON.stringify(res.status) === '"true"'){
                    // if res.status == true, then it's not new user.
                    console.log("Not New User");
                    this.user.MapId = JSON.stringify(res.id).slice(1, JSON.stringify(res.id).length-1).trim();
                    console.log("The MapId returned from database is " + this.user.MapId);
                    this.routerExtensions.navigate(['/home'], {
                        clearHistory: true,
                        transition: {
                            name: 'flip',
                            duration: 500,
                            curve:'linear'
                        }
                    });
                }
                else if (JSON.stringify(res.status) === '"false"') {
                    // if res.status == false, then it's new user
                    console.log("New User");
                    this.user.MapId = JSON.stringify(res.id).slice(1, JSON.stringify(res.id).length-1).trim();
                    console.log("The MapId returned from database is" + this.user.MapId);
                    this.routerExtensions.navigate(['/initRecomm'], {
                        clearHistory: true,
                        transition: {
                            name: 'flip',
                            duration: 500,
                            curve: 'linear'
                        }
                    });
                }

                else {
                    console.log("error appear in POST responding message");
                    console.log("Go To homepage without setting MapId");
                    this.routerExtensions.navigate(['/home'], {
                        clearHistory: true,
                        transition: {
                            name: 'flip',
                            duration: 500,
                            curve: 'linear'
                        }
                    })
                }
                });

        })
            // this.http.post(Config.CheckIsUserExistUrl, {search: searchparam})
            //     .map(res => res.json())
            //     .subscribe((response: any) => {
            //     console.log(response);
            //     })
                // if (this.user.isNewUser === false) {
                //     this.routerExtensions.navigate(['/home'], {
                //         clearHistory: true,
                //         transition: {
                //             name: "flip",
                //             duration: 500,
                //             curve: "linear"
                //         }
                //     });
                // }
                // else {
                //     this.routerExtensions.navigate(['/initRecomm'],{
                //
                //         clearHistory: true,
                //         transition:{
                //             name: 'flip',
                //             duration: 500,
                //             curve: 'linear'
                //         }
                //     })
                // }

    }

    public authcallback() {
        console.log("this is callback")
    }

    public onTapLogout() {
        tnsOAuthModule.logout()
            .then(() => {
                console.log('logged out');
            })
            .catch((er) => {
                console.log('error happens when logging out');
                console.log('printing out error');
                console.dir(er);
            })
            .then(() => {
            this.router.navigate(['/'])
            })
    }
}

