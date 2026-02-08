'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

interface AddVaccineModalProps {
    childId: string
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function AddVaccineModal({ childId, isOpen, onClose, onSuccess }: AddVaccineModalProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        dueDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        location: '',
        notes: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('/api/vaccinations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    childId,
                }),
            })

            if (response.ok) {
                toast.success('Đã thêm vắc xin thành công')
                onSuccess()
                onClose()
            } else {
                const error = await response.json()
                toast.error(error.error || 'Có lỗi xảy ra khi thêm vắc xin')
            }
        } catch (error) {
            console.error('Error adding vaccine:', error)
            toast.error('Có lỗi xảy ra khi kết nối máy chủ')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Thêm vắc xin ngoài lịch</DialogTitle>
                        <DialogDescription>
                            Ghi lại các mũi tiêm chủng bên ngoài lịch tiêm chủng định kỳ.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Tên vắc xin</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ví dụ: Cúm mùa, Viêm màng não..."
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="dueDate">Ngày tiêm / dự kiến</Label>
                                <Input
                                    id="dueDate"
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status">Trạng thái</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Chờ tiêm</SelectItem>
                                        <SelectItem value="completed">Đã tiêm</SelectItem>
                                        <SelectItem value="skipped">Bỏ qua</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="location">Địa điểm tiêm</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="Tên bệnh viện hoặc phòng khám"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="notes">Ghi chú</Label>
                            <Textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Ghi chú thêm về mũi tiêm"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
                        <Button type="submit" disabled={loading} className="bg-pink-600 hover:bg-pink-700">
                            {loading ? 'Đang lưu...' : 'Lưu bản ghi'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
