const DataTypes = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const keyword = sequelize.define("keyword",{
        kId: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
    }, { timestamps: false })
    return keyword;
}