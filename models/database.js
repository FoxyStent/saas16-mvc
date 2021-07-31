const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DB_URL, {
    operatorsAliases: false,
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const Answer  = require("./answer.js")(sequelize, Sequelize);
const Keyword = require("./keyword")(sequelize, Sequelize);
const Question = require("./question")(sequelize, Sequelize);
const Relations = require("./relations")(sequelize, Sequelize);
const User  = require("./user")(sequelize, Sequelize);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

User.hasMany(Question);
Question.belongsTo(User);
User.hasMany(Answer);
Answer.belongsTo(User);
Question.hasMany(Answer);
Answer.belongsTo(Question);
Question.hasMany(Relations);
Relations.belongsTo(Question);
Keyword.hasMany(Relations);
Relations.belongsTo(Keyword);


db.answer = Answer
db.keyword = Keyword
db.question = Question
db.relations = Relations
db.user = User

module.exports = db;