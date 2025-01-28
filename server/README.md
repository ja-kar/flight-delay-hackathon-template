# Get started

## 1. Set up the virtual environment

Navigate to the server directory and create a virtual environment:

```sh
cd server
python3 -m venv .venv
```

Activate the virtual environment:

```sh
source .venv/bin/activate
```

## 2. Install dependencies

Install Flask and other required packages:

```sh
pip install Flask
pip install -r requirements.txt
```

## 3. Run the server

Start the Flask server:

```sh
./run_server.sh
```

The server should now be running on `http://localhost:5000/`.