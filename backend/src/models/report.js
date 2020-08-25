module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    userId: DataTypes.INTEGER,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    locationManager: DataTypes.STRING,
    equipmentType: DataTypes.STRING,
    equipmentDetails: DataTypes.TEXT,
    problemsFound: DataTypes.TEXT,
    observations: DataTypes.TEXT,
    status: DataTypes.STRING
  });

  return Report;
}