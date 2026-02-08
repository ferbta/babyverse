'use client'

import { ReminderCard } from './ReminderCard'
import { Reminder } from '@/types'
import { Bell, CheckCircle2, AlertCircle } from 'lucide-react'

interface ReminderListProps {
    reminders: (Reminder & { child?: { id: string; name: string } | null })[]
    onUpdate: () => void
}

export function ReminderList({ reminders, onUpdate }: ReminderListProps) {
    const now = new Date()

    // Categorize reminders
    const overdue = reminders.filter(r => !r.dismissed && new Date(r.reminderDate) < now)
    const upcoming = reminders.filter(r => !r.dismissed && new Date(r.reminderDate) >= now)
    const completed = reminders.filter(r => r.dismissed)

    const EmptyState = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
        <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                <Icon className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-muted-foreground">{title}</p>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
    )

    return (
        <div className="space-y-8">
            {/* Overdue Section */}
            {overdue.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <h2 className="text-lg font-semibold text-red-600">
                            Quá hạn ({overdue.length})
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {overdue.map((reminder) => (
                            <ReminderCard key={reminder.id} reminder={reminder} onUpdate={onUpdate} />
                        ))}
                    </div>
                </div>
            )}

            {/* Upcoming Section */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Bell className="w-5 h-5 text-blue-500" />
                    <h2 className="text-lg font-semibold">
                        Sắp tới ({upcoming.length})
                    </h2>
                </div>
                {upcoming.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {upcoming.map((reminder) => (
                            <ReminderCard key={reminder.id} reminder={reminder} onUpdate={onUpdate} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={Bell}
                        title="Không có nhắc nhở sắp tới"
                        description="Thêm nhắc nhở mới để không bỏ lỡ những việc quan trọng"
                    />
                )}
            </div>

            {/* Completed Section */}
            {completed.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <h2 className="text-lg font-semibold text-green-600">
                            Đã hoàn thành ({completed.length})
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {completed.map((reminder) => (
                            <ReminderCard key={reminder.id} reminder={reminder} onUpdate={onUpdate} />
                        ))}
                    </div>
                </div>
            )}

            {/* All Empty State */}
            {reminders.length === 0 && (
                <EmptyState
                    icon={Bell}
                    title="Chưa có nhắc nhở nào"
                    description="Nhấn 'Thêm nhắc nhở' để tạo nhắc nhở đầu tiên"
                />
            )}
        </div>
    )
}
