// import { Component } from "@angular/core";
//
// @Component({
//   selector: "my-app",
//   template: '<page-router-outlet></page-router-outlet>'
// })
// export class AppComponent {
//
// }


import { Component } from "@angular/core";
import * as tnsOAuthModule from 'nativescript-oauth';

@Component({
    selector: "my-app",
    template: '<page-router-outlet></page-router-outlet>'
    // templateUrl: "../app/modules/login/login.component.html"
})

export class AppComponent {
    // public onTapLogin() {
    //     tnsOAuthModule.ensureValidToken()
    //         .then((token: string) => {
    //         console.log('Token is ' + token);
    //         })
    //         .catch((er) => {
    //         console.log('error logging in');
    //         });
    // }

//     public onTapLogout() {
//         tnsOAuthModule.logout()
//             .then(() => {
//             console.log('logged out');
//             })
//             .catch((er) => {
//             console.log('error happens when logging out');
//             console.log('printing out error');
//             console.dir(er);
//             });
//     }
//
//     public authcallback() {
//         console.log("this is callback")
//     }
//
}