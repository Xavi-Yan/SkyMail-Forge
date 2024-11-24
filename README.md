# SkyMail Forge

🚀 A powerful, self-hosted email dispatch system that lets you forge and send custom emails with the reliability of Mailgun.

A simple web application that allows users to send custom emails using the Mailgun API.

## Prerequisites

1. Python 3.6 or higher
2. A Mailgun account with API credentials
3. pip (Python package manager)

## Installation

1. Clone or download this repository

2. Install the required Python packages:
```bash
pip install flask flask-cors requests
```

1. Create your configuration file:
```bash
cp config.json.example config.json
```

1. Edit `config.json` with your Mailgun credentials and preferences:
```json
{
    "mailgun": {
        "api_key": "your-mailgun-api-key",
        "domain": "your-mailgun-domain",
        "from_name": "Your Name",
        "from_email": "mailgun@your-mailgun-domain"
    },
    "server": {
        "host": "0.0.0.0",
        "port": 5000,
        "debug": false
    }
}
```

## Configuration Options

### Mailgun Settings
- `api_key`: Your Mailgun API key
- `domain`: Your verified Mailgun domain
- `from_name`: The sender's name that will appear in emails
- `from_email`: The sender's email address (must be configured in Mailgun)

### Server Settings
- `host`: The host address to bind to (use "0.0.0.0" to accept connections from any IP)
- `port`: The port number to run the server on
- `debug`: Enable debug mode (set to false in production)

## Running the Application

1. Start the server:
```bash
python app.py
```

1. Access the application in your web browser:
```
http://localhost:5000
```

## Production Deployment

For production deployment, consider the following:

1. Use a production-grade WSGI server like Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

1. Set up a reverse proxy (like Nginx) in front of the application

2. Enable HTTPS using SSL/TLS certificates

3. Set appropriate firewall rules

4. Use environment variables for sensitive configuration:
```python
# Example using environment variables
import os

api_key = os.getenv('MAILGUN_API_KEY', config['mailgun']['api_key'])
```

## Security Considerations

1. Keep your `config.json` file secure and never commit it to version control
2. Use HTTPS in production
3. Implement rate limiting to prevent abuse
4. Consider adding authentication if needed
5. Regularly update dependencies

## Troubleshooting

1. If emails aren't sending:
    - Check your Mailgun credentials
    - Verify your domain in Mailgun
    - Check Mailgun logs for errors

2. If the server doesn't start:
    - Verify the port isn't in use
    - Check the config.json file exists and is valid
    - Ensure all dependencies are installed

## Support

For Mailgun-related issues, consult the [Mailgun documentation](https://documentation.mailgun.com).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### What this means:

- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- 📝 License and copyright notice required
- ❌ No liability
- ❌ No warranty

The MIT License is a permissive license that lets people do almost anything with your code with proper attribution and without warranty.
