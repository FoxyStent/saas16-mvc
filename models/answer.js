const DataTypes = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const answer = sequelize.define("answer",{
        aId: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, { timestamps: true, updatedAt: false})
    return answer;
}