
from datetime import datetime
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///dev.db'  # SQLite file
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Users table
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    ethnicity = db.Column(db.String(255), nullable=False)
    language = db.Column(db.String(255), nullable=False)
    hobby = db.Column(db.String(255), nullable=False)
    gender = db.Column(db.String(255), nullable=False)
    age = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(255), nullable=False)
    sexual_orientation = db.Column(db.String(255), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    spaces_created = db.relationship('Space', backref='creator', lazy=True)
    reviews = db.relationship('Review', backref='user', lazy=True)

# Spaces table
class Space(db.Model):
    __tablename__ = 'spaces'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    address = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text)
    website = db.Column(db.String(255))
    phone = db.Column(db.String(50))
    latitude = db.Column(db.Float(precision=8))
    longitude = db.Column(db.Float(precision=8))
    indoor = db.Column(db.Boolean, default=True)
    outdoor = db.Column(db.Boolean, default=False)
    wifi = db.Column(db.Boolean, default=False)
    parking = db.Column(db.Boolean, default=False)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    features = db.relationship('AccessibilityFeature', secondary='space_features', back_populates='spaces')
    reviews = db.relationship('Review', backref='space', lazy=True)

# Accessibility Features table
class AccessibilityFeature(db.Model):
    __tablename__ = 'accessibility_features'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    icon = db.Column(db.String(10))

    spaces = db.relationship('Space', secondary='space_features', back_populates='features')

# Junction table for many-to-many Space <-> AccessibilityFeature
space_features = db.Table('space_features',
    db.Column('space_id', db.Integer, db.ForeignKey('spaces.id', ondelete='CASCADE'), primary_key=True),
    db.Column('feature_id', db.Integer, db.ForeignKey('accessibility_features.id', ondelete='CASCADE'), primary_key=True)
)

# Reviews table
class Review(db.Model):
    __tablename__ = 'reviews'
    id = db.Column(db.Integer, primary_key=True)
    space_id = db.Column(db.Integer, db.ForeignKey('spaces.id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    rating = db.Column(db.Integer)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


@app.route("/")
def home():
    return jsonify(message="Welcome to the Hidden Spaces API")


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    required_fields = ['email', 'name', 'ethnicity', 'age', 'city', 'sexual_orientation', 'password']
    if not all(field in data for field in required_fields):
        return output_error(400, "Missing required fields")

    if User.query.filter_by(email=data['email']).first():
        return output_error(400, "Email already registered")

    user = User(
    email=data['email'],
    name=data['name'],
    ethnicity=data['ethnicity'],
    language=data['language'],
    hobby=data['hobby'],
    gender=data['gender'],
    age=data['age'],
    city=data['city'],
    sexual_orientation=data['sexual_orientation'],
    password_hash=(data['password'])  )

    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully", "user_id": user.id}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return output_error(400, "Email and password required")

    user = User.query.filter_by(email=data['email']).first()
    if user and user.password_hash ==  data['password']:
        # For simplicity, just respond success (token/session can be added later)
        return jsonify({"message": "Login successful", "user_id": user.id})
    return output_error(401, "Invalid email or password")


@app.route('/spaces/add', methods=['POST'])
def add_space():
    data = request.get_json()
    # Check user exists
    user = User.query.get(data['created_by'])
    if not user:
        return output_error(404, "User not found")

    required_fields = ['name', 'type', 'category', 'address', 'description', 'contactEmail']
    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400
    
    website = data.get('website')
    phone = data.get('phone')
    features = data.get('features', [])
    indoor = data.get('indoor', True)
    outdoor = data.get('outdoor', False)
    wifi = data.get('wifi', False)
    parking = data.get('parking', False)

   
    new_space = Space(
        name=data['name'],
        type=data['type'],
        category=data['category'],
        address=data['address'],
        description=data['description'],
        contact_email=data['contactEmail'],
        website=website,
        phone=phone,
        indoor=indoor,
        outdoor=outdoor,
        wifi=wifi,
        parking=parking,
        created_by = user.id
    )

    db.session.add(new_space)
    db.session.commit()

    return jsonify({'message': f"Space '{new_space.name}' created successfully.", 'space_id': new_space.id}), 201


@app.route('/spaces/remove/<int:space_id>', methods=['DELETE'])
def remove_space(space_id):
    data = request.get_json()
    user_id = data.get('user_id') if data else None
    if not user_id:
        return output_error(400, "User ID required")

    space = Space.query.get(space_id)
    if not space:
        return output_error(404, "Space not found")
    if space.created_by != user_id:
        return output_error(403, "Only owner can delete this space")

    db.session.delete(space)
    db.session.commit()
    return jsonify({"message": f"Space {space_id} deleted"})

@app.route('/spaces/edit/<int:space_id>', methods=['PUT'])
def edit_space(space_id):
    data = request.get_json()
    user_id = data.get('user_id')
    if not user_id:
        return output_error(400, "User ID required")

    space = Space.query.get(space_id)
    if not space:
        return output_error(404, "Space not found")
    if space.created_by != user_id:
        return output_error(403, "Only owner can edit this space")

    # Update allowed fields
    fields = ['name', 'type', 'address', 'description', 'website', 'phone', 'latitude', 'longitude', 'indoor', 'outdoor', 'wifi', 'parking']
    for field in fields:
        if field in data:
            setattr(space, field, data[field])

    db.session.commit()
    return jsonify({"message": "Space updated", "space": {
        'id': space.id,
        'name': space.name,
        'type': space.type,
        'address': space.address
    }})

@app.route('/spaces/categories', methods=['GET'])
def get_categories():
    categories = db.session.query(Space.type).distinct().all()
    category_list = [c[0] for c in categories]
    return jsonify(categories=category_list)

@app.route('/spaces/categories/<string:category>/spaces', methods=['GET'])
def get_spaces_in_category(category):
    spaces = Space.query.filter_by(category=category).all()
    spaces_list = [{
        'id': s.id,
        'name': s.name,
        'address': s.address,
        'description': s.description
    } for s in spaces]
    return jsonify(spaces=spaces_list)

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
    with app.app_context():
        db.create_all()
    app.run(debug=True)
