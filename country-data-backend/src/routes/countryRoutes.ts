import express from 'express';
import {
  getCountries,
  getCountryByCode,
  filterCountriesByRegion,
  searchCountries,
} from '../controllers/countryController';

const router = express.Router();

// More specific routes should come first
router.get('/search', searchCountries);
router.get('/region/:region', filterCountriesByRegion);
router.get('/:code', getCountryByCode);
router.get('/', getCountries);

export default router;
