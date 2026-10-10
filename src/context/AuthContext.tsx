"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, googleProvider, isFirebaseConfigured } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { saveUserProfile, getUserProfile, UserProfile } from "@/lib/db";

export interface User {
  id: string;
  name: string;
  email: string;
  bloodType: string;
  cpf: string;
  phone: string;
  lastDonationDate?: string;
  isEligible?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (userData: Omit<User, "id" | "isEligible"> & { password?: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync Firebase Auth State
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          const profile = await getUserProfile(fbUser.uid);
          const currentUser: User = {
            id: fbUser.uid,
            name: profile?.name || fbUser.displayName || "Doador Voluntário",
            email: fbUser.email || "",
            bloodType: profile?.bloodType || "O+",
            cpf: profile?.cpf || "000.000.000-00",
            phone: profile?.phone || "(47) 99999-9999",
            lastDonationDate: profile?.lastDonationDate || "2026-07-15",
            isEligible: profile?.isEligible ?? true,
          };
          setUser(currentUser);
          localStorage.setItem("doevida_active_user", JSON.stringify(currentUser));
        } else {
          setUser(null);
          localStorage.removeItem("doevida_active_user");
        }
        setIsLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Local Storage session mode for open testing
      const saved = localStorage.getItem("doevida_active_user");
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch (e) {
          console.error("Session parse error", e);
        }
      }
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    if (isFirebaseConfigured && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        const profile = await getUserProfile(cred.user.uid);
        const logged: User = {
          id: cred.user.uid,
          name: profile?.name || cred.user.displayName || email.split("@")[0],
          email: cred.user.email || email,
          bloodType: profile?.bloodType || "O+",
          cpf: profile?.cpf || "000.000.000-00",
          phone: profile?.phone || "(47) 99999-9999",
          isEligible: true,
        };
        setUser(logged);
        localStorage.setItem("doevida_active_user", JSON.stringify(logged));
        return true;
      } catch (err: any) {
        console.error("Firebase Login Error:", err);
        throw new Error(err.message || "Falha ao realizar login.");
      }
    }

    // Local Open Login
    const localId = "usr-" + Math.random().toString(36).substring(2, 9);
    const loggedUser: User = {
      id: localId,
      name: email.split("@")[0].replace(".", " ").toUpperCase(),
      email: email,
      bloodType: "O+",
      cpf: "123.456.789-00",
      phone: "(47) 99876-5432",
      isEligible: true,
    };
    setUser(loggedUser);
    localStorage.setItem("doevida_active_user", JSON.stringify(loggedUser));
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    if (isFirebaseConfigured && auth) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const profile = await getUserProfile(result.user.uid);
        const googleUser: User = {
          id: result.user.uid,
          name: result.user.displayName || "Doador Google",
          email: result.user.email || "",
          bloodType: profile?.bloodType || "O-",
          cpf: profile?.cpf || "000.000.000-00",
          phone: profile?.phone || "(47) 99111-2222",
          isEligible: true,
        };
        await saveUserProfile({
          uid: result.user.uid,
          name: googleUser.name,
          email: googleUser.email,
          bloodType: googleUser.bloodType,
          cpf: googleUser.cpf,
          phone: googleUser.phone,
        });
        setUser(googleUser);
        localStorage.setItem("doevida_active_user", JSON.stringify(googleUser));
        return true;
      } catch (err: any) {
        console.error("Google Auth Error:", err);
        throw new Error(err.message || "Erro no login com Google");
      }
    }

    // Open Google Simulation
    const googleUser: User = {
      id: "usr-google-" + Date.now(),
      name: "Doador Google Blumenau",
      email: "doador.blumenau@gmail.com",
      bloodType: "O-",
      cpf: "321.654.987-11",
      phone: "(47) 99111-2222",
      isEligible: true,
    };
    setUser(googleUser);
    localStorage.setItem("doevida_active_user", JSON.stringify(googleUser));
    return true;
  };

  const register = async (
    userData: Omit<User, "id" | "isEligible"> & { password?: string }
  ): Promise<boolean> => {
    const passwordToUse = userData.password || "123456";

    if (isFirebaseConfigured && auth) {
      try {
        const res = await createUserWithEmailAndPassword(auth, userData.email, passwordToUse);
        const newUser: User = {
          id: res.user.uid,
          name: userData.name,
          email: userData.email,
          bloodType: userData.bloodType,
          cpf: userData.cpf,
          phone: userData.phone,
          isEligible: true,
        };
        await saveUserProfile({
          uid: res.user.uid,
          name: userData.name,
          email: userData.email,
          bloodType: userData.bloodType,
          cpf: userData.cpf,
          phone: userData.phone,
          isEligible: true,
        });
        setUser(newUser);
        localStorage.setItem("doevida_active_user", JSON.stringify(newUser));
        return true;
      } catch (err: any) {
        console.error("Firebase Registration Error:", err);
        throw new Error(err.message || "Erro ao cadastrar novo doador.");
      }
    }

    // Open Local Registration
    const newId = "usr-" + Math.random().toString(36).substring(2, 9);
    const newUser: User = {
      id: newId,
      name: userData.name,
      email: userData.email,
      bloodType: userData.bloodType,
      cpf: userData.cpf,
      phone: userData.phone,
      isEligible: true,
    };
    await saveUserProfile({
      uid: newId,
      name: userData.name,
      email: userData.email,
      bloodType: userData.bloodType,
      cpf: userData.cpf,
      phone: userData.phone,
      isEligible: true,
    });
    setUser(newUser);
    localStorage.setItem("doevida_active_user", JSON.stringify(newUser));
    return true;
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await firebaseSignOut(auth);
    }
    setUser(null);
    localStorage.removeItem("doevida_active_user");
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    await saveUserProfile({
      uid: user.id,
      name: updated.name,
      email: updated.email,
      bloodType: updated.bloodType,
      cpf: updated.cpf,
      phone: updated.phone,
      isEligible: updated.isEligible,
      lastDonationDate: updated.lastDonationDate,
    });
    localStorage.setItem("doevida_active_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
