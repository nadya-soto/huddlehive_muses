import json
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///dev.db'  # SQLite file in your project folder
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define your User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(10))
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    postcode = db.Column(db.String(20))
    phone_num = db.Column(db.String(20))
    gender = db.Column(db.String(10))

    def to_dict(self):
        return {
            'title': self.title,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'postcode': self.postcode,
            'phone_num': self.phone_num,
            'gender': self.gender
        }

@app.before_first_request
def create_tables():
    db.create_all()

@app.route("/")
def home():
    return jsonify(message="Welcome to the Hidden Spaces API")

@app.route('/user', methods=['POST'])
def register_user():
    request_data = request.get_json()

    required_fields = ('title', 'postcode', 'phone_num', 'first_name', 'last_name', 'gender')
    if not all(key in request_data for key in required_fields):
        return output_error(400, 'Provide essential fields when creating a NEW user')

    # Check if user already exists
    existing_user = User.query.filter_by(
        first_name=request_data['first_name'],
        last_name=request_data['last_name']
    ).first()

    if existing_user:
        return output_error(400, 'User is already registered')

    new_user = User(
        title=request_data['title'],
        first_name=request_data['first_name'],
        last_name=request_data['last_name'],
        postcode=request_data['postcode'],
        phone_num=request_data['phone_num'],
        gender=request_data['gender']
    )
    db.session.add(new_user)
    db.session.commit()

    response = jsonify(new_user.to_dict())
    response.status_code = 201
    return response

@app.route('/user/<string:first_name>/<string:last_name>', methods=['GET'])
def get_user_info(first_name, last_name):
    user = User.query.filter_by(first_name=first_name, last_name=last_name).first()
    if user:
        return jsonify(user.to_dict())
    return output_error(404, 'User does NOT EXIST')

def output_error(code, message):
    response = jsonify({'status': code, 'message': message})
    response.status_code = code
    return response

@app.errorhandler(404)
def error_handler(error):
    response = jsonify({
        'status': 404,
        'message': 'Resource not found: ' + request.url,
    })
    response.status_code = 404
    return response

if __name__ == "__main__":
    app.run(debug=True)
