'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Baby, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const childSchema = z.object({
    name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    nickname: z.string().optional(),
    birthDate: z.string().min(1, 'Ngày sinh là bắt buộc'),
    gender: z.enum(['male', 'female', 'other'] as const, { message: 'Vui lòng chọn giới tính' }),
    bloodType: z.string().optional(),
    birthWeight: z.string().optional(),
    birthHeight: z.string().optional(),
    birthCondition: z.string().optional(),
})

type ChildFormData = z.infer<typeof childSchema>

export default function NewChildPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ChildFormData>({
        resolver: zodResolver(childSchema),
    })

    const gender = watch('gender')
    const bloodType = watch('bloodType')
    const birthCondition = watch('birthCondition')

    const onSubmit = async (data: ChildFormData) => {
        setError('')
        setLoading(true)

        try {
            const payload = {
                ...data,
                birthWeight: data.birthWeight ? parseFloat(data.birthWeight) : undefined,
                birthHeight: data.birthHeight ? parseFloat(data.birthHeight) : undefined,
            }

            const response = await fetch('/api/children', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            const result = await response.json()

            if (!response.ok) {
                setError(result.error || 'Đã xảy ra lỗi')
                return
            }

            router.push('/dashboard')
        } catch (error) {
            setError('Không thể tạo hồ sơ. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Link href="/dashboard">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
                            <Baby className="w-6 w-6 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">Thêm con mới</CardTitle>
                            <CardDescription>Nhập thông tin cơ bản của bé</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Tên bé *</Label>
                            <Input
                                id="name"
                                placeholder="Nguyễn Văn A"
                                {...register('name')}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Nickname */}
                        <div className="space-y-2">
                            <Label htmlFor="nickname">Biệt danh / Tên thường gọi</Label>
                            <Input
                                id="nickname"
                                placeholder="Bi, Bông, etc."
                                {...register('nickname')}
                            />
                        </div>

                        {/* Birth Date */}
                        <div className="space-y-2">
                            <Label htmlFor="birthDate">Ngày sinh *</Label>
                            <Input
                                id="birthDate"
                                type="date"
                                {...register('birthDate')}
                            />
                            {errors.birthDate && (
                                <p className="text-sm text-red-500">{errors.birthDate.message}</p>
                            )}
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                            <Label>Giới tính *</Label>
                            <Select onValueChange={(value) => setValue('gender', value as any)} value={gender}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn giới tính" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Bé trai</SelectItem>
                                    <SelectItem value="female">Bé gái</SelectItem>
                                    <SelectItem value="other">Khác</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.gender && (
                                <p className="text-sm text-red-500">{errors.gender.message}</p>
                            )}
                        </div>

                        {/* Blood Type */}
                        <div className="space-y-2">
                            <Label>Nhóm máu</Label>
                            <Select onValueChange={(value) => setValue('bloodType', value === 'none' ? undefined : value)} value={bloodType || 'none'}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn nhóm máu (nếu biết)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Không rõ</SelectItem>
                                    <SelectItem value="A+">A+</SelectItem>
                                    <SelectItem value="A-">A-</SelectItem>
                                    <SelectItem value="B+">B+</SelectItem>
                                    <SelectItem value="B-">B-</SelectItem>
                                    <SelectItem value="AB+">AB+</SelectItem>
                                    <SelectItem value="AB-">AB-</SelectItem>
                                    <SelectItem value="O+">O+</SelectItem>
                                    <SelectItem value="O-">O-</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Birth Weight */}
                            <div className="space-y-2">
                                <Label htmlFor="birthWeight">Cân nặng lúc sinh (kg)</Label>
                                <Input
                                    id="birthWeight"
                                    type="number"
                                    step="0.1"
                                    placeholder="3.2"
                                    {...register('birthWeight')}
                                />
                            </div>

                            {/* Birth Height */}
                            <div className="space-y-2">
                                <Label htmlFor="birthHeight">Chiều cao lúc sinh (cm)</Label>
                                <Input
                                    id="birthHeight"
                                    type="number"
                                    step="0.1"
                                    placeholder="50"
                                    {...register('birthHeight')}
                                />
                            </div>
                        </div>

                        {/* Birth Condition */}
                        <div className="space-y-2">
                            <Label>Hình thức sinh</Label>
                            <Select onValueChange={(value) => setValue('birthCondition', value === 'none' ? undefined : value)} value={birthCondition || 'none'}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn hình thức sinh" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Không rõ</SelectItem>
                                    <SelectItem value="natural">Sinh tự nhiên</SelectItem>
                                    <SelectItem value="c-section">Mổ đẻ</SelectItem>
                                    <SelectItem value="premature">Sinh non</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => router.back()}
                                disabled={loading}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang lưu...
                                    </>
                                ) : (
                                    'Thêm con'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
