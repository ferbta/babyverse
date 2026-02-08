import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const settingsSchema = z.object({
    emailNotifications: z.boolean().optional(),
})

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                emailNotifications: true,
            },
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error('Fetch settings error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const validatedData = settingsSchema.parse(body)

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: validatedData,
        })

        return NextResponse.json({
            emailNotifications: user.emailNotifications,
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
        }
        console.error('Update settings error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
