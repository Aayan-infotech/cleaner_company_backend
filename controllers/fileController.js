// const File = require('../models/fileModel');

// exports.uploadFile = async (req, res) => {
//     try {
//         const { originalname, buffer } = req.file;
//         const encodedData = buffer.toString('base64');
//         await File.create({ filename: originalname, data: encodedData });
//         res.status(201).json({ message: 'File uploaded successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// exports.getAllFiles = async (req, res) => {
//     try {
//         const files = await File.find();
//         res.json(files);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };
// exports.getFileById = async (req, res) => {
//     try {
//         const file = await File.findById(req.params.id);
//         if (!file) {
//             return res.status(404).json({ error: 'File not found' });
//         }
//         const img = Buffer.from(file.data, 'base64');
//         res.writeHead(200, {
//             'Content-Type': 'image/jpeg',
//             'Content-Length': img.length
//         });
//         res.end(img);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// }
