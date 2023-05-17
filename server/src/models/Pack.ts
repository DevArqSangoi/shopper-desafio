// server/src/models/Pack.ts - Back-end
import { Model, DataTypes, BelongsTo } from 'sequelize';
import sequelize from '../utils/sequelize';
import Product from './Product';

class Pack extends Model {
    public id!: number;
    public pack_id!: number;
    public product_id!: number;
    public qty!: number;

    public readonly product?: Product;

    public static async updatePriceBasedOnProducts(pack_id: number) {
        const packProducts = await Pack.findAll({ where: { pack_id }, include: [Product] });
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

export default Pack;