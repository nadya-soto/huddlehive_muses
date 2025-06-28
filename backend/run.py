from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///accessibility_map.db'
app.config['SECRET_KEY'] = 'your_secret_key'
db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

class AccessibilityFeature(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)

space_features = db.Table('space_features',
    db.Column('space_id', db.Integer, db.ForeignKey('space.id')),
    db.Column('feature_id', db.Integer, db.ForeignKey('accessibility_feature.id'))
)

class Space(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    type = db.Column(db.String(120), nullable=False)
    category = db.Column(db.String(120), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    contactEmail = db.Column(db.String(120), nullable=False)
    website = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    indoor = db.Column(db.Boolean, default=True)
    outdoor = db.Column(db.Boolean, default=False)
    wifi = db.Column(db.Boolean, default=False)
    parking = db.Column(db.Boolean, default=False)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    features = db.relationship('AccessibilityFeature', secondary=space_features, backref=db.backref('spaces'))

# Helper functions
def output_error(status, message):
    response = jsonify({"error": message})
    response.status_code = status
    return response

# Auth routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not all(field in data for field in ['username', 'email', 'password']):
        return output_error(400, "Missing fields")
    
    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = User(username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created"}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if not user or not check_password_hash(user.password, data['password']):
        return output_error(401, "Invalid credentials")

    token = jwt.encode({'id': user.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, app.config['SECRET_KEY'], algorithm="HS256")
    return jsonify({"token": token, "user": {"id": user.id, "username": user.username}})

# Space routes
@app.route('/api/spaces/categories', methods=['GET'])
def get_categories():
    categories = ["restaurant", "library", "gym", "park", "cafe", "other"]
    return jsonify({"categories": categories})

@app.route('/api/spaces', methods=['GET'])
def get_all_spaces():
    spaces = Space.query.all()
    result = []
    for s in spaces:
        result.append({
            "id": s.id,
            "name": s.name,
            "type": s.type,
            "category": s.category,
            "address": s.address,
            "description": s.description,
            "website": s.website,
            "phone": s.phone,
            "indoor": s.indoor,
            "outdoor": s.outdoor,
            "wifi": s.wifi,
            "parking": s.parking,
            "coordinates": [s.latitude, s.longitude] if s.latitude and s.longitude else [],
        })
    return jsonify({"spaces": result})

@app.route('/api/spaces', methods=['POST'])
def create_space():
    data = request.get_json()
    required_fields = ['name', 'type', 'category', 'address', 'description', 'contactEmail']
    if not all(field in data for field in required_fields):
        return output_error(400, f"Missing required fields: {', '.join(field for field in required_fields if field not in data)}")

    user = User.query.get(data.get('created_by'))
    if not user:
        return output_error(404, "Creator not found")

    feature_ids = data.get('features', [])
    matched_features = AccessibilityFeature.query.filter(AccessibilityFeature.id.in_(feature_ids)).all() if feature_ids else []

    space = Space(
        name=data['name'],
        type=data['type'],
        category=data['category'],
        address=data['address'],
        description=data['description'],
        contactEmail=data['contactEmail'],
        website=data.get('website'),
        phone=data.get('phone'),
        indoor=data.get('indoor', True),
        outdoor=data.get('outdoor', False),
        wifi=data.get('wifi', False),
        parking=data.get('parking', False),
        latitude=data.get('latitude'),
        longitude=data.get('longitude'),
        created_by=user.id,
        features=matched_features
    )
    db.session.add(space)
    db.session.commit()
    return jsonify({"message": "Space created", "space_id": space.id}), 201

@app.route('/api/spaces/<int:id>', methods=['GET'])
def get_space(id):
    space = Space.query.get(id)
    if not space:
        return output_error(404, "Space not found")
    return jsonify({
        "id": space.id,
        "name": space.name,
        "type": space.type,
        "category": space.category,
        "address": space.address,
        "description": space.description,
        "website": space.website,
        "phone": space.phone,
        "indoor": space.indoor,
        "outdoor": space.outdoor,
        "wifi": space.wifi,
        "parking": space.parking,
        "coordinates": [space.latitude, space.longitude] if space.latitude and space.longitude else [],
    })

@app.route('/api/spaces/<int:id>', methods=['PUT'])
def edit_space(id):
    space = Space.query.get(id)
    if not space:
        return output_error(404, "Space not found")

    data = request.get_json()
    for key in ['name', 'type', 'category', 'address', 'description', 'website', 'phone', 'indoor', 'outdoor', 'wifi', 'parking', 'latitude', 'longitude']:
        if key in data:
            setattr(space, key, data[key])
    db.session.commit()
    return jsonify({"message": "Space updated"})

@app.route('/api/spaces/<int:id>', methods=['DELETE'])
def delete_space(id):
    space = Space.query.get(id)
    if not space:
        return output_error(404, "Space not found")

    db.session.delete(space)
    db.session.commit()
    return jsonify({"message": "Space deleted"})

if __name__ == '__main__':
    app.run(debug=True)
