import db from "../models/index";
let createType = async (data) => {
  return new Promise(async (resolve, reject) => {
    console.log("CHECK DATA type", data);
    try {
      if (
        !data.name ||
        !data.imageBase64 ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        await db.Type.create({
          name: data.name,
          image: data.imageBase64,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
        });
        resolve({
          errCode: 0,
          errMessage: "Create new type succeed!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllTypes = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Type.findAll();
      if (data && data.length > 0) {
        console.log("data:", data);
      }
      resolve({
        errCode: 0,
        errMessage: "OK",
        data,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getDetailTypeById = (inputId, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId || !location) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let data = await db.Type.findOne({
          where: { id: inputId },
          attributes: ["descriptionHTML", "descriptionMarkdown"],
        });
        if (data) {
          let hotpotType = [];
          if (location === "ALL") {
            hotpotType = await db.Hotpot.findAll({
              where: { typeId: inputId },
              attributes: ["id", "provinceId"],
            });
          } else {
            //find by location
            hotpotType = await db.Hotpot.findAll({
              where: { typeId: inputId, provinceId: location },
              attributes: ["id", "provinceId"],
            });
          }

          data.hotpotType = hotpotType;
        } else {
          data = "linh";
        }
        resolve({
          errCode: 0,
          errMessage: "OK",
          data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createType: createType,
  getAllTypes: getAllTypes,
  getDetailTypeById: getDetailTypeById,
};
