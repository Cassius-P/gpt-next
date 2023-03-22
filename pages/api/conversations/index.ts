import { getCollection } from "@/utils/firestore";
import { where, query, getDocs, DocumentSnapshot, DocumentData } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import {adminAuth} from "../../../utils/fireadmin";

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
    
    let token = req.cookies.token;

    if(!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    
    const verif = await adminAuth.verifyIdToken(token);
    if(!verif) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    let userID = verif.uid;
    const conversationsRef = getCollection("conversations");
    const q = query(conversationsRef, where("userID", "==", userID));

    const result = await getDocs(q);

    let docs: Array<DocumentData> = []
    result.forEach((doc) => {
        docs.push({id: doc.id, data:doc.data()})
      });


    // FETCH STUFF HERE!! 🚀

    res.status(200).json({ message: docs });
}