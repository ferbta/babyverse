import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const vaccinationSchema = z.object({
    childId: z.string(),
    scheduleId: z.string().optional(),
    name: z.string().min(1, 'Tên vắc xin là bắt buộc'),
    dueDate: z.string(),
    status: z.enum(['pending', 'completed', 'overdue', 'skipped']),
    location: z.string().optional(),
    notes: z.string().optional(),
})

// GET vaccinations for a child
export async function GET(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const childId = searchParams.get('childId')

        if (!childId) {
            return NextResponse.json({ error: 'Thiếu ID của bé' }, { status: 400 })
        }

        // Verify child belongs to user
        const child = await prisma.child.findFirst({
            where: {
                id: childId,
                userId: session.user.id,
                isActive: true,
            },
        })

        if (!child) {
            return NextResponse.json({ error: 'Không tìm thấy thông tin bé' }, { status: 404 })
        }

        // Fetch existing vaccinations
        let vaccinations = await prisma.vaccination.findMany({
            where: { childId },
            include: { schedule: true },
            orderBy: { dueDate: 'asc' },
        })

        // If no vaccinations, generate from schedule
        if (vaccinations.length === 0) {
            const schedule = await prisma.vaccinationSchedule.findMany({
                orderBy: { order: 'asc' },
            })

            const newVaccinations = schedule.map((item) => {
                const dueDate = new Date(child.birthDate)
                if (item.ageMonths) {
                    dueDate.setMonth(dueDate.getMonth() + item.ageMonths)
                } else if (item.ageWeeks) {
                    dueDate.setDate(dueDate.getDate() + item.ageWeeks * 7)
                }

                return {
                    childId: childId,
                    scheduleId: item.id,
                    name: item.nameVi,
                    dueDate: dueDate,
                    status: 'pending' as const,
                }
            })

            if (newVaccinations.length > 0) {
                await prisma.vaccination.createMany({
                    data: newVaccinations,
                })
            }

            vaccinations = await prisma.vaccination.findMany({
                where: { childId },
                include: { schedule: true },
                orderBy: { dueDate: 'asc' },
            })
        }

        return NextResponse.json(vaccinations)
    } catch (error) {
        console.error('Error fetching vaccinations:', error)
        return NextResponse.json(
            { error: 'Không thể tải danh sách tiêm chủng' },
            { status: 500 }
        )
    }
}

// POST add custom vaccination
export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
        }

        const body = await req.json()
        const validatedData = vaccinationSchema.parse(body)

        // Verify child belongs to user
        const child = await prisma.child.findFirst({
            where: {
                id: validatedData.childId,
                userId: session.user.id,
                isActive: true,
            },
        })

        if (!child) {
            return NextResponse.json({ error: 'Không tìm thấy thông tin bé' }, { status: 404 })
        }

        const vaccination = await prisma.vaccination.create({
            data: {
                childId: validatedData.childId,
                scheduleId: validatedData.scheduleId || null,
                name: validatedData.name,
                dueDate: new Date(validatedData.dueDate),
                status: validatedData.status,
                location: validatedData.location || null,
                notes: validatedData.notes || null,
            },
        })

        return NextResponse.json(vaccination, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            )
        }

        console.error('Error creating vaccination:', error)
        return NextResponse.json(
            { error: 'Không thể tạo bản ghi tiêm chủng' },
            { status: 500 }
        )
    }
}
