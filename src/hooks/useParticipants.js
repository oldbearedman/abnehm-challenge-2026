import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { getCollectionPath } from "../lib/constants";

export function useParticipants() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = getCollectionPath();
    const colRef = collection(db, ...path);

    const unsub = onSnapshot(
      colRef,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setParticipants(data);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  return { participants, loading };
}


