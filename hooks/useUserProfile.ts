import { useState, useEffect } from "react";
import { getDocument } from "@/lib/firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

interface UserProfile {
  userId: string;
  email: string;
  sports: Array<{ id: string; name: string; grade?: string }>;
  physical: {
    weight: number;
    height: number;
    dateOfBirth: string;
    targetWeight?: number;
  };
  objective: {
    type: string;
    description: string;
    targetDate?: string;
    targetWeight?: number;
  };
  onboardingCompleted: boolean;
  createdAt?: any;
}

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const profileData = await getDocument("userProfiles", user.uid);
        setProfile(profileData as UserProfile | null);
      } catch (error) {
        console.error("Erreur chargement profil:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  return { profile, loading };
}
