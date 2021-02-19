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
    print(endpoints)
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

@app.route("/api/DES/loadJSON", methods=['PUT'])
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
    try:
        responseHeaders = content.pop('responseHeaders', None)
        print(content)
        print(responseHeaders)
        originalEndpoint = content.pop('originalEndpoint')
        orignalHTTPMethod = content.pop('originalHTTPMethod')
        db.updateEndpoint(originalEndpoint,orignalHTTPMethod, content)

        if len(responseHeaders) > 10:
            return jsonify({"Error": 'Limit number of headers to 10'}), 400
        for val in responseHeaders:
            db.deleteResponseHeadersEndpoint(content['endpoint'],content['HTTPMethod'])
            db.insertResponseHeaders(content['endpoint'], content['HTTPMethod'], val)
        response = content

    except Exception as err:
        return jsonify({"Error": str(err)}), 400
    return jsonify(response)

@app.route("/api/DES/addEndpoint", methods=['POST'])
def addEndpoint():
    content = request.get_json()
    response = {}
    try:
        content['endpoint'] = content['endpoint'].strip()
        
        if len(content['endpoint']) < 1 or len(content['HTTPMethod']) < 1: #Just making sure that the endpoint and http methods are defined
            return jsonify({"Error": 'Endpoint Name or HTTPMethod or both are undefined'}), 400

        if content['endpoint'].endswith('/') and len(content['endpoint']) > 1:
            printf('removing ending / on string {}', content['endpoint'])
            content['endpoint'] = content['endpoint'][:-1]
        groupName = content.pop('groupName', None)
        responseHeaders = content.pop('responseHeaders', None)
        print(content)


        db.insertEndpoint(groupName, content)
        if len(responseHeaders) > 10:
            return jsonify({"Error": 'Limit number of headers to 10'}), 400
        for val in responseHeaders:
            db.insertResponseHeaders(content['endpoint'], content['HTTPMethod'], val)

        content['groupName'] = groupName
        content['responseHeaders'] = responseHeaders
        content.pop('groupId', None)
        response = content
  
    except Exception as err:
        return jsonify({"Error": str(err)}), 400
    return jsonify(response)
        
if __name__ == "__main__":
    db = DatabaseService('db/EchoServer.db')
    app.run(debug=True)