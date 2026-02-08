'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Mail, Bell, Loader2, Save } from 'lucide-react'

export default function SettingsPage() {
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/user/settings')
            if (response.ok) {
                const data = await response.json()
                setEmailNotifications(data.emailNotifications ?? true)
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
            toast.error('Không thể tải cài đặt')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const response = await fetch('/api/user/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    emailNotifications,
                }),
            })

            if (response.ok) {
                toast.success('Đã lưu cài đặt thành công')
            } else {
                const error = await response.json()
                toast.error(error.error || 'Lỗi khi lưu cài đặt')
            }
        } catch (error) {
            console.error('Error saving settings:', error)
            toast.error('Lỗi khi lưu cài đặt')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                    Cài đặt
                </h1>
                <p className="text-muted-foreground mt-2">
                    Quản lý thông báo và thông tin cá nhân của bạn
                </p>
            </div>

            <div className="grid gap-6">
                <Card className="border-pink-100 dark:border-pink-900/30 overflow-hidden shadow-md">
                    <CardHeader className="bg-gradient-to-br from-pink-50/50 to-purple-50/50 dark:from-pink-950/10 dark:to-purple-950/10">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-pink-100 dark:bg-pink-900/40 rounded-lg">
                                <Bell className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                            </div>
                            <div>
                                <CardTitle>Thông báo nhắc nhở</CardTitle>
                                <CardDescription>Nhận thông báo nhắc nhở qua Email</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="flex items-center space-x-2 p-4 rounded-xl border border-pink-100 bg-pink-50/30 dark:border-pink-900/20 dark:bg-pink-950/20">
                            <Checkbox
                                id="emailNotifications"
                                checked={emailNotifications}
                                onCheckedChange={(checked) => setEmailNotifications(!!checked)}
                            />
                            <div className="grid gap-1.5 leading-none px-2">
                                <label
                                    htmlFor="emailNotifications"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    Bật thông báo qua Email
                                </label>
                                <p className="text-sm text-muted-foreground">
                                    Chúng tôi sẽ gửi nhắc nhở lịch tiêm và khám bệnh trực tiếp đến email của bạn.
                                </p>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/30 dark:border-blue-900/20 dark:bg-blue-950/20 flex gap-3">
                            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-full h-fit">
                                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                                Nhắc nhở sẽ được gửi đến địa chỉ email bạn đã đăng ký tài khoản.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50/50 dark:bg-gray-900/50 border-t py-4">
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Lưu cài đặt
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
