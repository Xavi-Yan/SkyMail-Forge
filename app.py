from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import json
import os

app = Flask(__name__, static_folder='static')
CORS(app)


# Load configuration
def load_config():
    try:
        with open('config.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print("Error: config.json not found. Please create one from config.example.json")
        exit(1)
    except json.JSONDecodeError:
        print("Error: config.json is invalid JSON")
        exit(1)


CONFIG = load_config()


# Serve static files (frontend)
@app.route('/')
def serve_frontend():
    return send_from_directory('static', 'static/index.html')


@app.route('/send-email', methods=['POST'])
def send_email():
    try:
        data = request.get_json()

        # Extract email details from request
        to_email = data.get('to')
        subject = data.get('subject')
        body = data.get('body')

        # Validate input
        if not all([to_email, subject, body]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Prepare email data
        email_data = {
            'from': f"{CONFIG['mailgun']['from_name']} <{CONFIG['mailgun']['from_email']}>",
            'to': to_email,
            'subject': subject,
            'text': body
        }

        # Send email using Mailgun API
        response = requests.post(
            f"https://api.mailgun.net/v3/{CONFIG['mailgun']['domain']}/messages",
            auth=('api', CONFIG['mailgun']['api_key']),
            data=email_data
        )

        # Check if email was sent successfully
        if response.status_code == 200:
            return jsonify({'message': 'Email sent successfully'}), 200
        else:
            return jsonify({'error': 'Failed to send email', 'details': response.text}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    # Ensure the static directory exists
    os.makedirs('static', exist_ok=True)

    # Start the server with configuration
    app.run(
        host=CONFIG['server']['host'],
        port=CONFIG['server']['port'],
        debug=CONFIG['server']['debug']
    )
