const express = require("express");
const router = express.Router();
const crmController = require("../controllers/crmController");

router.post("/add", crmController.createCRM);
router.get("/get-all", crmController.getAllCRM);
router.get("/get/:id", crmController.getCRMById);
router.put("/update/:id", crmController.updateCRMById);
router.delete("/delete/:id", crmController.deleteCRMById);


module.exports = router;