import dayjs, {type Dayjs} from "dayjs"
import "dayjs/locale/de"

/** Renders date string in Swiss table locale (`dd.mm.yyyy`). */
export function formatDateSwiss(iso: string): string {
    const d = dayjs(iso)
    return d.isValid() ? d.format("DD.MM.YYYY") : iso
}

/** Full weekday + Swiss numeric date (e.g. `Montag, 06.07.2026`). */
export function formatDateSwissLongWeekday(iso: string): string {
    const d = dayjs(iso).locale("de")
    return d.isValid() ? d.format("dddd, DD.MM.YYYY") : iso
}

/** Parses ISO date strings for MUI `DatePicker` / dayjs. */
export function parseIsoToDayjs(iso: string): Dayjs | null {
    const d = dayjs(iso)
    return d.isValid() ? d : null
}
