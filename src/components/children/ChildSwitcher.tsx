'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Baby, Check, ChevronsUpDown, Plus } from 'lucide-react'
import { Child } from '@/types'
import { useChildren } from '@/components/providers/ChildProvider'

export function ChildSwitcher() {
    const { children, selectedChild, setSelectedChild, loading } = useChildren()
    const router = useRouter()

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    const getAge = (birthDate: Date) => {
        const now = new Date()
        const birth = new Date(birthDate)
        const ageInMonths = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth()

        if (ageInMonths < 12) {
            return `${ageInMonths} tháng`
        } else {
            const years = Math.floor(ageInMonths / 12)
            return `${years} tuổi`
        }
    }

    if (loading) {
        return (
            <Button variant="outline" disabled className="w-full justify-between">
                <span className="truncate">Đang tải...</span>
            </Button>
        )
    }

    if (children.length === 0) {
        return (
            <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/children/new')}
            >
                <Plus className="mr-2 h-4 w-4" />
                Thêm con
            </Button>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                >
                    <div className="flex items-center gap-2 truncate">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={selectedChild?.avatar || undefined} />
                            <AvatarFallback className="text-xs bg-gradient-to-br from-pink-400 to-purple-500 text-white">
                                {selectedChild ? getInitials(selectedChild.name) : <Baby className="h-3 w-3" />}
                            </AvatarFallback>
                        </Avatar>
                        <span className="truncate">{selectedChild?.name || 'Chọn con'}</span>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width] min-w-[200px]">
                <DropdownMenuLabel>Danh sách con</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {children.map((child) => (
                    <div key={child.id}
                        onClick={() => setSelectedChild(child)}
                        className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={child.avatar || undefined} />
                                <AvatarFallback className="text-xs bg-gradient-to-br from-pink-400 to-purple-500 text-white">
                                    {getInitials(child.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-medium">{child.name}</span>
                                <span className="text-xs text-muted-foreground">
                                    {getAge(child.birthDate)}
                                </span>
                            </div>
                        </div>
                        {selectedChild?.id === child.id && (
                            <Check className="h-4 w-4 text-pink-500" />
                        )}
                    </div>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => router.push('/children/new')}
                    className="cursor-pointer text-pink-500"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm con mới
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
