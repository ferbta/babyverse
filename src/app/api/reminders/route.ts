import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const reminderSchema = z.object({
    type: z.enum(['vaccination', 'medical_visit', 'medication', 'birthday', 'milestone']),
    title: z.string().min(1, 'Tiêu đề là bắt buộc'),
    reminderDate: z.string(),
    childId: z.string().optional().nullable(),
    relatedId: z.string().optional().nullable(),
})

// GET all reminders for the logged-in user
export async function GET(req: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const childId = searchParams.get('childId')
        const showDismissed = searchParams.get('showDismissed') === 'true'

        const where: any = {
            userId: session.user.id,
        }

        if (childId) {
            where.childId = childId
        }

        if (!showDismissed) {
            where.dismissed = false
        }

        const reminders = await prisma.reminder.findMany({
            where,
            orderBy: {
                reminderDate: 'asc',
            },
            include: {
                child: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        })

        return NextResponse.json(reminders)
    } catch (error) {
        console.error('Error fetching reminders:', error)
        return NextResponse.json(
            { error: 'Không thể tải dữ liệu nhắc nhở' },
            { status: 500 }
        )
    }
}

// POST create a new reminder
export async function POST(req: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
        }

        const body = await req.json()
        const validatedData = reminderSchema.parse(body)

        const reminder = await prisma.reminder.create({
            data: {
                userId: session.user.id,
                type: validatedData.type,
                title: validatedData.title,
                reminderDate: new Date(validatedData.reminderDate),
                childId: validatedData.childId || null,
                relatedId: validatedData.relatedId || null,
            },
            include: {
                child: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        })

        return NextResponse.json(reminder, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            )
        }

        console.error('Error creating reminder:', error)
        return NextResponse.json(
            { error: 'Không thể thêm nhắc nhở' },
            { status: 500 }
        )
    }
}
