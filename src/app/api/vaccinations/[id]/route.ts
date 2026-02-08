import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const updateSchema = z.object({
    name: z.string().optional(),
    completedDate: z.string().optional().nullable(),
    status: z.enum(['pending', 'completed', 'overdue', 'skipped']).optional(),
    location: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    reactions: z.string().optional().nullable(),
})

// PATCH update vaccination record
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
        }

        const { id } = await params
        const body = await req.json()
        const validatedData = updateSchema.parse(body)

        // Find vaccination and verify ownership through child
        const vaccination = await prisma.vaccination.findUnique({
            where: { id },
            include: { child: true },
        })

        if (!vaccination || vaccination.child.userId !== session.user.id) {
            return NextResponse.json({ error: 'Không tìm thấy bản ghi tiêm chủng' }, { status: 404 })
        }

        const updatedVaccination = await prisma.vaccination.update({
            where: { id },
            data: {
                name: validatedData.name,
                completedDate: validatedData.completedDate ? new Date(validatedData.completedDate) : (validatedData.completedDate === null ? null : undefined),
                status: validatedData.status,
                location: validatedData.location,
                notes: validatedData.notes,
                reactions: validatedData.reactions,
            },
        })

        return NextResponse.json(updatedVaccination)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            )
        }

        console.error('Error updating vaccination:', error)
        return NextResponse.json(
            { error: 'Không thể cập nhật bản ghi tiêm chủng' },
            { status: 500 }
        )
    }
}

// DELETE vaccination record (only for custom ones or all?)
// Usually we don't delete standard ones, but maybe allow delete if custom
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

        // Find vaccination and verify ownership
        const vaccination = await prisma.vaccination.findUnique({
            where: { id },
            include: { child: true },
        })

        if (!vaccination || vaccination.child.userId !== session.user.id) {
            return NextResponse.json({ error: 'Không tìm thấy bản ghi tiêm chủng' }, { status: 404 })
        }

        await prisma.vaccination.delete({
            where: { id },
        })

        return NextResponse.json({ message: 'Đã xóa bản ghi tiêm chủng' })
    } catch (error) {
        console.error('Error deleting vaccination:', error)
        return NextResponse.json(
            { error: 'Không thể xóa bản ghi tiêm chủng' },
            { status: 500 }
        )
    }
}
