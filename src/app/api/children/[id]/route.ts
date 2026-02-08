import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const childUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    nickname: z.string().optional(),
    avatar: z.string().optional(),
    bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']).optional(),
    birthWeight: z.number().optional(),
    birthHeight: z.number().optional(),
    birthCondition: z.enum(['natural', 'c-section', 'premature', '']).optional(),
})

// GET single child
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
        }

        const { id } = await params
        const child = await prisma.child.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
            include: {
                vaccinations: {
                    orderBy: { dueDate: 'asc' },
                    take: 5,
                },
                growthRecords: {
                    orderBy: { measureDate: 'desc' },
                    take: 10,
                },
            },
        })

        if (!child) {
            return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
        }

        return NextResponse.json(child)
    } catch (error) {
        console.error('Error fetching child:', error)
        return NextResponse.json(
            { error: 'Không thể tải thông tin' },
            { status: 500 }
        )
    }
}

// PATCH update child
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
        const validatedData = childUpdateSchema.parse(body)

        const child = await prisma.child.updateMany({
            where: {
                id,
                userId: session.user.id,
            },
            data: validatedData,
        })

        if (child.count === 0) {
            return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            )
        }

        console.error('Error updating child:', error)
        return NextResponse.json(
            { error: 'Không thể cập nhật' },
            { status: 500 }
        )
    }
}

// DELETE child (soft delete)
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
        const child = await prisma.child.updateMany({
            where: {
                id,
                userId: session.user.id,
            },
            data: {
                isActive: false,
            },
        })

        if (child.count === 0) {
            return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting child:', error)
        return NextResponse.json(
            { error: 'Không thể xóa' },
            { status: 500 }
        )
    }
}
