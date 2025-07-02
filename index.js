require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
// const companyLoginRoutes = require('./routes/companyLoginRoutes')
const roleRoute = require('./routes/roleRoute')
//const routes = require('./routes/routes');
const estimateRoutes = require('./routes/estimateRoutes');
const calRoute = require('./routes/eventsRoute');

const dropdownRoute =require('./routes/dropDownRoutes')
const imageRoutes = require('./routes/imageRoutes');
const itemCleanRoutes = require('./routes/itemCleanRoutes');
const dryCleaningRoutes = require('./routes/dryCleaningRoutes');
const hardSurfaceRoutes = require('./routes/hardSurfaceRoutes');
const methodRoutes = require('./routes/methodRoutes');
const authRoute = require('./routes/authRoute')
const userRoute = require('./routes/userRoute')
const bodyParser = require('body-parser')
const itemInventoryRoute = require('./routes/itemInventoryRoute')
const orderRoute=require('./routes/orderRoute')
const troubleshootCategoryRoute = require('./routes/troubleshootCategoryRoute')
const roomRoutes = require('./routes/roomRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const materialRoutes = require('./routes/materialRoutes');
// const errorMiddleware = require('./middleware/errorMiddleware')
const contentVersionRoute = require('./routes/contentVersionRoute')
const contentLibraryRoute = require('./routes/contentLibraryRoute')
const profileManageRoute = require('./routes/profileManageRoute')
const jobRoutes = require('./routes/jobRoutes')
const timeTrackRoute = require('./routes/timeTrackRoute');
const contactUsRoute = require('./routes/contactUsRoute');
const deviceTokenRoutes = require('./routes/devicetokenRoute');
const employeeManagement = require('./routes/employeeManagementRoute');
const EmployeeCertificate = require('./routes/employeeCertificateRoute');
// const categoryItemImageRoute = require('./routes/category-item-imageRoute');
// const categoryItemVideoRoute = require('./routes/category-item-videoRoute');
// const categoryItemPdfRoute = require('./routes/category-item-pdfRoute');
const inventoryCategoryRoute = require('./routes/inventoryCategoryRoute');
const categoryItemRoute = require('./routes/categoryItemRoute');
const vanRoute = require('./routes/vanRoute');
const pushNotificationRoute = require('./routes/pushNotificationRoute');
const leaveRoute = require('./routes/leaveRoute');
const crmRoutes = require('./routes/crmRoute');
const groupRoutes = require('./routes/groupRoutes');
const methoodRoute = require('./routes/methodRoutes');
const categoryRoute = require('./routes/categoryRoutes');
const templateRoutes = require('./routes/templateRoutes');


const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 5966
const MONGO_URL = process.env.MONGO_URL
const FRONTEND = process.env.FRONTEND
const cookieParser = require('cookie-parser')
var cors = require('cors')
var app = express();
var corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    Credentials: true
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(bodyParser.json({ limit: '50mb' })); // To handle large JSON payloads if needed
app.use('/savedTemplates', express.static(path.join(process.cwd(), 'savedTemplates')));

//app.use(bodyParser.json());

// app.use('/api/login', companyLoginRoutes)
app.use('/api/manage-rooms', roomRoutes);
app.use('/api2', serviceRoutes);
app.use('/api2', materialRoutes);
app.use('/api2/itemCleans', itemCleanRoutes);
app.use('/api2/dryCleanings', dryCleaningRoutes);
app.use('/api2/hardSurfaces', hardSurfaceRoutes);
app.use('/api2/methods', methodRoutes);
app.use('/api', imageRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//to create roles
app.use('/api/role', roleRoute)
//to register and login
app.use('/api/auth', authRoute)
//to list users
app.use('/api/user', userRoute)
// to add iteminventory
app.use('/api/item', itemInventoryRoute)
//to add order
app.use('/api/item', orderRoute)
//for verison
app.use('/api/version',contentVersionRoute)
// for Library
app.use('/api/library',contentLibraryRoute)
// for profile management
app.use('/api/profile', profileManageRoute)
app.use('/api/dropdown', dropdownRoute)
//for estimate
app.use('/api/estimates', estimateRoutes);
//for app
app.use('/api/jobs', jobRoutes);
app.use('/api/event', calRoute);
app.use('/api/timeTrack', timeTrackRoute);
// for category
app.use('/api/category', troubleshootCategoryRoute);
app.use('/api/contactUs', contactUsRoute);
// app.use('/api/categoryImage', categoryItemImageRoute);
// app.use('/api/categoryVideo', categoryItemVideoRoute);
// app.use('/api/categoryPdf', categoryItemPdfRoute);
app.use('/api/employee', employeeManagement);
app.use('/api/certificate', EmployeeCertificate);
app.use('/api/inventoryCategory', inventoryCategoryRoute);
app.use('/api/categoryItem', categoryItemRoute);
app.use('/api/vans', vanRoute);
app.use('/api',deviceTokenRoutes);
app.use('/api/notification',pushNotificationRoute);
app.use('/api/leave', leaveRoute);
app.use('/api/manage-crm', crmRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/methods', methoodRoute);
app.use('/api/services', serviceRoutes);
app.use('/api/categories', categoryRoute);
app.use('/api/template',express.text({ type: '*/*', limit: '10mb' }), templateRoutes);

//app.use(express.static(path.join(__dirname, 'public')));
//test
//app.use('/api/images', imageRoutes);
//app.use('/', routes);


//Response handler Middleware

app.use((obj, req, res, next) => {
    const statusCode = obj.status || 500;
    const message = obj.message || "Something went wrong!";
    return res.status(statusCode).json({
        success: [200, 201, 204].some(a => a === obj.status) ? true : false,
        status: statusCode,
        message: message,
        data: obj.data
    })
})
// app.use(errorMiddleware);

//database connect

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
    })
