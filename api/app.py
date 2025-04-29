from flask import Flask
from flask_cors import CORS
from routes.upload import upload_bp
from routes.analyze import analyze_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(upload_bp, url_prefix='/api')
app.register_blueprint(analyze_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run()