const mongoose = require('mongoose');


// const subcategorySchema = new mongoose.Schema({
//     subName: String,
//   });
const MethodSchema = new mongoose.Schema({
  methodName: String,
  multiplier: String
});
// Define the category schema, including the subcategories array
const DropdownSchema = new mongoose.Schema({
  catName: String,
  price: String
});
const DropdownSchema2 = new mongoose.Schema({
  hardSurface: [DropdownSchema],
  itemClean: [DropdownSchema],
  dryCleaning: [DropdownSchema],
  specialServices: [DropdownSchema],
  method: [MethodSchema],
  room: {
    type: [String],
    default: [],
    required: false
  },
  // lotNumber: {
  //     type: [String],
  //     default: [],
  //     required: false
  // },                   
});


module.exports = mongoose.model('Dropdown', DropdownSchema2); 