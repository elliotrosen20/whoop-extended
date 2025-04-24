import pandas as pd
import numpy as np

def preprocess_data(df):
    df_clean = df.copy()

    if 'Sleep efficiency %' in df_clean.columns:
        df_clean = df_clean.dropna(subset=['Sleep efficiency %'])

    if 'Asleep duration (min)' in df_clean.columns:
        df_clean = df_clean[df_clean['Asleep duration (min)'] >= 300]

    if all(col in df_clean.columns for col in [
        'Deep (SWS) duration (min)',
        'REM duration (min)',
        'Light sleep duration (min)',
        'Asleep duration (min)'
    ]):
        df_clean['Deep sleep ratio'] = df_clean['Deep (SWS) duration (min)'] / df_clean['Asleep duration (min)']
        df_clean['REM sleep ratio'] = df_clean['REM duration (min)'] / df_clean['Asleep duration (min)']
        df_clean['Light sleep ratio'] = df_clean['Light sleep duration (min)'] / df_clean['Asleep duration (min)']
        
    columns_to_drop = [
        'Cycle start time',
        'Cycle end time',
        'Cycle timezone',
        'Day Strain',
        'Energy burned (cal)',
        'Max HR (bpm)',
        'Average HR (bpm)',
        'Sleep onset',
        'Wake onset',
        'Sleep consistency %',
    ]
    
    columns_to_drop = [col for col in columns_to_drop if col in df_clean.columns]
    df_clean = df_clean.drop(columns=columns_to_drop)

    numeric_columns = df_clean.select_dtypes(include=np.number).columns
    for col in numeric_columns:
        df_clean[col] = df_clean[col].fillna(df_clean[col].median())
        
    return df_clean

def model_prep(df, target_col='Recovery score %'):
    df_model = df.copy()

    y = df_model[target_col]
    X = df_model.drop(columns=[target_col])

    for col in X.select_dtypes(include=['object']).columns:
        X[col] = pd.to_numeric(X[col], errors='ignore')

    X = X.select_dtypes(include=np.number)

    return X, y