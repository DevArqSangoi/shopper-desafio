// server/src/utils/validator.ts - Back-end
import { Product } from '../models/initModels';
import { parse } from 'csv-parse';

interface CsvData {
  product_code: string;
  new_price: string;
}

interface ValidatedProduct {
  product_code: string;
  name: string;
  cost_price: number;
  sales_price: number;
  new_price: string;
}

interface ValidationResponse {
  errors: string[];
  validatedData: ValidatedProduct[];
  invalidData: ValidatedProduct[];
}


export const validateCsvData = async (csvData: CsvData[]) => {
  const errors: string[] = [];
  const validatedData: ValidatedProduct[] = [];
  const invalidData: ValidatedProduct[] = [];

  for (const row of csvData) {
    const product = await Product.findOne({ where: { code: parseInt(row.product_code) } });

    if (!product) {
      errors.push(`Produto com código ${row.product_code} não existe no banco de dados.`);
      continue;
    }

    const newSalesPrice = parseFloat(row.new_price);

    if (newSalesPrice < product.cost_price) {
      errors.push(`O preço de venda do produto com código ${row.product_code} está abaixo do preço de custo.`);
      invalidData.push({
        product_code: row.product_code,
        name: product.name,
        cost_price: product.cost_price,
        sales_price: product.sales_price,
        new_price: row.new_price
      });
    } else if (newSalesPrice > product.sales_price * 1.1) {
      errors.push(`O preço de venda do produto com código ${row.product_code} é maior do que 10% do preço atual.`);
      invalidData.push({
        product_code: row.product_code,
        name: product.name,
        cost_price: product.cost_price,
        sales_price: product.sales_price,
        new_price: row.new_price
      });
    } else if (newSalesPrice < product.sales_price * 0.9) {
      errors.push(`O preço de venda do produto com código ${row.product_code} é menor do que 10% do preço atual.`);
      invalidData.push({
        product_code: row.product_code,
        name: product.name,
        cost_price: product.cost_price,
        sales_price: product.sales_price,
        new_price: row.new_price
      });
    } else {
      validatedData.push({
        product_code: row.product_code,
        name: product.name,
        cost_price: product.cost_price,
        sales_price: product.sales_price,
        new_price: row.new_price
      });
    }

  }

  return { errors, validatedData, invalidData };
};

export const loadDataAndValidate = async (fileBuffer: Buffer): Promise<ValidationResponse> => {
  try {
    const csvData: CsvData[] = [];

    await new Promise((resolve, reject) => {
      parse(fileBuffer, { columns: true })
        .on('data', (data) => csvData.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    const { errors, validatedData, invalidData } = await validateCsvData(csvData);

    if (errors.length > 0) {
      console.log('Erros encontrados na validação:');
      console.log(errors);
      return {
        errors: errors,
        validatedData: validatedData,
        invalidData: invalidData,
      };
    } else {
      console.log('Dados validados com sucesso.');
      return {
        errors: [],
        validatedData: validatedData,
        invalidData: [],
      };
    }
  } catch (error: any) {
    console.error('Erro ao carregar ou validar os dados:', error);
    console.error('Erro retornado:', [error.toString()]);
    throw { errors: ["Erro ao carregar ou validar os dados."] };
  }
};

export const updatePrices = async (validatedData: ValidatedProduct[]): Promise<{ success: ValidatedProduct[], failed: ValidatedProduct[] }> => {
  const success: ValidatedProduct[] = [];
  const failed: ValidatedProduct[] = [];
  for (const row of validatedData) {
    const product = await Product.findOne({ where: { code: parseInt(row.product_code) } });

    if (product) {
      try {
        const newSalesPrice = parseFloat(row.new_price);
        await Product.updateAndAdjustPackPrices(product.code, product.cost_price, newSalesPrice);
        success.push(row);
      } catch (error) {
        console.error(`Erro ao atualizar o preço do produto ${row.product_code}:`, error);
        failed.push(row);
      }
    }
  }

  return { success, failed };
};
