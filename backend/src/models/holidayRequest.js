module.exports = (sequelize, DataTypes) => {
  const HolidayRequest = sequelize.define('HolidayRequest', {
    userId: DataTypes.INTEGER,
    startDate: DataTypes.STRING,
    endDate: DataTypes.STRING,
    contact: DataTypes.STRING,
    status: DataTypes.STRING
  });

  return HolidayRequest;
}