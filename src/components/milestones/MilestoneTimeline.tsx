'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Trash2, Edit2, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Milestone {
    id: string
    title: string
    category: string | null
    achievedDate: string | Date
    notes: string | null
}

interface MilestoneTimelineProps {
    milestones: Milestone[]
    onDelete?: (id: string) => void
    onEdit?: (milestone: Milestone) => void
}

const categories = {
    physical: { label: 'Thể chất', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
    cognitive: { label: 'Nhận thức', color: 'bg-purple-100 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
    social: { label: 'Xã hội', color: 'bg-pink-100 text-pink-700 border-pink-200', dot: 'bg-pink-500' },
    language: { label: 'Ngôn ngữ', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
}

export function MilestoneTimeline({ milestones, onDelete, onEdit }: MilestoneTimelineProps) {
    if (milestones.length === 0) {
        return (
            <div className="text-center py-20 bg-white/50 dark:bg-black/20 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Chưa có cột mốc nào</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Hãy ghi lại những khoảnh khắc đầu tiên của bé!</p>
            </div>
        )
    }

    return (
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-purple-200 before:to-transparent">
            {milestones.map((milestone, index) => {
                const category = milestone.category as keyof typeof categories || 'physical'
                const catInfo = categories[category] || categories.physical
                const date = new Date(milestone.achievedDate).toLocaleDateString('vi-VN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })

                return (
                    <div key={milestone.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        {/* Dot */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-gray-950 bg-white dark:bg-gray-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                            <div className={`w-3 h-3 rounded-full ${catInfo.dot} animate-pulse`} />
                        </div>

                        {/* Content Card */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all group-hover:scale-[1.02]">
                            <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline" className={`${catInfo.color}`}>
                                    {catInfo.label}
                                </Badge>
                                <div className="flex items-center text-xs text-muted-foreground">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {date}
                                </div>
                            </div>

                            <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{milestone.title}</h4>

                            {milestone.notes && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 italic line-clamp-3">
                                    "{milestone.notes}"
                                </p>
                            )}

                            <div className="flex items-center justify-end mt-4 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-400 hover:text-purple-600"
                                    onClick={() => onEdit?.(milestone)}
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-400 hover:text-red-600"
                                    onClick={() => onDelete?.(milestone.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
