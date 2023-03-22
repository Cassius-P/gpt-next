import {db} from './firebase';
import { collection, doc, setDoc } from "firebase/firestore";


const getCollection = (collectionName: string) => {
    return collection(db, collectionName);
}

export {getCollection}

