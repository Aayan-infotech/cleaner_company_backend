
const Group = require("../models/groupModel");
const GroupClients = require("../models/groupClientsModel");
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

    const [ totalGroups, groups ] = await Promise.all([
      Group.countDocuments(),
      Group.find()
           .sort({ createdAt: -1 })
           .skip(skip)
           .limit(limit)
           .lean()
    ]);

    const groupIds = groups.map(g => g._id);
    const gcs = await GroupClients.find({ groupName: { $in: groupIds } })
      .populate({
        path: 'clients',
        select: '-secondaryName -secondaryEmail -secondaryPhones -secondaryAddress'
      })
      .lean();

    const clientMap = gcs.reduce((map, gc) => {
      map[gc.groupName.toString()] = gc.clients;
      return map;
    }, {});

    const data = groups.map(g => ({
      ...g,
      clients: clientMap[g._id.toString()] || []
    }));

    const totalPages = Math.ceil(totalGroups / limit);

    return res.status(200).json({
      success:    true,
      status:     200,
      message:    "Groups fetched successfully",
      data,
      pagination: {
        totalGroups,
        totalPages,
        page,
        limit
      }
    });
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
    const { id: groupId } = req.params;  

    const group = await Group.findById(groupId);
    if (!group) {
      return next(createError(404, `Group not found.`));
    }

    let gc = await GroupClients.findOne({ groupName: groupId });
    if (!gc) {
      gc = await GroupClients.create({ groupName: groupId, clients: [] });
    }

    clients.forEach(clientId => {
      if (!gc.clients.map(c => c.toString()).includes(clientId)) {
        gc.clients.push(clientId);
      }
    });
    await gc.save();

    await gc.populate({
      path: "clients",
      select: "-secondaryName -secondaryEmail -secondaryPhones -secondaryAddress"
    });

    return next(createSuccess(
      200,
      "Clients added successfully",
      gc
    ));
  } catch (err) {
    console.error("addClients error:", err);
    return next(createError(500, "Internal Server Error"));
  }
};


exports.removeClient = async (req, res, next) => {
  try {
    const { id: groupId, clientId } = req.params;

    const gc = await GroupClients.findOne({ groupName: groupId });
    if (!gc) {
      return next(createError(404, `GroupClients record not found for group "${groupId}".`));
    }
    if (!gc.clients.map(c => c.toString()).includes(clientId)) {
      return next(createError(
        404,
        `Client with id "${clientId}" is not in group "${groupId}".`
      ));
    }

    gc.clients = gc.clients.filter(c => c.toString() !== clientId);
    await gc.save();

    await gc.populate({
      path: "clients",
      select: "-secondaryName -secondaryEmail -secondaryPhones -secondaryAddress"
    });

    return next(createSuccess(
      200,
      "Client removed successfully",
      gc
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

exports.getGroupClients = async (req, res, next) => {
  try {
    const { id: groupId } = req.params;

    const page  = Math.max(parseInt(req.query.page,  10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10,1);
    const skip  = (page - 1) * limit;

    const gc = await GroupClients.findOne({ groupName: groupId }).lean();
    if (!gc) {
      return next(createError(404, `GroupClients not found for group "${groupId}".`));
    }

    const totalClients = Array.isArray(gc.clients) ? gc.clients.length : 0;
    const totalPages   = Math.ceil(totalClients / limit);

    const paged = await GroupClients.findOne({ groupName: groupId })
      .populate({
        path: 'clients',
        select: '-secondaryName -secondaryEmail -secondaryPhones -secondaryAddress',
        options: { skip, limit, sort: { createdAt: -1 } }
      })
      .lean();

    return res.status(200).json({
      success: true,
      status:  200,
      message: "Group clients fetched successfully",
      data: {
        groupName: gc.groupName,
        _id:       gc._id,
        createdAt: gc.createdAt,
        updatedAt: gc.updatedAt,
        clients:   paged.clients || []
      },
      pagination: {
        totalClients,
        totalPages,
        page,
        limit
      }
    });
  } catch (err) {
    console.error("getGroupClients error:", err);
    return next(createError(500, "Internal Server Error"));
  }
};





