// server/src/utils/updatePrices.ts - Back-end
import Product from '../models/Product';
import { parse } from 'csv-parse';

interface CsvData {
  product_code: string;
  new_price: string;
}

export const updatePrices = async (csvData: CsvData[]) => {
  for (const row of csvData) {
    const productCode = parseInt(row.product_code);
    const product = await Product.findOne({ where: { code: productCode } });

    if (!product) {
      console.error(`Produto com código ${row.product_code} não existe no banco de dados.`);
      continue;
    }

    const newSalesPrice = parseFloat(row.new_price);

    if (newSalesPrice < product.cost_price) {
      console.error(`Preço de venda do produto com código ${row.product_code} está abaixo do custo.`);
      continue;
    }

    if (newSalesPrice > product.sales_price * 1.1 || newSalesPrice < product.sales_price * 0.9) {
      console.error(`Reajuste do produto com código ${row.product_code} é maior ou menor do que 10% do preço atual.`);
      continue;
    }

    await Product.update(
      { sales_price: newSalesPrice },
      { where: { code: productCode } }    
    );
  }
};

export const loadDataAndUpdatePrices = async (fileBuffer: Buffer) => {
  try {
    const csvData: CsvData[] = [];

    await new Promise((resolve, reject) => {
      parse(fileBuffer, { columns: true })
        .on('data', (data) => csvData.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    await updatePrices(csvData);
    console.log('Preços atualizados com sucesso.');

  } catch (error) {
    console.error('Erro ao atualizar os preços:', error);
    throw error;
  }
};