"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { ChevronDown, LogOut, User } from "lucide-react"

export function UserProfile() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("ecommerce_current_user")
    router.push("/login")
  }

  if (!user) return null

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition"
      >
        <User size={20} />
        <span className="font-medium">{user.name}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm text-muted-foreground">Signed in as</p>
            <p className="font-semibold text-foreground truncate">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition text-left"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  )
}
