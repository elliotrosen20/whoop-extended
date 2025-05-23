from flask import Blueprint, request, jsonify, current_app
import os
from werkzeug.utils import secure_filename
import uuid

upload_bp = Blueprint('upload', __name__)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls'}

def allowed_file(filename):
  return '.' in filename and \
    filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



@upload_bp.route('/upload', methods=['POST'])
def upload_file():
  print("UPLOAD endpoint hit with method:", request.method)
  if request.method == 'OPTIONS':
        # This is just the preflight; return 200 with appropriate headers
        return '', 200

  if 'file' not in request.files:
    return jsonify({'error': 'No file part'}), 400
  
  file = request.files['file']

  if file.filename == '':
    return jsonify({'error': 'No selected file'}), 400
  
  if file and allowed_file(file.filename):
    file_id = str(uuid.uuid4())
    filename = secure_filename(file.filename)
    extension = filename.rsplit('.', 1)[1].lower()
    unique_filename = f"{file_id}.{extension}"

    filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
    file.save(filepath)

    return jsonify({
      'success': True,
      'message': 'File upload successfully',
      'file_id': file_id
    }), 200
  
  return jsonify({'error': 'File type not allowed'}), 400


@upload_bp.route('/demo', methods=['GET'])
def get_demo_file():
    return jsonify({
        'success': True,
        'message': 'Demo file loaded successfully',
        'file_id': 'demo_whoop_data'  # No need for UUID
    }), 200