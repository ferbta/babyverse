import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const growthRecordSchema = z.object({
    measureDate: z.string(),
    weight: z.number().optional().nullable(),
    height: z.number().optional().nullable(),
    headCircumference: z.number().optional().nullable(),
    notes: z.string().optional().nullable(),
})

// GET all growth records for a specific child
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

        const growthRecords = await prisma.growthRecord.findMany({
            where: {
                childId: id,
            },
            orderBy: {
                measureDate: 'asc',
            },
        })

        return NextResponse.json(growthRecords)
    } catch (error) {
        console.error('Error fetching growth records:', error)
        return NextResponse.json(
            { error: 'Không thể tải dữ liệu tăng trưởng' },
            { status: 500 }
        )
    }
}

// POST create a new growth record
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
        const validatedData = growthRecordSchema.parse(body)

        const growthRecord = await prisma.growthRecord.create({
            data: {
                childId: id,
                measureDate: new Date(validatedData.measureDate),
                weight: validatedData.weight,
                height: validatedData.height,
                headCircumference: validatedData.headCircumference,
                notes: validatedData.notes,
            },
        })

        return NextResponse.json(growthRecord, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            )
        }

        console.error('Error creating growth record:', error)
        return NextResponse.json(
            { error: 'Không thể thêm dữ liệu tăng trưởng' },
            { status: 500 }
        )
    }
}
