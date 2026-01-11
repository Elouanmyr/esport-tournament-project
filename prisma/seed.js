import prisma from '../src/config/prisma.js'
import { hashPassword } from '../src/utils/cryptoHelper.js'

async function main() {
  console.log('Nettoyage de la base de données...')
  await prisma.registration.deleteMany()
  await prisma.tournament.deleteMany()
  await prisma.team.deleteMany()
  await prisma.user.deleteMany()

  // MDP sécurisé 
  const hashedPassword = await hashPassword('P@ssw0rd123')

  console.log('Création des utilisateur par défaut...')
  const admin = await prisma.user.create({
    data: {
      username: 'admin_esport',
      email: 'admin@esport.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  const organizer = await prisma.user.create({
    data: {
      username: 'organizer_pro',
      email: 'org@esport.com',
      password: hashedPassword,
      role: 'ORGANIZER',
    },
  })

  console.log('Création d\'un tournoi de test...')
  await prisma.tournament.create({
    data: {
      name: 'Masters Valorant 2025',
      game: 'Valorant',
      format: 'TEAM',
      maxParticipants: 16,
      prizePool: 5000,
      startDate: new Date('2025-12-01T10:00:00Z'),
      status: 'OPEN',
      organizerId: organizer.id,
    },
  })

  console.log('Seed terminé avec succès !')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })