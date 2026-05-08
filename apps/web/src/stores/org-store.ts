import { create } from "zustand";

interface OrgStore {
  activeOrgSlug: string | null;
  setActiveOrgSlug: (slug: string) => void;
}

export const useOrgStore = create<OrgStore>((set) => ({
  activeOrgSlug: null,
  setActiveOrgSlug: (slug) => set({ activeOrgSlug: slug }),
}));
