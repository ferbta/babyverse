'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    Baby,
    Calendar,
    TrendingUp,
    Syringe,
    AlertCircle,
    Plus,
    ArrowRight,
    Heart,
    Ruler,
    Weight,
} from 'lucide-react'
import { Child } from '@/types'

import { useChildren } from '@/components/providers/ChildProvider'

export default function DashboardPage() {
    const router = useRouter()
    const { children, selectedChild, loading } = useChildren()

    const getAge = (birthDate: Date) => {
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
            <div className="flex items-center justify-center min-h-[60vh]">
                <Baby className="w-12 h-12 animate-pulse text-pink-500" />
            </div>
        )
    }

    if (children.length === 0) {
        return (
            <div className="max-w-2xl mx-auto">
                <Card className="border-2 border-dashed">
                    <CardHeader className="text-center pb-4">
                        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                            <Baby className="w-10 h-10 text-pink-500" />
                        </div>
                        <CardTitle className="text-2xl">Chào mừng đến với BabyVerse!</CardTitle>
                        <CardDescription className="text-base">
                            Bắt đầu bằng cách thêm thông tin con yêu của bạn
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center pb-6">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                            onClick={() => router.push('/children/new')}
                        >
                            <Plus className="mr-2 h-5 w-5" />
                            Thêm con đầu tiên
                        </Button>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Quản lý sức khỏe, tăng trưởng và những khoảnh khắc quan trọng của bé
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                    Tổng quan
                </h1>
                <p className="text-muted-foreground mt-1">
                    {selectedChild ? `Thông tin của ${selectedChild.name}` : 'Dashboard'}
                </p>
            </div>

            {selectedChild && (
                <>
                    {/* Child Info Card */}
                    <Card className="border-2 bg-gradient-to-br from-pink-50/50 to-purple-50/50 dark:from-pink-900/10 dark:to-purple-900/10">
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                                        <span className="text-2xl text-white font-bold">
                                            {selectedChild.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">{selectedChild.name}</h2>
                                        <p className="text-muted-foreground">{getAge(selectedChild.birthDate)}</p>
                                        <div className="flex gap-2 mt-2">
                                            {selectedChild.gender === 'male' && (
                                                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                                                    Bé trai
                                                </Badge>
                                            )}
                                            {selectedChild.gender === 'female' && (
                                                <Badge variant="outline" className="bg-pink-50 text-pink-600 border-pink-200">
                                                    Bé gái
                                                </Badge>
                                            )}
                                            {selectedChild.bloodType && (
                                                <Badge variant="outline">
                                                    Nhóm máu {selectedChild.bloodType}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => router.push(`/children/${selectedChild.id}`)}
                                >
                                    Xem chi tiết
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
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
                                    {selectedChild.birthWeight ? `${selectedChild.birthWeight} kg` : 'Chưa có'}
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
                                    {selectedChild.birthHeight ? `${selectedChild.birthHeight} cm` : 'Chưa có'}
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
                                    {selectedChild.birthCondition === 'natural' && 'Sinh tự nhiên'}
                                    {selectedChild.birthCondition === 'c-section' && 'Mổ đẻ'}
                                    {selectedChild.birthCondition === 'premature' && 'Sinh non'}
                                    {!selectedChild.birthCondition && 'Chưa có'}
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
                                    {new Date(selectedChild.birthDate).toLocaleDateString('vi-VN')}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/medical')}>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/20 rounded-lg flex items-center justify-center">
                                        <Syringe className="h-6 w-6 text-pink-500" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Tiêm chủng</CardTitle>
                                        <CardDescription>Lịch tiêm phòng</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" className="w-full">
                                    Xem lịch tiêm chủng
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/growth')}>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                                        <TrendingUp className="h-6 w-6 text-purple-500" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Tăng trưởng</CardTitle>
                                        <CardDescription>Chiều cao & cân nặng</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" className="w-full">
                                    Theo dõi tăng trưởng
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/milestones')}>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                        <Calendar className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Cột mốc</CardTitle>
                                        <CardDescription>Phát triển của bé</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" className="w-full">
                                    Ghi nhận cột mốc
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                </>
            )}
        </div>
    )
}
