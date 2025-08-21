
const express = require("express");
const router = express.Router();
const group = require("../controllers/groupController");

router.post("/create", group.createGroup);
router.get("/getAll", group.getAllGroups);
router.get("/getById/:id", group.getGroupById);
router.put("/update/:id", group.updateGroupName);
router.delete("/delete/:id", group.deleteGroup);
router.post("/addClients/:id", group.addClients);
router.post("/addGroups/:id", group.addGroups);
router.delete("/delete/:id/:clientId", group.removeClient);
router.delete("/delete-group/:id/:groupId", group.removeGroup);
router.get("/getClients/:id", group.getGroupClients);
router.get("/getGroups/:id", group.getGroupChildGroups);


module.exports = router;
