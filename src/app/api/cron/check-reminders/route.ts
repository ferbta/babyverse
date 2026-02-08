import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export async function GET(req: Request) {
    // Basic security: check for a cron secret if provided
    const authHeader = req.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const now = new Date()

        // Find all reminders that are due and haven't been sent yet
        const pendingReminders = await prisma.reminder.findMany({
            where: {
                reminderDate: {
                    lte: now
                },
                sent: false,
                dismissed: false,
                user: {
                    emailNotifications: true
                }
            },
            include: {
                user: true,
                child: true
            }
        })

        if (pendingReminders.length === 0) {
            return NextResponse.json({ message: 'No pending reminders to send' })
        }

        const results = await Promise.all(pendingReminders.map(async (reminder) => {
            const childName = reminder.child?.name || 'con'
            const dateStr = format(reminder.reminderDate, 'HH:mm dd/MM/yyyy', { locale: vi })

            const html = `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; rounded: 8px;">
                    <h2 style="color: #db2777;">🔔 Nhắc nhở từ BabyVerse</h2>
                    <p>Chào ${reminder.user.name || 'ba mẹ'},</p>
                    <p>Bạn có một nhắc nhở mới cho bé <strong>${childName}</strong>:</p>
                    <div style="background-color: #fce7f3; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; font-size: 18px; font-weight: bold; color: #9d174d;">${reminder.title}</p>
                        <p style="margin: 5px 0 0 0; color: #be185d;">⏰ Thời gian: ${dateStr}</p>
                    </div>
                    <p>Chúc bé yêu luôn khỏe mạnh! ❤️</p>
                    <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #999; text-align: center;">
                        Bạn nhận được email này vì bạn đã bật thông báo trong ứng dụng BabyVerse.
                    </p>
                </div>
            `

            const result = await sendEmail({
                to: reminder.user.email,
                subject: `🔔 Nhắc nhở: ${reminder.title} - BabyVerse`,
                html,
            })

            if (result.success) {
                // Mark as sent
                await prisma.reminder.update({
                    where: { id: reminder.id },
                    data: { sent: true }
                })
            }

            return { id: reminder.id, success: result.success, error: result.error }
        }))

        return NextResponse.json({
            processed: pendingReminders.length,
            results
        })
    } catch (error) {
        console.error('Cron job error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
