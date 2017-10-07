import { Component } from '@angular/core';
import * as tnsOAuthModule from 'nativescript-oauth';
import { Router } from '@angular/router';


@Component({
    selector: "logout",
    templateUrl: 'modules/logout/logout.component.html'
})

export class LogoutComponent {

    constructor(private router: Router) {
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
                this.router.navigate(['/']);
            })
    }
    // public onTapLogout() {
    //     tnsOAuthModule.logout()
    //         .then(() => {
    //             console.log('logged out');
    //         })
    //         .catch((er) => {
    //             console.log('error happens when logging out');
    //             console.log('printing out error');
    //             console.dir(er);
    //         })
    //         .then(() => {
    //         this.router.navigate(['/']);
    //         })
    // }
    //
    // public authcallback() {
    //     console.log("this is callback")
    // }
}

