module.exports = (sequelize, DataTypes) => {
  const Occupation = sequelize.define('Occupation', {
    name: DataTypes.STRING
  });

  return Occupation;
}