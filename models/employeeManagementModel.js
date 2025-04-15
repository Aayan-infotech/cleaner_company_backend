const mongoose = require('mongoose');
const Van = require('./vanModel');
const employeeSchema = mongoose.Schema(
    {
        employee_name: {
            type: String,
            required: true,
        },
        employee_photo: {
            type: String,
            required: false,
            default: '/uploads/default.jpg', // Default photo if not provided
        },
        employee_address: {
            type: String,
            required: false,
            default: '',
        },
        employee_contact: {
            type: String,
            required: true,
        },
        employee_email: {
            type: String,
            required: true,
            unique: true,
        },
        employee_password:{
            type:String,
            required:true,

        },
        employee_jobStatus: {
            type: String,
            enum: ['Assigned', 'Unassigned'],
            default: 'Assigned',
        },
        employee_workingStatus: {
            type: String,
            enum: ['Offline', 'InService', 'Maintenance'],
            default: 'Offline',
        },
        employee_vanAssigned: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Van',
            required: true,
        },
        employee_role: {
            type: String,
            enum: ['Company', 'Technicians'],
            default: 'Technicians',
        },
        role_assigned:{
            type:String,
            enum: ['PP Admin', 'PP Employee', 'Client Admin', 'Client Supervisor', 'Client Employee']
        },
        employee_employeeStatus: {
            type: String,
            enum: ['Active', 'Block'],
            default: 'Active',
        },
        employee_EmContactName:{
            type:String,
            required:true
        },
        employee_EmContactNumber:{
            type:String,
            required:true,
        },
        employee_EmContactEmail:{
            type:String,
            required:false,
        },
        employee_EmContactAddress:{
            type:String,
            required:false,
        },

        employee_addNote: {
            type: String,
            required: false,
            default: '',
        },
        employee_SocialSecurityNumber: {
            type: String,
            required: false,
            default: '',
        },    
        ins_date: {
            type: Date,
            default: Date.now,
        },
        ins_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        update_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        
    },
    { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
