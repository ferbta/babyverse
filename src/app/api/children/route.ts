import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const childSchema = z.object({
    name: z.string().min(1, 'Tên bé là bắt buộc'),
    nickname: z.string().optional(),
    birthDate: z.string(),
    gender: z.enum(['male', 'female', 'other']),
    bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']).optional(),
    birthWeight: z.number().optional(),
    birthHeight: z.number().optional(),
    birthCondition: z.enum(['natural', 'c-section', 'premature', '']).optional(),
})

// GET all children for current user
export async function GET(req: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
        }

        const children = await prisma.child.findMany({
            where: {
                userId: session.user.id,
                isActive: true,
            },
            orderBy: {
                birthDate: 'desc',
            },
        })

        return NextResponse.json(children)
    } catch (error) {
        console.error('Error fetching children:', error)
        return NextResponse.json(
            { error: 'Không thể tải danh sách con' },
            { status: 500 }
        )
    }
}

// POST create a new child
export async function POST(req: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
        }

        const body = await req.json()
        const validatedData = childSchema.parse(body)

        const child = await prisma.child.create({
            data: {
                userId: session.user.id,
                name: validatedData.name,
                nickname: validatedData.nickname || null,
                birthDate: new Date(validatedData.birthDate),
                gender: validatedData.gender,
                bloodType: validatedData.bloodType || null,
                birthWeight: validatedData.birthWeight || null,
                birthHeight: validatedData.birthHeight || null,
                birthCondition: validatedData.birthCondition || null,
            },
        })

        return NextResponse.json(child, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            )
        }

        console.error('Error creating child:', error)
        return NextResponse.json(
            { error: 'Không thể tạo hồ sơ con' },
            { status: 500 }
        )
    }
}
