import type {HolidayClosureState, HolidayRowData} from "./ferien-types"
import type {LocationRowData} from "../locations/locations-types"

const SPORTAMT_ACCENT = "#d7e054"

export {SPORTAMT_ACCENT}

export function parseIsoDateParts(iso: string): {y: number; m: number; d: number} | null {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim())
    if (!m) {
        return null
    }
    const y = Number(m[1])
    const mo = Number(m[2])
    const d = Number(m[3])
    if (!y || mo < 1 || mo > 12 || d < 1 || d > 31) {
        return null
    }
    return {y, m: mo, d}
}

function toIsoLocal(d: Date): string {
    const y = d.getFullYear()
    const mo = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${mo}-${day}`
}

/** Seven-day blocks from holiday start through end (matches “Woche 1 (06.07–12.07)” style). */
export function splitIntoFerienwochen(startIso: string, endIso: string): {id: string; startDate: string; endDate: string}[] {
    const ps = parseIsoDateParts(startIso)
    const pe = parseIsoDateParts(endIso)
    if (!ps || !pe) {
        return []
    }
    const holidayEnd = new Date(pe.y, pe.m - 1, pe.d)
    const weeks: {id: string; startDate: string; endDate: string}[] = []
    let weekStart = new Date(ps.y, ps.m - 1, ps.d)
    let i = 0
    while (weekStart <= holidayEnd) {
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekEnd.getDate() + 6)
        if (weekEnd > holidayEnd) {
            weekEnd.setTime(holidayEnd.getTime())
        }
        weeks.push({
            id: `w-${i}`,
            startDate: toIsoLocal(weekStart),
            endDate: toIsoLocal(weekEnd),
        })
        weekStart = new Date(weekStart)
        weekStart.setDate(weekStart.getDate() + 7)
        i++
    }
    return weeks
}

export function formatDeShort(iso: string): string {
    const p = parseIsoDateParts(iso)
    if (!p) {
        return iso
    }
    return `${String(p.d).padStart(2, "0")}.${String(p.m).padStart(2, "0")}.`
}

export function formatDeDateFull(iso: string): string {
    const p = parseIsoDateParts(iso)
    if (!p) {
        return iso
    }
    return `${String(p.d).padStart(2, "0")}.${String(p.m).padStart(2, "0")}.${p.y}`
}

function activeWeekIds(closure: HolidayClosureState): string[] {
    return Object.entries(closure.weekIncluded)
        .filter(([, inc]) => inc)
        .map(([id]) => id)
}

export function computeClosedObjekteCount(locations: LocationRowData[], closure: HolidayClosureState): number {
    const weeks = activeWeekIds(closure)
    if (weeks.length === 0) {
        return 0
    }
    let n = 0
    for (const loc of locations) {
        for (const obj of loc.subRows) {
            const byW = closure.objectClosedByWeek[obj.id] ?? {}
            if (weeks.every((w) => byW[w] === true)) {
                n++
            }
        }
    }
    return n
}

function emptyWeekMap(weekIds: string[], value: boolean): Record<string, boolean> {
    const o: Record<string, boolean> = {}
    for (const id of weekIds) {
        o[id] = value
    }
    return o
}

export function buildDefaultClosure(locations: LocationRowData[], startIso: string, endIso: string): HolidayClosureState {
    const weekMetas = splitIntoFerienwochen(startIso, endIso)
    const weekIds = weekMetas.map((w) => w.id)
    const weekIncluded: Record<string, boolean> = {}
    for (const id of weekIds) {
        weekIncluded[id] = false
    }

    const locationClosedByWeek: Record<string, Record<string, boolean>> = {}
    const objectClosedByWeek: Record<string, Record<string, boolean>> = {}

    for (const loc of locations) {
        locationClosedByWeek[loc.id] = emptyWeekMap(weekIds, false)
        for (const obj of loc.subRows) {
            objectClosedByWeek[obj.id] = emptyWeekMap(weekIds, false)
        }
    }

    return {
        weekIncluded,
        locationClosedByWeek,
        objectClosedByWeek,
    }
}

/** Sets Ferien-week inclusion and syncs every Standort / Objekt cell for that column (week column header). */
export function setWeekIncludedWithColumnCascade(
    closure: HolidayClosureState,
    locations: LocationRowData[],
    weekId: string,
    included: boolean
): HolidayClosureState {
    const geschlossen = included
    let locationClosedByWeek = {...closure.locationClosedByWeek}
    let objectClosedByWeek = {...closure.objectClosedByWeek}

    for (const loc of locations) {
        locationClosedByWeek = {
            ...locationClosedByWeek,
            [loc.id]: {...(locationClosedByWeek[loc.id] ?? {}), [weekId]: geschlossen},
        }
        for (const obj of loc.subRows) {
            objectClosedByWeek = {
                ...objectClosedByWeek,
                [obj.id]: {...(objectClosedByWeek[obj.id] ?? {}), [weekId]: geschlossen},
            }
        }
    }

    return {
        ...closure,
        weekIncluded: {...closure.weekIncluded, [weekId]: included},
        locationClosedByWeek,
        objectClosedByWeek,
    }
}

/** Every geschlossen cell in the Ferien-week column (Standort rows + Objekte). */
function gatherWeekColumnClosedValues(closure: HolidayClosureState, locations: LocationRowData[], weekId: string): boolean[] {
    const vals: boolean[] = []
    for (const loc of locations) {
        vals.push(closure.locationClosedByWeek[loc.id]?.[weekId] ?? false)
        for (const obj of loc.subRows) {
            vals.push(closure.objectClosedByWeek[obj.id]?.[weekId] ?? false)
        }
    }
    return vals
}

/**
 * Week-column / week-list checkbox: unchecked when Ferien week is excluded; otherwise
 * matches “all geschlossen”; indeterminate when the week counts but closures differ per cell.
 */
export function aggregateWeekColumnForAllEntities(
    closure: HolidayClosureState,
    locations: LocationRowData[],
    weekId: string
): {checked: boolean; indeterminate: boolean} {
    const included = closure.weekIncluded[weekId] ?? false
    if (!included) {
        return {checked: false, indeterminate: false}
    }

    const vals = gatherWeekColumnClosedValues(closure, locations, weekId)
    if (vals.length === 0) {
        return {checked: false, indeterminate: false}
    }

    const allOn = vals.every(Boolean)
    const allOff = vals.every((v) => !v)
    if (allOn) {
        return {checked: true, indeterminate: false}
    }
    if (allOff) {
        return {checked: false, indeterminate: false}
    }
    return {checked: false, indeterminate: true}
}

/**
 * Cycle the week Ferien/header checkbox after click: exclude week ↔︎ unify column ↔︎ all geschlossen.
 */
export function cycleWeekColumnHeader(
    closure: HolidayClosureState,
    locations: LocationRowData[],
    weekId: string
): HolidayClosureState {
    const included = closure.weekIncluded[weekId] ?? false
    const vals = gatherWeekColumnClosedValues(closure, locations, weekId)

    if (!included) {
        return setWeekIncludedWithColumnCascade(closure, locations, weekId, true)
    }

    const allGeschlossen = vals.length > 0 && vals.every(Boolean)
    if (allGeschlossen) {
        return setWeekIncludedWithColumnCascade(closure, locations, weekId, false)
    }

    return setWeekIncludedWithColumnCascade(closure, locations, weekId, true)
}

export function ensureHolidayClosure(holiday: HolidayRowData, locations: LocationRowData[]): HolidayRowData {
    if (holiday.closure) {
        return holiday
    }
    const closure = buildDefaultClosure(locations, holiday.startDate, holiday.endDate)
    return {
        ...holiday,
        closure,
        closedObjekteCount: computeClosedObjekteCount(locations, closure),
    }
}

/** When start/end change, rebuild week ids and carry over overlapping indices where possible. */
export function rebuildClosureForNewRange(
    prev: HolidayClosureState,
    locations: LocationRowData[],
    startIso: string,
    endIso: string
): HolidayClosureState {
    const weekMetas = splitIntoFerienwochen(startIso, endIso)
    const weekIds = weekMetas.map((w) => w.id)
    const oldIds = Object.keys(prev.weekIncluded).sort()

    const weekIncluded: Record<string, boolean> = {}
    for (let i = 0; i < weekIds.length; i++) {
        const oid = oldIds[i]
        weekIncluded[weekIds[i]] = oid !== undefined ? (prev.weekIncluded[oid] ?? false) : false
    }

    const migrateMap = (oldMap: Record<string, Record<string, boolean>>): Record<string, Record<string, boolean>> => {
        const next: Record<string, Record<string, boolean>> = {}
        for (const entityId of Object.keys(oldMap)) {
            const row: Record<string, boolean> = {}
            for (let i = 0; i < weekIds.length; i++) {
                const oid = oldIds[i]
                const prevVal = oid !== undefined ? oldMap[entityId]?.[oid] : undefined
                row[weekIds[i]] = prevVal !== undefined ? prevVal : false
            }
            next[entityId] = row
        }
        return next
    }

    const locationClosedByWeek = migrateMap(prev.locationClosedByWeek)
    const objectClosedByWeek = migrateMap(prev.objectClosedByWeek)

    for (const loc of locations) {
        if (!locationClosedByWeek[loc.id]) {
            locationClosedByWeek[loc.id] = emptyWeekMap(weekIds, false)
        }
        for (const obj of loc.subRows) {
            if (!objectClosedByWeek[obj.id]) {
                objectClosedByWeek[obj.id] = emptyWeekMap(weekIds, false)
            }
        }
    }

    return {
        weekIncluded,
        locationClosedByWeek,
        objectClosedByWeek,
    }
}

export function aggregateWeekChecks(
    byWeek: Record<string, boolean> | undefined,
    closure: HolidayClosureState
): {checked: boolean; indeterminate: boolean} {
    const weeks = activeWeekIds(closure)
    if (weeks.length === 0) {
        return {checked: false, indeterminate: false}
    }
    const vals = weeks.map((w) => byWeek?.[w] === true)
    const allOn = vals.every(Boolean)
    const allOff = vals.every((v) => !v)
    if (allOn) {
        return {checked: true, indeterminate: false}
    }
    if (allOff) {
        return {checked: false, indeterminate: false}
    }
    return {checked: false, indeterminate: true}
}

/**
 * Standort cell for one Ferien week: driven by child Objekte so a mixed week shows indeterminate
 * (the stored `locationClosedByWeek` row can lag after Objekt-only edits).
 */
export function aggregateLocationWeekForObjects(
    closure: HolidayClosureState,
    loc: LocationRowData,
    weekId: string
): {checked: boolean; indeterminate: boolean} {
    if (closure.weekIncluded[weekId] === false) {
        return {checked: false, indeterminate: false}
    }
    if (loc.subRows.length === 0) {
        const v = closure.locationClosedByWeek[loc.id]?.[weekId] ?? false
        return {checked: v, indeterminate: false}
    }
    const vals = loc.subRows.map((obj) => closure.objectClosedByWeek[obj.id]?.[weekId] ?? false)
    const allOn = vals.every(Boolean)
    const allOff = vals.every((v) => !v)
    if (allOn) {
        return {checked: true, indeterminate: false}
    }
    if (allOff) {
        return {checked: false, indeterminate: false}
    }
    return {checked: false, indeterminate: true}
}

/** Classic layout: one Standort checkbox across all active weeks, still reflecting Objekte. */
export function aggregateLocationRowForObjects(
    closure: HolidayClosureState,
    loc: LocationRowData
): {checked: boolean; indeterminate: boolean} {
    const weeks = activeWeekIds(closure)
    if (weeks.length === 0) {
        return {checked: false, indeterminate: false}
    }
    const perWeek = weeks.map((w) => aggregateLocationWeekForObjects(closure, loc, w))
    if (perWeek.some((p) => p.indeterminate)) {
        return {checked: false, indeterminate: true}
    }
    const allChecked = perWeek.every((p) => p.checked)
    const noneChecked = perWeek.every((p) => !p.checked)
    if (allChecked) {
        return {checked: true, indeterminate: false}
    }
    if (noneChecked) {
        return {checked: false, indeterminate: false}
    }
    return {checked: false, indeterminate: true}
}

export function setEntityAllActiveWeeks(
    closure: HolidayClosureState,
    entityKey: "locationClosedByWeek" | "objectClosedByWeek",
    entityId: string,
    value: boolean
): HolidayClosureState {
    const weeks = activeWeekIds(closure)
    const map = {...closure[entityKey]}
    const row = {...(map[entityId] ?? {})}
    for (const w of weeks) {
        row[w] = value
    }
    map[entityId] = row
    return {...closure, [entityKey]: map}
}

export function toggleEntityActiveWeeks(
    closure: HolidayClosureState,
    entityKey: "locationClosedByWeek" | "objectClosedByWeek",
    entityId: string
): HolidayClosureState {
    const {checked} = aggregateWeekChecks(closure[entityKey][entityId], closure)
    return setEntityAllActiveWeeks(closure, entityKey, entityId, !checked)
}

export function setLocationClosedCascade(
    closure: HolidayClosureState,
    locations: LocationRowData[],
    locationId: string,
    value: boolean
): HolidayClosureState {
    let next = setEntityAllActiveWeeks(closure, "locationClosedByWeek", locationId, value)
    const loc = locations.find((l) => l.id === locationId)
    if (!loc) {
        return next
    }
    for (const obj of loc.subRows) {
        next = setEntityAllActiveWeeks(next, "objectClosedByWeek", obj.id, value)
    }
    return next
}

/** Toggle closure for one Ferien week for one Objekt (`objectClosedByWeek[objId][weekId]`). */
export function toggleObjectWeekClosure(closure: HolidayClosureState, objectId: string, weekId: string): HolidayClosureState {
    const row = closure.objectClosedByWeek[objectId] ?? {}
    const prev = row[weekId]
    const nextVal = !(prev ?? false)
    return {
        ...closure,
        objectClosedByWeek: {
            ...closure.objectClosedByWeek,
            [objectId]: {...row, [weekId]: nextVal},
        },
    }
}

/** Toggle closure for one Ferien week for a location and cascade that week to child Objekte. */
export function toggleLocationWeekCascade(
    closure: HolidayClosureState,
    locations: LocationRowData[],
    locationId: string,
    weekId: string
): HolidayClosureState {
    const loc = locations.find((l) => l.id === locationId)
    if (!loc) {
        return closure
    }
    /** Match tri-state UX: all Objekte closed → open all; mixed or none → close all (and sync Standort flag). */
    let nextVal: boolean
    if (loc.subRows.length === 0) {
        const lr = closure.locationClosedByWeek[locationId] ?? {}
        const prev = lr[weekId]
        nextVal = !(prev ?? false)
    } else {
        const vals = loc.subRows.map((o) => closure.objectClosedByWeek[o.id]?.[weekId] ?? false)
        const allClosed = vals.every(Boolean)
        nextVal = !allClosed
    }

    let next: HolidayClosureState = {
        ...closure,
        locationClosedByWeek: {
            ...closure.locationClosedByWeek,
            [locationId]: {...(closure.locationClosedByWeek[locationId] ?? {}), [weekId]: nextVal},
        },
        objectClosedByWeek: {...closure.objectClosedByWeek},
    }

    for (const obj of loc.subRows) {
        const oRow = {...(next.objectClosedByWeek[obj.id] ?? {})}
        oRow[weekId] = nextVal
        next = {...next, objectClosedByWeek: {...next.objectClosedByWeek, [obj.id]: oRow}}
    }

    return next
}

export function toggleLocationClosedCascade(
    closure: HolidayClosureState,
    locations: LocationRowData[],
    locationId: string
): HolidayClosureState {
    const loc = locations.find((l) => l.id === locationId)
    if (!loc) {
        return closure
    }
    const {checked} = aggregateLocationRowForObjects(closure, loc)
    return setLocationClosedCascade(closure, locations, locationId, !checked)
}