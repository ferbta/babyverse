'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { NutritionLog } from '@/types'
import { Utensils, TrendingUp, Clock, Calendar } from 'lucide-react'

interface NutritionStatsProps {
    data: NutritionLog[]
}

export function NutritionStats({ data }: NutritionStatsProps) {
    // Calculate statistics
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayLogs = data.filter(log => {
        const logDate = new Date(log.feedingDate)
        logDate.setHours(0, 0, 0, 0)
        return logDate.getTime() === today.getTime()
    })

    const last7Days = new Date()
    last7Days.setDate(last7Days.getDate() - 7)
    const last7DaysLogs = data.filter(log => new Date(log.feedingDate) >= last7Days)
    const avgDailyFeedings = last7DaysLogs.length > 0 ? (last7DaysLogs.length / 7).toFixed(1) : '0'

    // Most common feeding type
    const typeCounts: Record<string, number> = {}
    data.forEach(log => {
        typeCounts[log.type] = (typeCounts[log.type] || 0) + 1
    })
    const mostCommonType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]

    const feedingTypeLabels: Record<string, string> = {
        breastfeeding: 'Sữa mẹ',
        formula: 'Sữa công thức',
        solid: 'Đồ ăn dặm',
        snack: 'Ăn vặt',
        water: 'Nước',
    }

    // Last feeding
    const lastFeeding = data.length > 0 ? data[0] : null

    return (
        <div className="space-y-6">
            <Card className="bg-gradient-to-br from-pink-500/10 to-purple-600/10 border-none shadow-none">
                <CardHeader>
                    <CardTitle className="text-lg">Thống kê dinh dưỡng</CardTitle>
                    <CardDescription>Tổng quan về bữa ăn của bé</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Today's feedings */}
                    <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-black/20 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pink-100 rounded-lg">
                                <Calendar className="w-4 h-4 text-pink-600" />
                            </div>
                            <span className="text-sm font-medium">Hôm nay</span>
                        </div>
                        <span className="text-xl font-bold">{todayLogs.length} bữa</span>
                    </div>

                    {/* Average daily feedings */}
                    <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-black/20 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <TrendingUp className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="text-sm font-medium">Trung bình 7 ngày</span>
                        </div>
                        <span className="text-xl font-bold">{avgDailyFeedings} bữa/ngày</span>
                    </div>

                    {/* Most common type */}
                    {mostCommonType && (
                        <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-black/20 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Utensils className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="text-sm font-medium">Phổ biến nhất</span>
                            </div>
                            <span className="text-sm font-bold">
                                {feedingTypeLabels[mostCommonType[0]] || mostCommonType[0]}
                            </span>
                        </div>
                    )}

                    {/* Last feeding */}
                    {lastFeeding && (
                        <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-black/20 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Clock className="w-4 h-4 text-green-600" />
                                </div>
                                <span className="text-sm font-medium">Bữa gần nhất</span>
                            </div>
                            <span className="text-sm font-bold">
                                {new Date(lastFeeding.feedingDate).toLocaleTimeString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Tips card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Mẹo dinh dưỡng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-3 bg-muted/50 rounded-lg text-sm">
                        <p className="font-medium text-pink-600 mb-1">🤱 Sữa mẹ</p>
                        <p className="text-muted-foreground text-xs">
                            Sữa mẹ là nguồn dinh dưỡng tốt nhất cho bé trong 6 tháng đầu đời.
                        </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg text-sm">
                        <p className="font-medium text-green-600 mb-1">🥣 Ăn dặm</p>
                        <p className="text-muted-foreground text-xs">
                            Bắt đầu ăn dặm từ 6 tháng tuổi, giới thiệu từng loại thực phẩm một.
                        </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg text-sm">
                        <p className="font-medium text-blue-600 mb-1">💧 Nước uống</p>
                        <p className="text-muted-foreground text-xs">
                            Bé cần uống đủ nước mỗi ngày, đặc biệt khi thời tiết nóng.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
