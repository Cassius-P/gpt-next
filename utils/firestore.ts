import {db} from './firebase';
import { collection, doc, setDoc,  } from "firebase/firestore";


const getCollection = (collectionName: string) => {
    return collection(db, collectionName);
}

const tokenize= (text:string) => {
    return text
        .toLowerCase()
        .replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g, "")
        .split(" ")
        .filter((word) => word.length > 0);
}


export {getCollection, db, tokenize}

