import customerService from "../services/customerService";

let handlePostBookHotpot = async (req, res) => {
  try {
    let info = await customerService.postBookHotpot(req.body);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server...",
    });
  }
};

let handlePostBookRestaurant = async (req, res) => {
  try {
    let info = await customerService.postBookRestaurant(req.body);
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
  handlePostBookHotpot: handlePostBookHotpot,
  handlePostBookRestaurant: handlePostBookRestaurant,
};
