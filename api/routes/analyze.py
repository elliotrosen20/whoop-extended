import datetime
import os
from flask import Blueprint
import pandas as pd
from api.models.analysis import calculate_eq_insights, calculate_insights, calculate_shap_values
from models.preprocess import preprocess_data, model_prep
from models.xgb_model import train_model, train_xgboost_kfold_early_stop

analyze_bp = Blueprint('analyze', __name__)

cache = {}

UPLOAD_FOLDER = 'uploads'

@analyze_bp.route('/analyze/model/<file_id>', methods=['POST'])
def build_model(file_id):
  filename = f"{file_id}.csv"
  filepath = os.path.join(UPLOAD_FOLDER, filename)

  df = pd.read_csv(filepath)
  df_clean = preprocess_data(df)

  model = train_model(df_clean)

  insights = calculate_insights(model, df_clean)
  equivalence_insights = calculate_eq_insights(insights)

  shap_values = calculate_shap_values(model, df_clean)

  cache[file_id] = {
    'model': model,
    'insights': insights,
    'equivalence_insights': equivalence_insights,
    'shap_values': shap_values,
    'timestamp': datetime.now()
  }

