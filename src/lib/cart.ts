"use client";

import { useSyncExternalStore } from "react";

/**
 * Client cart. Holds only identifiers — prices are ALWAYS recomputed on the
 * server from the database at checkout, so tampering here has no effect.
 */
export type CartLine = { projectId: string; slug: string; title: string; package: "digital" | "kit" };

const KEY = "zensha.cart.v1";
const listeners = new Set<() => void>();
let cache: CartLine[] | null = null;
const EMPTY: CartLine[] = [];

function read(): CartLine[] {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    cache = Array.isArray(parsed)
      ? parsed.filter(
          (l): l is CartLine =>
            !!l && typeof l.projectId === "string" && typeof l.slug === "string" && (l.package === "digital" || l.package === "kit"),
        )
      : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(lines: CartLine[]) {
  cache = lines;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* storage unavailable — cart stays in memory for this tab */
  }
  listeners.forEach((l) => l());
}

export const cart = {
  add(line: CartLine) {
    const lines = read().filter((l) => !(l.projectId === line.projectId && l.package === line.package));
    write([...lines, line]);
  },
  remove(projectId: string, pkg: CartLine["package"]) {
    write(read().filter((l) => !(l.projectId === projectId && l.package === pkg)));
  },
  clear() {
    write([]);
  },
};

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCart(): CartLine[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
