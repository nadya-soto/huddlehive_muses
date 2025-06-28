from flask import Flask, jsonify, request

# Configuration
app = Flask(__name__)

@app.route("/")
def home():
    return jsonify(message="Welcome to the Hidden Spaces  API")


# Main entry
if __name__ == "__main__":
    app.run(debug=True)