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
import { Plus, Loader2 } from 'lucide-react'
import { getLocalDateString } from '@/lib/dateUtils'

const growthSchema = z.object({
    measureDate: z.string().min(1, 'Ngày đo là bắt buộc'),
    weight: z.string().optional().refine(val => !val || !isNaN(parseFloat(val)), 'Cân nặng phải là số'),
    height: z.string().optional().refine(val => !val || !isNaN(parseFloat(val)), 'Chiều cao phải là số'),
    headCircumference: z.string().optional().refine(val => !val || !isNaN(parseFloat(val)), 'Vòng đầu phải là số'),
    notes: z.string().optional(),
})

type GrowthFormData = z.infer<typeof growthSchema>

interface AddGrowthRecordModalProps {
    childId: string
    onRecordAdded: () => void
}

export function AddGrowthRecordModal({ childId, onRecordAdded }: AddGrowthRecordModalProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<GrowthFormData>({
        resolver: zodResolver(growthSchema),
        defaultValues: {
            measureDate: getLocalDateString(),
        }
    })

    const onSubmit = async (data: GrowthFormData) => {
        setLoading(true)
        setError('')

        try {
            const payload = {
                measureDate: data.measureDate,
                weight: data.weight ? parseFloat(data.weight) : null,
                height: data.height ? parseFloat(data.height) : null,
                headCircumference: data.headCircumference ? parseFloat(data.headCircumference) : null,
                notes: data.notes || null,
            }

            const response = await fetch(`/api/children/${childId}/growth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                onRecordAdded()
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
                <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm chỉ số
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Thêm chỉ số tăng trưởng</DialogTitle>
                    <DialogDescription>
                        Nhập các chỉ số chiều cao, cân nặng của bé.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="measureDate">Ngày đo *</Label>
                        <Input
                            id="measureDate"
                            type="date"
                            {...register('measureDate')}
                        />
                        {errors.measureDate && <p className="text-xs text-red-500">{errors.measureDate.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="weight">Cân nặng (kg)</Label>
                            <Input
                                id="weight"
                                type="number"
                                step="0.01"
                                placeholder="8.5"
                                {...register('weight')}
                            />
                            {errors.weight && <p className="text-xs text-red-500">{errors.weight.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="height">Chiều cao (cm)</Label>
                            <Input
                                id="height"
                                type="number"
                                step="0.1"
                                placeholder="72.5"
                                {...register('height')}
                            />
                            {errors.height && <p className="text-xs text-red-500">{errors.height.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="headCircumference">Vòng đầu (cm)</Label>
                        <Input
                            id="headCircumference"
                            type="number"
                            step="0.1"
                            placeholder="44"
                            {...register('headCircumference')}
                        />
                        {errors.headCircumference && <p className="text-xs text-red-500">{errors.headCircumference.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Ghi chú</Label>
                        <Textarea
                            id="notes"
                            placeholder="Sức khỏe bình thường, bé ăn ngoan..."
                            {...register('notes')}
                        />
                    </div>

                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

                    <DialogFooter>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Lưu dữ liệu
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
