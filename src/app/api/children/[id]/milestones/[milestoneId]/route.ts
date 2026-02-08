import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const milestoneSchema = z.object({
    title: z.string().min(1, 'Tiêu đề là bắt buộc'),
    category: z.enum(['physical', 'cognitive', 'social', 'language']).optional().nullable(),
    achievedDate: z.string(),
    notes: z.string().optional().nullable(),
})

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; milestoneId: string }> }
) {
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, milestoneId } = await params

    try {
        const body = await req.json()
        const validatedData = milestoneSchema.parse(body)

        // Verify child ownership
        const child = await prisma.child.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
        })

        if (!child) {
            return NextResponse.json({ error: 'Child not found' }, { status: 404 })
        }

        const milestone = await prisma.milestone.update({
            where: {
                id: milestoneId,
                childId: id,
            },
            data: {
                title: validatedData.title,
                category: validatedData.category,
                achievedDate: new Date(validatedData.achievedDate),
                notes: validatedData.notes,
            },
        })

        return NextResponse.json(milestone)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        console.error('Update milestone error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; milestoneId: string }> }
) {
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, milestoneId } = await params

    try {
        // Verify child ownership
        const child = await prisma.child.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
        })

        if (!child) {
            return NextResponse.json({ error: 'Child not found' }, { status: 404 })
        }

        await prisma.milestone.delete({
            where: {
                id: milestoneId,
                childId: id,
            },
        })

        return NextResponse.json({ message: 'Milestone deleted' })
    } catch (error) {
        console.error('Delete milestone error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
