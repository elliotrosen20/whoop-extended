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
    for i in range(len(TOP_FEATURES)):
        for j in range(i + 1, len(TOP_FEATURES)):
            insight1, insight2 = insights[i], insights[j]
            feature1_impact = float(insight1['impact'])
            feature2_impact = float(insight2['impact'])

            feature1_name = insight1['feature']
            feature2_name = insight2['feature']

            feature1_units = insight1['units']
            feature2_units = insight2['units']

            feature1_change = float(insight1['change_amount'])
            feature2_change = float(insight2['change_amount'])

            if feature2_impact != 0:
                ratio = float(feature1_impact / feature2_impact)
                eq_amount = abs(feature2_change * ratio)

                direction_word = "increasing" if (feature1_impact * feature2_impact) > 0 else "decreasing"
                description = f"Increasing {feature1_name} by {feature1_change:.2f} {feature1_units} is equivalent to {direction_word} {feature2_name} by {eq_amount:.2f} {feature2_units}"

                equivalence_insights.append({
                    'feature1': feature1_name,
                    'feature2': feature2_name,
                    'feature1_units':  feature1_units,
                    'feature2_units':  feature2_units,
                    'ratio': ratio,
                    'description': description
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
        match = re.match(r'(.*)\s*\((.*)\)$', feature)
        if match:
            feature_name = match.group(1).lower()
            units = match.group(2)
        else:
            feature_name = feature.lower()
            units = "units"

        shap_data.append({
            'feature': feature,
            'name': feature_name,
            'units': units,
            'importance': float(feature_importances[i]),
            # 'shap_values': shap_values[:, i].tolist()
            'mean_shap_value':float(shap_values[:, i].mean())
        })
    
    shap_data.sort(key=lambda x: x['importance'], reverse=True)

    return shap_data
