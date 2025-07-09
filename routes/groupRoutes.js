
const express = require("express");
const router = express.Router();
const group = require("../controllers/groupController");

router.post("/create", group.createGroup);
router.get("/getAll", group.getAllGroups);
router.get("/getById/:id", group.getGroupById);
router.put("/update/:id", group.updateGroupName);
router.delete("/delete/:id", group.deleteGroup);
router.post("/addClients/:id", group.addClients);
router.delete("/delete/:id/:clientId", group.removeClient);
router.get("/getClients/:id", group.getGroupClients);

module.exports = router;
