
const Group = require("../models/groupModel");
const createError   = require("../middleware/error");
const createSuccess = require("../middleware/success");

exports.createGroup = async (req, res, next) => {
  try {
    const { groupName } = req.body;
    if (!groupName) {
      return next(createError(400, "groupName is required."));
    }

    const group = await Group.create({ groupName, clients: [] });
    return next(createSuccess(
      200,
      "Group created successfully",
      group
    ));
  } catch (err) {
    console.error("createGroup error:", err);
    return next(createError(500, "Internal Server Error"));
  }
};


exports.getAllGroups = async (req, res, next) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page  = Math.max(parseInt(page, 10), 1);
    limit = Math.max(parseInt(limit, 10), 1);
    const skip = (page - 1) * limit;

    const totalGroups = await Group.countDocuments();
    const groups = await Group
      .find()
      .populate("clients")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });     

    const totalPages = Math.ceil(totalGroups / limit);
    return next(createSuccess(
      200,
      "Groups fetched successfully",
      {
        groups,
        pagination: {
          totalGroups,
          totalPages,
          page,
          limit,
        }
      }
    ));
  } catch (err) {
    console.error("getAllGroups error:", err);
    return next(createError(500, "Failed to fetch groups"));
  }
};


exports.getGroupById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const group = await Group.findById(id).populate("clients");

    if (!group) {
      return next(
        createError(404, `Group not found`)
      );
    }

    return next(
      createSuccess(
        200,
        "Group fetched successfully",
        group
      )
    );
  } catch (err) {
    console.error("getGroupById error:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.updateGroupName = async (req, res, next) => {
  try {
    const { groupName } = req.body;
    const { id } = req.params;

    const group = await Group.findByIdAndUpdate(
      id,
      { groupName: groupName.trim() },
      { new: true, runValidators: true }
    );

    if (!group) {
      return next(createError(404, `Group not found.`));
    }

    return next(createSuccess(
      200,
      "Group name updated successfully",
      group
    ));
  } catch (err) {
    console.error("updateGroupName error:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.addClients = async (req, res, next) => {
  try {
    const { clients } = req.body;
    const { id } = req.params;

    const group = await Group.findById(id);
    if (!group) {
      return next(createError(404, `Group  not found.`));
    }

    clients.forEach(cid => {
      if (!group.clients.includes(cid)) {
        group.clients.push(cid);
      }
    });
    await group.save();

    await group.populate({
      path: "clients",
      select: "-secondaryName -secondaryEmail -secondaryPhones -secondaryAddress"
    });

    return next(createSuccess(
      200,
      "Clients added successfully",
      group
    ));
  } catch (err) {
    console.error("addClients error:", err);
    return next(createError(500, "Internal Server Error"));
  }
};


exports.removeClient = async (req, res, next) => {
  try {
    const { id, clientId } = req.params;

    const group = await Group.findById(id);
    if (!group) {
      return next(createError(404, `Group not found.`));
    }

    if (!group.clients.map(c => c.toString()).includes(clientId)) {
      return next(createError(
        404,
        `Client with id "${clientId}" is not in group "${id}".`
      ));
    }

    group.clients = group.clients.filter(c => c.toString() !== clientId);
    await group.save();

    await group.populate({
      path: "clients",
      select: "-secondaryName -secondaryEmail -secondaryPhones -secondaryAddress"
    });

    return next(createSuccess(
      200,
      `Client removed successfully`,
      group
    ));
  } catch (err) {
    console.error("removeClient error:", err);
    return next(createError(500, "Internal Server Error"));
  }
};


exports.deleteGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const group = await Group.findByIdAndDelete(id);

    if (!group) {
      return next(createError(404, `Group not found.`));
    }

    return next(createSuccess(
      200,
      "Group deleted successfully",
      null
    ));
  } catch (err) {
    console.error("deleteGroup error:", err);
    return next(createError(500, "Internal Server Error"));
  }
};



