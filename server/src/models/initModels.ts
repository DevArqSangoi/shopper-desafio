// server/src/models/initModels.ts - Back-end
import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/sequelize';

class Pack extends Model {
    public id!: number;
    public pack_id!: number;
    public product_id!: number;
    public qty!: number;

    public readonly product?: Product;

    public static async updatePriceBasedOnProducts(pack_id: number) {
        const packProducts = await Pack.findAll({ where: { pack_id }, include: [{ model: Product, as: 'product' }] });

        let newPackCostPrice = 0;
        let newPackSalesPrice = 0;
        for (const packProduct of packProducts) {
            if (packProduct.product) {
                newPackCostPrice += packProduct.qty * packProduct.product.cost_price;
                newPackSalesPrice += packProduct.qty * packProduct.product.sales_price;
            }
        }
        await Product.update({ cost_price: newPackCostPrice, sales_price: newPackSalesPrice },
            { where: { code: pack_id } });
    }
}

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

Pack.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        pack_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'Product',
                key: 'code',
            },
        },
        product_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'Product',
                key: 'code',
            },
        },
        qty: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Pack',
        tableName: 'packs',
        timestamps: false,
    }
);

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

Product.hasMany(Pack, { foreignKey: 'product_id' });
Pack.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

export { Product, Pack };
