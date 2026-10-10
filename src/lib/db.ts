import { db, isFirebaseConfigured } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

// User Profile Type
export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  bloodType: string;
  cpf: string;
  phone: string;
  isEligible?: boolean;
  lastDonationDate?: string;
  createdAt?: any;
}

// Appointment Type
export interface AgendamentoRecord {
  id: string;
  userId?: string;
  userName: string;
  userEmail?: string;
  userPhone: string;
  userCpf: string;
  hemocentroNome: string;
  tipoDoacao: "Sangue Total" | "Plaquetas por Aférese";
  data: string;
  horario: string;
  status: "Confirmado" | "Concluído" | "Cancelado";
  createdAt?: any;
}

// Screening Record Type
export interface TriagemRecord {
  id: string;
  userId?: string;
  protocolo: string;
  userName: string;
  cpf: string;
  tipoPresumido: string;
  status: "apto" | "inapto_temporario" | "inapto_definitivo";
  dataEmissao: string;
  respostas: Record<string, any>;
  createdAt?: any;
}

// ----------------------------------------------------
// USER DATABASE METHODS
// ----------------------------------------------------
export async function saveUserProfile(user: UserProfile): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { ...user, updatedAt: serverTimestamp() }, { merge: true });
      return;
    } catch (err) {
      console.warn("Firestore error, saving locally:", err);
    }
  }
  localStorage.setItem(`doevida_user_${user.uid}`, JSON.stringify(user));
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (isFirebaseConfigured && db) {
    try {
      const userRef = doc(db, "users", uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
    } catch (err) {
      console.warn("Firestore fetch error, reading locally:", err);
    }
  }
  const local = localStorage.getItem(`doevida_user_${uid}`);
  return local ? JSON.parse(local) : null;
}

// ----------------------------------------------------
// APPOINTMENTS (AGENDAMENTOS)
// ----------------------------------------------------
export async function saveAgendamento(agendamento: Omit<AgendamentoRecord, "createdAt">): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      const agdRef = doc(db, "agendamentos", agendamento.id);
      await setDoc(agdRef, {
        ...agendamento,
        createdAt: serverTimestamp(),
      });
      return;
    } catch (err) {
      console.warn("Firestore agendamento error, saving locally:", err);
    }
  }

  // Local fallback
  const existingStr = localStorage.getItem("doevida_agendamentos");
  const existing: AgendamentoRecord[] = existingStr ? JSON.parse(existingStr) : [];
  localStorage.setItem("doevida_agendamentos", JSON.stringify([agendamento, ...existing]));
}

export async function getAgendamentos(userId?: string): Promise<AgendamentoRecord[]> {
  if (isFirebaseConfigured && db) {
    try {
      const agdColl = collection(db, "agendamentos");
      let q = query(agdColl, orderBy("createdAt", "desc"));
      if (userId) {
        q = query(agdColl, where("userId", "==", userId));
      }
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data() as AgendamentoRecord);
    } catch (err) {
      console.warn("Firestore agendamentos fetch error, reading locally:", err);
    }
  }

  const existingStr = localStorage.getItem("doevida_agendamentos");
  const existing: AgendamentoRecord[] = existingStr ? JSON.parse(existingStr) : [];
  if (userId) {
    return existing.filter((a) => a.userId === userId);
  }
  return existing;
}

export async function cancelAgendamento(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      const agdRef = doc(db, "agendamentos", id);
      await deleteDoc(agdRef);
      return;
    } catch (err) {
      console.warn("Firestore delete error:", err);
    }
  }

  const existingStr = localStorage.getItem("doevida_agendamentos");
  if (existingStr) {
    const existing: AgendamentoRecord[] = JSON.parse(existingStr);
    const updated = existing.filter((a) => a.id !== id);
    localStorage.setItem("doevida_agendamentos", JSON.stringify(updated));
  }
}

// ----------------------------------------------------
// SCREENING HISTORY (TRIAGEM & PDF)
// ----------------------------------------------------
export async function saveTriagemRecord(triagem: Omit<TriagemRecord, "createdAt">): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      const triagemRef = doc(db, "triagens", triagem.id);
      await setDoc(triagemRef, {
        ...triagem,
        createdAt: serverTimestamp(),
      });
      return;
    } catch (err) {
      console.warn("Firestore triagem error, saving locally:", err);
    }
  }

  const existingStr = localStorage.getItem("doevida_triagens");
  const existing: TriagemRecord[] = existingStr ? JSON.parse(existingStr) : [];
  localStorage.setItem("doevida_triagens", JSON.stringify([triagem, ...existing]));
}
