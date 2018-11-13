'use strict';

/**
 * This Lambda function is invoked during fulfillment period.
 *
 */

// Load the SDK for JavaScript
var AWS = require('aws-sdk');

// Set the region
AWS.config.update({region: 'us-east-1'});

// create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

// Construct the response to Lex
function close(sessionAttributes, fulfillmentState, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
        },
    };
}


// --------------- Functions that control the bot's behavior -----------------------

/**
 * Performs fulfillment.
 */
function recommendRestaurant(intentRequest, callback) {

    const cuisine = intentRequest.currentIntent.slots.cuisine;
    const date = intentRequest.currentIntent.slots.date;
    const time = intentRequest.currentIntent.slots.time;
    const people = intentRequest.currentIntent.slots.numberofpeople;
    const location= intentRequest.currentIntent.slots.location;
    const phone = intentRequest.currentIntent.slots.phonenumber;


    var params = {
        DelaySeconds: 10,
        MessageAttributes: {
            "Cuisine": {
                DataType: "String",
                StringValue: cuisine
            },
            "Date": {
                DataType: "String",
                StringValue: date
            },
            "Time":{
                DataType: "String",
                StringValue: time
            },
            "People":{
                DataType: "Number",
                StringValue: people
            },
            "Location":{
                DataType: "String",
                StringValue: location
            },
            "Phone":{
                DataType: "Number",
                StringValue: phone
            }
        },
        MessageBody: "New reservation",
    QueueUrl: "https://sqs.us-east-1.amazonaws.com/553196132859/Quest"
    };

    // Send the message to SQS
    sqs.sendMessage(params, function(err, data){
        if (err){
            // Send confirmation message to the user
            callback(close(intentRequest.sessionAttributes, 'Fulfilled',
                { contentType: 'PlainText', content: 'Sorry, something is wrong. ' +
                    'Have a good day.'}));
            console.log("Error", err);
        }else{
            // Send confirmation message to the user
            callback(close(intentRequest.sessionAttributes, 'Fulfilled',
                { contentType: 'PlainText', content: 'Thanks, you are all set.' +
                'Please expect my recommendations shortly! Have a good day.'}));
            console.log("Success", data.MessageId);
        }
    });
}

function Greeting(intentRequest, callback) {
    callback(close(intentRequest.sessionAttributes, 'Fulfilled',
        { contentType: 'PlainText', content: 'Hi there, how can I help?'}));
};

function ThankYou(intentRequest, callback) {
    callback(close(intentRequest.sessionAttributes, 'Fulfilled',
        { contentType: 'PlainText', content: 'You’re welcome'}));
};



// --------------- Intents -----------------------

/**
 * Called when the user specifies an intent for this skill.
 */
function dispatch(intentRequest, callback) {
    console.log(`dispatch userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);

    const intentName = intentRequest.currentIntent.name;

    // Dispatch to intent handlers, just deal with Dining Suggestions Intent
    if (intentName === 'DiningSuggestionsIntent') {
        return recommendRestaurant(intentRequest, callback);
    }else if (intentName === 'GreetingIntent') {
        return Greeting(intentRequest, callback);
    }else if(intentName === 'ThankYouIntent') {
        return ThankYou(intentRequest, callback);
    }

    throw new Error(`Intent with name ${intentName} not supported`);
}


// --------------- Main handler -----------------------

exports.handler = (event, context, callback) => {
    try {
        // By default, treat the user request as coming from the America/New_York time zone.
        process.env.TZ = 'America/New_York';
        console.log(`event.bot.name=$DiningBot`);

        dispatch(event, (response) => callback(null, response));
    } catch (err) {
        callback(err);
    }
};