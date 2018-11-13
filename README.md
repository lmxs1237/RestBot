# RestBot
The 2nd project of CC Group Member: Jiachen Du jd3488, Yuqin Xu yx2478, Tian Xia tx2178

Cognito Endpoint: https://chatbottttt.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=5nf4dko1039e712ddt4ifl3g8a&redirect_uri=https://s3.amazonaws.com/chattbot/Untitled-1.html

index.js LF1,receive LexBot's message and send them to SQS

index2.js LF2,receive SQS, search ID in elasticsearch area, find restaurant in DynamoDB,send SNS message

es_request.json the datas send in elasticsearch area

FILE_3.csv datas send in dynamoDB

NewT.js RestLoad.js create dynamoDB table and put datas into table

scrape.js get restaurants' information using yelp's api
