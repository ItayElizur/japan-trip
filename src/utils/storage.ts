export const vKey = (r: string, a: string, n: string) => `v4:${r}:${a}:${n}`.replace(/\s/g,"_");
export const cKey = (r: string, a: string, n: string) => `c4:${r}:${a}:${n}`.replace(/\s/g,"_");
export const itinKey = "itin_v2";
export const tripDatesKey = "trip_dates_v1";

declare global {
  interface Window {
    storage?: {
      get: (key: string) => Promise<{value: string} | null>;
      set: (key: string, value: string) => Promise<void>;
    };
  }
}

export const load = async (k: string): Promise<any> => {
  try {
    const r = await window.storage!.get(k);
    return r ? JSON.parse(r.value) : null;
  } catch {
    return null;
  }
};

export const save = async (k: string, v: any): Promise<void> => {
  try {
    await window.storage!.set(k, JSON.stringify(v));
  } catch {}
};
