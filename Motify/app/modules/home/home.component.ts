import { Component, ChangeDetectionStrategy,ElementRef, OnInit, ViewChild } from '@angular/core';
import { Page } from'ui/page';
import { RouterExtensions} from "nativescript-angular";
import { Http, Headers, Response, URLSearchParams, RequestOptions} from '@angular/http';
import { NgZone } from "@angular/core";
import { Config } from '../shared/config';
import {View} from 'ui/core/view';
import { Label } from 'ui/label';
import { Image } from 'ui/image';
import { User } from "../shared/user/user";
import { MovieDetailPage } from '../shared/moviedetailpage/moviedetailpage';


@Component({
  selector: 'home',
  templateUrl: 'modules/home/home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
    text: string = '';
    MovieList;
    MovieNameInitial: string;
    MovieNameSearched: string;
    MovieRank: string;
    // @ViewChild("GridLayoutContainer") gridLayoutContainer: ElementRef;

    constructor(private movieDetailPage: MovieDetailPage,  private http: Http, private page: Page, private routerExtensions: RouterExtensions, private ngZone: NgZone, private user: User) {
        this.MovieList = [];
    }

    ngOnInit() {
        console.log("Posting genid "+ this.user.MapId);
        let searchparam: URLSearchParams = new URLSearchParams();
        searchparam.set("genid", this.user.MapId);
        this.http.get(Config.GetRecommendationUrl, {search: searchparam})
            .map(res => res.json())
            .subscribe((response: any) => {
            console.log(JSON.stringify(response));
            console.log(JSON.stringify(response.result));
            console.log(response.errorType);
            if (response.errorType == null){
                // Recommendation result is fetched here
                console.log("The Response result is...");
                console.log(response.result);
                console.log("The Response result length is " + response.result.length);
                var len = response.result.length;
                var result = response.result;
                for (var i=0; i< len;i++){
                    this.MovieNameInitial = result[i].name.toString();
                    this.MovieRank = result[i].rank.toString();
                    if (this.MovieNameInitial.trim().indexOf(",") > 0) {
                        this.MovieNameSearched = this.MovieNameInitial.trim().slice(0, this.MovieNameInitial.indexOf(","));
                    }
                    else {
                        this.MovieNameSearched = this.MovieNameInitial.trim();
                    }
                    this.executeSearch();
                    this.text = '';
                }

            }
            else{
                // Recommendation result has not been generated yet
                this.text = 'Still Computing...'
            }
            });
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

    executeSearch() {
        var queryitem = this.MovieNameSearched;
        let searchparam: URLSearchParams = new URLSearchParams();
        searchparam.set("api_key", Config.TMDBAPIKEY);
        searchparam.set("language", "en-US");
        searchparam.set("query", queryitem);
        searchparam.set("page", "1");
        searchparam.set("include_adult", "false");
        this.http.get(Config.SearchMovieUrl, {search: searchparam})
            .map(res => res.json())
            .subscribe((response: any) => {
                var results = JSON.parse(JSON.stringify(response.results));
                var len = results.length;
                var movie;
                if (len > 0) {
                    movie = {
                        overview: (results[0].overview == null || results[0].overview.length === 0 ) ? 'None' : results[0].overview,
                        genre: (results[0].genre_ids == null || results[0].genre_ids.length === 0) ? [0] : results[0].genre_ids.map(Number),
                        id: (results[0].id == null || results[0].length === 0 ) ? 0 : results[0].id,
                        thumbposterUrl: (results[0].poster_path == null || results[0].poster_path.length === 0) ? 'https://cldup.com/7pg616EKAp.png' : Config.GetMovieImage + 'w154' + results[0].poster_path,
                        releaseDate: (results[0].release_date == null || results[0].release_date.length === 0) ? "0000-00-00" : results[0].release_date,
                        title: (results[0].title == null || results[0].title.length === 0) ? 'None' : results[0].title,
                        vote: (results[0].vote_average == null) ? 0 : results[0].vote_average,
                        rank: this.MovieRank
                    };
                    this.MovieList.push(movie);
                    console.log(" Top 1 Movies are collected");
                }
                else {
                    movie = {
                        overview: 'None',
                        genre: [0],
                        id: 0,
                        thumbposterUrl: 'https://cldup.com/7pg616EKAp.png',
                        releaseDate: "0000-00-00",
                        title: 'None',
                        vote: 0,
                        rank: '0'
                    };
                    this.MovieList.push(movie);
                    console.log("None results found");
                }
            })
    }
}
