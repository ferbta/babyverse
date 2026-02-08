import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateReminderSchema = z.object({
    type: z.enum(['vaccination', 'medical_visit', 'medication', 'birthday', 'milestone']).optional(),
    title: z.string().min(1, 'Tiêu đề là bắt buộc').optional(),
    reminderDate: z.string().optional(),
    dismissed: z.boolean().optional(),
    childId: z.string().optional().nullable(),
    relatedId: z.string().optional().nullable(),
})

// PUT update a reminder
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
        }

        const { id } = await params

        // Verify reminder ownership
        const existingReminder = await prisma.reminder.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
        })

        if (!existingReminder) {
            return NextResponse.json({ error: 'Không tìm thấy nhắc nhở' }, { status: 404 })
        }

        const body = await req.json()
        const validatedData = updateReminderSchema.parse(body)

        const updateData: any = {}
        if (validatedData.type !== undefined) updateData.type = validatedData.type
        if (validatedData.title !== undefined) updateData.title = validatedData.title
        if (validatedData.reminderDate !== undefined) updateData.reminderDate = new Date(validatedData.reminderDate)
        if (validatedData.dismissed !== undefined) updateData.dismissed = validatedData.dismissed
        if (validatedData.childId !== undefined) updateData.childId = validatedData.childId
        if (validatedData.relatedId !== undefined) updateData.relatedId = validatedData.relatedId

        const reminder = await prisma.reminder.update({
            where: { id },
            data: updateData,
            include: {
                child: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        })

        return NextResponse.json(reminder)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            )
        }

        console.error('Error updating reminder:', error)
        return NextResponse.json(
            { error: 'Không thể cập nhật nhắc nhở' },
            { status: 500 }
        )
    }
}

// DELETE a reminder
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
        }

        const { id } = await params

        // Verify reminder ownership
        const existingReminder = await prisma.reminder.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
        })

        if (!existingReminder) {
            return NextResponse.json({ error: 'Không tìm thấy nhắc nhở' }, { status: 404 })
        }

        await prisma.reminder.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting reminder:', error)
        return NextResponse.json(
            { error: 'Không thể xóa nhắc nhở' },
            { status: 500 }
        )
    }
}
