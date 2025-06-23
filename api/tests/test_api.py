from app import app


def test_upload_endpoint_no_file():
    app.config['TESTING'] = True
    client = app.test_client()
    
    response = client.post('/api/upload', data={})
    
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data


def test_demo_endpoint():
    app.config['TESTING'] = True
    client = app.test_client()
    
    response = client.get('/api/demo')
    
    assert response.status_code == 200
    data = response.get_json()
    assert 'file_id' in data
    assert 'message' in data


def test_insights_endpoint_invalid_file_id():
    app.config['TESTING'] = True
    client = app.test_client()
    
    response = client.get('/api/analyze/insights/invalid-id')
    
    assert response.status_code in [400, 404, 500]


def test_health_check():
    app.config['TESTING'] = True
    client = app.test_client()
    
    response = client.get('/')
    assert response.status_code == 404 