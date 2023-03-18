type MapType = {
    [key: string]: string;
}

const AuthError:MapType = {
    "auth/email-already-exists": "An account with this email already exists",
    "auth/invalid-email": "Invalid email",
    "auth/operation-not-allowed": "Operation not allowed",
    "auth/weak-password": "Your password is too weak. Please use at least 6 characters",
    "auth/user-disabled": "Your account seems to be disabled. Please contact us for more information",
    "auth/user-not-found": "No account with this email could be found",
    "auth/wrong-password": "The password you entered is incorrect",

    "auth/invalid-credential": "Invalid credential",
    "auth/invalid-verification-code": "Invalid verification code",
    "auth/email-already-in-use": "An account with this email already exists",
}

export default AuthError;