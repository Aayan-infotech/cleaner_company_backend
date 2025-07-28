const express = require("express");
const router = express.Router();
const crmController = require("../controllers/crmController");
const upload = require('../middleware/upload');

router.post("/add", upload.array('images'), crmController.createCRM);
router.get("/get-all", crmController.getAllCRM);
router.get("/get-all-clients", crmController.getAllClients);
router.get("/get/:id", crmController.getCRMById);
router.put("/update/:id", upload.array('images'), crmController.updateCRMById);
router.delete("/delete/:id", crmController.deleteCRMById);


module.exports = router;