import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';

export default function Home() {
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('http://localhost:3001/countries');
        setCountries(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load countries');
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);


  const filteredCountries = countries.filter((country: any) => {
    return (
      country.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) &&
      (selectedRegion ? country.region === selectedRegion : true)
    );
  });

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">

      <div className="mb-4">
        <label className="block text-gray-700">Search for a Country</label>
        <input
          id="search"
          type="text"
          placeholder="Enter country name"
          className="border border-gray-300 p-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>


      <div className="mb-4">
        <label className="block text-gray-700">Filter by Region</label>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="border border-gray-300 p-2"
        >
          <option value="">All Regions</option>
          <option value="Africa">Africa</option>
          <option value="Americas">Americas</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCountries.length > 0 ? (
          filteredCountries.map((country) => (
            <div key={country.name} className="bg-white rounded-lg shadow-md p-4">
              {country.flag ? (
                <img
                  className="w-10 h-10 object-cover"
                  src={country.flag}
                  alt={`Flag of ${country.name}`}
                />
              ) : (
                <p className="text-center">No Flag Available</p>
              )}
              <div className="mt-2 text-center">
                <h2 className="font-semibold">{country.name}</h2>
                <p>{country.region}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No countries found.</p>
        )}
      </div>
    </div>
  );
}
