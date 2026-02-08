'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
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
import { ChildSwitcher } from '@/components/children/ChildSwitcher'
import {
    Baby,
    LayoutDashboard,
    Syringe,
    LineChart,
    Heart,
    Calendar,
    Image,
    Bell,
    Settings,
    LogOut,
    Menu,
    X,
} from 'lucide-react'

const navigation = [
    { name: 'Tổng quan', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Y tế & Tiêm chủng', href: '/medical', icon: Syringe },
    { name: 'Tăng trưởng', href: '/growth', icon: LineChart },
    { name: 'Dinh dưỡng', href: '/nutrition', icon: Heart },
    { name: 'Cột mốc phát triển', href: '/milestones', icon: Calendar },
    { name: 'Bộ sưu tập', href: '/media', icon: Image },
    { name: 'Nhắc nhở', href: '/reminders', icon: Bell },
]

import { ChildProvider } from '@/components/providers/ChildProvider'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
    }, [status, router])

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
                <Baby className="w-12 h-12 animate-pulse text-pink-500" />
            </div>
        )
    }

    if (!session) {
        return null
    }

    return (
        <ChildProvider>
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
                {/* Mobile sidebar */}
                <div
                    className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'
                        }`}
                >
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-xl">
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between p-4 border-b">
                                <div className="flex items-center gap-2">
                                    <img src="/logo.png" alt="BabyVerse Logo" className="w-8 h-8 rounded-lg shadow-sm" />
                                    <span className="font-bold text-lg bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                                        BabyVerse
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="p-4">
                                <ChildSwitcher />
                            </div>

                            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                                {navigation.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            {item.name}
                                        </Link>
                                    )
                                })}
                            </nav>

                            <div className="p-4 border-t">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                                    onClick={() => signOut({ callbackUrl: '/login' })}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Đăng xuất
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop sidebar */}
                <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                    <div className="flex flex-col flex-grow bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-r overflow-y-auto">
                        <div className="flex items-center gap-2 px-4 py-6">
                            <img src="/logo.png" alt="BabyVerse Logo" className="w-10 h-10 rounded-xl shadow-lg" />
                            <span className="font-bold text-xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                                BabyVerse
                            </span>
                        </div>

                        <div className="px-4 pb-4">
                            <ChildSwitcher />
                        </div>

                        <nav className="flex-1 px-2 pb-4 space-y-1">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </nav>

                        <div className="p-4 border-t">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start px-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <Avatar className="h-8 w-8 mr-2">
                                            <AvatarImage src={session.user?.image || undefined} />
                                            <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white">
                                                {session.user?.name?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col items-start text-sm truncate flex-1">
                                            <span className="font-medium truncate w-full">
                                                {session.user?.name || 'User'}
                                            </span>
                                            <span className="text-xs text-muted-foreground truncate w-full">
                                                {session.user?.email}
                                            </span>
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => router.push('/settings')}>
                                        <Settings className="mr-2 h-4 w-4" />
                                        Cài đặt
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-red-500 focus:text-red-600"
                                        onClick={() => signOut({ callbackUrl: '/login' })}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Đăng xuất
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="lg:pl-64">
                    {/* Mobile header */}
                    <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl px-4 py-4 shadow-sm lg:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <img src="/logo.png" alt="BabyVerse Logo" className="w-8 h-8 rounded-lg shadow-sm" />
                                <span className="font-bold text-lg bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                                    BabyVerse
                                </span>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={session.user?.image || undefined} />
                                        <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white">
                                            {session.user?.name?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                    {session.user?.name || 'User'}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push('/settings')}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    Cài đặt
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-red-500"
                                    onClick={() => signOut({ callbackUrl: '/login' })}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Đăng xuất
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <main className="py-6 px-4 sm:px-6 lg:px-8">
                        {children}
                    </main>
                </div>
            </div>
        </ChildProvider>
    )
}
