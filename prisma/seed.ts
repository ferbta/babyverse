import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Vietnam vaccination schedule...')

  // Vietnam Ministry of Health Standard Vaccination Schedule
  const vaccinations = [
    {
      name: 'BCG',
      nameVi: 'Lao (BCG)',
      ageWeeks: 1,
      description: 'Bacillus Calmette-Guérin vaccine for tuberculosis',
      required: true,
      order: 1,
    },
    {
      name: 'Hepatitis B (1st dose)',
      nameVi: 'Viêm gan B (mũi 1)',
      ageWeeks: 1,
      description: 'First dose of Hepatitis B vaccine',
      required: true,
      order: 2,
    },
    {
      name: 'Pentavalent (1st dose)',
      nameVi: '5 trong 1 (mũi 1)',
      ageMonths: 2,
      description: 'DPT-HepB-Hib vaccine',
      required: true,
      order: 3,
    },
    {
      name: 'Polio (1st dose)',
      nameVi: 'Bại liệt (mũi 1)',
      ageMonths: 2,
      description: 'Oral polio vaccine',
      required: true,
      order: 4,
    },
    {
      name: 'Pentavalent (2nd dose)',
      nameVi: '5 trong 1 (mũi 2)',
      ageMonths: 3,
      description: 'DPT-HepB-Hib vaccine',
      required: true,
      order: 5,
    },
    {
      name: 'Polio (2nd dose)',
      nameVi: 'Bại liệt (mũi 2)',
      ageMonths: 3,
      description: 'Oral polio vaccine',
      required: true,
      order: 6,
    },
    {
      name: 'Pentavalent (3rd dose)',
      nameVi: '5 trong 1 (mũi 3)',
      ageMonths: 4,
      description: 'DPT-HepB-Hib vaccine',
      required: true,
      order: 7,
    },
    {
      name: 'Polio (3rd dose)',
      nameVi: 'Bại liệt (mũi 3)',
      ageMonths: 4,
      description: 'Oral polio vaccine',
      required: true,
      order: 8,
    },
    {
      name: 'MMR (1st dose)',
      nameVi: 'Sởi - Quai bị - Rubella (mũi 1)',
      ageMonths: 9,
      description: 'Measles, Mumps, Rubella vaccine',
      required: true,
      order: 9,
    },
    {
      name: 'Japanese Encephalitis (1st dose)',
      nameVi: 'Viêm não Nhật Bản (mũi 1)',
      ageMonths: 12,
      description: 'Japanese Encephalitis vaccine',
      required: true,
      order: 10,
    },
    {
      name: 'MMR (2nd dose)',
      nameVi: 'Sởi - Quai bị - Rubella (mũi 2)',
      ageMonths: 18,
      description: 'Measles, Mumps, Rubella vaccine booster',
      required: true,
      order: 11,
    },
    {
      name: 'DPT Booster',
      nameVi: 'Nhắc lại 3 trong 1',
      ageMonths: 18,
      description: 'Diphtheria, Pertussis, Tetanus booster',
      required: true,
      order: 12,
    },
    {
      name: 'Japanese Encephalitis (2nd dose)',
      nameVi: 'Viêm não Nhật Bản (mũi 2)',
      ageMonths: 24,
      description: 'Japanese Encephalitis vaccine booster',
      required: true,
      order: 13,
    },
    {
      name: 'Hepatitis A',
      nameVi: 'Viêm gan A',
      ageMonths: 24,
      description: 'Hepatitis A vaccine',
      required: false,
      order: 14,
    },
    {
      name: 'Varicella',
      nameVi: 'Thủy đậu',
      ageMonths: 12,
      description: 'Chickenpox vaccine',
      required: false,
      order: 15,
    },
    {
      name: 'Pneumococcal',
      nameVi: 'Phế cầu khuẩn',
      ageMonths: 2,
      description: 'Pneumococcal conjugate vaccine',
      required: false,
      order: 16,
    },
    {
      name: 'Rotavirus (1st dose)',
      nameVi: 'Rota virus (mũi 1)',
      ageMonths: 2,
      description: 'Rotavirus vaccine',
      required: false,
      order: 17,
    },
    {
      name: 'Rotavirus (2nd dose)',
      nameVi: 'Rota virus (mũi 2)',
      ageMonths: 4,
      description: 'Rotavirus vaccine',
      required: false,
      order: 18,
    },
  ]

  for (const vaccination of vaccinations) {
    await prisma.vaccinationSchedule.upsert({
      where: { name: vaccination.name }, // This won't work perfectly but helps prevent duplicates
      update: vaccination,
      create: vaccination,
    })
  }

  console.log('✅ Vaccination schedule seeded successfully')
  console.log(`📊 Total vaccines in schedule: ${vaccinations.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
