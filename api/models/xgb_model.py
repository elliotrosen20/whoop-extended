import pandas as pd
import xgboost as xgb
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import numpy as np
from sklearn.model_selection import KFold, train_test_split
import os

from api.models.preprocess import model_prep, preprocess_data

def train_xgboost_kfold_early_stop(X, y, n_splits=5, RANDOM_STATE=42):
    kf = KFold(n_splits=n_splits, shuffle=True, random_state=RANDOM_STATE)
    val_scores = []
    rmse_scores = []
    for fold, (train_index, val_index) in enumerate(kf.split(X)):
        X_train_fold, X_val_fold = X.iloc[train_index], X.iloc[val_index]
        y_train_fold, y_val_fold = y.iloc[train_index], y.iloc[val_index]
        model = xgb.XGBRegressor(
            n_estimators=1000,
            learning_rate=0.025,
            max_depth=4,
            subsample=0.9,
            colsample_bytree=0.9,
            random_state=RANDOM_STATE
        )
        model.fit(
            X_train_fold,
            y_train_fold,
            eval_set=[(X_val_fold, y_val_fold)],
            early_stopping_rounds=25,
            verbose=False
        )
        preds = model.predict(X_val_fold)
        rmse = np.sqrt(mean_squared_error(y_val_fold, preds))
        r2 = r2_score(y_val_fold, preds)
        val_scores.append(r2)
        rmse_scores.append(rmse)
        print(f"Fold {fold+1} — R2: {r2:.4f}, RMSE: {rmse:.4f}, Estimators used: {model.best_iteration + 1}")

    print(f"\n📊 Cross-Validation with Early Stopping Results ({n_splits}-fold):")
    print(f"Avg R²: {np.mean(val_scores):.4f} ± {np.std(val_scores):.4f}")
    print(f"Avg RMSE: {np.mean(rmse_scores):.2f} ± {np.std(rmse_scores):.2f}")

    return model

UPLOAD_FOLDER = 'uploads'

def train_model(file_id):
    filename = f"{file_id}.csv"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    
    df = pd.read_csv(filepath)
    df_clean = preprocess_data(df)
    # df_clean, test_df_clean = train_test_split(df_clean, test_size=0.2, random_state=42)
    
    X, y = model_prep(df_clean)
    xgb_model = train_xgboost_kfold_early_stop(X, y)

    return xgb_model

def train_model(df_clean):
    # df_clean, test_df_clean = train_test_split(df_clean, test_size=0.2, random_state=42)
    
    X, y = model_prep(df_clean)
    xgb_model = train_xgboost_kfold_early_stop(X, y)

    return xgb_model


