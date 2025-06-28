#imports
import json
from flask import Flask, jsonify, request,render_template
from flask_mysqldb import MySQL

app = Flask(__name__)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'password'
app.config['MYSQL_DB'] = 'Rehoboth'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor' #return db results as dictionaries

mysql = MySQL(app)

@app.route("/")
def home():
    return jsonify(message="Welcome to the Hidden Spaces  API")

@app.route('/user', methods=['POST'])
def register_user():
    #get the data from the request made
    request_data = request.get_json()

    # ensure at least the user title, first & last name, phone number, post code, gender were provided
    if all(key in request_data for key in ('title','postcode', 'phone_num', 'first_name', 'last_name', 'gender')) and request.method == 'POST':
        #create a new user from the data gotten 
        new_user = {
        'title': request_data['title'],
        'first_name': request_data['first_name'],
        'last_name': request_data['last_name'],
        'postcode': request_data['postcode'],
        'phone_num': request_data['phone_num'],
        'gender': request_data['gender']
        }

        #check if the user already exists
        is_existing_user = get_user_info(request_data['first_name'],request_data['last_name'])
        if is_existing_user.status_code == 200:
            output_error(400,'User is already registered')

        # save new user information into db
        cursor = mysql.connection.cursor()
        cursor.execute(''' INSERT INTO users VALUES(%s,%s)''',(new_user['first_name'],new_user['last_name'],new_user['postcode'],new_user['gender'],new_user['title']))
        mysql.connection.commit()
        cursor.close()

        response = jsonify(new_user)
        response.status_code = 201 #new resource created
        return response
    
    output_error(400,'Provide essential fields when creating a NEW user')
        
@app.route('/user/<string:first_name>/<string:last_name>')
def get_user_info(first_name:str, last_name:str):
    # check for user
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM users WHERE first_name = %s AND last_name = %s", (first_name, last_name,))
    user = cursor.fetchone()
    cursor.close()

    if user:
        response = jsonify(user)
        response.status_code = 200 #successful
        return response
    output_error(404,'User does NOT EXIST')

def output_error(code:int, message:str):
    error_message = {
    'status' : code,
    'message': message
    }
    response = jsonify(error_message)
    response.status_code = code #error status code
    return response

@app.errorhandler(404)
def error_handler(error):
    message = {
        'status': 404,
        'message': 'Resource not found: ' + request.url,
    }
    response = jsonify(message)
    response.status_code = 404
    return response

# Main entry
if __name__ == "__main__":
    app.run(debug=True)