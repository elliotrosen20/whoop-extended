import pandas as pd
import numpy as np
from models.preprocess import preprocess_data, model_prep


def test_preprocess_removes_short_sleep():
    df = pd.DataFrame({
        'Asleep duration (min)': [200, 400, 100],
        'Recovery score %': [80, 85, 75]
    })
    
    result = preprocess_data(df)
    
    assert len(result) == 1
    assert result['Asleep duration (min)'].iloc[0] == 400


def test_preprocess_calculates_sleep_ratios():
    df = pd.DataFrame({
        'Deep (SWS) duration (min)': [60],
        'REM duration (min)': [90],
        'Light sleep duration (min)': [150],
        'Asleep duration (min)': [300],
        'Recovery score %': [80]
    })
    
    result = preprocess_data(df)
    
    assert 'Deep sleep ratio' in result.columns
    assert 'REM sleep ratio' in result.columns
    assert 'Light sleep ratio' in result.columns
    
    assert result['Deep sleep ratio'].iloc[0] == 0.2
    assert result['REM sleep ratio'].iloc[0] == 0.3


def test_model_prep_separates_features_and_target():
    df = pd.DataFrame({
        'feature1': [1, 2, 3],
        'feature2': [4, 5, 6],
        'Recovery score %': [80, 85, 90]
    })
    
    X, y = model_prep(df)
    
    assert list(y) == [80, 85, 90]
    assert 'Recovery score %' not in X.columns
    assert len(X.columns) == 2


def test_preprocess_handles_missing_values():
    # Test with missing values that won't be filtered out by the >= 300 condition
    df = pd.DataFrame({
        'Asleep duration (min)': [400, 500, 350],  # All values >= 300
        'Heart rate variability (ms)': [45, np.nan, 35],  # Missing value in different column
        'Recovery score %': [80, 85, 90]
    })
    
    result = preprocess_data(df)
    
    # After preprocessing, NaN values should be filled with median
    assert result['Heart rate variability (ms)'].isna().sum() == 0
    # The median of [45, 35] is 40, so the NaN should be replaced with 40
    assert result['Heart rate variability (ms)'].iloc[1] == 40.0 