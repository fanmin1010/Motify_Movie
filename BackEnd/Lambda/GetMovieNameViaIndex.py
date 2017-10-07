import boto3
import json
AWS_ACCESS_KEY = "Input Here"
AWS_SECRET_KEY = "Input Here"

def lambda_handler(event, context):
    # TODO implement
    print event
    dynamodb = boto3.client('dynamodb', region_name="us-east-1", aws_access_key_id = AWS_ACCESS_KEY, aws_secret_access_key = AWS_SECRET_KEY)
    id = event[u'MovieId']
    ids = [id]
    keys = [{'movieIndex':  {'S':i}} for i in ids]
    response = dynamodb.batch_get_item(RequestItems = {"NewMovie":{"Keys":keys}})["Responses"]["NewMovie"][0]["title"]["S"]
    return json.dumps({"MovieName":response})