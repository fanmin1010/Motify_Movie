import os
import time
from pyspark.mllib.recommendation import ALS
from pyspark import SparkContext, SparkConf
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATASETPATH = 'gs://dataproc-707afe6a-f099-42d6-9224-95b125e30b64-us/Motify/ml-latest/'

def get_counts_and_averages(ID_and_ratings_tuple):
    """Given a tuple (movieID, ratings_iterable)
    returns (movieID, (ratings_count, ratings_avg))
    """
    nratings = len(ID_and_ratings_tuple[1])
    return ID_and_ratings_tuple[0], (nratings, float(sum(x for x in ID_and_ratings_tuple[1]))/nratings)

def convert_token(tokens):
    try:
        uid = int(tokens[0])
    except:
        logger.info(tokens[0])
        logger.info("UserID conversion has an error when parsing users.csv")
        uid = 0
    try:
        movieid = int(tokens[1])
    except:
        logger.info(tokens[1])
        logger.info("MovieID conversion has an error when parsing users.csv")
        movieid = 1
    try:
        rating = float(tokens[2])
    except:
        logger.info(tokens[2])
        logger.info("Rating cannot be parsed when parsing users.csv")
        rating = 3.0
    return (uid, movieid, rating)

class RecommendationEngine:
    """A movie recommendation engine
    """
    def __count_and_average_ratings(self):
        """Updates the movies ratings counts from
        the current data self.ratings_RDD
        """
        logger.info("Counting movie ratings...")
        movie_ID_with_ratings_RDD = self.ratings_RDD.map(lambda x: (x[1], x[2])).groupByKey()
        movie_ID_with_avg_ratings_RDD = movie_ID_with_ratings_RDD.map(get_counts_and_averages)
        self.movies_rating_counts_RDD = movie_ID_with_avg_ratings_RDD.map(lambda x: (x[0], x[1][0]))


    def __train_model(self):
        """Train the ALS model with the current dataset
        """
        logger.info("Training the ALS model...")
        self.model = ALS.train(self.ratings_RDD, self.rank, seed=self.seed,
                               iterations=self.iterations, lambda_=self.regularization_parameter)
        logger.info("ALS model built!")


    def __predict_ratings(self, user_and_movie_RDD):
        """Gets predictions for a given (userID, movieID) formatted RDD
        Returns: an RDD with format (movieTitle, movieRating, numRatings)
        """
        predicted_RDD = self.model.predictAll(user_and_movie_RDD)
        predicted_rating_RDD = predicted_RDD.map(lambda x: (x.product, x.rating))

        return predicted_rating_RDD

    def add_ratings(self, content):
        # Loading Updated User Rating Info and calculating
        logger.info("Update: Loading User Info")
        con_list = content.strip().split("\n")
        user_RDD = self.sc.parallelize(con_list)
        user_RDD = user_RDD.map(lambda line: line.split(","))\
            .map(convert_token)
        # user_RDD = self.sc.textFile(user_file_path)
        # user_RDD = user_RDD.map(lambda line: line.split(","))\
        #     .map(lambda tokens: (int(tokens[0]),int(tokens[1]),float(tokens[2])))
        self.ratings_RDD = self.ratings_RDD.union(user_RDD)
        # Re-compute movie ratings count
        self.__count_and_average_ratings()
        # Re-train the ALS model with the new ratings
        self.__train_model()

    def get_ratings_for_movie_ids(self, user_id, movie_ids):
        """Given a user_id and a list of movie_ids, predict ratings for them
        """
        requested_movies_RDD = self.sc.parallelize(movie_ids).map(lambda x: (user_id, x))
        # Get predicted ratings
        ratings = self.__predict_ratings(requested_movies_RDD).collect()
        return ratings

    def get_top_ratings(self, user_id, movies_count):
        """Recommends up to movies_count top unrated movies to user_id
        """
        # Get pairs of (userID, movieID) for user_id unrated movies
        user_unrated_movies_RDD = self.ratings_RDD.filter(lambda rating: not rating[0] == user_id)\
                                                 .map(lambda x: (user_id, x[1])).distinct()
        # Get predicted ratings
        ratings = self.__predict_ratings(user_unrated_movies_RDD).filter(lambda r: r[0]>=25).takeOrdered(movies_count, key=lambda x: -x[1])
        return ratings

    def __init__(self, dataset_path):
        """Init the recommendation engine given a Spark context and a dataset path
        """
        self.dataset_path = dataset_path
        conf = SparkConf().setAppName("movie_recommendation-server")
        # IMPORTANT: pass aditional Python modules to each worker
        self.sc = SparkContext(conf=conf)
        logger.info("Starting up the Recommendation Engine: ")
        # Load ratings data for later use
        logger.info("Loading Ratings data...")
        ratings_file_path = os.path.join(self.dataset_path, 'ratings.csv')
        ratings_raw_RDD = self.sc.textFile(ratings_file_path)
        ratings_raw_data_header = ratings_raw_RDD.take(1)[0]
        self.ratings_RDD = ratings_raw_RDD.filter(lambda line: line!=ratings_raw_data_header)\
            .map(lambda line: line.split(",")).map(lambda tokens: (int(tokens[0]),int(tokens[1]),float(tokens[2]))).cache()
        # Pre-calculate movies ratings counts
        self.__count_and_average_ratings()
        # Train the model
        self.rank = 8
        self.seed = 5L
        self.iterations = 10
        self.regularization_parameter = 0.1
        # self.__train_model()

if __name__ == '__main__':
    RMEngine = RecommendationEngine(DATASETPATH)
    # RMEngine.add_ratings()
