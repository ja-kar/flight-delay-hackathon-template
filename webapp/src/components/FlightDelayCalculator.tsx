import React, { useState, useEffect } from 'react';
import { Plane, Clock, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const FlightDelayCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    departure: '',
    arrival: '',
    date: new Date()
  });
  const [probability, setProbability] = useState<string>('');
  const [airports, setAirports] = useState<{ id: number, name: string }[]>([]);
  const [destinations, setDestinations] = useState<{ id: number, name: string }[]>([]);
  const [loadingAirports, setLoadingAirports] = useState<boolean>(true);
  const [loadingDestinations, setLoadingDestinations] = useState<boolean>(false);

  useEffect(() => {
    fetch('http://localhost:5000/airports/origin')
      .then(response => response.json())
      .then(data => {
        const formattedAirports = data.airports.map((airport: [number, string]) => ({
          id: airport[0],
          name: airport[1]
        }));
        setAirports(formattedAirports);
        setLoadingAirports(false);
      })
      .catch(error => {
        console.error('Error fetching airports:', error);
        setLoadingAirports(false);
      });
  }, []);

  interface FormData {
    departure: string;
    arrival: string;
    date: Date;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value
    }));

    if (name === 'departure') {
      setLoadingDestinations(true);
      fetch(`http://localhost:5000/airports/origin/${value}/destinations`)
        .then(response => response.json())
        .then(data => {
          const formattedAirports = data.airports.map((airport: [number, string]) => ({
            id: airport[0],
            name: airport[1]
          }));
          setDestinations(formattedAirports);
          setLoadingDestinations(false);
        })
        .catch(error => {
          console.error('Error fetching destinations:', error);
          setLoadingDestinations(false);
        });
    }
  };

  const handleDateChange = (date: Date) => {
    setFormData((prev: FormData) => ({
      ...prev,
      date: date
    }));
  };

  const calculateProbability = async (departure: string, arrival: string, date: Date): Promise<string> => {
    const monthName = date.toLocaleString('default', { month: 'long' });
    const response = await fetch(`http://localhost:5000/delay/${departure}/${arrival}/${monthName}`);
    const data = await response.json();
    return (data.probability * 100).toFixed(1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { departure, arrival, date } = formData;
    const finalProb = await calculateProbability(departure, arrival, date);
    setProbability(finalProb);
  };

  return (
    <div className="p-4">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Plane className="h-6 w-6" />
            Flight Delay Probability Calculator
          </h2>
        </div>
        <div className="p-6">
          {loadingAirports ? (
            <div className="flex justify-center items-center">
                <div className="loader flex justify-center items-center"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Plane className="h-4 w-4" />
                    Departure Airport
                  </label>
                  <select
                    name="departure"
                    value={formData.departure}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded-md bg-white"
                  >
                    <option value="">Select departure airport</option>
                    {airports.map(airport => (
                      <option key={airport.id} value={airport.id}>{airport.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Plane className="h-4 w-4 transform -rotate-90" />
                    Arrival Airport
                  </label>
                  {loadingDestinations ? (
                    <div className="flex justify-center items-center">
                      <div className="loader"></div>
                    </div>
                  ) : (
                    <select
                      name="arrival"
                      value={formData.arrival}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border rounded-md bg-white"
                    >
                      <option value="">Select arrival airport</option>
                      {destinations.map(airport => (
                        <option key={airport.id} value={airport.id}>{airport.name}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Calendar className="h-4 w-4" />
                    Date of Travel
                  </label>
                  <DatePicker
                    selected={formData.date}
                    onChange={handleDateChange}
                    dateFormat="MM/dd/yyyy"
                    className="w-full p-2 border rounded-md bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Calculate Probability
              </button>
            </form>
          )}

          {probability !== null && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5" />
                Delay Probability Result
              </h3>
              <div className="text-3xl font-bold text-blue-600">
                {probability}%
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Chance of your flight being delayed based on historical data and current factors.
                {Number(probability) > 30 && (
                  <span className="block mt-1 text-amber-600">
                    ⚠️ This route has a higher than average delay risk.
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightDelayCalculator;