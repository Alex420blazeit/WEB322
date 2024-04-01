require('dotenv').config();
const Sequelize = require('sequelize');

// set up sequelize to point to our postgres database
let sequelize = new Sequelize(
  process.env.database,
  process.env.user,
  process.env.password,
  {
    host: process.env.host,
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  }
)

const Theme = sequelize.define('Theme', {
  id:{
    type: Sequelize.INTEGER,
    primaryKey: true, 
    autoIncrement: true,
  },
  name: Sequelize.STRING, 
  createdAt: false, 
  updatedAt: false,
  });

const Set = sequelize.define('Set', {
  set_num: {
    type: Sequelize.STRING,
    primaryKey: true,
  }, 
  name: Sequelize.STRING,
  year: Sequelize.INTEGER,
  num_parts: Sequelize.INTEGER,
  theme_id: Sequelize.INTEGER,
  img_url: Sequelize.STRING,
  createdAt: false, 
  updatedAt: false,
  });
  Set.belongsTo(Theme, {foreignKey: 'theme_id'})

  function initialize() {
    return new Promise((resolve, reject) => {
      sequelize.sync()
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

function getAllSets() {
  sequelize.sync()
    .then(() => {
      return Set.findAll({ include: [Theme] }); 
    })
    .catch((err) => {
    });
}

function getSetByNum(setNum) {
  sequelize.sync()
    .then(() => {
      return Set.findOne({ 
        set_num: setNum 
      });
    })
    .catch((err) => {
    });
  }

function getSetsByTheme(theme) {

  return Set.findAll({include: [Theme], where: {
    '$Theme.name$': {
      [Sequelize.Op.iLike]: `%${theme}%`}
    }});
}

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme }

