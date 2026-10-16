import { Badge, type BadgeTone } from '@/components/ui/badge'
import type { DefectStatus } from '@/features/defects/domain/defect-status'
import { DEFECT_STATUS_LABELS } from './defect-status-labels'

const tones: Record<DefectStatus, BadgeTone> = {
  OPEN: 'warning',
  ON_PROGRESS: 'info',
  COMPLETED: 'success',
}

export function DefectStatusBadge({ status }: { status: DefectStatus }) {
  return <Badge tone={tones[status]}>{DEFECT_STATUS_LABELS[status]}</Badge>
}
