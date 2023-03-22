import { NextApiRequest, NextApiResponse } from "next";

import {adminAuth} from "./fireadmin";

export const isUserConnected = async (req: NextApiRequest, res: NextApiResponse) => {
    let token = req.cookies.token;

    if(!token) {
        return false;
    }
    
    const verif = await adminAuth.verifyIdToken(token);
    if(!verif) {
        return false;
    }

    return verif;
}