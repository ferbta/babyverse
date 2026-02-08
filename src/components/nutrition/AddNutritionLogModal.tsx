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
import { Plus, Loader2 } from 'lucide-react'

const nutritionSchema = z.object({
    feedingDate: z.string().min(1, 'Ngày giờ là bắt buộc'),
    type: z.enum(['breastfeeding', 'formula', 'solid', 'snack', 'water'], {
        required_error: 'Loại bữa ăn là bắt buộc',
    }),
    foodItems: z.string().optional(),
    amount: z.string().optional().refine(val => !val || !isNaN(parseFloat(val)), 'Lượng phải là số'),
    unit: z.enum(['ml', 'oz', 'g', 'serving']).optional(),
    notes: z.string().optional(),
})

type NutritionFormData = z.infer<typeof nutritionSchema>

interface AddNutritionLogModalProps {
    childId: string
    onLogAdded: () => void
}

export function AddNutritionLogModal({ childId, onLogAdded }: AddNutritionLogModalProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<NutritionFormData>({
        resolver: zodResolver(nutritionSchema),
        defaultValues: {
            feedingDate: new Date().toISOString().slice(0, 16),
        }
    })

    const feedingType = watch('type')

    const onSubmit = async (data: NutritionFormData) => {
        setLoading(true)
        setError('')

        try {
            const payload = {
                feedingDate: data.feedingDate,
                type: data.type,
                foodItems: data.foodItems || null,
                amount: data.amount ? parseFloat(data.amount) : null,
                unit: data.unit || null,
                notes: data.notes || null,
            }

            const response = await fetch(`/api/children/${childId}/nutrition`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                onLogAdded()
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

    const feedingTypeLabels: Record<string, string> = {
        breastfeeding: 'Sữa mẹ',
        formula: 'Sữa công thức',
        solid: 'Đồ ăn dặm',
        snack: 'Ăn vặt',
        water: 'Nước',
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm bữa ăn
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Thêm nhật ký dinh dưỡng</DialogTitle>
                    <DialogDescription>
                        Ghi lại bữa ăn và dinh dưỡng của bé.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="feedingDate">Ngày giờ *</Label>
                        <Input
                            id="feedingDate"
                            type="datetime-local"
                            {...register('feedingDate')}
                        />
                        {errors.feedingDate && <p className="text-xs text-red-500">{errors.feedingDate.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">Loại bữa ăn *</Label>
                        <Select onValueChange={(value) => setValue('type', value as any)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn loại bữa ăn" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="breastfeeding">🤱 Sữa mẹ</SelectItem>
                                <SelectItem value="formula">🍼 Sữa công thức</SelectItem>
                                <SelectItem value="solid">🥣 Đồ ăn dặm</SelectItem>
                                <SelectItem value="snack">🍪 Ăn vặt</SelectItem>
                                <SelectItem value="water">💧 Nước</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
                    </div>

                    {(feedingType === 'solid' || feedingType === 'snack') && (
                        <div className="space-y-2">
                            <Label htmlFor="foodItems">Món ăn</Label>
                            <Textarea
                                id="foodItems"
                                placeholder="Cháo gà, cà rốt nghiền, táo..."
                                {...register('foodItems')}
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Lượng</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.1"
                                placeholder="150"
                                {...register('amount')}
                            />
                            {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="unit">Đơn vị</Label>
                            <Select onValueChange={(value) => setValue('unit', value as any)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn đơn vị" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ml">ml</SelectItem>
                                    <SelectItem value="oz">oz</SelectItem>
                                    <SelectItem value="g">g</SelectItem>
                                    <SelectItem value="serving">Khẩu phần</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Ghi chú</Label>
                        <Textarea
                            id="notes"
                            placeholder="Bé ăn ngoan, thích món này..."
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
