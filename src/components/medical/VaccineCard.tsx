'use client'

import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Syringe, Calendar, MapPin, CheckCircle, Clock, AlertCircle, MoreVertical } from 'lucide-react'
import { Vaccination } from '@/types'
import { useState } from 'react'
import { toast } from 'sonner'

import { VaccineDetailsModal } from './VaccineDetailsModal'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface VaccineCardProps {
    vaccination: Vaccination & { schedule?: { name: string, nameVi: string, description?: string | null } | null }
    onUpdate: (id: string, data: any) => Promise<void>
    onDelete: (id: string) => Promise<void>
}

export function VaccineCard({ vaccination, onUpdate, onDelete }: VaccineCardProps) {
    const [loading, setLoading] = useState(false)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400'
            case 'overdue':
                return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400'
            case 'skipped':
                return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400'
            default:
                return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-4 h-4 mr-1" />
            case 'overdue':
                return <AlertCircle className="w-4 h-4 mr-1" />
            case 'skipped':
                return <Clock className="w-4 h-4 mr-1" />
            default:
                return <Clock className="w-4 h-4 mr-1" />
        }
    }

    const handleAction = async (action: 'complete' | 'undo' | 'delete') => {
        if (loading) return
        setLoading(true)

        try {
            if (action === 'complete') {
                await onUpdate(vaccination.id, {
                    status: 'completed',
                    completedDate: new Date().toISOString(),
                })
                toast.success('Đã đánh dấu là hoàn thành')
            } else if (action === 'undo') {
                await onUpdate(vaccination.id, {
                    status: 'pending',
                    completedDate: null,
                })
                toast.success('Đã hoàn tác trạng thái')
            } else if (action === 'delete') {
                if (confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) {
                    await onDelete(vaccination.id)
                    toast.success('Đã xóa bản ghi')
                }
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi thực hiện thao tác')
        } finally {
            setLoading(false)
        }
    }

    const vaccineName = vaccination.schedule?.nameVi || vaccination.schedule?.name || vaccination.name || 'Vắc xin không tên'

    return (
        <>
            <Card className="hover:shadow-md transition-all border-l-4 overflow-hidden relative"
                style={{ borderLeftColor: vaccination.status === 'completed' ? '#22c55e' : (vaccination.status === 'overdue' ? '#ef4444' : '#3b82f6') }}>

                <div className="absolute top-2 right-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setIsDetailsOpen(true)}>
                                Chi tiết & Chỉnh sửa
                            </DropdownMenuItem>
                            {vaccination.status === 'completed' && (
                                <DropdownMenuItem onClick={() => handleAction('undo')}>
                                    Hoàn tác "Đã tiêm"
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleAction('delete')} className="text-red-500">
                                Xóa bản ghi
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0 pr-10">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={getStatusColor(vaccination.status)}>
                                {getStatusIcon(vaccination.status)}
                                {vaccination.status === 'completed' ? 'Hoàn thành' :
                                    vaccination.status === 'overdue' ? 'Quá hạn' :
                                        vaccination.status === 'skipped' ? 'Đã bỏ qua' : 'Chờ tiêm'}
                            </Badge>
                        </div>
                        <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-100">
                            {vaccineName}
                        </CardTitle>
                        {vaccination.schedule?.description && (
                            <CardDescription className="line-clamp-1 mt-0.5">
                                {vaccination.schedule.description}
                            </CardDescription>
                        )}
                    </div>
                    <div className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                        <Syringe className="w-6 h-6 text-pink-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                            <span className="font-medium mr-1">Ngày dự kiến:</span>
                            {format(new Date(vaccination.dueDate), 'dd/MM/yyyy', { locale: vi })}
                        </div>

                        {vaccination.completedDate && (
                            <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                <span className="font-medium mr-1">Ngày tiêm:</span>
                                {format(new Date(vaccination.completedDate), 'dd/MM/yyyy', { locale: vi })}
                            </div>
                        )}

                        {vaccination.location && (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                <MapPin className="w-4 h-4 mr-2 text-red-400" />
                                {vaccination.location}
                            </div>
                        )}

                        <div className="pt-3 border-t flex gap-2">
                            {vaccination.status !== 'completed' ? (
                                <Button
                                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-sm"
                                    size="sm"
                                    onClick={() => handleAction('complete')}
                                    disabled={loading}
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Đã tiêm
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                    onClick={() => setIsDetailsOpen(true)}
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Xem chi tiết
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <VaccineDetailsModal
                vaccination={vaccination}
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                onUpdate={onUpdate}
                onDelete={onDelete}
            />
        </>
    )
}
