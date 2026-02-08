import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const childId = searchParams.get('childId')

        // Get all active children for this user
        const whereChild: any = {
            userId: session.user.id,
            isActive: true,
        }

        if (childId) {
            whereChild.id = childId
        }

        const children = await prisma.child.findMany({
            where: whereChild,
        })

        if (children.length === 0) {
            return NextResponse.json({
                message: 'Không có thông tin bé',
                created: 0
            })
        }

        // Get all pending vaccinations for these children
        const vaccinations = await prisma.vaccination.findMany({
            where: {
                childId: { in: children.map(c => c.id) },
                status: 'pending',
            },
            include: {
                schedule: true,
            },
        })

        if (vaccinations.length === 0) {
            return NextResponse.json({
                message: 'Không có lịch tiêm chủng nào đang chờ',
                created: 0
            })
        }

        // Get existing reminders to avoid duplicates
        const existingReminders = await prisma.reminder.findMany({
            where: {
                userId: session.user.id,
                type: 'vaccination',
                relatedId: { in: vaccinations.map(v => v.id) },
            },
        })

        const existingRelatedIds = new Set(
            existingReminders.map(r => r.relatedId).filter(Boolean)
        )

        // Filter out vaccinations that already have reminders
        const vaccinationsToSync = vaccinations.filter(
            v => !existingRelatedIds.has(v.id)
        )

        if (vaccinationsToSync.length === 0) {
            return NextResponse.json({
                message: 'Tất cả lịch tiêm đã có nhắc nhở',
                created: 0
            })
        }

        // Create reminders for vaccinations without reminders
        const remindersToCreate = vaccinationsToSync.map(vaccination => {
            // Set reminder date to 3 days before vaccination due date
            const reminderDate = new Date(vaccination.dueDate)
            reminderDate.setDate(reminderDate.getDate() - 3)

            const vaccineName = vaccination.name || vaccination.schedule?.nameVi || 'Tiêm chủng'

            return {
                userId: session.user.id,
                childId: vaccination.childId,
                type: 'vaccination',
                title: `Tiêm chủng: ${vaccineName}`,
                reminderDate: reminderDate,
                relatedId: vaccination.id,
                sent: false,
                dismissed: false,
            }
        })

        // Bulk create reminders
        await prisma.reminder.createMany({
            data: remindersToCreate,
        })

        return NextResponse.json({
            message: `Đã tạo ${remindersToCreate.length} nhắc nhở tiêm chủng`,
            created: remindersToCreate.length
        })
    } catch (error) {
        console.error('Error syncing vaccinations:', error)
        return NextResponse.json(
            { error: 'Không thể đồng bộ lịch tiêm' },
            { status: 500 }
        )
    }
}
