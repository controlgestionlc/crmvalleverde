import { useEffect, useState } from "react";
import {
  collection, addDoc, deleteDoc, doc, onSnapshot,
  query, where, serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase";

// parentType: "contact" | "deal"
export function useDocuments(parentType, parentId) {
  const [docsList, setDocsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!parentId) {
      setDocsList([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(
      collection(db, "documents"),
      where("parentType", "==", parentType),
      where("parentId", "==", parentId)
    );
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (b.uploadedAt?.seconds || 0) - (a.uploadedAt?.seconds || 0));
      setDocsList(list);
      setLoading(false);
    });
    return () => unsub();
  }, [parentType, parentId]);

  const upload = async (file) => {
    if (!parentId) return;
    setUploading(true);
    try {
      const path = `documents/${parentType}/${parentId}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await addDoc(collection(db, "documents"), {
        parentType,
        parentId,
        name: file.name,
        url,
        path,
        size: file.size,
        contentType: file.type,
        uploadedAt: serverTimestamp(),
      });
    } finally {
      setUploading(false);
    }
  };

  const remove = async (item) => {
    if (item.path) {
      try {
        await deleteObject(ref(storage, item.path));
      } catch (err) {
        console.error("No se pudo borrar el archivo del storage:", err);
      }
    }
    await deleteDoc(doc(db, "documents", item.id));
  };

  return { docs: docsList, loading, uploading, upload, remove };
}
