# User Flow Diagram

This diagram shows the complete user journey through the WHOOP Extended application, including all frontend interactions and navigation flows.

```mermaid
graph TD
    A["Landing Page<br/>/"] --> B["Upload Page<br/>/upload"]
    
    B --> C{"File uploaded?"}
    C -->|No| D["Select CSV File<br/>or Demo Data"]
    C -->|Yes| E{"Analysis generated?"}
    
    D --> F["POST /api/upload<br/>or GET /api/demo"]
    F --> G["Store fileId<br/>localStorage"]
    G --> E
    
    E -->|No| H["Generate Analysis<br/>POST /api/analyze/model"]
    E -->|Yes| I["Dashboard Page<br/>/dashboard"]
    
    H --> J["Loading Spinner<br/>(5+ seconds)"]
    J --> K["Store insightsReady<br/>localStorage"]
    K --> L["Navigate to Dashboard"]
    L --> I
    
    I --> M["Navigation Guard<br/>Check localStorage"]
    M -->|Valid Session| N["Parallel API Calls"]
    M -->|Invalid Session| B
    
    N --> O["GET /api/analyze/insights"]
    N --> P["GET /api/analyze/eqInsights"] 
    N --> Q["GET /api/analyze/shap"]
    
    O --> R["Dashboard UI"]
    P --> R
    Q --> R
    
    R --> S{"User Tab Selection"}
    S --> T["Insights Tab<br/>Recovery recommendations"]
    S --> U["Feature Analysis Tab<br/>SHAP visualizations"]
    S --> V["Simulate Tab<br/>Prediction sliders"]
    
    V --> W["Adjust 13 Biometric Sliders"]
    W --> X["Predict Recovery Score<br/>POST /api/analyze/predict"]
    X --> Y["Display Prediction"]
    
    R --> Z["Reset / New Analysis"]
    Z --> AA["Clear localStorage"]
    AA --> B
    
    style A fill:#e1f5fe
    style I fill:#e8f5e8
    style B fill:#fff3e0
    style H fill:#fce4ec
    style V fill:#f3e5f5
```

## Key User Interactions

### 1. Initial Navigation
- **Landing Page**: Welcome screen with "Get Started" button
- **Upload Page**: File upload interface with demo option
- **Dashboard**: Main analysis interface with three tabs

### 2. File Processing Flow
- **Upload**: User selects CSV file or demo data
- **Storage**: File ID stored in localStorage for session management
- **Analysis**: ML model training triggered by user action
- **Navigation**: Automatic redirect to dashboard when complete

### 3. Dashboard Interactions
- **Tab Navigation**: Switch between Insights, Feature Analysis, and Simulate
- **Real-time Prediction**: Interactive sliders for custom predictions
- **Session Management**: Reset functionality to start new analysis

### 4. State Management
- **localStorage**: Persistent session data (`fileId`, `insightsReady`)
- **Navigation Guards**: Automatic redirects based on session state
- **Error Handling**: Graceful fallbacks for failed API calls 