from flask import request,Flask, jsonify
import json  
import sqlite3
app = Flask(__name__)
from DatabaseService import DatabaseService

supportedMethods = ['GET', 'POST','DELETE','PUT']


@app.route("/", methods=supportedMethods)
def home():
    return "Hello, World!"

@app.route("/addGroup", methods=['PUT'])
def addGroup():
    content = request.get_json()
    response = {}
    if(content['groupName'] is None or len(content['groupName']) < 1):
        response = {'data': 'Group name not defined or is too short'}
        return jsonify(response), 400 
    response = {content['groupName']: []}
    return jsonify(response)
    
if __name__ == "__main__":
    DatabaseService('db/EchoServer.db')
    app.run(debug=True)