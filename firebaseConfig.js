const admin = require("firebase-admin");
const AWS = require("aws-sdk");

AWS.config.update({ region: 'us-east-1' });

const secretsManager = new AWS.SecretsManager();

async function getFirebaseCredentials() {
  try {
    const data = await secretsManager.getSecretValue({ SecretId: 'cle-firebase' }).promise();
    
    if (data.SecretString) {
      const secrets = JSON.parse(data.SecretString);

      admin.initializeApp({
        credential: admin.credential.cert(secrets),
        databaseURL: "https://cleaner-65f50-default-rtdb.firebaseio.com"
      });

      console.log('Firebase initialized successfully with Secrets Manager credentials');
    } else {
      console.error('Error: No secret string found.');
    }
  } catch (error) {
    console.error('Error fetching Firebase credentials from Secrets Manager:', error.message);
  }
}

getFirebaseCredentials();

module.exports = admin;
