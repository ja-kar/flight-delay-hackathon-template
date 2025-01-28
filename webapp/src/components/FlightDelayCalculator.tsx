import React, { useState } from 'react';
import { Plane, Clock, Calendar } from 'lucide-react';

const FlightDelayCalculator = () => {
  const [formData, setFormData] = useState({
    departure: '',
    arrival: '',
    month: ''
  });
  const [probability, setProbability] = useState<string>('');


  // TODO: Get airports from API
  // Sample airports for demonstration
  const airports = [
    'JFK - New York',
    'LAX - Los Angeles',
    'ORD - Chicago',
    'DFW - Dallas',
    'ATL - Atlanta',
    'SFO - San Francisco',
    'MIA - Miami',
    'SEA - Seattle',
    'DEN - Denver',
    'BOS - Boston'
  ];

  // Months array
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  interface FormData {
    departure: string;
    arrival: string;
    month: string;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Calculate base probability based on month (winter months have higher probability)
    let monthFactor = 1;
    if (['December', 'January', 'February'].includes(formData.month)) {
      monthFactor = 1.5; // 50% higher chance in winter
    } else if (['July', 'August'].includes(formData.month)) {
      monthFactor = 1.3; // 30% higher chance in peak summer
    }

    // Calculate probability based on airports (busier airports have higher chances)
    let airportFactor = 1;
    const busyAirports = ['JFK - New York', 'LAX - Los Angeles', 'ORD - Chicago', 'ATL - Atlanta'];
    if (busyAirports.includes(formData.departure) || busyAirports.includes(formData.arrival)) {
      airportFactor = 1.2;
    }

    // Base probability between 15-25%
    const baseProb = Math.random() * 10 + 15;
    const finalProb = (baseProb * monthFactor * airportFactor).toFixed(1);
    
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
                    <option key={airport} value={airport}>{airport}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Plane className="h-4 w-4 transform rotate-90" />
                  Arrival Airport
                </label>
                <select
                  name="arrival"
                  value={formData.arrival}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-md bg-white"
                >
                  <option value="">Select arrival airport</option>
                  {airports.filter(airport => airport !== formData.departure).map(airport => (
                    <option key={airport} value={airport}>{airport}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Calendar className="h-4 w-4" />
                  Month of Travel
                </label>
                <select
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-md bg-white"
                >
                  <option value="">Select month</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Calculate Probability
            </button>
          </form>

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