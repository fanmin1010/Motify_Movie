import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MovieDetailPage } from '../shared/moviedetailpage/moviedetailpage';
// var imageSource = require("image-source");
import { Http, Headers, Response, URLSearchParams, RequestOptions} from '@angular/http';
import {Config} from "../shared/config";
import {User} from "../shared/user/user";



@Component({
    selector: 'homeRecommDetail',
    templateUrl: 'modules/homeRecommDetail/homeRecommDetail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    // providers: [User]
})
export class HomeRecommDetailComponent {

    public constructor(private movieRecommDetail: MovieDetailPage, private http: Http, private user: User){
        // console.log(this.movieRecommDetail.title);
    }

    ngOnInit() {
        // this.userService.getUserPhoto(this.user);
        this.postRating();

    }

    postRating() {
        console.log("sending movie detail info");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let body = JSON.stringify({UserId: this.user.id, MovieTMDBId: this.movieRecommDetail.id});
        console.log("posting body is " + body);
        let options = new RequestOptions({headers: headers, method:"post"});
        console.log("posting...");
        this.http.post(Config.PostSearchItemUrl, body, options)
            .map(res => res.json())
            .subscribe((response: any) => {
                console.log("responding message is " + JSON.stringify(response))
            });
    }
}
