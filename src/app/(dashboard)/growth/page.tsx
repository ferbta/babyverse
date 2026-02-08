'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, Baby, ChevronRight, AlertCircle } from 'lucide-react'
import { useChildren } from '@/components/providers/ChildProvider'
import { GrowthCharts } from '@/components/growth/GrowthCharts'
import { GrowthTable } from '@/components/growth/GrowthTable'
import { AddGrowthRecordModal } from '@/components/growth/AddGrowthRecordModal'
import { GrowthRecord } from '@/types'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function GrowthPage() {
    const { selectedChild, loading: childLoading } = useChildren()
    const [records, setRecords] = useState<GrowthRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchGrowthRecords = async () => {
        if (!selectedChild?.id) return

        setLoading(true)
        try {
            const response = await fetch(`/api/children/${selectedChild.id}/growth`)
            if (response.ok) {
                const data = await response.json()
                setRecords(data)
            } else {
                setError('Không thể tải dữ liệu tăng trưởng')
            }
        } catch (error) {
            setError('Lỗi khi kết nối đến máy chủ')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchGrowthRecords()
    }, [selectedChild?.id])

    if (childLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-48" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-[400px] lg:col-span-2" />
                    <Skeleton className="h-[400px]" />
                </div>
            </div>
        )
    }

    if (!selectedChild) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center">
                    <Baby className="w-10 h-10 text-pink-500" />
                </div>
                <h2 className="text-2xl font-bold">Chưa chọn bé</h2>
                <p className="text-muted-foreground max-w-xs">
                    Vui lòng chọn hoặc thêm bé mới để bắt đầu theo dõi quá trình tăng trưởng.
                </p>
                <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
                    Đến trang quản lý
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Theo dõi tăng trưởng</h1>
                    <p className="text-muted-foreground mt-1">
                        Ghi lại và theo dõi các chỉ số phát triển của <strong>{selectedChild.name}</strong>
                    </p>
                </div>
                <AddGrowthRecordModal childId={selectedChild.id} onRecordAdded={fetchGrowthRecords} />
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Lỗi</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Skeleton className="h-[450px] w-full" />
                        <Skeleton className="h-[300px] w-full" />
                    </div>
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-1/2" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Charts area */}
                    <div className="lg:col-span-2 space-y-6">
                        <GrowthCharts data={records} />
                        <GrowthTable data={records} />
                    </div>

                    {/* Summary area */}
                    <div className="space-y-6">
                        <Card className="bg-gradient-to-br from-pink-500/10 to-purple-600/10 border-none shadow-none">
                            <CardHeader>
                                <CardTitle className="text-lg">Tóm tắt hiện tại</CardTitle>
                                <CardDescription>Dựa trên lần đo gần nhất</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {records.length > 0 ? (
                                    <>
                                        <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-black/20 rounded-2xl">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-pink-100 rounded-lg">
                                                    <TrendingUp className="w-4 h-4 text-pink-600" />
                                                </div>
                                                <span className="text-sm font-medium">Cân nặng</span>
                                            </div>
                                            <span className="text-xl font-bold">{records[records.length - 1].weight || '-'} kg</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-black/20 rounded-2xl">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-purple-100 rounded-lg">
                                                    <TrendingUp className="w-4 h-4 text-purple-600" />
                                                </div>
                                                <span className="text-sm font-medium">Chiều cao</span>
                                            </div>
                                            <span className="text-xl font-bold">{records[records.length - 1].height || '-'} cm</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-6 text-muted-foreground italic text-sm">
                                        Chưa có dữ liệu đo lường gần đây
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Kiến thức tăng trưởng</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-3 bg-muted/50 rounded-lg text-sm">
                                    <p className="font-medium text-pink-600 mb-1">Cân nặng của bé</p>
                                    <p className="text-muted-foreground text-xs">Trong năm đầu đời, trẻ sơ sinh thường tăng gấp đôi cân nặng khi được 5 tháng tuổi.</p>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg text-sm">
                                    <p className="font-medium text-purple-600 mb-1">Chiều cao của bé</p>
                                    <p className="text-muted-foreground text-xs">Chiều dài của trẻ sơ sinh trung bình tăng thêm khoảng 25cm trong năm đầu tiên.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}
