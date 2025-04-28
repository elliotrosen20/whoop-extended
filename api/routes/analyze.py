import datetime
import os
from flask import Blueprint, jsonify, request
import pandas as pd
from models.analysis import calculate_eq_insights, calculate_insights, calculate_shap_values, final_prediction
from models.preprocess import preprocess_data, model_prep
from models.xgb_model import train_model, train_xgboost_kfold_early_stop

analyze_bp = Blueprint('analyze', __name__)

cache = {}

UPLOAD_FOLDER = 'uploads'

@analyze_bp.route('/analyze/model/<file_id>', methods=['POST'])
def build_model(file_id):
  try:
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
      'timestamp': datetime.datetime.now()
    }

    return jsonify({
      'status': 'success',
      'message': 'Model built and cached successfully'
    }), 201
  except Exception as e:
    return jsonify({
      'error': str(e),
      'status': 'error'
    }), 500



@analyze_bp.route('/analyze/insights/<file_id>', methods=['GET'])
def get_insights(file_id):
  try:
    insights = cache[file_id]['insights']
    return jsonify(insights)
  except KeyError:
    return jsonify({
      'error': 'Insights not found for the given file ID',
      'status': 'error'
    }), 404
  except Exception as e:
    return jsonify({
      'error': str(e),
      'status': 'error'
    }), 500


@analyze_bp.route('/analyze/eqInsights/<file_id>', methods=['GET'])
def get_equivalence_insights(file_id):
  try:
    eq_insights = cache[file_id]['equivalence_insights']
    return jsonify(eq_insights)
  except KeyError:
    return jsonify({
      'error': 'Equivalence insights not found for the given file ID',
      'status': 'error'
    }), 404
  except Exception as e:
    return jsonify({
      'error': str(e),
      'status': 'error'
    }), 500


@analyze_bp.route('/analyze/shap/<file_id>', methods=['GET'])
def get_shap(file_id):
  try:
    shap_values = cache[file_id]['shap_values']
    return jsonify(shap_values)
  except KeyError:
    return jsonify({
      'error': 'SHAP values not found for the given file ID',
      'status': 'error'
    }), 404
  except Exception as e:
    return jsonify({
      'error': str(e),
      'status': 'error'
    }), 500
  
# @analyze_bp.route('/analyze/predict/<file_id>', methods=['POST'])
# def get_prediction(file_id):
#   try:
#     data = request.json

#     required_fields = ["rhr", "hrv", "temp", "spo2", "resp", "asleep", 
#                         "in_bed", "light", "deep", "rem", "awake", 
#                         "sleep_need", "sleep_debt"]
    
#     missing_fields = [field for field in required_fields if field not in data]
#     if missing_fields:
#       return jsonify({
#         "error": f"Missing required fields: {', '.join(missing_fields)}"
#       }), 400
#   except Exception as e:
#     return jsonify({
#       'error': f"Error during prediction: {str(e)}",
#       'status': 'error'
#     }), 500

#   try:
#     model = cache[file_id]['model']
#   except KeyError:
#     return jsonify({
#       'error': 'Prediction model not found for the given file ID',
#       'status': 'error'
#     }), 404
#   except Exception as e:
#     return jsonify({
#       'error': str(e),
#       'status': 'error'
#     }), 500
  
#   res = final_prediction(model, data)
#   return jsonify({
#     'prediction': res,
#   })

@analyze_bp.route('/analyze/predict/<file_id>', methods=['POST'])
def get_prediction(file_id):
  try:
    data = request.json
    if not data:
      return jsonify({
        'error': 'No JSON data received',
        'status': 'error'
      }), 400

    required_fields = ["rhr", "hrv", "temp", "spo2", "resp", "asleep", 
                      "in_bed", "light", "deep", "rem", "awake", 
                      "sleep_need", "sleep_debt"]
    
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
      return jsonify({
        "error": f"Missing required fields: {', '.join(missing_fields)}"
      }), 400
      
    try:
      model = cache[file_id]['model']
    except KeyError:
      return jsonify({
        'error': 'Prediction model not found for the given file ID',
        'status': 'error'
      }), 404
    
    # Add a try/except for the final_prediction call
    try:
      res = final_prediction(model, data)
      return jsonify({
        'prediction': res,
      })
    except Exception as pred_error:
      print(f"Error in final_prediction: {str(pred_error)}")
      return jsonify({
        'error': f"Error making prediction: {str(pred_error)}",
        'status': 'error'
      }), 500
      
  except Exception as e:
    print(f"Unexpected error in prediction route: {str(e)}")
    return jsonify({
      'error': f"Error during prediction: {str(e)}",
      'status': 'error'
    }), 500
