const User = require('../models/userModel');
const Role = require('../models/roleModel');
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success')
const path = require('path');
const fs = require('fs');

const defaultImage = {
    filename: 'default-image.jpg',
    contentType: 'image/png'
};

//to Create user 
const register = async (req, res, next) => {
    try {
        const role = await Role.findOne({ role: 'User' });
        const {
            firstName,
            lastName,
            username,
            email,
            password,
            contactNumber,
            companyAddress
        } = req.body;

        let images = [];

        if (!req.files || req.files.length === 0) {
            images = [defaultImage]; // Use default image if no files are uploaded
        } else {
            images = req.files.map(file => {
                const filename = Date.now() + path.extname(file.originalname);
                const filepath = path.join(__dirname, '../uploads', filename);

                fs.writeFileSync(filepath, file.buffer); // Save the file to the filesystem

                return {
                    filename,
                    contentType: file.mimetype
                };
            });
        }

        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password,
            contactNumber,
            companyAddress,
            images,
            roles: role
        });

        await newUser.save();
        return next(createSuccess(200, "User Registered Successfully"));
    } catch (error) {
        return next(createError(500, "Something went wrong"));
    }
};

//get users
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        const userWithImageURLs = users.map(user => {
            const imagesWithURLs = user.images.map(image => {
                return {
                    ...image._doc,
                    url: `${req.protocol}://${req.get('host')}/api/images/${image.filename}`
                };
            });

            return {
                ...user._doc,
                images: imagesWithURLs
            };
        });

        return next(createSuccess(200, "All Users", userWithImageURLs));

    } catch (error) {
        return next(createError(500, "Internal Server Error!"))
    }
}

//get user
const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(createError(404, "User not found!"));
        }

        const imagesWithURLs = user.images.map(image => {
            return {
                ...image._doc,
                url: `${req.protocol}://${req.get('host')}/api/images/${image.filename}`
            };
        });

        const userWithImageURLs = {
            ...user._doc,
            images: imagesWithURLs
        };

        return next(createSuccess(200, "User found", userWithImageURLs));
    } catch (error) {
        return next(createError(500, "Internal Server Error!"));
    }
};

const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const {
            firstName,
            lastName,
            username,
            email,
            password,
            contactNumber,
            companyAddress
        } = req.body;

        let user = await User.findById(userId);
        if (!user) {
            return next(createError(404, "User not found"));
        }

        // Update fields
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = password;
        if (contactNumber) user.contactNumber = contactNumber;
        if (companyAddress) user.companyAddress = companyAddress;

        if (req.files && req.files.length > 0) {
            const images = req.files.map(file => {
                const filename = Date.now() + path.extname(file.originalname);
                const filepath = path.join(__dirname, '../uploads', filename);

                fs.writeFileSync(filepath, file.buffer); // Save the file to the filesystem

                return {
                    filename,
                    contentType: file.mimetype
                };
            });

            user.images = images;
        }

        await user.save();
        return res.status(200).json("User Updated Successfully");
    } catch (error) {
        return next(createError(500, "Something went wrong"));
    }
};

//delete user
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return next(createError(404, "User Not Found"));
        }
        return next(createSuccess(200, "User Deleted", user));
    } catch (error) {
        return next(createError(500, "Internal Server Error1"))
    }
}


module.exports = {
    getAllUsers, getUser, deleteUser, updateUser, register
}