import type { ReactNode } from 'react'
import type { Defect } from '@/features/defects/types/defect-types'
import { DefectStatusBadge } from '@/components/shared/defect-status-badge'

function DetailField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-slate-700">{children}</dd>
    </div>
  )
}

export function DefectDetail({ defect }: { defect: Defect }) {
  return (
    <dl className="grid gap-5 sm:grid-cols-2">
      <DetailField label="Project / Cluster">{defect.projectCluster}</DetailField>
      <DetailField label="Unit">{defect.unit}</DetailField>
      <DetailField label="Tanggal">{defect.defectDate.toLocaleDateString('id-ID')}</DetailField>
      <DetailField label="Total Defect">{defect.totalDefect}</DetailField>
      <DetailField label="PIC">{defect.pic?.name ?? '-'}</DetailField>
      <DetailField label="Status"><DefectStatusBadge status={defect.status} /></DetailField>
      <DetailField label="Target Repair">{defect.targetRepair.toLocaleDateString('id-ID')}</DetailField>
      <DetailField label="Last Update">{defect.updatedAt.toLocaleString('id-ID')}</DetailField>
    </dl>
  )
}
