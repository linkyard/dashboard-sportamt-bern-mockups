import dayjs, {type Dayjs} from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"

dayjs.extend(customParseFormat)

/** Renders date string in Swiss table locale (`dd.mm.yyyy`). */
export function formatDateSwiss(iso: string): string {
    const d = dayjs(iso)
    return d.isValid() ? d.format("DD.MM.YYYY") : iso
}

/** Parses ISO date strings for MUI `DatePicker` / dayjs. */
export function parseIsoToDayjs(iso: string): Dayjs | null {
    const d = dayjs(iso)
    return d.isValid() ? d : null
}

/** Strict ISO date parse (`YYYY-MM-DD`) to numeric date parts. */
export function parseIsoDateParts(iso: string): {y: number; m: number; d: number} | null {
    const parsed = dayjs(iso.trim(), "YYYY-MM-DD", true)
    if (!parsed.isValid()) {
        return null
    }
    return {
        y: parsed.year(),
        m: parsed.month() + 1,
        d: parsed.date(),
    }
}

/** Formats a local Date instance to strict ISO (`YYYY-MM-DD`). */
export function formatIsoDateLocal(date: Date): string {
    return dayjs(date).format("YYYY-MM-DD")
}

/** Formats ISO date to German short style (`dd.mm.`). */
export function formatDateDeShort(iso: string): string {
    const parsed = dayjs(iso.trim(), "YYYY-MM-DD", true)
    return parsed.isValid() ? parsed.format("DD.MM.") : iso
}

/** Formats ISO date to German full style (`dd.mm.yyyy`). */
export function formatDateDeFull(iso: string): string {
    const parsed = dayjs(iso.trim(), "YYYY-MM-DD", true)
    return parsed.isValid() ? parsed.format("DD.MM.YYYY") : iso
}
