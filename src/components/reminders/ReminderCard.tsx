'use client'

import { useState, useEffect, use } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Reminder } from '@/types'
import { Calendar, Check, Trash2, Clock } from 'lucide-react'
import { isSameDay, getDaysDifference } from '@/lib/dateUtils'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ReminderCardProps {
    reminder: Reminder & { child?: { id: string; name: string } | null }
    onUpdate: () => void
}

export function ReminderCard({ reminder, onUpdate }: ReminderCardProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [loading, setLoading] = useState(false)

    const reminderTypeInfo: Record<string, { label: string; emoji: string; color: string }> = {
        vaccination: { label: 'Tiêm chủng', emoji: '💉', color: 'bg-pink-100 text-pink-700 border-pink-200' },
        medical_visit: { label: 'Khám bệnh', emoji: '🏥', color: 'bg-blue-100 text-blue-700 border-blue-200' },
        medication: { label: 'Uống thuốc', emoji: '💊', color: 'bg-purple-100 text-purple-700 border-purple-200' },
        birthday: { label: 'Sinh nhật', emoji: '🎂', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
        milestone: { label: 'Cột mốc', emoji: '🌟', color: 'bg-green-100 text-green-700 border-green-200' },
    }

    const typeInfo = reminderTypeInfo[reminder.type] || reminderTypeInfo.milestone

    // Calculate time difference using day-based comparison
    const now = new Date()
    const reminderDate = new Date(reminder.reminderDate)
    const daysDiff = getDaysDifference(now, reminderDate)
    const isOverdue = daysDiff < 0
    const isSameDayAsToday = isSameDay(now, reminderDate)

    // Calculate hours for same-day reminders
    const diffMs = reminderDate.getTime() - now.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    const getTimeDisplay = () => {
        if (isSameDayAsToday) {
            if (diffHours < 0) {
                return 'Hôm nay'
            } else if (diffHours === 0) {
                return 'Ngay bây giờ'
            }
            return `Trong ${diffHours} giờ`
        }

        if (isOverdue) {
            const absDays = Math.abs(daysDiff)
            if (absDays === 1) return 'Hôm qua'
            return `${absDays} ngày trước`
        } else {
            if (daysDiff === 1) return 'Ngày mai'
            return `Trong ${daysDiff} ngày`
        }
    }


    const handleDismiss = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/reminders/${reminder.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dismissed: true }),
            })

            if (response.ok) {
                onUpdate()
            }
        } catch (error) {
            console.error('Error dismissing reminder:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/reminders/${reminder.id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                onUpdate()
            }
        } catch (error) {
            console.error('Error deleting reminder:', error)
        } finally {
            setLoading(false)
            setShowDeleteDialog(false)
        }
    }

    return (
        <>
            <Card className={`hover:shadow-md transition-all ${isOverdue && !reminder.dismissed ? 'border-red-300 bg-red-50/50' : ''}`}>
                <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className={typeInfo.color}>
                                    {typeInfo.emoji} {typeInfo.label}
                                </Badge>
                                {isOverdue && !reminder.dismissed && (
                                    <Badge variant="destructive" className="text-xs">
                                        Quá hạn
                                    </Badge>
                                )}
                            </div>
                            <h3 className="font-semibold text-base mb-1 truncate">{reminder.title}</h3>
                            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {new Date(reminder.reminderDate).toLocaleString('vi-VN', {
                                            timeZone: 'Asia/Ho_Chi_Minh',
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>

                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span className={isOverdue ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                                        {getTimeDisplay()}
                                    </span>
                                </div>
                                {reminder.child && (
                                    <div className="text-xs">
                                        👶 {reminder.child.name}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            {!reminder.dismissed && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleDismiss}
                                    disabled={loading}
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                    <Check className="h-4 w-4" />
                                </Button>
                            )}
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowDeleteDialog(true)}
                                disabled={loading}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xóa nhắc nhở?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa nhắc nhở này? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
