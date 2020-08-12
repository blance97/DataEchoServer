from flask import request,Flask, jsonify
# from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)

@app.route("/", methods=['GET', 'POST','DELETE','PUT'])
def home():
    return "Hello, World!"

@app.route("/addGroup", methods=['PUT'])
def addGroup():
    content = request.json
    print(content)
    return jsonify(content)
    
if __name__ == "__main__":
    app.run(debug=True)