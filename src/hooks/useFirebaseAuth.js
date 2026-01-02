import { useEffect, useState } from "react";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

export function useFirebaseAuth() {
  const [user, setUser] = useState({ uid: "local" });

  useEffect(() => {
    let unsub = null;

    try {
      const auth = getAuth(); // Default App

      unsub = onAuthStateChanged(auth, (u) => {
        if (u?.uid) setUser(u);
      });

      signInAnonymously(auth).catch((err) => {
        console.warn("Firebase auth disabled/misconfigured, running in local mode:", err?.code || err);
        setUser({ uid: "local" });
      });
    } catch (e) {
      console.warn("Firebase auth init failed, running in local mode:", e);
      setUser({ uid: "local" });
    }

    return () => {
      try { unsub && unsub(); } catch {}
    };
  }, []);

  return user;
}


