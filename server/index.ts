// server/src/index.ts - Back-end
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { Product } from './src/models/initModels';
import { loadDataAndValidate, updatePrices } from './src/utils/validator';

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
        validatedData: validationResponse.validatedData,
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
  console.log('Recebeu solicitação de /update');
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

    const updateResult = await updatePrices(validationResponse.validatedData);

    console.log('Preços atualizados com sucesso.');
    console.log('Produtos atualizados:', updateResult.success.length);
    console.log('Produtos falhados:', updateResult.failed.length);
    res.json({ updatedData: updateResult.success, failedData: updateResult.failed });
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