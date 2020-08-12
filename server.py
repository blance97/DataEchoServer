from flask import request,Flask, jsonify
import json
# from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)

@app.route("/", methods=['GET', 'POST','DELETE','PUT'])
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
    app.run(debug=True)