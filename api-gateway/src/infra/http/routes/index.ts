import { Router } from 'express';
import { CurrencyConversionController } from '../controllers/CurrencyConversionController';

export const routes = Router();

const currencyConversionController = new CurrencyConversionController();

routes.post('/convert', currencyConversionController.convert);
