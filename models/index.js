const dbConfig = require("../db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.answer = require("./answer.js")(sequelize, Sequelize);
db.keyword = require("./keyword")(sequelize, Sequelize);
db.question = require("./question")(sequelize, Sequelize);
db.relations = require("./relations")(sequelize, Sequelize);
db.user = require("./user")(sequelize, Sequelize);

module.exports = db;