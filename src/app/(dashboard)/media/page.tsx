'use client'

import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Baby, Image as ImageIcon, Heart } from 'lucide-react'
import { useChildren } from '@/components/providers/ChildProvider'
import { PhotoGrid } from '@/components/media/PhotoGrid'
import { UploadPhotoModal } from '@/components/media/UploadPhotoModal'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface Media {
    id: string
    url: string
    caption: string | null
    takenDate: string | Date | null
    createdAt: string | Date
}

export default function MediaPage() {
    const { selectedChild, loading: childLoading } = useChildren()
    const [media, setMedia] = useState<Media[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchMedia = async () => {
        if (!selectedChild?.id) return

        setLoading(true)
        try {
            const response = await fetch(`/api/children/${selectedChild.id}/media`)
            if (response.ok) {
                const data = await response.json()
                setMedia(data)
            } else {
                setError('Không thể tải dữ liệu ảnh')
            }
        } catch (error) {
            setError('Lỗi khi kết nối đến máy chủ')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!selectedChild?.id) return

        try {
            const response = await fetch(`/api/children/${selectedChild.id}/media/${id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                fetchMedia()
            } else {
                alert('Không thể xóa ảnh')
            }
        } catch (error) {
            alert('Lỗi khi xóa ảnh')
        }
    }

    useEffect(() => {
        fetchMedia()
    }, [selectedChild?.id])

    if (childLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-48" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <Skeleton key={i} className="aspect-square" />
                    ))}
                </div>
            </div>
        )
    }

    if (!selectedChild) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center">
                    <Baby className="w-10 h-10 text-pink-500" />
                </div>
                <h2 className="text-2xl font-bold">Chưa chọn bé</h2>
                <p className="text-muted-foreground max-w-xs">
                    Vui lòng chọn hoặc thêm bé mới để bắt đầu lưu trữ kỷ niệm.
                </p>
                <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
                    Đến trang quản lý
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <ImageIcon className="w-8 h-8 text-pink-500" />
                        Bộ sưu tập
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Lưu giữ những khoảnh khắc đáng nhớ của <strong>{selectedChild.name}</strong>
                    </p>
                </div>
                <UploadPhotoModal childId={selectedChild.id} onPhotoUploaded={fetchMedia} />
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Lỗi</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Stats Card */}
            <Card className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950 border-none shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Tổng số ảnh</p>
                            <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">{media.length}</p>
                        </div>
                        <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center">
                            <Heart className="w-8 h-8 text-pink-500" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Photo Grid */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <Skeleton key={i} className="aspect-square rounded-2xl" />
                    ))}
                </div>
            ) : (
                <PhotoGrid photos={media} onDelete={handleDelete} />
            )}
        </div>
    )
}
