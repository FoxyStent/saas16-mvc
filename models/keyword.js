const DataTypes = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const keyword = sequelize.define("keyword",{
        name: {
            primaryKey: true,
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
    }, { timestamps: false })
    return keyword;
}