import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const getInitialUserInfo = () => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const userData = JSON.parse(storedUserInfo);
      if (userData && userData.token) {
        return userData;
      }
    }
  } catch (error) {
    console.error("Error reading userInfo from localStorage on init:", error);
    localStorage.removeItem("userInfo");
  }
  return null;
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      // --- State ---
      userInfo: getInitialUserInfo(),
      isAuthenticated: !!getInitialUserInfo(),

      // --- Core Actions ---
      login: (userData) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("userInfo", JSON.stringify(userData));
        }
        set({ userInfo: userData, isAuthenticated: true });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("userInfo");
        }
        set({ userInfo: null, isAuthenticated: false });
      },

      // --- Utility Actions ---
      loadUser: () => {
        const userData = getInitialUserInfo();
        set({ userInfo: userData, isAuthenticated: !!userData });
      },

      updateUserInfo: (updatedData) => {
        set((state) => {
          const newUserInfo = { ...state.userInfo, ...updatedData };
          if (typeof window !== "undefined") {
            localStorage.setItem("userInfo", JSON.stringify(newUserInfo));
          }
          return { userInfo: newUserInfo };
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = !!(state.userInfo && state.userInfo.token);
        }
      },
    }
  )
);

export default useAuthStore;
