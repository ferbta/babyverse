'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Child } from '@/types'

interface ChildContextType {
    children: Child[]
    selectedChild: Child | null
    loading: boolean
    setSelectedChild: (child: Child | null) => void
    refreshChildren: () => Promise<void>
}

const ChildContext = createContext<ChildContextType | undefined>(undefined)

export function ChildProvider({ children: reactChildren }: { children: ReactNode }) {
    const [children, setChildren] = useState<Child[]>([])
    const [selectedChild, setSelectedChild] = useState<Child | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchChildren = async () => {
        try {
            const response = await fetch('/api/children')
            if (response.ok) {
                const data = await response.json()
                setChildren(data)

                // If there's no selected child or the current one is not in the new list, pick the first one
                if (data.length > 0) {
                    const storedChildId = localStorage.getItem('selectedChildId')
                    const matchedChild = data.find((c: Child) => c.id === storedChildId)
                    setSelectedChild(matchedChild || data[0])
                } else {
                    setSelectedChild(null)
                }
            }
        } catch (error) {
            console.error('Error fetching children:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchChildren()
    }, [])

    useEffect(() => {
        if (selectedChild) {
            localStorage.setItem('selectedChildId', selectedChild.id)
        }
    }, [selectedChild])

    return (
        <ChildContext.Provider
            value={{
                children,
                selectedChild,
                loading,
                setSelectedChild,
                refreshChildren: fetchChildren,
            }}
        >
            {reactChildren}
        </ChildContext.Provider>
    )
}

export function useChildren() {
    const context = useContext(ChildContext)
    if (context === undefined) {
        throw new Error('useChildren must be used within a ChildProvider')
    }
    return context
}
