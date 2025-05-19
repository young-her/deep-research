import { create } from "zustand";
import { persist, type StorageValue } from "zustand/middleware";
import { researchStore } from "@/utils/storage";
import { clone, pick } from "radash";

export interface KnowledgeStore {
  knowledges: Knowledge[];
}

type KnowledgeFunction = {
  save: (knowledge: Knowledge) => void;
  exist: (id: string) => boolean;
  get: (id: string) => Knowledge | null;
  update: (id: string, knowledge: Partial<Knowledge>) => boolean;
  remove: (id: string) => boolean;
};

export const useKnowledgeStore = create(
  persist<KnowledgeStore & KnowledgeFunction>(
    (set, get) => ({
      knowledges: [],
      save: (knowledge) => {
        set((state) => ({ knowledges: [knowledge, ...state.knowledges] }));
      },
      exist: (id) => {
        const { knowledges } = get();
        const knowledge = knowledges.find((item) => item.id === id);
        return !!knowledge;
      },
      get: (id) => {
        const current = get().knowledges.find((item) => item.id === id);
        return current ? clone(current) : null;
      },
      update: (id, knowledge) => {
        const newKnowledges = get().knowledges.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              ...clone(knowledge),
              updatedAt: Date.now(),
            };
          } else {
            return item;
          }
        });
        set(() => ({ knowledges: [...newKnowledges] }));
        return true;
      },
      remove: (id) => {
        set((state) => ({
          knowledges: state.knowledges.filter((item) => item.id !== id),
        }));
        return true;
      },
    }),
    {
      name: "knowledgeStore",
      version: 1,
      storage: {
        getItem: async (key: string) => {
          return await researchStore.getItem<
            StorageValue<KnowledgeStore & KnowledgeFunction>
          >(key);
        },
        setItem: async (
          key: string,
          store: StorageValue<KnowledgeStore & KnowledgeFunction>
        ) => {
          return await researchStore.setItem(key, {
            state: pick(store.state, ["knowledges"]),
            version: store.version,
          });
        },
        removeItem: async (key: string) => await researchStore.removeItem(key),
      },
    }
  )
);
