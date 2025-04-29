import { Request, Response } from 'express';
import axios from 'axios';

const REST_COUNTRIES_API = 'https://restcountries.com/v3.1/all';

interface Country {
  name: { common: string };
  flags?: { svg: string };
  region: string;
  population: number;
  languages: { [key: string]: string };
  currencies?: { [key: string]: { name: string; symbol: string } };
  capital?: string[];
  timezones?: string[];
}

interface Params {
  code: string;
}

// Get all countries
export const getCountries = async (req: Request, res: Response) => {
  try {
    const response = await axios.get<Country[]>(REST_COUNTRIES_API);
    const countries = response.data.map((country) => ({
      name: country.name.common,
      flag: country.flags?.svg || '',
      region: country.region,
    }));
    res.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
};

export const getCountryByCode = async (req: Request<Params>, res: Response): Promise<void> => {
  const { code } = req.params;
  try {
    const response = await axios.get<Country[]>(`https://restcountries.com/v3.1/alpha/${code}`);
    const country = response.data[0];

    if (!country) {
      res.status(404).json({ error: 'Country not found' });
    }

    res.json({
      name: country.name.common,
      flag: country.flags?.svg || '',
      population: country.population,
      languages: country.languages,
      region: country.region,
      currency: country.currencies,
    });
  } catch (error) {
    console.error('Error fetching country by code:', error);
    res.status(500).json({ error: 'Failed to fetch country by code' });
  }
};


// Filter countries by region
export const filterCountriesByRegion = async (req: Request, res: Response) => {
  const { region } = req.params;
  try {
    const response = await axios.get<Country[]>(REST_COUNTRIES_API);
    const countries = response.data.filter((country) => country.region === region);

    res.json(countries);
  } catch (error) {
    console.error(`Error filtering countries by region ${region}:`, error);
    res.status(500).json({ error: 'Failed to filter countries' });
  }
};

// Search countries
export const searchCountries = async (req: Request, res: Response) => {
  const { name, capital, region, timezone } = req.query;

  try {
    const response = await axios.get<Country[]>(REST_COUNTRIES_API);
    let countries = response.data;

    if (name) {
      countries = countries.filter((country) =>
        country.name.common.toLowerCase().includes((name as string).toLowerCase())
      );
    }
    if (capital) {
      countries = countries.filter((country) =>
        country.capital?.[0]?.toLowerCase().includes((capital as string).toLowerCase())
      );
    }
    if (region) {
      countries = countries.filter((country) => country.region === region);
    }
    if (timezone) {
      countries = countries.filter((country) => country.timezones?.includes(timezone as string));
    }

    res.json(countries);
  } catch (error) {
    console.error('Error searching countries:', error);
    res.status(500).json({ error: 'Failed to search countries' });
  }
};
