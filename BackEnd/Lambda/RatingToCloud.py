import boto3
import json

AWS_ACCESS_KEY = "Input Here"
AWS_SECRET_KEY = "Input Here"
bucketname = 'motify'

def lambda_handler(event, context):
    # TODO implement
    # {"rating":"4","MovieIndex":"28321","UserId":"297313930711915"}
    movieid = movieparser(event["MovieIndex"])
    rating = event["rating"]
    UserId = event["UserId"]
    
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
    return json.dumps({"result":"Success!"})

    
def movieparser(index):
    AWS_ACCESS_KEY = "Input Here"
    AWS_SECRET_KEY = "Input Here"
    dynamodb = boto3.client('dynamodb', region_name="us-east-1", aws_access_key_id = AWS_ACCESS_KEY, aws_secret_access_key = AWS_SECRET_KEY)
    id = index
    ids = [id]
    keys = [{'movieIndex':  {'S':i}} for i in ids]
    response = dynamodb.batch_get_item(RequestItems = {"Movie":{"Keys":keys}})["Responses"]["Movie"][0]["movieId"]["S"]
    return response