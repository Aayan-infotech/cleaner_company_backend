const Library = require('../models/contentLibrary');
const Role = require('../models/roleModel');
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success')

//to Version item

const addLibrary = async (req, res, next) => {
    try {
      const role = await Role.find({ role: 'User' });
      const newLibrary = new Library({
        libName: req.body.libName,
      })
      await newLibrary.save();
      return res.status(200).json("Library Registered Successfully")
     // return next(createSuccess(200, "User Registered Successfully"))
    }
    catch (error) {
      //return res.status(500).send("Something went wrong")
      return next(createError(500, "Something went wrong"))
    }
  }
//get Verison
const getLibraries = async (req, res, next) => {
  try {
      const newLibrary = await Library.find();
      return next(createSuccess(200, "All Libraries", newLibrary));

  } catch (error) {
      return next(createError(500, "Internal Server Error!"))
  }
}

//get Item
// const getItem = async (req, res, next) => {
//   try {
//       const item = await Item.findById(req.params.id);
//       if (!item) {
//           return next(createError(404, "Item Not Found"));
//       }
//       return next(createSuccess(200, "Single Item",item));
//   } catch (error) {
//       return next(createError(500, "Internal Server Error1"))
//   }
// }

//delete item
// const deleteItem = async (req, res, next) => {
//   try {
//       const {id} = req.params;
//       const item = await Item.findByIdAndDelete(id);
//       if (!item) {
//           return next(createError(404, "Item Not Found"));
//       }
//       return next(createSuccess(200, "Item Deleted",item));
//   } catch (error) {
//       return next(createError(500, "Internal Server Error1"))
//   }
// } 

module.exports = {
    addLibrary,getLibraries
}