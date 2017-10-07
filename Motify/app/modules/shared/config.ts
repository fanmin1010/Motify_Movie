export class Config {
    static TMDBAPIKEY = "9e5b32f4c29e6bc9feb26bc796cd6261";
    static GetUserInfoUrl = "https://graph.facebook.com/";
    static GetPopularMovie = "https://api.themoviedb.org/3/movie/popular";
    static GetMovieImage = "https://image.tmdb.org/t/p/";
    static SearchMovieUrl = "https://api.themoviedb.org/3/search/movie";
    // static CheckIsUserExistUrl = "https://dormhjoh8i.execute-api.us-west-2.amazonaws.com/prod/api/motifyuser";
    static CheckIsUserExistUrl = 'https://wkrw1uj7h2.execute-api.us-east-1.amazonaws.com/V1/register';
    static GetMovieNameByIndexUrl = 'https://wkrw1uj7h2.execute-api.us-east-1.amazonaws.com/V1/recommender';
    static PostUserRatingUrl = 'https://wkrw1uj7h2.execute-api.us-east-1.amazonaws.com/V1/recommender';
    static GetRecommendationUrl = 'https://wkrw1uj7h2.execute-api.us-east-1.amazonaws.com/V1/GetRecomm';
    static PostSearchItemUrl = 'https://wkrw1uj7h2.execute-api.us-east-1.amazonaws.com/V1/GetSearch';
}