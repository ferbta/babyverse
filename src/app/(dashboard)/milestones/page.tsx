'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Baby, Star, TrendingUp, Award } from 'lucide-react'
import { useChildren } from '@/components/providers/ChildProvider'
import { MilestoneTimeline } from '@/components/milestones/MilestoneTimeline'
import { AddMilestoneModal } from '@/components/milestones/AddMilestoneModal'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface Milestone {
    id: string
    title: string
    category: string | null
    achievedDate: string | Date
    notes: string | null
}

export default function MilestonesPage() {
    const { selectedChild, loading: childLoading } = useChildren()
    const [milestones, setMilestones] = useState<Milestone[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchMilestones = async () => {
        if (!selectedChild?.id) return

        setLoading(true)
        try {
            const response = await fetch(`/api/children/${selectedChild.id}/milestones`)
            if (response.ok) {
                const data = await response.json()
                setMilestones(data)
            } else {
                setError('Không thể tải dữ liệu cột mốc')
            }
        } catch (error) {
            setError('Lỗi khi kết nối đến máy chủ')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!selectedChild?.id) return
        if (!confirm('Bạn có chắc muốn xóa cột mốc này?')) return

        try {
            const response = await fetch(`/api/children/${selectedChild.id}/milestones/${id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                fetchMilestones()
            } else {
                alert('Không thể xóa cột mốc')
            }
        } catch (error) {
            alert('Lỗi khi xóa cột mốc')
        }
    }

    useEffect(() => {
        fetchMilestones()
    }, [selectedChild?.id])

    if (childLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-48" />
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
                <Skeleton className="h-[600px]" />
            </div>
        )
    }

    if (!selectedChild) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center">
                    <Baby className="w-10 h-10 text-purple-500" />
                </div>
                <h2 className="text-2xl font-bold">Chưa chọn bé</h2>
                <p className="text-muted-foreground max-w-xs">
                    Vui lòng chọn hoặc thêm bé mới để bắt đầu ghi lại những cột mốc phát triển.
                </p>
                <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
                    Đến trang quản lý
                </Button>
            </div>
        )
    }

    const categoryStats = {
        physical: milestones.filter(m => m.category === 'physical').length,
        cognitive: milestones.filter(m => m.category === 'cognitive').length,
        social: milestones.filter(m => m.category === 'social').length,
        language: milestones.filter(m => m.category === 'language').length,
    }

    return (
        <div className="space-y-6 pb-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Star className="w-8 h-8 text-yellow-500" />
                        Cột mốc phát triển
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Ghi lại những khoảnh khắc đáng nhớ của <strong>{selectedChild.name}</strong>
                    </p>
                </div>
                <AddMilestoneModal childId={selectedChild.id} onMilestoneAdded={fetchMilestones} />
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Lỗi</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Thể chất</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{categoryStats.physical}</div>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">cột mốc</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Nhận thức</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{categoryStats.cognitive}</div>
                        <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">cột mốc</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 border-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-pink-700 dark:text-pink-300">Xã hội</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-pink-900 dark:text-pink-100">{categoryStats.social}</div>
                        <p className="text-xs text-pink-600 dark:text-pink-400 mt-1">cột mốc</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Ngôn ngữ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-900 dark:text-green-100">{categoryStats.language}</div>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">cột mốc</p>
                    </CardContent>
                </Card>
            </div>

            {/* Timeline */}
            <div className="mt-8">
                {loading ? (
                    <div className="space-y-6">
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                ) : (
                    <MilestoneTimeline
                        milestones={milestones}
                        onDelete={handleDelete}
                        onEdit={(milestone) => {
                            // TODO: Implement edit functionality
                            alert('Chức năng chỉnh sửa sẽ được cập nhật sớm!')
                        }}
                    />
                )}
            </div>
        </div>
    )
}
