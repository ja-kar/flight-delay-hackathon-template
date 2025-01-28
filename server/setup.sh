#!/bin/bash

# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate

# Install dependencies
pip install Flask
pip install -r requirements.txt

echo "Setup complete. Virtual environment created and dependencies installed."
