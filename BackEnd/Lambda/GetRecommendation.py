import boto3
import json
AWS_ACCESS_KEY = "Input Here"
AWS_SECRET_KEY = "Input Here"
DYNAMODB_TABLE_NAME = 'MovieRecomm'
dynamodb = boto3.client('dynamodb', region_name="us-east-1", aws_access_key_id = AWS_ACCESS_KEY, aws_secret_access_key = AWS_SECRET_KEY)

def lambda_handler(event, context):
    # TODO implement
    listofid = get_recomm(event["genid"])
    rank, moviename= datacleaning(listofid)
    final = {"result":[]}
    for i in range(len(moviename)):
        final["result"].append({"name":moviename[i],"rank":rank[i]})
    return json.dumps(final)
    
def get_recomm(genid):
    ids = [genid]
    keys = [{'userId':  {'S':i}} for i in ids]
    list_of_movie = dynamodb.batch_get_item(RequestItems = {DYNAMODB_TABLE_NAME:{"Keys":keys}})['Responses'][DYNAMODB_TABLE_NAME][0]['movielist']
    list_of_movie = list_of_movie["L"]
    return list_of_movie

def get_moviename(listofid):
    # listofid = ["3635","228"]
    keys = [{"MovieId":  {'S':i}} for i in listofid]
    return dynamodb.batch_get_item(RequestItems = {"MovieRev":{"Keys":keys}})['Responses']["MovieRev"]
    
def datacleaning(response):
    movieid = []
    rank = []
    moviename = []
    for i in range(len(response)):
        movieid.append(response[i]["L"][0]["S"])
        rank.append(response[i]["L"][1]["S"])
    response = get_moviename(movieid)
    for i in range(len(response)):
        moviename.append(response[i]['title']['S'])
    return rank, moviename