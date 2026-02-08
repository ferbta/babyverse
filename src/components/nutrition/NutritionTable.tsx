'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NutritionLog } from '@/types'
import { Calendar, Utensils } from 'lucide-react'

interface NutritionTableProps {
    data: NutritionLog[]
}

export function NutritionTable({ data }: NutritionTableProps) {
    const feedingTypeLabels: Record<string, { label: string; emoji: string; color: string }> = {
        breastfeeding: { label: 'Sữa mẹ', emoji: '🤱', color: 'bg-pink-100 text-pink-700 border-pink-200' },
        formula: { label: 'Sữa công thức', emoji: '🍼', color: 'bg-blue-100 text-blue-700 border-blue-200' },
        solid: { label: 'Đồ ăn dặm', emoji: '🥣', color: 'bg-green-100 text-green-700 border-green-200' },
        snack: { label: 'Ăn vặt', emoji: '🍪', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
        water: { label: 'Nước', emoji: '💧', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
    }

    if (data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Nhật ký dinh dưỡng</CardTitle>
                    <CardDescription>Lịch sử các bữa ăn của bé</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mb-4">
                            <Utensils className="w-8 h-8 text-pink-400" />
                        </div>
                        <p className="text-muted-foreground">Chưa có dữ liệu dinh dưỡng</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Nhấn "Thêm bữa ăn" để bắt đầu ghi nhật ký
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Nhật ký dinh dưỡng</CardTitle>
                <CardDescription>Lịch sử các bữa ăn của bé ({data.length} bữa)</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Desktop table view */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                                    Ngày giờ
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                                    Loại
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                                    Món ăn
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                                    Lượng
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                                    Ghi chú
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((log) => {
                                const typeInfo = feedingTypeLabels[log.type] || feedingTypeLabels.solid
                                return (
                                    <tr key={log.id} className="border-b hover:bg-muted/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm">
                                                    {new Date(log.feedingDate).toLocaleString('vi-VN', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Badge variant="outline" className={typeInfo.color}>
                                                {typeInfo.emoji} {typeInfo.label}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-4 text-sm">
                                            {log.foodItems || '-'}
                                        </td>
                                        <td className="py-3 px-4 text-sm font-medium">
                                            {log.amount ? `${log.amount} ${log.unit || ''}` : '-'}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-muted-foreground max-w-xs truncate">
                                            {log.notes || '-'}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile card view */}
                <div className="md:hidden space-y-3">
                    {data.map((log) => {
                        const typeInfo = feedingTypeLabels[log.type] || feedingTypeLabels.solid
                        return (
                            <div
                                key={log.id}
                                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <Badge variant="outline" className={typeInfo.color}>
                                        {typeInfo.emoji} {typeInfo.label}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(log.feedingDate).toLocaleString('vi-VN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                                {log.foodItems && (
                                    <p className="text-sm mb-1">
                                        <span className="font-medium">Món ăn:</span> {log.foodItems}
                                    </p>
                                )}
                                {log.amount && (
                                    <p className="text-sm mb-1">
                                        <span className="font-medium">Lượng:</span> {log.amount} {log.unit || ''}
                                    </p>
                                )}
                                {log.notes && (
                                    <p className="text-sm text-muted-foreground">
                                        <span className="font-medium">Ghi chú:</span> {log.notes}
                                    </p>
                                )}
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
