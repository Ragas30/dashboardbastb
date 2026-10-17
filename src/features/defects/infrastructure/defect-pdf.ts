import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import { DEFECT_STATUS_LABELS } from '../domain/defect-status'
import { formatDefectDate } from '../domain/defect-import-rules'
import type { Defect } from '../types/defect-types'

const PAGE_WIDTH = 842
const PAGE_HEIGHT = 595
const MARGIN = 40
const ROW_HEIGHT = 18
const FONT_SIZE = 8
const HEADER_FONT_SIZE = 8

type Column = { header: string; width: number }

const COLUMNS: Column[] = [
  { header: 'No', width: 30 },
  { header: 'Project / Cluster', width: 190 },
  { header: 'Unit', width: 70 },
  { header: 'Total', width: 55 },
  { header: 'PIC', width: 110 },
  { header: 'Status', width: 85 },
  { header: 'Target Repair', width: 95 },
  { header: 'Last Update', width: 95 },
]

export async function buildDefectsPdf(
  defects: Defect[],
  options: { title: string; generatedAt: Date },
): Promise<ArrayBuffer> {
  const document = await PDFDocument.create()
  const font = await document.embedFont(StandardFonts.Helvetica)
  const boldFont = await document.embedFont(StandardFonts.HelveticaBold)
  const contentWidth = COLUMNS.reduce((total, column) => total + column.width, 0)

  let page = document.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  let cursorY = PAGE_HEIGHT - MARGIN

  page.drawText(safeText(options.title), {
    x: MARGIN,
    y: cursorY - 10,
    size: 14,
    font: boldFont,
    color: rgb(0.1, 0.12, 0.16),
  })
  cursorY -= 24
  page.drawText(safeText(`Dicetak: ${formatDateTime(options.generatedAt)}`), {
    x: MARGIN,
    y: cursorY - 10,
    size: FONT_SIZE,
    font,
    color: rgb(0.4, 0.44, 0.5),
  })
  cursorY -= 22

  const drawHeaderRow = (target: PDFPage, y: number) => {
    let x = MARGIN
    for (const column of COLUMNS) {
      target.drawText(safeText(column.header), {
        x,
        y: y - 12,
        size: HEADER_FONT_SIZE,
        font: boldFont,
        color: rgb(0.2, 0.24, 0.3),
      })
      x += column.width
    }
    target.drawLine({
      start: { x: MARGIN, y: y - 16 },
      end: { x: MARGIN + contentWidth, y: y - 16 },
      thickness: 0.8,
      color: rgb(0.75, 0.78, 0.82),
    })
  }

  drawHeaderRow(page, cursorY)
  cursorY -= ROW_HEIGHT + 4

  defects.forEach((defect, index) => {
    if (cursorY - ROW_HEIGHT < MARGIN) {
      page = document.addPage([PAGE_WIDTH, PAGE_HEIGHT])
      cursorY = PAGE_HEIGHT - MARGIN
      drawHeaderRow(page, cursorY)
      cursorY -= ROW_HEIGHT + 4
    }

    const values = [
      String(index + 1),
      defect.projectCluster,
      defect.unit,
      String(defect.totalDefect),
      defect.pic?.name ?? '',
      DEFECT_STATUS_LABELS[defect.status],
      formatDefectDate(defect.targetRepair),
      formatDefectDate(defect.updatedAt),
    ]

    let x = MARGIN
    values.forEach((value, columnIndex) => {
      const column = COLUMNS[columnIndex]
      page.drawText(truncate(safeText(value), font, FONT_SIZE, column.width - 6), {
        x,
        y: cursorY - 12,
        size: FONT_SIZE,
        font,
        color: rgb(0.15, 0.18, 0.22),
      })
      x += column.width
    })

    page.drawLine({
      start: { x: MARGIN, y: cursorY - 16 },
      end: { x: MARGIN + contentWidth, y: cursorY - 16 },
      thickness: 0.3,
      color: rgb(0.9, 0.91, 0.93),
    })
    cursorY -= ROW_HEIGHT
  })

  if (defects.length === 0) {
    page.drawText('Belum ada data defect.', {
      x: MARGIN,
      y: cursorY - 12,
      size: FONT_SIZE + 1,
      font,
      color: rgb(0.4, 0.44, 0.5),
    })
  }

  const saved = await document.save()
  const copy = new Uint8Array(saved.byteLength)
  copy.set(saved)
  return copy.buffer
}

function formatDateTime(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function safeText(value: string): string {
  return Array.from(value)
    .filter((char) => {
      const code = char.codePointAt(0) ?? 0
      return code >= 32 && code <= 255
    })
    .join('')
}

function truncate(value: string, font: PDFFont, size: number, maxWidth: number): string {
  if (font.widthOfTextAtSize(value, size) <= maxWidth) return value
  let result = value
  while (result.length > 1 && font.widthOfTextAtSize(`${result}...`, size) > maxWidth) {
    result = result.slice(0, -1)
  }
  return `${result}...`
}
