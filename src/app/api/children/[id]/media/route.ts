import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

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

        const media = await prisma.media.findMany({
            where: {
                childId: id,
                relatedType: 'general' // Only fetch general gallery photos
            },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json(media)
    } catch (error) {
        console.error('Fetch media error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    try {
        const body = await req.json()
        const { imageData, caption, takenDate } = body

        if (!imageData) {
            return NextResponse.json({ error: 'Image data is required' }, { status: 400 })
        }

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

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(imageData, {
            folder: `babyverse/${id}`,
            resource_type: 'image',
        })

        // Save to database
        const media = await prisma.media.create({
            data: {
                childId: id,
                url: uploadResponse.secure_url,
                publicId: uploadResponse.public_id,
                type: 'image',
                caption: caption || null,
                takenDate: takenDate ? new Date(takenDate) : null,
                relatedType: 'general',
            },
        })

        return NextResponse.json(media)
    } catch (error) {
        console.error('Upload media error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
