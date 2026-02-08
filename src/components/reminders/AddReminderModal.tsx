'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Plus, Loader2 } from 'lucide-react'
import { useChildren } from '@/components/providers/ChildProvider'
import { getLocalDateTimeString } from '@/lib/dateUtils'

const reminderSchema = z.object({
    type: z.enum(['vaccination', 'medical_visit', 'medication', 'birthday', 'milestone']),
    title: z.string().min(1, 'Tiêu đề là bắt buộc'),
    reminderDate: z.string().min(1, 'Ngày giờ là bắt buộc'),
    childId: z.string().optional(),
})

type ReminderFormData = z.infer<typeof reminderSchema>

interface AddReminderModalProps {
    onReminderAdded: () => void
}

export function AddReminderModal({ onReminderAdded }: AddReminderModalProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { children, selectedChild } = useChildren()

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ReminderFormData>({
        resolver: zodResolver(reminderSchema),
        defaultValues: {
            reminderDate: getLocalDateTimeString(),
            childId: selectedChild?.id || undefined,
        }
    })

    const onSubmit = async (data: ReminderFormData) => {
        setLoading(true)
        setError('')

        try {
            const payload = {
                type: data.type,
                title: data.title,
                reminderDate: data.reminderDate,
                childId: data.childId || null,
            }

            const response = await fetch('/api/reminders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                onReminderAdded()
                setOpen(false)
                reset()
            } else {
                const result = await response.json()
                setError(result.error || 'Đã xảy ra lỗi')
            }
        } catch (error) {
            setError('Không thể lưu dữ liệu')
        } finally {
            setLoading(false)
        }
    }

    const reminderTypeLabels: Record<string, { label: string; emoji: string }> = {
        vaccination: { label: 'Tiêm chủng', emoji: '💉' },
        medical_visit: { label: 'Khám bệnh', emoji: '🏥' },
        medication: { label: 'Uống thuốc', emoji: '💊' },
        birthday: { label: 'Sinh nhật', emoji: '🎂' },
        milestone: { label: 'Cột mốc', emoji: '🌟' },
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm nhắc nhở
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Thêm nhắc nhở mới</DialogTitle>
                    <DialogDescription>
                        Tạo nhắc nhở để không bỏ lỡ những việc quan trọng.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="type">Loại nhắc nhở *</Label>
                        <Select onValueChange={(value) => setValue('type', value as any, { shouldValidate: true })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn loại nhắc nhở" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(reminderTypeLabels).map(([key, { label, emoji }]) => (
                                    <SelectItem key={key} value={key}>
                                        {emoji} {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Tiêu đề *</Label>
                        <Input
                            id="title"
                            placeholder="Tiêm phòng viêm gan B, Khám định kỳ..."
                            {...register('title')}
                        />
                        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reminderDate">Ngày giờ nhắc nhở *</Label>
                        <Input
                            id="reminderDate"
                            type="datetime-local"
                            {...register('reminderDate')}
                        />
                        {errors.reminderDate && <p className="text-xs text-red-500">{errors.reminderDate.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="childId">Bé (tùy chọn)</Label>
                        <Select
                            onValueChange={(value) => setValue('childId', value === 'none' ? undefined : value)}
                            defaultValue={selectedChild?.id || 'none'}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn bé" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Tất cả</SelectItem>
                                {children.map((child) => (
                                    <SelectItem key={child.id} value={child.id}>
                                        {child.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

                    <DialogFooter>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Lưu nhắc nhở
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
