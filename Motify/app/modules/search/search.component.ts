import { Component, ChangeDetectionStrategy } from '@angular/core';
import {Http, Headers, Response, URLSearchParams, RequestOptions} from '@angular/http';
import { Config } from '../shared/config';
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Router, NavigationStart, NavigationEnd } from "@angular/router";
import { User } from '../shared/user/user';
import {MovieDetailPage} from "../shared/moviedetailpage/moviedetailpage";
import {RouterExtensions} from "nativescript-angular";

@Component({
    selector: 'search',
    templateUrl: 'modules/search/search.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['modules/search/search.component.css']
})

export class SearchComponent {
    text: string = 'Search Page';
    querystring: string = '';
    SearchMovieResultList;
    fetchedMovie = true;

    constructor(private http: Http, private postHttp: Http, private user: User, private movieDetailPage: MovieDetailPage, private routerExtensions: RouterExtensions) {
        this.SearchMovieResultList = [];
    }

    onTap(movie){
        console.log(JSON.stringify(movie));
        this.movieDetailPage.overview = movie.overview;
        this.movieDetailPage.title = movie.title;
        this.movieDetailPage.id = movie.id;
        this.movieDetailPage.vote = movie.vote;
        this.movieDetailPage.rank = movie.rank;
        // Movie poster on Detail page is subject to change
        this.movieDetailPage.thumbposterUrl = movie.thumbposterUrl;
        this.movieDetailPage.releasedate = movie.releaseDate;

        this.routerExtensions.navigate(["/homeRecommDetail"], {
            transition: {
                name: "flip",
                duration: 500,
                curve: "linear"
            }
        });

    }

    executesearch($event) {
        this.SearchMovieResultList = [];
        var queryitem = this.querystring;
        this.querystring = '';
        let searchparam: URLSearchParams = new URLSearchParams();
        searchparam.set("api_key", Config.TMDBAPIKEY);
        searchparam.set("language","en-US");
        searchparam.set("query", queryitem);
        searchparam.set("page", "1");
        searchparam.set("include_adult","false");
        this.http.get(Config.SearchMovieUrl, {search: searchparam})
            .map(res => res.json())
            .subscribe((response: any) => {
            var results = JSON.parse(JSON.stringify(response.results));
            var len = results.length;
            if ( len > 0 ) {
                // Post first Movie Infomation to API
                // schema: {"UserId":"", "MovieTMDBId":""};
                console.log("Posting first movie fetched to API");
                let headers = new Headers();
                headers.append('Content-Type', 'application/json');
                let body = JSON.stringify({UserId: this.user.id, MovieTMDBId: results[0].id});
                console.log("posting body is " + body);
                let options = new RequestOptions({headers: headers, method:"post"});
                console.log("posting...");
                this.postHttp.post(Config.PostSearchItemUrl, body, options)
                    .map(res => res.json())
                    .subscribe((response: any) => {
                    console.log("responding message is " + JSON.stringify(response))
                    });

                var movieitem;
                if (len > 5) {
                    for ( var i = 0; i <5 ; i++) {
                        movieitem = {
                            overview: (results[i].overview == null || results[i].overview.length ===0 ) ? 'None': results[i].overview,
                            genre: (results[i].genre_ids == null || results[i].genre_ids.length ===0) ? [0]: results[i].genre_ids.map(Number),
                            id: (results[i].id == null || results[i].length ===0 )? 0: results[i].id,
                            thumbposterUrl: (results[i].poster_path == null || results[i].poster_path.length ===0)? 'https://cldup.com/7pg616EKAp.png' : Config.GetMovieImage + 'w92' + results[i].poster_path,
                            releaseDate: (results[i].release_date == null || results[i].release_date.length === 0)? "0000-00-00":results[i].release_date,
                            title: (results[i].title == null || results[i].title.length ===0) ? 'None': results[i].title,
                            vote: (results[i].vote_average == null) ? 0:results[i].vote_average
                    };
                        this.SearchMovieResultList.push(movieitem);
                    }
                    console.log(" Top 5 Movies are collected");
                    console.log(JSON.stringify(this.SearchMovieResultList));
                }
            else {
                    for ( var i = 0; i <len ; i++) {
                        movieitem = {
                            overview: (results[i].overview == null || results[i].overview.length ===0 ) ? 'None': results[i].overview,
                            genre: (results[i].genre_ids == null || results[i].genre_ids.length ===0) ? [0]: results[i].genre_ids.map(Number),
                            id: (results[i].id == null || results[i].length ===0 )? 0: results[i].id,
                            thumbposterUrl: (results[i].poster_path == null || results[i].poster_path.length ===0)? 'https://cldup.com/7pg616EKAp.png' : Config.GetMovieImage + 'w92' + results[i].poster_path,
                            releaseDate: (results[i].release_date == null || results[i].release_date.length === 0)? "0000-00-00":results[i].release_date,
                            title: (results[i].title == null || results[i].title.length ===0) ? 'None': results[i].title,
                            vote: (results[i].vote_average == null) ? 0:results[i].vote_average
                            // overview: results[i].overview,
                            // genre: results[i].genre_ids.map(Number),
                            // id: results[i].id,
                            // thumbposterUrl: results[i].poster_path == null ? 'https://cldup.com/7pg616EKAp.png' : Config.GetMovieImage + 'w92' + results[i].poster_path,
                            // releaseDate: results[i].release_date,
                            // title: results[i].title,
                            // vote: results[i].vote_average
                        };
                        this.SearchMovieResultList.push(movieitem);
                    }
                    console.log(" Top " + len +" Movies are collected");
                    console.log(JSON.stringify(this.SearchMovieResultList));
                }
            }
            else{
                this.fetchedMovie = false;
                console.log("None movie is fetched");
            }

            })
    }

}