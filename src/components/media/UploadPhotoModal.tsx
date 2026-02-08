'use client'

import { useState, useRef } from 'react'
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
import { Upload, Loader2, ImagePlus, X } from 'lucide-react'
import Image from 'next/image'
import { getLocalDateString } from '@/lib/dateUtils'

const photoSchema = z.object({
    caption: z.string().optional(),
    takenDate: z.string().optional(),
})

type PhotoFormData = z.infer<typeof photoSchema>

interface UploadPhotoModalProps {
    childId: string
    onPhotoUploaded: () => void
}

export function UploadPhotoModal({ childId, onPhotoUploaded }: UploadPhotoModalProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [preview, setPreview] = useState<string | null>(null)
    const [imageData, setImageData] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PhotoFormData>({
        resolver: zodResolver(photoSchema),
        defaultValues: {
            takenDate: getLocalDateString(),
        }
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            setError('Vui lòng chọn file ảnh')
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            const result = reader.result as string
            setPreview(result)
            setImageData(result)
        }
        reader.readAsDataURL(file)
    }

    const clearImage = () => {
        setPreview(null)
        setImageData(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const onSubmit = async (data: PhotoFormData) => {
        if (!imageData) {
            setError('Vui lòng chọn ảnh')
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await fetch(`/api/children/${childId}/media`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageData,
                    caption: data.caption,
                    takenDate: data.takenDate,
                }),
            })

            if (response.ok) {
                onPhotoUploaded()
                setOpen(false)
                reset()
                clearImage()
            } else {
                const result = await response.json()
                setError(result.error || 'Đã xảy ra lỗi')
            }
        } catch (error) {
            setError('Không thể tải ảnh lên')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg">
                    <Upload className="mr-2 h-4 w-4" />
                    Tải ảnh lên
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Thêm ảnh mới</DialogTitle>
                    <DialogDescription>
                        Lưu giữ những khoảnh khắc đáng nhớ của bé.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    {/* Image Upload Area */}
                    <div className="space-y-2">
                        <Label>Chọn ảnh *</Label>
                        {!preview ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 text-center cursor-pointer hover:border-pink-400 hover:bg-pink-50/50 dark:hover:bg-pink-950/20 transition-all"
                            >
                                <ImagePlus className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Nhấn để chọn ảnh
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    PNG, JPG, WEBP (tối đa 10MB)
                                </p>
                            </div>
                        ) : (
                            <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-800">
                                <Image
                                    src={preview}
                                    alt="Preview"
                                    width={500}
                                    height={300}
                                    className="w-full h-auto object-cover"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 rounded-full"
                                    onClick={clearImage}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="takenDate">Ngày chụp</Label>
                        <Input
                            id="takenDate"
                            type="date"
                            {...register('takenDate')}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="caption">Chú thích</Label>
                        <Textarea
                            id="caption"
                            placeholder="Mô tả khoảnh khắc này..."
                            className="min-h-[80px]"
                            {...register('caption')}
                        />
                    </div>

                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

                    <DialogFooter>
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-600"
                            disabled={loading || !imageData}
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Tải lên
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
