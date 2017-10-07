from pyspark import SparkContext, SparkConf
from engine import RecommendationEngine
import boto3
import time
import logging
import csv
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATAPATH = 'gs://dataproc-707afe6a-f099-42d6-9224-95b125e30b64-us/Motify/ml-latest/'

AWS_ACCESS_KEY = 'Input Key Here'
AWS_SECRET_KEY = 'Input Key Here'
s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY)
Bucketname = 'motify'

def rename(Bucketname, client):
    copy_source = {'Bucket': Bucketname,'Key': 'users.csv'}
    client.copy(copy_source, Bucketname, 'users_old.csv')
    client.delete_object(Bucket= Bucketname,Key='users.csv')

def updateduser(content):
    user = []
    for row in content:
        user.append(row.split(',')[0])
    user = list(set(user))
    return user

def uploadtoDynamo(Bucketname, updatedfile):
    parsed = []
    for key in updatedfile:
        keyset = str(key)
        item = {'userId':keyset}
        item['movielist'] = []
        row = updatedfile[key]
        for i in range(len(row)):
            temp = []
            temp.append(str(row[i][0]))
            temp.append(str(row[i][1]))
            item['movielist'].append(temp)
        parsed.append(item)

    AWS_ACCESS_KEY = 'AKIAIC73SLYYTN6YEJNA'
    AWS_SECRET_KEY = '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'
    DYNAMODB_TABLE_NAME = 'MovieRecomm'
    dynamodb = boto3.resource('dynamodb',region_name='us-east-1',aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY)
    table = dynamodb.Table(DYNAMODB_TABLE_NAME)
    with table.batch_writer() as batch:
        for item in parsed:
            batch.put_item(Item= item)


def run_app():
    RMEngine = RecommendationEngine(DATAPATH)
    no_train = True
    while True:
        try:
            s3.download_file(Bucketname, 'users.csv', 'users.csv')
            no_train = False
        except:
            no_train = True
            logger.info("No file to Train, Sleep for 10 seconds")
            time.sleep(10)

        if not no_train:
            s3.delete_object(Bucket= Bucketname,Key='users.csv')
            logger.info("Adding Users...")
            with open('users.csv', 'r') as content_file:
                content = content_file.read()

            with open('users.csv', 'r') as content_file:
                users = updateduser(content_file.readlines())

            RMEngine.add_ratings(content)
            updatedfile = {}
            for user in users:
                logger.info("Get Ratings of User "+str(user)+" ...")
                updaterow = RMEngine.get_top_ratings(user, 25)
                updatedfile[user] = updaterow

            uploadtoDynamo(Bucketname, updatedfile)
            logger.info("Prediction Successfully Uploaded to S3!")
    

if __name__ == '__main__':
    run_app()
