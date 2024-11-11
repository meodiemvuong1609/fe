import React, { useState, useEffect } from 'react';
import axiosInstance from './services/axiosIntance';
import './App.css';

const CountryList = ({ onSelectCountry }) => {
  const [countries, setCountries] = useState([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await axiosInstance.get(`api/location/country/?name__icontains=${keyword}`);
      setCountries(response.data.data);
    };
    fetchCountries();
  }, [keyword]);

  return (
    <div className='list'>
      <input
        type="text"
        placeholder="Filter countries"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <ul>
        {countries.map((country) => (
          <li key={country.id} onClick={() => onSelectCountry(country)}>
            {country.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

const StateList = ({ country, onSelectState }) => {
  const [states, setStates] = useState([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    if (country) {
      const fetchStates = async () => {
        const response = await axiosInstance.get(`api/location/state/?name__icontains=${keyword}&country=${country.id}`);
        setStates(response.data.data);
      };
      fetchStates();
    }
  }, [keyword, country]);

  return (
    <div className='list'>
      <input
        type="text"
        placeholder="Filter states"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <ul>
        {states.map((state) => (
          <li key={state.id} onClick={() => onSelectState(state)}>
            {state.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

const CityList = ({ state, onSelectCity }) => {
  const [cities, setCities] = useState([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    if (state) {
      const fetchCities = async () => {
        const response = await axiosInstance.get(`api/location/city/?name__icontains=${keyword}&state=${state.id}`);
        setCities(response.data.data);
      };
      fetchCities();
    }
  }, [keyword, state]);

  return (
    <div className='list'>
      <input
        type="text"
        placeholder="Filter cities"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <ul>
        {cities.map((city) => (
          <li key={city.id} onClick={() => onSelectCity(city)}>
            {city.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

const LocationList = ({ city, state, country }) => {
  const [locations, setLocations] = useState([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    if (city || state || country) {
      const fetchLocations = async () => {
        const params = { city: city?.id, state: state?.id, country: country?.id };
        const response = await axiosInstance.get('api/location/location/', { params });
        setLocations(response.data.data);
      };
      fetchLocations();
    }
  }, [keyword, city, state, country]);

  return (
    <div className='list'>
      <input
        type="text"
        placeholder="Filter locations by zip code"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <ul>
        {locations.map((location) => (
          <li key={location.id}>
            {location.zip_code}
          </li>
        ))}
      </ul>
    </div>
  );
};

const App = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <div className='container'>
      <div className='content'>
        <CountryList onSelectCountry={setSelectedCountry} />
      </div>
      <div className='content'>
        {selectedCountry && <StateList country={selectedCountry} onSelectState={setSelectedState} />}
      </div>
      <div className='content'>
        {selectedState && <CityList state={selectedState} onSelectCity={setSelectedCity} />}
      </div>
      <div className='content'>
      {selectedCity && <LocationList city={selectedCity} state={selectedState} country={selectedCountry} />}
      </div>
    </div>
  );
};

export default App;
