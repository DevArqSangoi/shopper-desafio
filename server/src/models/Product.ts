// server/src/models/Product.ts - Back-end
import { Model, DataTypes, Op } from 'sequelize';
import sequelize from '../utils/sequelize';
import Pack from './Pack';

class Product extends Model {
  public code!: number;
  public name!: string;
  public cost_price!: number;
  public sales_price!: number;
  
  public static async updateAndAdjustPackPrices(code: number, cost_price: number, sales_price: number) {
    await Product.update({ cost_price, sales_price }, { where: { code } });
    const updatedProduct = await Product.findOne({ where: { code } });

    if (!updatedProduct) {
      throw new Error(`Product with code ${code} not found`);
    }

    const packs = await Pack.findAll({ where: { product_id: code } });
    for (const pack of packs) {
      await Pack.updatePriceBasedOnProducts(pack.pack_id);
    }

    if (await Product.isPack(updatedProduct.code)) {
      await Product.updateProductPricesBasedOnPack(updatedProduct.code);
    }
  }

  public static async isPack(code: number): Promise<boolean> {
    const count = await Pack.count({ where: { pack_id: code } });
    return count > 0;
  }

  public static async updateProductPricesBasedOnPack(code: number) {
    const product = await Product.findOne({ where: { code } });

    if (!product) {
      throw new Error(`Product with code ${code} not found`);
    }

    const packProducts = await Pack.findAll({ where: { pack_id: code }, include: [Product] });
    for (const packProduct of packProducts) {
      if (packProduct.product) {
        const newProductCostPrice = product.cost_price / packProduct.qty;
        const newProductSalesPrice = product.sales_price / packProduct.qty;
        await Product.update({ cost_price: newProductCostPrice, sales_price: newProductSalesPrice }, { where: { code: packProduct.product.code } });
      }
    }
  }
}

Product.init(
  {
    code: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    cost_price: {
      type: DataTypes.DECIMAL(9, 2),
      allowNull: false,
    },
    sales_price: {
      type: DataTypes.DECIMAL(9, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: false,
  }
);

export default Product;