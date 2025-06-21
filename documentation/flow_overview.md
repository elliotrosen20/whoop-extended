# WHOOP Extended - Application Flow Overview

## Table of Contents
- [Complete User Flow](#complete-user-flow)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [API Integration Points](#api-integration-points)
- [Machine Learning Pipeline](#machine-learning-pipeline)
- [Data Flow Diagram](#data-flow-diagram)
- [Advantages](#advantages)
- [Disadvantages](#disadvantages)
- [Recommendations](#recommendations)

---

## Complete User Flow

### 1. Landing Page (`/`)
**User Experience:**
- User visits the landing page
- Sees welcome message and app description
- Clicks "Get Started" button

**Technical Flow:**
- React Router loads `App.tsx` component
- Simple static page with navigation link
- No API calls or data processing

### 2. Upload Page (`/upload`)
**User Experience:**
- User sees instructions for exporting WHOOP data
- Can either upload their own CSV file or use demo data
- Sees file upload interface

**Technical Flow:**
```typescript
// Frontend checks for existing session
const fileId = localStorage.getItem('fileId');
const insightsReady = localStorage.getItem('insightsReady');

// Three possible states:
// 1. No file uploaded
// 2. File uploaded, analysis not generated
// 3. Analysis complete (redirect to dashboard)
```

#### 2A. File Upload Process
**User Action:** Selects and uploads `physiological_cycles.csv`

**Frontend → Backend:**
```http
POST /api/upload
Content-Type: multipart/form-data
Body: CSV file
```

**Backend Processing:**
```python
# routes/upload.py
1. Validate file extension (.csv, .xlsx, .xls)
2. Generate unique UUID for file identification
3. Save file as "{uuid}.csv" in uploads/ directory
4. Return file_id to frontend
```

**Backend → Frontend:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "file_id": "abc123-def456-ghi789"
}
```

**Frontend Processing:**
```typescript
// Store file ID in browser localStorage
localStorage.setItem('fileId', data.file_id);
// Update UI to show "Generate insights" button
```

#### 2B. Demo Data Loading
**User Action:** Clicks "Try Demo" button

**Frontend → Backend:**
```http
GET /api/demo
```

**Backend → Frontend:**
```json
{
  "success": true,
  "message": "Demo file loaded successfully",
  "file_id": "demo_whoop_data"
}
```

#### 2C. Analysis Generation
**User Action:** Clicks "Generate insights" button

**Frontend Processing:**
```typescript
// Show loading spinner
setIsGenerating(true);
// 5-second delay for user feedback
await new Promise(resolve => setTimeout(resolve, 5000));
```

**Frontend → Backend:**
```http
POST /api/analyze/model/{fileId}
```

**Backend Processing (Machine Learning Pipeline):**
```python
# routes/analyze.py - build_model()
1. Load CSV file from uploads/
2. Data preprocessing and cleaning
3. Feature engineering (sleep ratios)
4. Train XGBoost model with 5-fold cross-validation
5. Generate insights from top 3 features
6. Calculate feature equivalencies
7. Compute SHAP values for interpretability
8. Cache all results in memory
```

**Backend → Frontend:**
```json
{
  "status": "success",
  "message": "Model built and cached successfully"
}
```

**Frontend Processing:**
```typescript
// Mark analysis as complete
localStorage.setItem('insightsReady', 'true');
// Navigate to dashboard
navigate('/dashboard');
```

### 3. Dashboard Page (`/dashboard`)
**User Experience:**
- Sees comprehensive analysis dashboard
- Three main tabs: Insights, Feature Analysis, Simulate
- Interactive visualizations and predictions

**Technical Flow:**

#### 3A. Navigation Guard
```typescript
// Check if user has valid session
const fileId = localStorage.getItem('fileId');
const insightsReady = localStorage.getItem('insightsReady') === 'true';

if (!fileId || !insightsReady) {
  navigate('/upload'); // Redirect back to upload
}
```

#### 3B. Data Loading (Parallel API Calls)
**Frontend → Backend (3 simultaneous requests):**
```http
GET /api/analyze/insights/{fileId}     // Recovery insights
GET /api/analyze/eqInsights/{fileId}   // Equivalence factors
GET /api/analyze/shap/{fileId}         // SHAP analysis
```

**Backend Processing:**
```python
# All data served from in-memory cache
return jsonify(cache[file_id]['insights'])
return jsonify(cache[file_id]['equivalence_insights'])
return jsonify(cache[file_id]['shap_values'])
```

**Frontend State Management:**
```typescript
// Update component state with analysis results
setInsights(insightsData || []);
setEqInsights(eqInsightsData || []);
setShapData(shapData || []);
setIsLoading(false);
```

#### 3C. Tab Interactions

**Insights Tab:**
- Displays carousel of recovery insights
- Shows equivalence factor analysis
- All data from initial API calls

**Feature Analysis Tab:**
- Interactive SHAP visualizations
- Bar charts and waterfall plots
- Toggle between visualization types

**Simulate Tab:**
- 13 interactive biometric sliders
- Real-time recovery score prediction

#### 3D. Prediction Flow (Simulate Tab)
**User Action:** Adjusts sliders and clicks "Predict Recovery Score"

**Frontend → Backend:**
```http
POST /api/analyze/predict/{fileId}
Content-Type: application/json
Body: {
  "rhr": 60,
  "hrv": 50,
  "temp": 36,
  "spo2": 97,
  "resp": 14,
  "asleep": 420,
  "in_bed": 380,
  "light": 130,
  "deep": 110,
  "rem": 100,
  "awake": 50,
  "sleep_need": 120,
  "sleep_debt": 120
}
```

**Backend Processing:**
```python
# models/analysis.py - final_prediction()
1. Calculate derived features (sleep efficiency, ratios)
2. Create feature vector matching model training format
3. Use cached XGBoost model for prediction
4. Return predicted recovery score
```

**Backend → Frontend:**
```json
{
  "prediction": 73.45
}
```

---

## Frontend Architecture

### Technology Stack
- **React 19.0.0** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **Tailwind CSS** for styling
- **D3.js & Recharts** for visualizations

### Component Structure
```
src/
├── pages/
│   ├── Dashboard.tsx    # Main analysis interface
│   └── Upload.tsx       # File upload and processing
├── components/
│   ├── InsightsModule.tsx       # Recovery insights carousel
│   ├── EqInsightsModule.tsx     # Equivalence factors
│   ├── ShapModule.tsx           # Feature importance
│   ├── PredictionModule.tsx     # Interactive simulator
│   └── [visualization components]
└── routes.tsx           # Navigation configuration
```

### State Management
- **Local Storage**: Session persistence (`fileId`, `insightsReady`)
- **React Hooks**: Component-level state management
- **No Global State**: Each component manages its own data

---

## Backend Architecture

### Technology Stack
- **Flask 3.1.0** with CORS support
- **XGBoost 3.0.0** for machine learning
- **SHAP 0.47.2** for model interpretability
- **Pandas/NumPy** for data processing
- **Scikit-learn** for ML utilities

### API Structure
```
api/
├── app.py               # Flask application setup
├── routes/
│   ├── upload.py        # File handling endpoints
│   └── analyze.py       # ML analysis endpoints
├── models/
│   ├── preprocess.py    # Data cleaning and feature engineering
│   ├── xgb_model.py     # XGBoost training pipeline
│   └── analysis.py      # Insights and SHAP calculations
└── uploads/             # File storage directory
```

### In-Memory Caching System
```python
cache = {
    "file_id": {
        'model': trained_xgboost_model,
        'insights': [...],
        'equivalence_insights': [...],
        'shap_values': [...],
        'timestamp': datetime.now()
    }
}
```

---

## API Integration Points

| Endpoint | Method | Purpose | Frontend Usage |
|----------|--------|---------|----------------|
| `/api/upload` | POST | File upload | Upload page file handling |
| `/api/demo` | GET | Load demo data | Upload page demo option |
| `/api/analyze/model/{id}` | POST | Train ML model | Analysis generation |
| `/api/analyze/insights/{id}` | GET | Get recovery insights | Dashboard insights tab |
| `/api/analyze/eqInsights/{id}` | GET | Get equivalencies | Dashboard insights tab |
| `/api/analyze/shap/{id}` | GET | Get SHAP analysis | Dashboard feature analysis |
| `/api/analyze/predict/{id}` | POST | Real-time prediction | Dashboard simulate tab |

---

## Machine Learning Pipeline

### 1. Data Preprocessing
```python
# Remove incomplete data (missing sleep efficiency)
# Filter for sufficient sleep (≥5 hours)
# Engineer sleep stage ratios
# Clean irrelevant columns
# Fill missing values with median
```

### 2. Model Training
```python
# XGBoost Regressor with early stopping
# 5-fold cross-validation
# Hyperparameters: learning_rate=0.025, max_depth=4
# Target: Recovery Score %
# Features: ~18 biometric and sleep metrics
```

### 3. Analysis Generation
```python
# Top 3 feature insights (HRV, RHR, REM)
# Feature equivalency calculations
# SHAP value computation for interpretability
# Real-time prediction capabilities
```

---

## Data Flow Diagram

```
User Journey:
Landing → Upload → Analysis → Dashboard

API Flow:
[CSV File] → POST /upload → [File ID] → localStorage
[File ID] → POST /analyze/model → [ML Training] → cache
[Dashboard] → GET insights/shap/eq → [Cached Results] → UI
[Sliders] → POST /predict → [Real-time ML] → [Score]

Data Processing:
Raw WHOOP CSV → Preprocessing → Feature Engineering → XGBoost → Insights
```

---

## Advantages

### 🚀 Performance
- **Parallel API calls** for fast dashboard loading
- **In-memory caching** eliminates repeated ML training
- **Client-side routing** for instant navigation
- **Optimized XGBoost** with early stopping

### 🎯 User Experience
- **Progressive enhancement** - app works even if some features fail
- **Clear loading states** with spinners and feedback
- **Interactive predictions** with real-time slider adjustments
- **Comprehensive analysis** - insights, visualizations, simulations

### 🧠 Machine Learning
- **Robust validation** with 5-fold cross-validation
- **Interpretable AI** using SHAP analysis
- **Feature engineering** for better predictions
- **Actionable insights** with specific recommendations

### 🏗️ Architecture
- **Modular design** with clear separation of concerns
- **Type safety** with TypeScript
- **Modern tooling** (Vite, Tailwind, React 19)
- **RESTful API** design

### 🔧 Development
- **Simple deployment** - no database required
- **Easy debugging** with clear error handling
- **Extensible** - easy to add new analysis types
- **Well-structured** code organization

---

## Disadvantages

### 💾 Data Persistence
- **Session loss** on server restart - all analysis lost
- **No user accounts** - can't save multiple analyses
- **Memory leaks** - cache grows indefinitely
- **No data backup** - uploaded files not persistent

### 📈 Scalability
- **Single-server limitation** - no horizontal scaling
- **Memory constraints** - RAM usage grows with users
- **No load balancing** - single point of failure
- **Concurrent user limits** - shared cache conflicts

### 🔒 Security & Privacy
- **No authentication** - anyone can access any file_id
- **Sensitive health data** stored in memory without encryption
- **No rate limiting** - vulnerable to abuse
- **File cleanup** - uploaded files accumulate on disk

### 🐛 Error Handling
- **Cache dependency** - if cache corrupted, analysis lost
- **No retry mechanisms** - API failures require restart
- **Limited error recovery** - users must re-upload on issues
- **Silent failures** - some errors not surfaced to users

### 🔧 Maintenance
- **Manual ML retraining** - no automated model updates
- **No monitoring** - no insights into system performance
- **Limited logging** - difficult to debug production issues
- **Configuration hardcoded** - no environment-specific settings

---

## Recommendations

### Short-term Improvements
1. **Add database persistence** (PostgreSQL/MongoDB)
2. **Implement user authentication** 
3. **Add comprehensive error handling**
4. **Include system monitoring/logging**
5. **Add rate limiting and security headers**

### Medium-term Enhancements
1. **Background job processing** (Celery/RQ)
2. **File storage service** (AWS S3/Google Cloud)
3. **Model versioning and A/B testing**
4. **Caching layer** (Redis) with TTL
5. **API documentation** (Swagger/OpenAPI)

### Long-term Architecture
1. **Microservices architecture**
2. **Container orchestration** (Docker/Kubernetes)
3. **Auto-scaling infrastructure**
4. **Data pipeline automation**
5. **Real-time collaborative features**

---

*This document provides a comprehensive overview of the WHOOP Extended application architecture, data flow, and recommendations for improvement.* 