import pytest
from flask import Flask
from main import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_origin_airports_count(client):
    response = client.get('/airports/origin')
    assert response.status_code == 200
    data = response.get_json()
    assert 'airports' in data
    assert len(data['airports']) > 50