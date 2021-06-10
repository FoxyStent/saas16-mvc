const DataTypes = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const question = sequelize.define("question",{
        qId: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, { timestamps: true, updatedAt: false, createdAt: true})
    return question;
}