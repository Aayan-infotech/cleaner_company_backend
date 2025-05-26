
const express = require("express");
const router = express.Router();
const group = require("../controllers/groupController");

router.post("/create", group.createGroup);
router.get("/getAll", group.getAllGroups);
router.get("/getById/:id", group.getGroupById);
router.put("/update/:id", group.updateGroupName);
router.delete("/delete/:id", group.deleteGroup);
router.put("/addClients/:id", group.addClients);
router.delete("/delete/:id/:clientId", group.removeClient);

module.exports = router;
