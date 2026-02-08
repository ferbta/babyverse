'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, EyeOff } from 'lucide-react'

interface ReminderFiltersProps {
    selectedType: string
    onTypeChange: (type: string) => void
    showDismissed: boolean
    onToggleDismissed: () => void
    typeCounts: Record<string, number>
}

export function ReminderFilters({
    selectedType,
    onTypeChange,
    showDismissed,
    onToggleDismissed,
    typeCounts,
}: ReminderFiltersProps) {
    const filterTypes = [
        { value: 'all', label: 'Tất cả', emoji: '📋' },
        { value: 'vaccination', label: 'Tiêm chủng', emoji: '💉' },
        { value: 'medical_visit', label: 'Khám bệnh', emoji: '🏥' },
        { value: 'medication', label: 'Uống thuốc', emoji: '💊' },
        { value: 'birthday', label: 'Sinh nhật', emoji: '🎂' },
        { value: 'milestone', label: 'Cột mốc', emoji: '🌟' },
    ]

    return (
        <div className="flex flex-col gap-4">
            {/* Type Filters */}
            <div className="flex flex-wrap gap-2">
                {filterTypes.map((type) => {
                    const count = type.value === 'all'
                        ? Object.values(typeCounts).reduce((a, b) => a + b, 0)
                        : typeCounts[type.value] || 0

                    return (
                        <Button
                            key={type.value}
                            variant={selectedType === type.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onTypeChange(type.value)}
                            className={selectedType === type.value
                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
                                : ''
                            }
                        >
                            {type.emoji} {type.label}
                            {count > 0 && (
                                <Badge
                                    variant="secondary"
                                    className="ml-2 h-5 min-w-5 px-1"
                                >
                                    {count}
                                </Badge>
                            )}
                        </Button>
                    )
                })}
            </div>

            {/* Show/Hide Dismissed Toggle */}
            <div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleDismissed}
                    className="gap-2"
                >
                    {showDismissed ? (
                        <>
                            <EyeOff className="h-4 w-4" />
                            Ẩn đã hoàn thành
                        </>
                    ) : (
                        <>
                            <Eye className="h-4 w-4" />
                            Hiện đã hoàn thành
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
