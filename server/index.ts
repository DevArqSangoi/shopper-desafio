// server/src/index.ts - Back-end
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import Product from './src/models/Product';
import { loadDataAndValidate } from './src/utils/validator';
import { updatePrices } from './src/utils/updatePrices';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.listen(5000, () => {
  console.log('Server is listening on port 5000');
});

app.post('/upload', upload.single('file'), async (req, res) => {
  console.log('Recebeu solicitação /upload');
  try {
    if (!req.file || !req.file.buffer) {
      return res.json({ error: 'Nenhum arquivo enviado.' });
    }

    const validationResponse = await loadDataAndValidate(req.file.buffer);

    if (validationResponse.errors.length > 0) {
      const errorResponse = {
        errors: validationResponse.errors,
        invalidData: validationResponse.invalidData,
      };
      return res.json(errorResponse);
    }

    console.log('Todos os produtos foram processados com sucesso.');
    res.json({ validatedData: validationResponse.validatedData, invalidData: validationResponse.invalidData });
  } catch (error) {
    console.error('Erro ao processar o upload:', error);
    res.json({ error: 'Erro ao processar o arquivo.' });
  }
});

app.post('/update', upload.single('file'), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.json({ error: 'Nenhum arquivo enviado.' });
    }

    const validationResponse = await loadDataAndValidate(req.file.buffer);
    
    if (validationResponse.errors.length > 0) {
      const errorResponse = {
        errors: validationResponse.errors,
        invalidData: validationResponse.invalidData,
      };
      return res.json(errorResponse);
    }

    await updatePrices(validationResponse.validatedData);

    console.log('Preços atualizados com sucesso.');
    res.json(validationResponse.validatedData);
  } catch (error) {
    console.error('Erro ao atualizar os preços:', error);
    res.json({ error: 'Erro ao atualizar os preços.' });
  }
});

app.get('/produtos', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.json({ error: 'Erro ao buscar produtos.' });
  }
});