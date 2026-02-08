'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Syringe,
    Plus,
    Baby,
    AlertCircle,
    CheckCircle2,
    Clock,
    Search,
} from 'lucide-react'
import { useChildren } from '@/components/providers/ChildProvider'
import { AddVaccineModal } from '@/components/medical/AddVaccineModal'
import { VaccineCard } from '@/components/medical/VaccineCard'
import { Toaster, toast } from 'sonner'
import { Input } from '@/components/ui/input'

export default function MedicalPage() {
    const { selectedChild, loading: childLoading } = useChildren()
    const [vaccinations, setVaccinations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    useEffect(() => {
        if (selectedChild) {
            fetchVaccinations()
        }
    }, [selectedChild])

    const fetchVaccinations = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/vaccinations?childId=${selectedChild?.id}`)
            if (response.ok) {
                const data = await response.json()
                setVaccinations(data)
            }
        } catch (error) {
            console.error('Error fetching vaccinations:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateVaccination = async (id: string, data: any) => {
        try {
            const response = await fetch(`/api/vaccinations/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (response.ok) {
                const updatedData = await response.json()
                // Update local state
                setVaccinations((prev) =>
                    prev.map((v) => (v.id === id ? { ...v, ...updatedData } : v))
                )
            }
        } catch (error) {
            console.error('Error updating vaccination:', error)
        }
    }

    const handleDeleteVaccination = async (id: string) => {
        try {
            const response = await fetch(`/api/vaccinations/${id}`, {
                method: 'DELETE',
            })
            if (response.ok) {
                setVaccinations((prev) => prev.filter((v) => v.id !== id))
                toast.success('Đã xóa bản ghi tiêm chủng')
            } else {
                const error = await response.json()
                toast.error(error.error || 'Không thể xóa bản ghi')
            }
        } catch (error) {
            console.error('Error deleting vaccination:', error)
            toast.error('Có lỗi xảy ra khi xóa bản ghi')
        }
    }

    const filteredVaccinations = vaccinations.filter((v) => {
        const name = v.schedule?.nameVi || v.schedule?.name || v.name || ''
        return name.toLowerCase().includes(searchQuery.toLowerCase())
    })

    const pendingVaccines = filteredVaccinations.filter((v) => v.status === 'pending')
    const completedVaccines = filteredVaccinations.filter((v) => v.status === 'completed')
    const overdueVaccines = filteredVaccinations.filter((v) => v.status === 'overdue')

    const stats = {
        total: vaccinations.length,
        completed: vaccinations.filter((v) => v.status === 'completed').length,
        progress: vaccinations.length > 0 ? Math.round((vaccinations.filter((v) => v.status === 'completed').length / vaccinations.length) * 100) : 0,
    }

    if (childLoading || (loading && vaccinations.length === 0)) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Baby className="w-12 h-12 animate-pulse text-pink-500" />
            </div>
        )
    }

    if (!selectedChild) {
        return (
            <div className="max-w-2xl mx-auto py-12 text-center">
                <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Baby className="w-10 h-10 text-pink-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Chưa chọn bé</h2>
                <p className="text-muted-foreground mb-6">Vui lòng chọn hoặc thêm hồ sơ bé để xem lịch tiêm chủng.</p>
                <Button onClick={() => window.location.href = '/dashboard'}>Quay lại Dashboard</Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header section with Summary */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                        Y tế & Tiêm chủng
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Quản lý lịch tiêm phòng cho {selectedChild.name}
                    </p>
                </div>
                <Button
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm vắc xin ngoài lịch
                </Button>
            </div>

            {/* Progress Overview Card */}
            <Card className="border-2 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 overflow-hidden">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Tiến độ tiêm chủng</p>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-bold text-gray-800 dark:text-gray-100">{stats.progress}%</span>
                                <span className="text-sm text-muted-foreground mb-1">({stats.completed}/{stats.total} mũi)</span>
                            </div>
                            <Progress value={stats.progress} className="h-2 bg-white/50" />
                        </div>

                        <div className="flex gap-4 md:border-l md:pl-6">
                            <div className="flex-1 p-3 bg-white/60 dark:bg-gray-800/40 rounded-xl border">
                                <p className="text-xs text-muted-foreground mb-1 flex items-center">
                                    <AlertCircle className="w-3 h-3 mr-1 text-red-500" /> Quá hạn
                                </p>
                                <p className="text-xl font-bold text-red-600">{overdueVaccines.length}</p>
                            </div>
                            <div className="flex-1 p-3 bg-white/60 dark:bg-gray-800/40 rounded-xl border">
                                <p className="text-xs text-muted-foreground mb-1 flex items-center">
                                    <Clock className="w-3 h-3 mr-1 text-blue-500" /> Sắp tới
                                </p>
                                <p className="text-xl font-bold text-blue-600">{pendingVaccines.length}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center p-4 bg-pink-500/10 rounded-2xl border border-pink-200 dark:border-pink-900/30">
                            <Syringe className="w-8 h-8 text-pink-500 mr-3" />
                            <div className="text-sm">
                                <p className="font-bold text-pink-700 dark:text-pink-400">Gợi ý</p>
                                <p className="text-pink-600/80 dark:text-pink-400/80">Nhớ đưa bé đi tiêm đúng lịch nhé!</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Search and Filters */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    placeholder="Tìm kiếm vắc xin..."
                    className="pl-10 bg-white/50 backdrop-blur-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm">
                    <TabsTrigger value="pending" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                        Sắp tới ({pendingVaccines.length})
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                        Đã tiêm ({completedVaccines.length})
                    </TabsTrigger>
                    <TabsTrigger value="all" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                        Tất cả ({filteredVaccinations.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-6">
                    {overdueVaccines.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-3 px-1 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2" /> Đã quá hạn
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {overdueVaccines.map((v) => (
                                    <VaccineCard
                                        key={v.id}
                                        vaccination={v}
                                        onUpdate={handleUpdateVaccination}
                                        onDelete={handleDeleteVaccination}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="text-sm font-semibold text-blue-500 uppercase tracking-wider mb-3 px-1 flex items-center">
                            <Clock className="w-4 h-4 mr-2" /> Hồ sơ sắp tới
                        </h3>
                        {pendingVaccines.length === 0 ? (
                            <Card className="border-dashed py-12 text-center text-muted-foreground bg-white/30">
                                Không có vắc xin nào đang chờ tiêm
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {pendingVaccines.map((v) => (
                                    <VaccineCard
                                        key={v.id}
                                        vaccination={v}
                                        onUpdate={handleUpdateVaccination}
                                        onDelete={handleDeleteVaccination}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="completed" className="mt-6">
                    {completedVaccines.length === 0 ? (
                        <Card className="border-dashed py-12 text-center text-muted-foreground bg-white/30">
                            Chưa có vắc xin nào được đánh dấu đã tiêm
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {completedVaccines.map((v) => (
                                <VaccineCard
                                    key={v.id}
                                    vaccination={v}
                                    onUpdate={handleUpdateVaccination}
                                    onDelete={handleDeleteVaccination}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="all" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredVaccinations.map((v) => (
                            <VaccineCard
                                key={v.id}
                                vaccination={v}
                                onUpdate={handleUpdateVaccination}
                                onDelete={handleDeleteVaccination}
                            />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            <AddVaccineModal
                childId={selectedChild.id}
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchVaccinations}
            />
            <Toaster richColors position="top-right" />
        </div>
    )
}
