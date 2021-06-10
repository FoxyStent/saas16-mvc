const DataTypes = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const relations = sequelize.define("relations",{
        rId: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER

        },
    }, { timestamps: false })
    return relations;
}