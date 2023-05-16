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

    static associate(models: any) {
        this.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product',
        });
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