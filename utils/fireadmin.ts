const admin = require("firebase-admin");

let FIREBASE_ADMIN_SERVICE_ACCOUNT = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT

if(!FIREBASE_ADMIN_SERVICE_ACCOUNT){
    throw new Error("FIREBASE_ADMIN_SERVICE_ACCOUNT is missing")
}else {
    FIREBASE_ADMIN_SERVICE_ACCOUNT = FIREBASE_ADMIN_SERVICE_ACCOUNT.toString().replaceAll("'", "")
}

let serviceAccount = JSON.parse(FIREBASE_ADMIN_SERVICE_ACCOUNT)




console.log("serviceAccount", serviceAccount)

const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount)
};

const adminApp = !admin.apps.length ? admin.initializeApp(firebaseConfig) : admin.app();
const adminAuth = adminApp.auth();

const verifyIdToken = async (token: string) => {
  return await adminAuth.verifyIdToken(token);
}


export { verifyIdToken, adminAuth };