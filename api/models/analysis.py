import os
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import numpy as np
import pandas as pd
import shap

from api.models.preprocess import model_prep, preprocess_data

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

TOP_FEATURES = []

def calculate_insights(model, df_clean):
    TOP_FEATURES = []
    baseline_data = df_clean[TOP_FEATURES].mean().to_dict()
    baseline_prediction = model.predict([list(baseline_data.values())])[0]

    insights = {}

    for feature in TOP_FEATURES:
        std_dev = df_clean[feature].std()
        change_amount = std_dev * 0.5

        modified_data = baseline_data.copy()
        modified_data[feature] += change_amount

        modified_prediction = model.predict([list(modified_data.values())])[0]

        impact = modified_prediction - baseline_prediction

        insights[feature] = ({
            'change_amount': change_amount,
            'impact': impact,
            'description': f"Increasing {feature} by {change_amount:.2f} improves recovery by {impact:.2f} points"
        })
    
    return insights

def calculate_eq_insights(insights):
    equivalence_insights = []
    for i, feature1 in enumerate(TOP_FEATURES):
        for feature2 in TOP_FEATURES[i + 1:]:
            feature1_impact = insights[feature1]['impact']
            feature2_impact = insights[feature2]['impact']
            if feature2_impact != 0:
                ratio = feature1_impact / feature2_impact
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
