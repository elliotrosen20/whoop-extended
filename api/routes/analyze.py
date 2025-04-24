from flask import Blueprint
from models.preprocess import preprocess_data, model_prep
from models.xgb_model import train_xgboost_kfold_early_stop

analyze_bp = Blueprint('analyze', __name__)

cache = {}

@analyze_bp.route('/analyze/model/<file_id>', methods=['POST'])
def build_model(file_id):
  