from run import app, db  # Import your app and db from run.py

with app.app_context():
    db.create_all()  # This creates all tables based on your models
    print("✅ Database initialized!")
