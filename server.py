from flask import request,Flask, jsonify, Response
import json  
import sqlite3
app = Flask(__name__)
from DatabaseService import DatabaseService

supportedMethods = ['GET', 'POST','DELETE','PUT']
protectedPaths = [{'api':'/api/DES/getJSON', 'method':'get' },{'api': '/api/DES/loadJSON', 'method':'post' }, {'api':'/api/DES/addGroup', 'method':'put'} ]

@app.route("/*", methods=supportedMethods)
def response():
    return "Hello, World!"

@app.route('/<path:path>', methods=supportedMethods)
def catch_all(path):
    if '/' + path in protectedPaths:
        return jsonify({'Error': '/'})
    endpoints = db.selectAllEndpoints()
    for endpoint in endpoints:
        if '/' + path == endpoint['endpoint'] and request.method == endpoint['HTTPMethod']:
            Headers = {}
            for rh in endpoint['responseHeaders']:
                Headers[list(rh.keys())[0]] = list(rh.values())[0]
            response = Response(response=endpoint['responseBody'], status=200, headers=Headers)
            return response
    return jsonify({"Error": "/{} with method: {} not found".format(path, request.method) }), 404

@app.route("/api/DES/getJSON", methods=['GET'])
def getJSON():
    formattedDict = db.generateFormattedDictionary()
    return jsonify(formattedDict)

@app.route("/api/DES/loadJSON", methods=['POST'])
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


@app.route("/api/DES/addGroup", methods=['PUT'])
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

@app.route("/api/DES/editEndpoint", methods=['POST'])
def editEndpoint():
    content = request.get_json()
    response = {}
    print(content)
    try:
        responseHeaders = content.pop('responseHeaders', None)
        print(responseHeaders)
        originalEndpoint = content.pop('originalEndpoint')
        orignalHTTPMethod = content.pop('originalHTTPMethod')
        db.updateEndpoint(originalEndpoint,orignalHTTPMethod, content)
        response = content
    except Exception as err:
        return jsonify({"Error": str(err)}), 400
    return jsonify(response)
    
if __name__ == "__main__":
    db = DatabaseService('db/EchoServer.db')
    app.run(debug=True)