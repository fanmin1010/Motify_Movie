import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Http, Headers, Response, URLSearchParams} from '@angular/http';
import { Config } from '../shared/config';
import { Movie } from '../shared/movie/movie';
import { MovieDetailPage } from '../shared/moviedetailpage/moviedetailpage';
import { RouterExtensions} from "nativescript-angular";

@Component({
  selector: 'trend',
  templateUrl: 'modules/trend/trend.component.html',
  styleUrls:['modules/trend/trend.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrendComponent {
  text: string = 'Trend Page';
  movie: Movie;
  MovieList;

  constructor(private http: Http, private movieDetailPage: MovieDetailPage, private routerExtensions: RouterExtensions){
      this.MovieList = [];
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

  ngOnInit() {
    let popularparam : URLSearchParams = new URLSearchParams();
    popularparam.set("api_key",Config.TMDBAPIKEY);
    popularparam.set("language","en-US");

    this.http.get(Config.GetPopularMovie,{search: popularparam})
    .map(res => res.json())
    .subscribe((response: any) => {
        var results = JSON.parse(JSON.stringify(response.results));
        var movieitem;
        for ( var i =0 ;i <results.length; i++ ) {
            movieitem = {
                overview: results[i].overview,
                genre: results[i].genre_ids.map(Number),
                id: results[i].id,
                thumbposterUrl: Config.GetMovieImage+"w92"+results[i].poster_path,
                releaseDate: results[i].release_date,
                title: results[i].title,
                vote : results[i].vote_average
            };
            this.MovieList.push(movieitem);
        }
      console.log("All Movies are added to MovieList");
    });

  }
}
