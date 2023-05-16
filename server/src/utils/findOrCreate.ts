import { ProductType } from '../types/productType';
import Product from '../models/Product';

const findOrCreateProduct = async (productData: ProductType): Promise<void> => {
    try {
        const [product, created] = await Product.findOrCreate({
            where: { code: productData.code },
            defaults: {
                name: productData.name,
                cost_price: productData.cost_price,
                sales_price: productData.sales_price
            }
        });

        if (!created) {
            await product.update({
                name: productData.name,
                cost_price: productData.cost_price,
                sales_price: productData.sales_price
            });
        }
    } catch (error) {
        console.error('Erro ao buscar ou criar produto:', error);
    }
};

export default findOrCreateProduct;