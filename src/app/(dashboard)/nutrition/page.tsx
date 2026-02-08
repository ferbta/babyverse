'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Utensils, Baby, AlertCircle } from 'lucide-react'
import { useChildren } from '@/components/providers/ChildProvider'
import { AddNutritionLogModal } from '@/components/nutrition/AddNutritionLogModal'
import { NutritionTable } from '@/components/nutrition/NutritionTable'
import { NutritionStats } from '@/components/nutrition/NutritionStats'
import { NutritionLog } from '@/types'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function NutritionPage() {
    const { selectedChild, loading: childLoading } = useChildren()
    const [logs, setLogs] = useState<NutritionLog[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchNutritionLogs = async () => {
        if (!selectedChild?.id) return

        setLoading(true)
        try {
            const response = await fetch(`/api/children/${selectedChild.id}/nutrition`)
            if (response.ok) {
                const data = await response.json()
                setLogs(data)
            } else {
                setError('Không thể tải dữ liệu dinh dưỡng')
            }
        } catch (error) {
            setError('Lỗi khi kết nối đến máy chủ')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNutritionLogs()
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
                    Vui lòng chọn hoặc thêm bé mới để bắt đầu theo dõi dinh dưỡng.
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
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                        Dinh dưỡng
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Theo dõi bữa ăn và dinh dưỡng của <strong>{selectedChild.name}</strong>
                    </p>
                </div>
                <AddNutritionLogModal childId={selectedChild.id} onLogAdded={fetchNutritionLogs} />
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
                    {/* Main content area */}
                    <div className="lg:col-span-2 space-y-6">
                        <NutritionTable data={logs} />
                    </div>

                    {/* Stats and tips area */}
                    <div className="space-y-6">
                        <NutritionStats data={logs} />
                    </div>
                </div>
            )}
        </div>
    )
}
