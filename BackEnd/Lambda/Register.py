import json
import random
import boto3

AWS_ACCESS_KEY = "Input Key Here"
AWS_SECRET_KEY = "Input Key Here"
DYNAMODB_TABLE_NAME = 'User'

def lambda_handler(event, context):
    # TODO implement
    fbid = event["uid"]
    result = idexist(fbid)
    if  result == -1:
        genid = random.randint(300000, 500000)
        postdynamo(fbid, genid)
        return json.dumps({"status":"false","id":genid})
    else:
        return json.dumps({"status":"true","id":result})
    
    
def idexist(fbid):
    dynamodb = boto3.client('dynamodb', region_name="us-east-1", aws_access_key_id = AWS_ACCESS_KEY, aws_secret_access_key = AWS_SECRET_KEY)
    ids = [fbid]
    keys = [{'FBId':  {'S':i}} for i in ids]
    try:
        response = dynamodb.batch_get_item(RequestItems = {DYNAMODB_TABLE_NAME:{"Keys":keys}})["Responses"][DYNAMODB_TABLE_NAME][0]['genid']['N']
        return response
    except:
        return -1
    
def postdynamo(fbid, genid):
    dynamodb = boto3.resource('dynamodb',region_name='us-east-1',aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY)
    table = dynamodb.Table(DYNAMODB_TABLE_NAME)
    item = {"FBId":fbid, "genid": genid}
    with table.batch_writer() as batch:
        batch.put_item(Item= item)