'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Vaccination } from '@/types'
import { Calendar, MapPin, Syringe, Trash2, AlertCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { formatDateForInput } from '@/lib/dateUtils'

interface VaccineDetailsModalProps {
    vaccination: Vaccination & { schedule?: { name: string, nameVi: string, description?: string | null } | null }
    isOpen: boolean
    onClose: () => void
    onUpdate: (id: string, data: any) => Promise<void>
    onDelete: (id: string) => Promise<void>
}

export function VaccineDetailsModal({ vaccination, isOpen, onClose, onUpdate, onDelete }: VaccineDetailsModalProps) {
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: vaccination.name || vaccination.schedule?.nameVi || '',
        status: vaccination.status,
        completedDate: vaccination.completedDate ? formatDateForInput(vaccination.completedDate) : '',
        location: vaccination.location || '',
        notes: vaccination.notes || '',
        reactions: vaccination.reactions || '',
    })

    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: vaccination.name || vaccination.schedule?.nameVi || '',
                status: vaccination.status,
                completedDate: vaccination.completedDate ? formatDateForInput(vaccination.completedDate) : '',
                location: vaccination.location || '',
                notes: vaccination.notes || '',
                reactions: vaccination.reactions || '',
            })
            setIsEditing(false)
        }
    }, [isOpen, vaccination])

    const handleUpdate = async () => {
        setLoading(true)
        try {
            await onUpdate(vaccination.id, {
                ...formData,
                completedDate: formData.status === 'completed' && formData.completedDate ? new Date(formData.completedDate).toISOString() : (formData.status === 'completed' ? new Date().toISOString() : null),
            })
            toast.success('Đã cập nhật thông tin tiêm chủng')
            setIsEditing(false)
            onClose()
        } catch (error) {
            toast.error('Có lỗi xảy ra khi cập nhật')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) {
            setLoading(true)
            try {
                await onDelete(vaccination.id)
                toast.success('Đã xóa bản ghi tiêm chủng')
                onClose()
            } catch (error) {
                toast.error('Có lỗi xảy ra khi xóa')
            } finally {
                setLoading(false)
            }
        }
    }

    const vaccineName = vaccination.schedule?.nameVi || vaccination.schedule?.name || vaccination.name || 'Vắc xin'

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                            <Syringe className="w-6 h-6 text-pink-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">{vaccineName}</DialogTitle>
                            <DialogDescription>
                                {vaccination.schedule?.description || 'Bản ghi tiêm chủng riêng'}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {!isEditing ? (
                    <div className="space-y-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" /> Ngày dự kiến
                                </p>
                                <p className="font-medium">{format(new Date(vaccination.dueDate), 'dd/MM/yyyy', { locale: vi })}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground flex items-center">
                                    <Clock className="w-3 h-3 mr-1" /> Trạng thái
                                </p>
                                <p className="font-medium">
                                    {vaccination.status === 'completed' ? 'Đã hoàn thành' :
                                        vaccination.status === 'overdue' ? 'Quá hạn' : 'Chờ tiêm'}
                                </p>
                            </div>
                        </div>

                        {vaccination.completedDate && (
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground flex items-center">
                                    <AlertCircle className="w-3 h-3 mr-1" /> Ngày đã tiêm
                                </p>
                                <p className="font-medium text-green-600">
                                    {format(new Date(vaccination.completedDate), 'dd/MM/yyyy', { locale: vi })}
                                </p>
                            </div>
                        )}

                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground flex items-center">
                                <MapPin className="w-3 h-3 mr-1" /> Địa điểm
                            </p>
                            <p className="font-medium">{vaccination.location || 'Chưa cập nhật'}</p>
                        </div>

                        {vaccination.notes && (
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Ghi chú</p>
                                <p className="p-3 bg-muted rounded-lg text-sm italic">"{vaccination.notes}"</p>
                            </div>
                        )}

                        {vaccination.reactions && (
                            <div className="space-y-1">
                                <p className="text-sm text-red-500 font-medium">Phản ứng sau tiêm</p>
                                <p className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg text-sm text-red-700 dark:text-red-400">
                                    {vaccination.reactions}
                                </p>
                            </div>
                        )}

                        <DialogFooter className="flex sm:justify-between gap-2">
                            <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleDelete}>
                                <Trash2 className="w-4 h-4 mr-2" /> Xóa
                            </Button>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={onClose}>Đóng</Button>
                                <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
                            </div>
                        </DialogFooter>
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Tên vắc xin</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={!!vaccination.scheduleId}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-status">Trạng thái</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                                >
                                    <SelectTrigger id="edit-status">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Chờ tiêm</SelectItem>
                                        <SelectItem value="completed">Đã tiêm</SelectItem>
                                        <SelectItem value="skipped">Bỏ qua</SelectItem>
                                        <SelectItem value="overdue">Quá hạn</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {formData.status === 'completed' && (
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-completed-date">Ngày đã tiêm</Label>
                                    <Input
                                        id="edit-completed-date"
                                        type="date"
                                        value={formData.completedDate}
                                        onChange={(e) => setFormData({ ...formData, completedDate: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-location">Địa điểm</Label>
                            <Input
                                id="edit-location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-notes">Ghi chú</Label>
                            <Textarea
                                id="edit-notes"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-reactions">Phản ứng sau tiêm (nếu có)</Label>
                            <Textarea
                                id="edit-reactions"
                                value={formData.reactions}
                                onChange={(e) => setFormData({ ...formData, reactions: e.target.value })}
                                placeholder="Sốt nhẹ, sưng đau..."
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>Hủy</Button>
                            <Button onClick={handleUpdate} disabled={loading} className="bg-pink-600 hover:bg-pink-700">
                                {loading ? 'Đang lưu...' : 'Cập nhật bản ghi'}
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
