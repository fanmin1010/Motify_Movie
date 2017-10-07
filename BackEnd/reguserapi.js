'use strict';

console.log('Loading function');

// const doc = require('dynamodb-doc');
var aws = require('aws-sdk');
var dynamo = new aws.DynamoDB();

/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 *
 * To scan a DynamoDB table, make a GET request with the TableName as a
 * query string parameter. To put, update, or delete an item, make a POST,
 * PUT, or DELETE request respectively, passing in the payload to the
 * DynamoDB API as a JSON body.
 */
exports.handler = (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    switch (event.httpMethod) {
        case 'DELETE':
            dynamo.deleteItem(JSON.parse(event.body), done);
            break;
        case 'GET':
            dynamo.scan({ TableName: event.queryStringParameters.TableName }, done);
            break;
        case 'POST':
            var data = JSON.parse(event.body);
            var uid = data.uid;
            
            var scanParams = {
                ExpressionAttributeNames: {
                    "#UID": "uid"
                }, 
                ExpressionAttributeValues: {
                    ":a": {
                    S: uid
                    }
                }, 
                FilterExpression: "uid = :a", 
                ProjectionExpression: "#UID", 
                TableName: "Motify_Users"
                
            };
            dynamo.scan(scanParams, function(err, data) {
                
                console.log('scan is done...');
                
                if (err) console.log(err, err.stack); // an error occurred
                else {
                    // successful response
                    if (data.Count == 0)  {
                        var putParams = {
                        Item: {
                            "uid": {
                                S: uid
                            }
                        }, 
                        ReturnConsumedCapacity: "TOTAL", 
                        TableName: "Motify_Users"
                        };
            
            
                        dynamo.putItem(putParams,  function(err, data) {
                            if (err) console.log(err, err.stack); // an error occurred
                            else { 
                                console.log(data);           // successful response
                                done(null, {message: `uid ${uid} generated.`});
                            }
                        });
                    } 
                    else done(null, true);
                }
            });

            break;
        case 'PUT':
            dynamo.updateItem(JSON.parse(event.body), done);
            break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};