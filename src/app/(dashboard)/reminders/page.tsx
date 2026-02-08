'use client'

import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Bell, Baby, AlertCircle, Syringe } from 'lucide-react'
import { AddReminderModal } from '@/components/reminders/AddReminderModal'
import { ReminderList } from '@/components/reminders/ReminderList'
import { ReminderFilters } from '@/components/reminders/ReminderFilters'
import { Reminder } from '@/types'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useChildren } from '@/components/providers/ChildProvider'

export default function RemindersPage() {
    const { selectedChild } = useChildren()
    const [reminders, setReminders] = useState<(Reminder & { child?: { id: string; name: string } | null })[]>([])
    const [loading, setLoading] = useState(true)
    const [syncLoading, setSyncLoading] = useState(false)
    const [error, setError] = useState('')
    const [selectedType, setSelectedType] = useState('all')
    const [showDismissed, setShowDismissed] = useState(true)

    const fetchReminders = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (showDismissed) {
                params.append('showDismissed', 'true')
            }
            if (selectedChild) {
                params.append('childId', selectedChild.id)
            }

            const response = await fetch(`/api/reminders?${params.toString()}`)
            if (response.ok) {
                const data = await response.json()
                setReminders(data)
            } else {
                setError('Không thể tải dữ liệu nhắc nhở')
            }
        } catch (error) {
            setError('Lỗi khi kết nối đến máy chủ')
        } finally {
            setLoading(false)
        }
    }

    const handleSyncVaccinations = async () => {
        setSyncLoading(true)
        try {
            const params = new URLSearchParams()
            if (selectedChild) {
                params.append('childId', selectedChild.id)
            }

            const response = await fetch(`/api/reminders/sync-vaccinations?${params.toString()}`, {
                method: 'POST',
            })

            if (response.ok) {
                const data = await response.json()
                if (data.created > 0) {
                    toast.success(data.message)
                    fetchReminders()
                } else {
                    toast.info(data.message)
                }
            } else {
                const errorData = await response.json()
                toast.error(errorData.error || 'Không thể đồng bộ lịch tiêm')
            }
        } catch (error) {
            toast.error('Lỗi khi kết nối đến máy chủ')
        } finally {
            setSyncLoading(false)
        }
    }

    useEffect(() => {
        fetchReminders()
    }, [showDismissed, selectedChild?.id])

    // Filter reminders by type
    const filteredReminders = selectedType === 'all'
        ? reminders
        : reminders.filter(r => r.type === selectedType)

    // Calculate type counts
    const typeCounts: Record<string, number> = {}
    reminders.forEach(r => {
        if (!r.dismissed) {
            typeCounts[r.type] = (typeCounts[r.type] || 0) + 1
        }
    })

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-12 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Skeleton className="h-40" />
                    <Skeleton className="h-40" />
                    <Skeleton className="h-40" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                        Nhắc nhở
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Quản lý và theo dõi các nhắc nhở quan trọng
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={handleSyncVaccinations}
                        disabled={syncLoading}
                        variant="outline"
                        className="border-pink-200 hover:bg-pink-50 dark:border-pink-800 dark:hover:bg-pink-950"
                    >
                        <Syringe className="mr-2 h-4 w-4" />
                        {syncLoading ? 'Đang đồng bộ...' : 'Đồng bộ lịch tiêm'}
                    </Button>
                    <AddReminderModal onReminderAdded={fetchReminders} />
                </div>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Lỗi</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Filters */}
            <ReminderFilters
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                showDismissed={showDismissed}
                onToggleDismissed={() => setShowDismissed(!showDismissed)}
                typeCounts={typeCounts}
            />

            {/* Reminder List */}
            <ReminderList reminders={filteredReminders} onUpdate={fetchReminders} />
        </div>
    )
}
