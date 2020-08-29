module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    userId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    totalValue: DataTypes.FLOAT,
  });

  return Order;
}