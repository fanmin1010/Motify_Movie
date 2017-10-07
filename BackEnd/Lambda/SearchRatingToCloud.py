import boto3
import json
import random
AWS_ACCESS_KEY = "Input Here"
AWS_SECRET_KEY = "Input Here"
bucketname = "motify"
def lambda_handler(event, context):
    # TODO implement
    AWS_ACCESS_KEY = "Input Here"
    AWS_SECRET_KEY = "Input Here"
    FBId = event["UserId"]
    UserId = findGenid(FBId)
    MTid = str(event["MovieTMDBId"])
    movieid = findTMDB(MTid)
    rating = "3.5"
    s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY)
    try:
        s3.download_file(bucketname, 'users.csv', '/tmp/users.csv')
    except:
        pass
    s3.download_file(bucketname,'historical.csv','/tmp/historical.csv')
    
    users = open("/tmp/users.csv","a+")
    historical = open("/tmp/historical.csv","a+")
    users.write(UserId+","+movieid+","+rating+"\n")
    historical.write(UserId+","+movieid+","+rating+"\n")
    users.close()
    historical.close()
    s3.upload_file("/tmp/users.csv", bucketname,"users.csv")
    s3.upload_file("/tmp/historical.csv", bucketname,"historical.csv")
    return json.dumps({"status":"success"})
    

def findGenid(uid):
    DYNAMODB_TABLE_NAME = 'User'
    dynamodb = boto3.client('dynamodb', region_name="us-east-1", aws_access_key_id = AWS_ACCESS_KEY, aws_secret_access_key = AWS_SECRET_KEY)
    ids = [uid]
    keys = [{'FBId':  {'S':i}} for i in ids]
    print uid
    genid = dynamodb.batch_get_item(RequestItems = {DYNAMODB_TABLE_NAME:{"Keys":keys}})["Responses"][DYNAMODB_TABLE_NAME][0]["genid"]["N"]
    return genid

def findTMDB(mid):
    DYNAMODB_TABLE_NAME = 'Link'
    dynamodb = boto3.client('dynamodb', region_name="us-east-1", aws_access_key_id = AWS_ACCESS_KEY, aws_secret_access_key = AWS_SECRET_KEY)
    ids = [mid]
    keys = [{'tmdbid':  {'S':i}} for i in ids]
    try:
        movieid = dynamodb.batch_get_item(RequestItems = {DYNAMODB_TABLE_NAME:{"Keys":keys}})["Responses"][DYNAMODB_TABLE_NAME][0]["movieid"]["S"]
    except:
        dynamodb = boto3.resource('dynamodb',region_name='us-east-1',aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY)
        table = dynamodb.Table(DYNAMODB_TABLE_NAME)
        movieid = str(random.randint(200000, 400000))
        item = {"tmdbid":mid, "movieid":movieid}
        with table.batch_writer() as batch:
            batch.put_item(Item = item)
    return movieid