export interface HolidayClosureState {
    weekIncluded: Record<string, boolean>
    locationClosedByWeek: Record<string, Record<string, boolean>>
    objectClosedByWeek: Record<string, Record<string, boolean>>
}

export interface HolidayRowData {
    id: string
    name: string
    startDate: string
    endDate: string
    closedObjekteCount: number
    closure?: HolidayClosureState
}

export function newHolidayId(): string {
    return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
}
