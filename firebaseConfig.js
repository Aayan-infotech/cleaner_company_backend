const admin = require("firebase-admin");
const serviceAccount = require("./cleaner-65f50-firebase-adminsdk-fbsvc-3103cc885f.json"); // Downloaded from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
