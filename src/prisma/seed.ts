import { PrismaClient, PicStatus, DefectStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.defect.deleteMany()
  await prisma.masterPic.deleteMany()

  const andi = await prisma.masterPic.create({ data: { name: 'Andi', status: PicStatus.ACTIVE } })
  const budi = await prisma.masterPic.create({ data: { name: 'Budi', status: PicStatus.ACTIVE } })

  await prisma.defect.createMany({
    data: [
      {
        projectCluster: 'Cluster A',
        unit: 'A-01',
        defectDate: new Date('2026-10-07'),
        totalDefect: 5,
        picId: andi.id,
        targetRepair: new Date('2026-10-10'),
        status: DefectStatus.ON_PROGRESS,
      },
      {
        projectCluster: 'Cluster A',
        unit: 'A-02',
        defectDate: new Date('2026-10-07'),
        totalDefect: 3,
        picId: budi.id,
        targetRepair: new Date('2026-10-11'),
        status: DefectStatus.OPEN,
      },
    ],
  })
}

main()
  .then(async () => { await prisma.() })
  .catch(async (e) => { console.error(e); await prisma.(); process.exit(1) })
