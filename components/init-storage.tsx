"use client"

import { useEffect } from "react"
import { initializeStorage } from "@/lib/storage"

export function InitStorage() {
  useEffect(() => {
    // Only initialize storage if not already initialized in this session
    if (!window.sessionStorage.getItem('storage_initialized')) {
      initializeStorage();
      window.sessionStorage.setItem('storage_initialized', 'true');
    }
  }, []);
  return null;
}
