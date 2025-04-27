import os
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import numpy as np
import pandas as pd
import shap
import re

from .preprocess import model_prep, preprocess_data

UPLOAD_FOLDER = 'uploads'

def plot_feature_importance(model, X, save_path='feature_importance_top5.png'):
    importance = model.feature_importances_
    
    feature_importance = pd.DataFrame({
        'Feature': X.columns,
        'Importance': importance
    }).sort_values('Importance', ascending=False)
    
    TOP_FEATURES = feature_importance.head(5)
    
    plt.figure(figsize=(8, 5))
    sns.barplot(x='Importance', y='Feature', data=TOP_FEATURES, palette='Blues_d')
    plt.title('Top 5 Feature Importances for Recovery Score %')
    plt.tight_layout()
    
    plt.savefig(save_path)
    plt.show()
    
    return feature_importance

def eval_model(model, X_test, y_test):
    test_preds = model.predict(X_test)

    test_rmse = np.sqrt(mean_squared_error(y_test, test_preds))
    test_mae = mean_absolute_error(y_test, test_preds)
    test_r2 = r2_score(y_test, test_preds)

    print(f"Test Set Performance:")
    print(f"Test RMSE: {test_rmse:.4f}")
    print(f"Test MAE: {test_mae:.4f}")
    print(f"Test R2: {test_r2:.4f}")

TOP_FEATURES = ['Heart rate variability (ms)', 'Resting heart rate (bpm)', 'In bed duration (min)', 'Asleep duration (min)', 'REM duration (min)'];


def calculate_insights(model, df_clean):
    print(df_clean.shape)
    print(df_clean.columns.tolist())
    print(model.feature_names_in_)

    X, _ = model_prep(df_clean)

    baseline_data = X.mean().to_dict()

    baseline_values = [baseline_data[col] for col in X.columns]
    baseline_prediction = float(model.predict([baseline_values])[0])

    insights = []

    for feature in TOP_FEATURES:
        match = re.match(r'(.*)\s*\((.*)\)$', feature)
        if match:
            feature_name = match.group(1).lower()
            units = match.group(2)
        else:
            feature_name = feature.lower()
            units = "units"
        
        std_dev = X[feature].std()
        change_amount = float(std_dev * 0.5)

        modified_data = baseline_data.copy()
        modified_data[feature] += change_amount

        modified_values = [modified_data[col] for col in X.columns]
        modified_prediction = float(model.predict([modified_values])[0])

        impact = modified_prediction - baseline_prediction

        insights.append({
            'feature': feature_name,
            'original_feature': feature,
            'units': units,
            'change_amount': change_amount,
            'impact': impact,
            'description': f"Increasing {feature_name} by {change_amount:.2f} {units} {'improves' if impact > 0 else 'hurts'} recovery by {abs(impact):.2f} points"
        });
    
    return insights

def calculate_eq_insights(insights):
    equivalence_insights = []
    for i, feature1 in enumerate(TOP_FEATURES):
        for j, feature2 in enumerate(TOP_FEATURES[i + 1:]):
            feature1_impact = float(insights[i]['impact'])
            feature2_impact = float(insights[j]['impact'])
            if feature2_impact != 0:
                ratio = float(feature1_impact / feature2_impact)
                equivalence_insights.append({
                    'feature1': feature1,
                    'feature2': feature2,
                    'ratio': ratio,
                    'description': f"Improving {feature1} by {feature1_impact:.2f} is equivalent to improving {feature2} by {(feature2_impact * ratio):.2f}"
                })
    return equivalence_insights


def calculate_shap_values(model, df_clean):
    X, _ = model_prep(df_clean)

    explainer = shap.TreeExplainer(model)

    shap_values = explainer.shap_values(X)

    feature_importances = model.feature_importances_
    feature_names = X.columns.tolist()

    shap_data = []

    for i, feature in enumerate(feature_names):
        shap_data.append({
            'feature': feature,
            'importance': float(feature_importances[i]),
            # 'shap_values': shap_values[:, i].tolist()
            'mean_shap_value':float(np.abs(shap_values[:, i]).mean())
        })
    
    shap_data.sort(key=lambda x: x['importance'], reverse=True)

    return shap_data
