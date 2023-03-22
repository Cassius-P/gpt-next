const admin = require("firebase-admin");

let serviceAccount = require("/jeepeetee-a520e-firebase-adminsdk-br5r8-3add21f581.json");

const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount)
};

const adminApp = !admin.apps.length ? admin.initializeApp(firebaseConfig) : admin.app();
const adminAuth = adminApp.auth();

const verifyIdToken = async (token: string) => {
  const decodedToken = await adminAuth.verifyIdToken(token);
  return decodedToken;
}


export { verifyIdToken, adminAuth };