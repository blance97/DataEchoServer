from flask import request,Flask, jsonify
import json  
import sqlite3
app = Flask(__name__)
from DatabaseService import DatabaseService

supportedMethods = ['GET', 'POST','DELETE','PUT']


@app.route("/", methods=supportedMethods)
def home():
    return "Hello, World!"

@app.route("/getJSON", methods=['GET'])
def getJSON():
    formatedDict = db.generateFormatedDictionary()
    return jsonify(formatedDict)

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