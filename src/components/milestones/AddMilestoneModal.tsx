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
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Plus, Loader2, Sparkles } from 'lucide-react'
import { getLocalDateString } from '@/lib/dateUtils'

const milestoneSchema = z.object({
    title: z.string().min(1, 'Tiêu đề là bắt buộc'),
    category: z.enum(['physical', 'cognitive', 'social', 'language']),
    achievedDate: z.string().min(1, 'Ngày đạt được là bắt buộc'),
    notes: z.string().optional(),
})

type MilestoneFormData = z.infer<typeof milestoneSchema>

interface AddMilestoneModalProps {
    childId: string
    onMilestoneAdded: () => void
}

const categories = [
    { value: 'physical', label: 'Thể chất', color: 'bg-blue-500' },
    { value: 'cognitive', label: 'Nhận thức', color: 'bg-purple-500' },
    { value: 'social', label: 'Xã hội', color: 'bg-pink-500' },
    { value: 'language', label: 'Ngôn ngữ', color: 'bg-green-500' },
]

export function AddMilestoneModal({ childId, onMilestoneAdded }: AddMilestoneModalProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<MilestoneFormData>({
        resolver: zodResolver(milestoneSchema),
        defaultValues: {
            achievedDate: getLocalDateString(),
            category: 'physical'
        }
    })

    const onSubmit = async (data: MilestoneFormData) => {
        setLoading(true)
        setError('')

        try {
            const response = await fetch(`/api/children/${childId}/milestones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                onMilestoneAdded()
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg group">
                    <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                    Thêm cột mốc mới
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Kỷ niệm cột mốc mới</DialogTitle>
                    <DialogDescription>
                        Ghi lại khoảnh khắc đáng nhớ trong sự phát triển của bé.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Cột mốc của bé là gì? *</Label>
                        <Input
                            id="title"
                            placeholder="Ví dụ: Biết lẫy, Những bước đi đầu tiên..."
                            {...register('title')}
                        />
                        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="achievedDate">Ngày đạt được *</Label>
                            <Input
                                id="achievedDate"
                                type="date"
                                {...register('achievedDate')}
                            />
                            {errors.achievedDate && <p className="text-xs text-red-500">{errors.achievedDate.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Phân loại</Label>
                            <Select
                                defaultValue="physical"
                                onValueChange={(value: any) => setValue('category', value)}
                            >
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Chọn loại" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                                                {cat.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Cảm xúc hoặc chi tiết thêm</Label>
                        <Textarea
                            id="notes"
                            placeholder="Hôm nay bé làm bố mẹ rất bất ngờ và hạnh phúc..."
                            className="min-h-[100px]"
                            {...register('notes')}
                        />
                    </div>

                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

                    <DialogFooter>
                        <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-600" disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Lưu khoảnh khắc
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
