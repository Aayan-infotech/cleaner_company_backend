require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const PORT = process.env.PORT || 5966;
const MONGO_URL = process.env.MONGO_URL;
const FRONTEND = process.env.FRONTEND;


// Initialize Express App
const app = express();


// CORS Configuration
const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
    Credentials: true
};


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use('/savedTemplates', express.static(path.join(process.cwd(), 'savedTemplates')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes Imports
const roleRoute = require('./routes/roleRoute');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const roomRoutes = require('./routes/roomRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const materialRoutes = require('./routes/materialRoutes');
const itemCleanRoutes = require('./routes/itemCleanRoutes');
const dryCleaningRoutes = require('./routes/dryCleaningRoutes');
const hardSurfaceRoutes = require('./routes/hardSurfaceRoutes');
const methodRoutes = require('./routes/methodRoutes');
const imageRoutes = require('./routes/imageRoutes');
const itemInventoryRoute = require('./routes/itemInventoryRoute');
const orderRoute = require('./routes/orderRoute');
const dropdownRoute = require('./routes/dropDownRoutes');
const estimateRoutes = require('./routes/estimateRoutes');
const calRoute = require('./routes/eventsRoute');
const contentVersionRoute = require('./routes/contentVersionRoute');
const contentLibraryRoute = require('./routes/contentLibraryRoute');
const profileManageRoute = require('./routes/profileManageRoute');
const troubleshootCategoryRoute = require('./routes/troubleshootCategoryRoute');
const jobRoutes = require('./routes/jobRoutes');
const timeTrackRoute = require('./routes/timeTrackRoute');
const contactUsRoute = require('./routes/contactUsRoute');
const deviceTokenRoutes = require('./routes/devicetokenRoute');
const employeeManagement = require('./routes/employeeManagementRoute');
const EmployeeCertificate = require('./routes/employeeCertificateRoute');
const inventoryCategoryRoute = require('./routes/inventoryCategoryRoute');
const categoryItemRoute = require('./routes/categoryItemRoute');
const vanRoute = require('./routes/vanRoute');
const pushNotificationRoute = require('./routes/pushNotificationRoute');
const leaveRoute = require('./routes/leaveRoute');
const crmRoutes = require('./routes/crmRoute');
const groupRoutes = require('./routes/groupRoutes');

// Disabled Routes Imports

// const companyLoginRoutes = require('./routes/companyLoginRoutes');
//const routes = require('./routes/routes');
// const errorMiddleware = require('./middleware/errorMiddleware')
// const categoryItemImageRoute = require('./routes/category-item-imageRoute');
// const categoryItemVideoRoute = require('./routes/category-item-videoRoute');
// const categoryItemPdfRoute = require('./routes/category-item-pdfRoute');

const methoodRoute = require('./routes/methodRoutes');
const categoryRoute = require('./routes/categoryRoutes');
const templateRoutes = require('./routes/templateRoutes');
const templateRoute2 = require('./routes/templateRoute2');
const marketingCategoriesRoutes = require('./routes/marketingCategoriesRoute');


// Routes
app.use(cors(corsOptions));
app.use('/api/role', roleRoute);
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/manage-rooms', roomRoutes);
app.use('/api2', serviceRoutes);
app.use('/api2', materialRoutes);
app.use('/api2/itemCleans', itemCleanRoutes);
app.use('/api2/dryCleanings', dryCleaningRoutes);
app.use('/api2/hardSurfaces', hardSurfaceRoutes);
app.use('/api2/methods', methodRoutes);
app.use('/api', imageRoutes);
app.use('/api/item', itemInventoryRoute);
app.use('/api/item-order', orderRoute);
app.use('/api/dropdown', dropdownRoute);
app.use('/api/estimates', estimateRoutes);
app.use('/api/event', calRoute);
app.use('/api/version', contentVersionRoute);
app.use('/api/library', contentLibraryRoute);
app.use('/api/profile', profileManageRoute);
app.use('/api/jobs', jobRoutes);
app.use('/api/timeTrack', timeTrackRoute);
app.use('/api/contactUs', contactUsRoute);
app.use('/api/employee', employeeManagement);
app.use('/api/certificate', EmployeeCertificate);
app.use('/api/inventoryCategory', inventoryCategoryRoute);
app.use('/api/categoryItem', categoryItemRoute);
app.use('/api/vans', vanRoute);
app.use('/api', deviceTokenRoutes);
app.use('/api/notification', pushNotificationRoute);
app.use('/api/leave', leaveRoute);
app.use('/api/manage-crm', crmRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/methods', methoodRoute);

// Disabled Routes

// app.use(bodyParser.json());
// app.use('/api/login', companyLoginRoutes);
// app.use('/api/categoryImage', categoryItemImageRoute);
// app.use('/api/categoryVideo', categoryItemVideoRoute);
// app.use('/api/categoryPdf', categoryItemPdfRoute);
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/api/images', imageRoutes);
// app.use('/', routes);
// app.use(errorMiddleware);

app.use('/api/services', serviceRoutes);
app.use('/api/categories', categoryRoute);
app.use('/api/category', troubleshootCategoryRoute);
app.use('/api/template', express.text({ type: '*/*', limit: '10mb' }), templateRoutes);
app.use('/api/template2', templateRoute2);
app.use('/api/manage-marketing-categories', marketingCategoriesRoutes);


// Response handler Middleware
app.use((obj, req, res, next) => {
    const statusCode = obj.status || 500;
    const message = obj.message || "Something went wrong!";
    return res.status(statusCode).json({
        success: [200, 201, 204].some(a => a === obj.status) ? true : false,
        status: statusCode,
        message: message,
        data: obj.data
    })
});


// Mongoose connection
mongoose.set("strictQuery", false)
mongoose.
    connect(MONGO_URL)
    .then(() => {
        console.log('connected to MongoDB')
        app.listen(PORT, () => {
            console.log(`Node API app is running on port ${PORT}`)
        });
    }).catch((error) => {
        console.log(error)
    });
