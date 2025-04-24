import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import numpy as np
import pandas as pd

def plot_feature_importance(model, X, save_path='feature_importance_top5.png'):
    importance = model.feature_importances_
    
    feature_importance = pd.DataFrame({
        'Feature': X.columns,
        'Importance': importance
    }).sort_values('Importance', ascending=False)
    
    top_features = feature_importance.head(5)
    
    plt.figure(figsize=(8, 5))
    sns.barplot(x='Importance', y='Feature', data=top_features, palette='Blues_d')
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