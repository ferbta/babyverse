'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Baby,
    Calendar,
    ArrowLeft,
    Weight,
    Ruler,
    Heart,
    Edit,
    Trash2,
    Syringe,
    TrendingUp,
    AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { useChildren } from '@/components/providers/ChildProvider'

interface ChildDetail {
    id: string
    name: string
    nickname?: string | null
    birthDate: string
    gender: string
    bloodType?: string | null
    birthWeight?: number | null
    birthHeight?: number | null
    birthCondition?: string | null
    vaccinations?: any[]
    growthRecords?: any[]
}

export default function ChildDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id } = use(params)
    const { refreshChildren } = useChildren()
    const [child, setChild] = useState<ChildDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const fetchChild = async () => {
            try {
                const response = await fetch(`/api/children/${id}`)
                if (response.ok) {
                    const data = await response.json()
                    setChild(data)
                } else {
                    console.error('Failed to fetch child')
                    router.push('/dashboard')
                }
            } catch (error) {
                console.error('Error fetching child:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchChild()
    }, [id, router])

    const handleDelete = async () => {
        setDeleting(true)
        try {
            const response = await fetch(`/api/children/${id}`, {
                method: 'DELETE',
            })
            if (response.ok) {
                await refreshChildren()
                router.push('/dashboard')
            } else {
                console.error('Failed to delete child')
            }
        } catch (error) {
            console.error('Error deleting child:', error)
        } finally {
            setDeleting(false)
        }
    }

    const getAge = (birthDate: string) => {
        const now = new Date()
        const birth = new Date(birthDate)
        const ageInMonths = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth()

        if (ageInMonths < 12) {
            return `${ageInMonths} tháng tuổi`
        } else {
            const years = Math.floor(ageInMonths / 12)
            const months = ageInMonths % 12
            return months > 0 ? `${years} tuổi ${months} tháng` : `${years} tuổi`
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-32" />
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex gap-6 items-center">
                            <Skeleton className="w-24 h-24 rounded-3xl" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-8 w-1/3" />
                                <Skeleton className="h-6 w-1/4" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-6 w-20" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        )
    }

    if (!child) return null

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Link href="/dashboard">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại
                    </Button>
                </Link>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/children/${id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Bạn có chắc chắn muốn xóa?</DialogTitle>
                                <DialogDescription>
                                    Hành động này không thể hoàn tác. Toàn bộ hồ sơ của <strong>{child.name}</strong> sẽ bị ẩn khỏi hệ thống.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="flex-row justify-end gap-2">
                                <DialogClose asChild>
                                    <Button variant="outline">Hủy</Button>
                                </DialogClose>
                                <Button onClick={handleDelete} variant="destructive" disabled={deleting}>
                                    {deleting ? 'Đang xóa...' : 'Xác nhận xóa'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Child Profile Header */}
            <Card className="border-2 bg-gradient-to-br from-pink-50/50 to-purple-50/50 dark:from-pink-900/10 dark:to-purple-900/10">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                        <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl flex items-center justify-center shadow-xl">
                            <span className="text-4xl text-white font-bold">
                                {child.name.charAt(0)}
                            </span>
                        </div>
                        <div className="flex-1 space-y-2">
                            <h1 className="text-3xl font-bold">{child.name}</h1>
                            {child.nickname && (
                                <p className="text-lg text-muted-foreground">Biệt danh: {child.nickname}</p>
                            )}
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
                                <Badge variant="outline" className="px-3 py-1">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {getAge(child.birthDate)}
                                </Badge>
                                {child.gender === 'male' && (
                                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 px-3 py-1">
                                        Bé trai
                                    </Badge>
                                )}
                                {child.gender === 'female' && (
                                    <Badge variant="outline" className="bg-pink-50 text-pink-600 border-pink-200 px-3 py-1">
                                        Bé gái
                                    </Badge>
                                )}
                                {child.bloodType && (
                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 px-3 py-1">
                                        Nhóm máu {child.bloodType}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Cân nặng lúc sinh
                            </CardTitle>
                            <Weight className="h-4 w-4 text-pink-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {child.birthWeight ? `${child.birthWeight} kg` : 'Chưa có'}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Chiều cao lúc sinh
                            </CardTitle>
                            <Ruler className="h-4 w-4 text-purple-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {child.birthHeight ? `${child.birthHeight} cm` : 'Chưa có'}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Hình thức sinh
                            </CardTitle>
                            <Heart className="h-4 w-4 text-red-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {child.birthCondition === 'natural' && 'Sinh tự nhiên'}
                            {child.birthCondition === 'c-section' && 'Mổ đẻ'}
                            {child.birthCondition === 'premature' && 'Sinh non'}
                            {!child.birthCondition && 'Chưa có'}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Ngày sinh
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-blue-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Date(child.birthDate).toLocaleDateString('vi-VN')}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Vaccinations */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Syringe className="h-5 w-5 text-pink-500" />
                                <CardTitle className="text-lg">Tiêm chủng gần đây</CardTitle>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => router.push('/medical')}>
                                Xem tất cả
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {child.vaccinations && child.vaccinations.length > 0 ? (
                            <div className="space-y-4">
                                {child.vaccinations.map((v) => (
                                    <div key={v.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                        <div>
                                            <p className="font-medium text-sm">{v.name || 'Vaccine'}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(v.dueDate).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                        <Badge variant={v.status === 'completed' ? 'default' : 'outline'}>
                                            {v.status === 'completed' ? 'Đã tiêm' : 'Chưa tiêm'}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-muted-foreground text-sm">
                                <Syringe className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                <p>Chưa có dữ liệu tiêm chủng</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Growth */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-purple-500" />
                                <CardTitle className="text-lg">Tăng trưởng gần đây</CardTitle>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => router.push('/growth')}>
                                Xem tất cả
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {child.growthRecords && child.growthRecords.length > 0 ? (
                            <div className="space-y-4">
                                {child.growthRecords.map((r) => (
                                    <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                        <div>
                                            <p className="font-medium text-sm">
                                                {new Date(r.measureDate).toLocaleDateString('vi-VN')}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {r.weight ? `${r.weight} kg` : ''}
                                                {r.weight && r.height ? ' • ' : ''}
                                                {r.height ? `${r.height} cm` : ''}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-muted-foreground text-sm">
                                <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                <p>Chưa có dữ liệu tăng trưởng</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
