# Data Flow Diagram

This diagram illustrates how data flows through the WHOOP Extended system, from raw CSV input through machine learning processing to final insights and predictions.

```mermaid
graph TB
    subgraph "Data Input"
        A["Raw WHOOP CSV<br/>physiological_cycles.csv"]
        B["Demo Data<br/>demo_whoop_data.csv"]
    end
    
    A --> C["File Upload<br/>POST /api/upload"]
    B --> D["Demo Load<br/>GET /api/demo"]
    
    C --> E["UUID Generation"]
    D --> E
    E --> F["File Storage<br/>uploads/{uuid}.csv"]
    
    F --> G["Data Preprocessing<br/>preprocess_data()"]
    
    subgraph "Data Preprocessing Pipeline"
        G --> H["Remove Missing<br/>Sleep Efficiency"]
        H --> I["Filter Sleep Duration<br/>≥ 5 hours"]
        I --> J["Feature Engineering<br/>Sleep Ratios"]
        J --> K["Clean Columns<br/>Remove Timestamps"]
        K --> L["Fill Missing Values<br/>Median Imputation"]
    end
    
    L --> M["ML Model Training<br/>train_model()"]
    
    subgraph "XGBoost Training Pipeline"
        M --> N["Feature Preparation<br/>model_prep()"]
        N --> O["Target: Recovery Score %<br/>Features: ~18 metrics"]
        O --> P["5-Fold Cross-Validation<br/>XGBRegressor"]
        P --> Q["Early Stopping<br/>25 rounds"]
        Q --> R["Trained Model"]
    end
    
    R --> S["Analysis Generation"]
    
    subgraph "Insights Pipeline"
        S --> T["Calculate Insights<br/>Top 3 Features"]
        S --> U["Equivalence Analysis<br/>Feature Relationships"]
        S --> V["SHAP Analysis<br/>Model Interpretability"]
    end
    
    T --> W["In-Memory Cache"]
    U --> W
    V --> W
    R --> W
    
    subgraph "Cache Structure"
        W --> X["cache[file_id]<br/>{model, insights, eq_insights, shap}"]
    end
    
    X --> Y["API Endpoints"]
    
    subgraph "Data Serving"
        Y --> Z["GET /api/analyze/insights<br/>Recovery Recommendations"]
        Y --> AA["GET /api/analyze/eqInsights<br/>Feature Equivalencies"]
        Y --> BB["GET /api/analyze/shap<br/>Feature Importance"]
        Y --> CC["POST /api/analyze/predict<br/>Real-time Predictions"]
    end
    
    subgraph "Frontend Data Usage"
        Z --> DD["Insights Carousel<br/>Actionable Tips"]
        AA --> EE["Equivalence Cards<br/>Feature Comparisons"]
        BB --> FF["SHAP Visualizations<br/>Bar Charts & Waterfall"]
        CC --> GG["Prediction Results<br/>Recovery Score"]
    end
    
    subgraph "Real-time Prediction Flow"
        HH["13 Biometric Inputs<br/>HRV, RHR, Sleep, etc."] --> II["Derive Features<br/>Sleep Efficiency, Ratios"]
        II --> JJ["Model Prediction<br/>final_prediction()"]
        JJ --> CC
    end
    
    style A fill:#e3f2fd
    style R fill:#e8f5e8
    style W fill:#fff3e0
    style DD fill:#f3e5f5
    style EE fill:#f3e5f5
    style FF fill:#f3e5f5
    style GG fill:#f3e5f5
```

## Data Processing Stages

### 1. Data Ingestion
- **Raw CSV**: WHOOP physiological cycles data with ~18 features
- **File Management**: UUID-based storage system
- **Demo Support**: Pre-loaded sample dataset

### 2. Data Preprocessing
- **Quality Filters**: Remove incomplete records (missing sleep efficiency)
- **Duration Filter**: Only analyze nights with ≥5 hours of sleep
- **Feature Engineering**: Calculate sleep stage ratios (Deep/REM/Light)
- **Data Cleaning**: Remove timestamps and irrelevant columns
- **Missing Value Handling**: Median imputation for numeric features

### 3. Machine Learning Pipeline
- **Model Type**: XGBoost Regressor for continuous predictions
- **Validation**: 5-fold cross-validation with early stopping
- **Target Variable**: Recovery Score % (0-100)
- **Features**: Biometric data + engineered sleep ratios

### 4. Analysis Generation
- **Insights**: Impact analysis of top 3 features (HRV, RHR, REM)
- **Equivalencies**: Cross-feature relationships and trade-offs
- **Interpretability**: SHAP values for model explanation

### 5. Data Serving
- **Caching Strategy**: In-memory storage for fast access
- **API Endpoints**: RESTful services for different data types
- **Real-time Processing**: Live predictions with custom inputs

## Key Data Transformations

| Stage | Input | Output | Purpose |
|-------|-------|--------|---------|
| **Upload** | Raw CSV | File ID | Session management |
| **Preprocessing** | Raw data | Clean DataFrame | Model-ready data |
| **Training** | Features + Target | XGBoost Model | Prediction capability |
| **Analysis** | Model + Data | Insights + SHAP | User understanding |
| **Caching** | All results | In-memory store | Fast API responses |
| **Prediction** | Custom inputs | Recovery score | Real-time simulation | 