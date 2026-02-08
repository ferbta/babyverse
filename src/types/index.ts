import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    interface Session {
        user: {
            id: string
        } & DefaultSession['user']
    }

    interface User {
        id: string
    }

    interface JWT {
        id: string
    }
}

// Child types
export type Child = {
    id: string
    userId: string
    name: string
    nickname?: string | null
    avatar?: string | null
    birthDate: Date
    gender: string
    bloodType?: string | null
    birthWeight?: number | null
    birthHeight?: number | null
    birthCondition?: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

// Vaccination types
export type VaccinationStatus = 'pending' | 'completed' | 'overdue' | 'skipped'

export type Vaccination = {
    id: string
    childId: string
    scheduleId?: string | null
    name?: string | null
    dueDate: Date
    completedDate?: Date | null
    status: VaccinationStatus
    location?: string | null
    notes?: string | null
    reactions?: string | null
    createdAt: Date
    updatedAt: Date
}

// Growth types
export type GrowthRecord = {
    id: string
    childId: string
    measureDate: Date
    height?: number | null
    weight?: number | null
    headCircumference?: number | null
    notes?: string | null
    createdAt: Date
}

// Medical types
export type MedicalVisit = {
    id: string
    childId: string
    visitDate: Date
    hospital?: string | null
    doctor?: string | null
    diagnosis?: string | null
    notes?: string | null
    createdAt: Date
    updatedAt: Date
}

// Nutrition types
export type FeedingType = 'breastfeeding' | 'formula' | 'solid' | 'snack' | 'water'

export type NutritionLog = {
    id: string
    childId: string
    feedingDate: Date
    type: string
    foodItems?: string | null
    amount?: number | null
    unit?: string | null
    notes?: string | null
    createdAt: Date
}

// Reminder types
export type ReminderType = 'vaccination' | 'medical_visit' | 'medication' | 'birthday' | 'milestone'

export type Reminder = {
    id: string
    userId: string
    childId?: string | null
    type: string
    title: string
    reminderDate: Date
    sent: boolean
    dismissed: boolean
    relatedId?: string | null
    createdAt: Date
}


