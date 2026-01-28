'use client'

import { useState, useEffect } from 'react'
import { getCurrentUser, onAuthStateChange, signOut as authSignOut } from '@/infrastructure/supabase/auth'
import { User } from '@/domain/user'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initial load
    getCurrentUser()
      .then(setUser)
      .catch((error) => {
        console.error('Error loading user:', error)
        setUser(null)
      })
      .finally(() => setIsLoading(false))

    // Listen for auth state changes
    const unsubscribe = onAuthStateChange((newUser) => {
      setUser(newUser)
      setIsLoading(false)
    })

    return unsubscribe
  }, [])

  const signOut = async () => {
    try {
      await authSignOut()
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  return { user, isLoading, signOut }
}
