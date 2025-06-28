
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
    contactEmail = db.Column(db.Text, nullable=True)
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

@app.route('/register/many', methods=['POST'])
def register_many():
    data = request.get_json()

    if isinstance(data, dict):
        data = [data] 

    created_users = []

    for user_data in data:
        required_fields = ['email', 'name', 'ethnicity', 'language', 'hobby', 'gender', 'age', 'city', 'sexual_orientation', 'password']
        if not all(field in user_data for field in required_fields):
            return output_error(400, f"Missing required fields in: {user_data.get('email', 'Unknown')}")

        if User.query.filter_by(email=user_data['email']).first():
            continue  # Skip already-registered emails

        user = User(
            email=user_data['email'],
            name=user_data['name'],
            ethnicity=user_data['ethnicity'],
            language=user_data['language'],
            hobby=user_data['hobby'],
            gender=user_data['gender'],
            age=user_data['age'],
            city=user_data['city'],
            sexual_orientation=user_data['sexual_orientation'],
            password_hash=user_data['password']
        )

        db.session.add(user)
        created_users.append(user)

    db.session.commit()

    return jsonify({
        "message": f"{len(created_users)} user(s) registered successfully",
        "users": [{"id": u.id, "email": u.email} for u in created_users]
    }), 201

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
def add_spaces():
    data = request.get_json()

    if not isinstance(data, list):
        return jsonify({'error': 'Request body must be a list of space objects.'}), 400

    created_spaces = []
    errors = []

    for idx, item in enumerate(data):
        # Check if user exists
        user = User.query.get(item.get('created_by'))
        if not user:
            errors.append({'index': idx, 'error': 'User not found', 'data': item})
            continue

        # Validate required fields
        required_fields = ['name', 'type', 'category', 'address', 'description', 'contactEmail']
        missing_fields = [field for field in required_fields if field not in item]

        if missing_fields:
            errors.append({
                'index': idx,
                'error': f'Missing required fields: {", ".join(missing_fields)}',
                'data': item
            })
            continue

        # Get feature objects from IDs
        feature_ids = item.get('features', [])
        matched_features = []
        if feature_ids:
            matched_features = AccessibilityFeature.query.filter(
                AccessibilityFeature.id.in_(feature_ids)
            ).all()

        # Create the Space object
        space = Space(
            name=item['name'],
            type=item['type'],
            category=item['category'],
            address=item['address'],
            description=item['description'],
            contactEmail=item['contactEmail'],
            website=item.get('website'),
            phone=item.get('phone'),
            indoor=item.get('indoor', True),
            outdoor=item.get('outdoor', False),
            wifi=item.get('wifi', False),
            parking=item.get('parking', False),
            latitude=item.get('latitude'),
            longitude=item.get('longitude'),
            created_by=user.id,
            features=matched_features  # attach features correctly
        )

        db.session.add(space)
        created_spaces.append(space)

    db.session.commit()

    response = {
        'created': [{'name': s.name, 'id': s.id} for s in created_spaces],
        'errors': errors
    }

    status_code = 207 if errors else 201  # 207: Multi-Status for partial success
    return jsonify(response), status_code



@app.route('/spaces/remove/<int:space_id>', methods=['DELETE'])
def remove_space(space_id):
    data = request.get_json()
    user_id = data.get('user_id') if data else None
    if not user_id:
        return output_error(400, "User ID required")

    space = Space.query.get(space_id)
    if not space:
        return output_error(404, "Space not found")
    #if space.created_by != user_id:
       # return output_error(403, "Only owner can delete this space")

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

    # Editable fields
    fields = [
        'name', 'type', 'category', 'address', 'description', 'website', 'phone',
        'latitude', 'longitude', 'indoor', 'outdoor', 'wifi', 'parking'
    ]
    for field in fields:
        if field in data:
            setattr(space, field, data[field])

    
    if 'features' in data:
        feature_ids = data['features']
        if isinstance(feature_ids, list):
            features =  AccessibilityFeature.query.filter(
                AccessibilityFeature.id.in_(feature_ids)
            ).all()
            space.features = features
        else:
            return output_error(400, "Features should be a list of IDs")

    db.session.commit()

    # Serialize updated space data
    space_data = {
        "id": space.id,
        "name": space.name,
        "type": space.type,
        "category": space.category,
        "address": space.address,
        "description": space.description,
        "website": space.website,
        "phone": space.phone,
        "rating": None,  # You can compute if you want here
        "reviewCount": len(space.reviews),
        "distance": "",
        "images": [],
        "features": [f.name for f in space.features],
        "indoor": space.indoor,
        "outdoor": space.outdoor,
        "wifi": space.wifi,
        "parking": space.parking,
        "coordinates": [space.latitude, space.longitude] if space.latitude and space.longitude else [],
        "hours": {},
        "ownerId": space.created_by,
        "createdBy": space.creator.name if space.creator else None,
    }

    return jsonify({"message": "Space updated", "space": space_data}), 200


@app.route('/spaces/categories', methods=['GET'])
def get_categories():
    spaces = Space.query.all()

    category_counts = {}
    for space in spaces:
        category = space.category
        if category in category_counts:
            category_counts[category] += 1
        else:
            category_counts[category] = 1

    categories = [
        {
            "id": category.lower().replace(" ", "_"),
            "name": category,
            "description": f"Spaces under {category}",
            "icon": "🏠",
            "count": count
        }
        for category, count in category_counts.items()
    ]

    return jsonify({"categories": categories})


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

@app.route('/accessibility/add', methods=['POST'])
def add_accessibility_feature():
    data = request.get_json()

    # Handle a single object or a list of objects
    if isinstance(data, dict):
        data = [data]

    created_features = []

    for item in data:
        required_fields = ['name', 'description', 'icon']
        if not all(field in item for field in required_fields):
            return jsonify({'message': 'Missing required fields in one or more entries'}), 400

        feature = AccessibilityFeature(
            name=item['name'],
            description=item['description'],
            icon=item['icon']
        )
        db.session.add(feature)
        created_features.append(feature)

    db.session.commit()

    return jsonify({
        'message': f'{len(created_features)} feature(s) added',
        'features': [
            {
                'id': feature.id,
                'name': feature.name,
                'description': feature.description,
                'icon': feature.icon
            }
            for feature in created_features
        ]
    }), 201


@app.route('/accessibility', methods=['GET'])
def get_accessibility_features():
    features = AccessibilityFeature.query.all()

    feature_list = []
    for feature in features:
        feature_list.append({
            'id': feature.id,
            'name': feature.name,
            'description': feature.description,
            'icon': feature.icon
        })

    return jsonify({'features': feature_list}), 200

@app.route('/reviews/add', methods=['POST'])
def add_reviews():
    data = request.get_json()

    # Ensure input is a list for batch support
    if not isinstance(data, list):
        data = [data]

    reviews_to_add = []
    errors = []

    for idx, entry in enumerate(data):
        required_fields = ['space_id', 'user_id', 'rating']
        missing = [field for field in required_fields if field not in entry]

        if missing:
            errors.append({
                "index": idx,
                "error": f"Missing required fields: {', '.join(missing)}"
            })
            continue

        # Validate user and space
        user = User.query.get(entry['user_id'])
        space = Space.query.get(entry['space_id'])

        if not user or not space:
            errors.append({
                "index": idx,
                "error": f"{'User' if not user else 'Space'} not found"
            })
            continue

        # Optional fields
        rating = entry['rating']
        comment = entry.get('comment', '')

        review = Review(
            space_id=entry['space_id'],
            user_id=entry['user_id'],
            rating=rating,
            comment=comment,
            created_at=datetime.utcnow()
        )
        reviews_to_add.append(review)

    if reviews_to_add:
        db.session.add_all(reviews_to_add)
        db.session.commit()

    return jsonify({
        "message": f"{len(reviews_to_add)} review(s) added successfully.",
        "errors": errors
    }), 207 if errors else 201

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

@app.route('/spaces/<int:space_id>', methods=['GET'])
def get_space_details(space_id):
    space = Space.query.get(space_id)
    if not space:
        return output_error(404, "Space not found")

    def average_rating(reviews):
        if not reviews:
            return None
        # Only consider reviews with a rating
        valid_ratings = [r.rating for r in reviews if r.rating is not None]
        if not valid_ratings:
            return None
        return round(sum(valid_ratings) / len(valid_ratings), 1)

    # Serialize reviews
    reviews_data = [
        {
            "id": review.id,
            "user_id": review.user_id,
            "rating": review.rating,
            "comment": review.comment,
            "created_at": review.created_at.isoformat() if review.created_at else None
        }
        for review in space.reviews
    ]

    return jsonify({
        "space": {
            "id": space.id,
            "name": space.name,
            "type": space.type,
            "category": space.category,
            "address": space.address,
            "description": space.description,
            "website": space.website,
            "phone": space.phone,
            "rating": average_rating(space.reviews),
            "reviewCount": len(space.reviews),
            "distance": "",  # Placeholder
            "images": [],    # Placeholder
            "features": [f.name for f in space.features],
            "indoor": space.indoor,
            "outdoor": space.outdoor,
            "wifi": space.wifi,
            "parking": space.parking,
            "coordinates": [space.latitude, space.longitude] if space.latitude and space.longitude else [],
            "hours": {},  # Placeholder
            "ownerId": space.created_by,
            "createdBy": space.creator.name if space.creator else None,
            "reviews": reviews_data  # Add the reviews here
        }
    })


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
