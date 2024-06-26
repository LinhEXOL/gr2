"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ResBooking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ResBooking.init(
    {
      statusId: DataTypes.STRING,
      restaurantId: DataTypes.INTEGER,
      customerId: DataTypes.INTEGER,
      date: DataTypes.STRING,
      timeType: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ResBooking",
    }
  );
  return ResBooking;
};
