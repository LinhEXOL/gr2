import restaurantService from "../services/restaurantService";
let handleCreateRestaurant = async (req, res) => {
  try {
    let info = await restaurantService.createRestaurant(req.body);
    console.log(info);
    return res.status(200).json(info);
  } catch (e) {
    console.log("Get all code error:", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let handleGetAllRestaurants = async (req, res) => {
  try {
    let info = await restaurantService.getAllRestaurants();

    return res.status(200).json(info);
  } catch (e) {
    console.log("Get all code error:", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let handleGetDetailRestaurantById = async (req, res) => {
  try {
    let info = await restaurantService.getDetailRestaurantById(req.query.id);

    return res.status(200).json(info);
  } catch (e) {
    console.log("Get all code error:", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let handleBulkCreateResSchedule = async (req, res) => {
  try {
    console.log(req.body);
    let info = await restaurantService.bulkCreateResSchedule(req.body);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server...",
    });
  }
};

let handleGetResScheduleByDate = async (req, res) => {
  try {
    console.log(req.body);
    let info = await restaurantService.getResScheduleByDate(
      req.query.hotpotId,
      req.query.date
    );
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server...",
    });
  }
};
module.exports = {
  handleCreateRestaurant: handleCreateRestaurant,
  handleGetAllRestaurants: handleGetAllRestaurants,
  handleGetDetailRestaurantById: handleGetDetailRestaurantById,
  handleGetResScheduleByDate: handleGetResScheduleByDate,
  handleBulkCreateResSchedule: handleBulkCreateResSchedule,
};
