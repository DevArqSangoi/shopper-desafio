import express from 'express';
import multer from 'multer';
import { loadDataAndValidate } from './src/utils/validator';
import { loadDataAndUpdatePrices } from './src/utils/updatePrices';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });





export default router;