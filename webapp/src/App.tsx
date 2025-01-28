import { useState } from 'react';
import './App.css';
import FlightDelayCalculator from './components/FlightDelayCalculator';

function App() {
  const [message, setMessage] = useState('');

  const fetchMessage = () => {
    console.log('Fetching message...');
    fetch('http://localhost:5000/')
      .then(response => {
        console.log('Response received:', response);
        return response.text();
      })
      .then(data => {
        console.log('Data received:', data);
        setMessage(data);
      })
      .catch(error => {
        console.error('Error fetching message:', error);
      });
  };

  return (
    <div className="App">
      <button onClick={fetchMessage}>
        Fetch Message
      </button>
      <div className="message-box">
        <p>{message}</p>
      </div>
      <FlightDelayCalculator />
    </div>
  );
}

export default App;
