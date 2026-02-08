import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const nutritionLogSchema = z.object({
    feedingDate: z.string(),
    type: z.enum(['breastfeeding', 'formula', 'solid', 'snack', 'water']),
    foodItems: z.string().optional().nullable(),
    amount: z.number().optional().nullable(),
    unit: z.enum(['ml', 'oz', 'g', 'serving']).optional().nullable(),
    notes: z.string().optional().nullable(),
})

// GET all nutrition logs for a specific child
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

        // Verify child ownership
        const child = await prisma.child.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
        })

        if (!child) {
            return NextResponse.json({ error: 'Không tìm thấy trẻ' }, { status: 404 })
        }

        const nutritionLogs = await prisma.feedingLog.findMany({
            where: {
                childId: id,
            },
            orderBy: {
                feedingDate: 'desc',
            },
        })

        return NextResponse.json(nutritionLogs)
    } catch (error) {
        console.error('Error fetching nutrition logs:', error)
        return NextResponse.json(
            { error: 'Không thể tải dữ liệu dinh dưỡng' },
            { status: 500 }
        )
    }
}

// POST create a new nutrition log
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
        }

        const { id } = await params

        // Verify child ownership
        const child = await prisma.child.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
        })

        if (!child) {
            return NextResponse.json({ error: 'Không tìm thấy trẻ' }, { status: 404 })
        }

        const body = await req.json()
        const validatedData = nutritionLogSchema.parse(body)

        const nutritionLog = await prisma.feedingLog.create({
            data: {
                childId: id,
                feedingDate: new Date(validatedData.feedingDate),
                type: validatedData.type,
                foodItems: validatedData.foodItems,
                amount: validatedData.amount,
                unit: validatedData.unit,
                notes: validatedData.notes,
            },
        })

        return NextResponse.json(nutritionLog, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            )
        }

        console.error('Error creating nutrition log:', error)
        return NextResponse.json(
            { error: 'Không thể thêm dữ liệu dinh dưỡng' },
            { status: 500 }
        )
    }
}
