import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

// Hook genérico: se conecta en tiempo real a una colección de Firestore
// y expone helpers para crear, actualizar y eliminar documentos.
export function useCollection(collectionName, orderField = "createdAt") {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, collectionName), orderBy(orderField, "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [collectionName, orderField]);

  const add = (item) =>
    addDoc(collection(db, collectionName), {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

  const update = (id, changes) =>
    updateDoc(doc(db, collectionName, id), {
      ...changes,
      updatedAt: serverTimestamp(),
    });

  const remove = (id) => deleteDoc(doc(db, collectionName, id));

  return { data, loading, error, add, update, remove };
}
