import dayjs, {type Dayjs} from "dayjs"

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
