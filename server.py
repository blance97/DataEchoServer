from flask import request,Flask, jsonify
import json  
import sqlite3
app = Flask(__name__)
from DatabaseService import DatabaseService

supportedMethods = ['GET', 'POST','DELETE','PUT']


@app.route("/*", methods=supportedMethods)
def response():
   
    return "Hello, World!"

@app.route('/<path:path>', methods=supportedMethods)
def catch_all(path):
    endpoints = db.selectAllEndpoints()
    print(("/" + path , request.method) in endpoints)
    return 'You want path: %s' % path

@app.route("/getJSON", methods=['GET'])
def getJSON():
    formattedDict = db.generateFormattedDictionary()
    return jsonify(formattedDict)

@app.route("/loadJSON", methods=['POST'])
def loadJSON():
    try:
        db.loadFormattedJSON({ 
            "groups":{
                "API": [{
                    "endpoint": "/api/*",
                    "description": "",
                    "HTTPMethod": "POST",
                    "responseBodyType": "JSON",
                    "responseBody": "{\"menu\":{\"id\":\"file\",\"value\":\"File\",\"popup\":{\"menuitem\":[{\"value\":\"New\",\"onclick\":\"CreateNewDoc()\"},{\"value\":\"Open\",\"onclick\":\"OpenDoc()\"},{\"value\":\"Close\",\"onclick\":\"CloseDoc()\"}]}}}",
                    "responseHeaders": [{"key": "2"}]
                    }],
                    "General": [{
                        "endpoint": "/api/Please",
                        "description": "descriptiogn",
                        "HTTPMethod": "PUT",
                        "responseBodyType": "JSON",
                        "responseBody": "{\"menu\":{\"id\":\"file\",\"value\":\"File\",\"popup\":{\"menuitem\":[{\"value\":\"New\",\"onclick\":\"CreateNewDoc()\"},{\"value\":\"Open\",\"onclick\":\"OpenDoc()\"},{\"value\":\"Close\",\"onclick\":\"CloseDoc()\"}]}}}",
                        "responseHeaders": [{"key": "2"}, {"key2": "FSDFDSFDSGSFDGBFCVD"}]
                        },
                        {
                            "endpoint": "/api/Work",
                            "description": "descriptiogn2",
                            "HTTPMethod": "GET",
                            "responseBodyType": "JSON",
                            "responseBody": "{\"menu\":{\"id\":\"file\",\"value\":\"File\",\"popup\":{\"menuitem\":[{\"value\":\"New\",\"onclick\":\"CreateNewDoc()\"},{\"value\":\"Open\",\"onclick\":\"OpenDoc()\"},{\"value\":\"Close\",\"onclick\":\"CloseDoc()\"}]}}}",
                            "responseHeaders": [{"key": "2"}]
                        }
                    ]
                }
            }
            )
    except Exception as err:
        return jsonify({"Error": str(err)}), 400
    return jsonify({'message':'Succesfully uploaded JSON to DB'})


@app.route("/addGroup", methods=['PUT'])
def addGroup():
    content = request.get_json()
    groupName = content['name']
    response = {}
    if(groupName is None or len(groupName) < 1):
        response = {'data': 'Group name not defined or is too short'}
        return jsonify(response), 400
    try:
        db.insertNewGroup(groupName)
        response = {groupName: []}
    except Exception as err:
        return jsonify({"Error": str(err)}), 400
    return jsonify(response)
    
if __name__ == "__main__":
    db = DatabaseService('db/EchoServer.db')
    app.run(debug=True)