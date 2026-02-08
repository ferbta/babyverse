'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Trash2, Calendar, X, ImageIcon } from 'lucide-react'

interface Media {
    id: string
    url: string
    caption: string | null
    takenDate: string | Date | null
    createdAt: string | Date
}

interface PhotoGridProps {
    photos: Media[]
    onDelete?: (id: string) => void
}

export function PhotoGrid({ photos, onDelete }: PhotoGridProps) {
    const [selectedPhoto, setSelectedPhoto] = useState<Media | null>(null)

    if (photos.length === 0) {
        return (
            <div className="text-center py-20 bg-white/50 dark:bg-black/20 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Chưa có ảnh nào</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Hãy tải lên những khoảnh khắc đầu tiên của bé!</p>
            </div>
        )
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa ảnh này?')) return
        onDelete?.(id)
        setSelectedPhoto(null)
    }

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo) => {
                    const date = photo.takenDate
                        ? new Date(photo.takenDate).toLocaleDateString('vi-VN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })
                        : null

                    return (
                        <Card
                            key={photo.id}
                            className="group relative overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-none"
                            onClick={() => setSelectedPhoto(photo)}
                        >
                            <div className="aspect-square relative bg-gray-100 dark:bg-gray-900">
                                <Image
                                    src={photo.url}
                                    alt={photo.caption || 'Photo'}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                />

                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                                        {date && (
                                            <div className="flex items-center text-xs mb-1">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {date}
                                            </div>
                                        )}
                                        {photo.caption && (
                                            <p className="text-sm line-clamp-2">{photo.caption}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>

            {/* Lightbox Dialog */}
            <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95 border-none">
                    {selectedPhoto && (
                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 rounded-full"
                                onClick={() => setSelectedPhoto(null)}
                            >
                                <X className="h-6 w-6" />
                            </Button>

                            <div className="relative w-full" style={{ maxHeight: '80vh' }}>
                                <Image
                                    src={selectedPhoto.url}
                                    alt={selectedPhoto.caption || 'Photo'}
                                    width={1200}
                                    height={800}
                                    className="w-full h-auto object-contain"
                                    priority
                                />
                            </div>

                            <div className="p-6 bg-gradient-to-t from-black to-transparent">
                                {selectedPhoto.takenDate && (
                                    <div className="flex items-center text-gray-300 text-sm mb-2">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {new Date(selectedPhoto.takenDate).toLocaleDateString('vi-VN', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </div>
                                )}
                                {selectedPhoto.caption && (
                                    <p className="text-white text-base mb-4">{selectedPhoto.caption}</p>
                                )}
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(selectedPhoto.id)}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Xóa ảnh
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
