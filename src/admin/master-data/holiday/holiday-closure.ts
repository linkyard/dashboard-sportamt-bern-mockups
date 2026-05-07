import type {LocationRowData} from "../location/location-types"
import {formatIsoDateLocal, parseIsoDateParts} from "../../../util/date"
import type {HolidayClosureState, HolidayRowData} from "./holiday-types"

const SPORTAMT_ACCENT = "#d7e054"

export {SPORTAMT_ACCENT}

/** Seven-day blocks from holiday start through end (matches “Woche 1 (06.07–12.07)” style). */
export function splitIntoFerienwochen(startIso: string, endIso: string): {id: string; startDate: string; endDate: string}[] {
    const start = parseIsoDateParts(startIso)
    const end = parseIsoDateParts(endIso)
    if (!start || !end) {
        return []
    }
    const holidayStart = new Date(start.y, start.m - 1, start.d)
    const holidayEnd = new Date(end.y, end.m - 1, end.d)
    const millisPerDay = 24 * 60 * 60 * 1000
    const totalDays = Math.floor((holidayEnd.getTime() - holidayStart.getTime()) / millisPerDay) + 1
    const weekCount = Math.max(0, Math.ceil(totalDays / 7))

    return Array.from({length: weekCount}, (_, index) => {
        const weekStart = new Date(holidayStart)
        weekStart.setDate(weekStart.getDate() + index * 7)

        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekEnd.getDate() + 6)
        if (weekEnd > holidayEnd) {
            weekEnd.setTime(holidayEnd.getTime())
        }

        return {
            id: `w-${index}`,
            startDate: formatIsoDateLocal(weekStart),
            endDate: formatIsoDateLocal(weekEnd),
        }
    })
}

function activeWeekIds(closure: HolidayClosureState): string[] {
    return Object.entries(closure.weekIncluded)
        .filter(([, included]) => included)
        .map(([id]) => id)
}

export function computeClosedObjekteCount(locations: LocationRowData[], closure: HolidayClosureState): number {
    const weeks = activeWeekIds(closure)
    if (weeks.length === 0) {
        return 0
    }

    return locations
        .flatMap((location) => location.subRows)
        .reduce((count, objectRow) => {
            const closedByWeek = closure.objectClosedByWeek[objectRow.id] ?? {}
            return weeks.every((weekId) => closedByWeek[weekId] === true) ? count + 1 : count
        }, 0)
}

function emptyWeekMap(weekIds: string[], value: boolean): Record<string, boolean> {
    return Object.fromEntries(weekIds.map((weekId) => [weekId, value]))
}

export function buildDefaultClosure(locations: LocationRowData[], startIso: string, endIso: string): HolidayClosureState {
    const weekMetas = splitIntoFerienwochen(startIso, endIso)
    const weekIds = weekMetas.map((w) => w.id)
    const weekIncluded = emptyWeekMap(weekIds, false)
    const locationClosedByWeek = Object.fromEntries(locations.map((location) => [location.id, emptyWeekMap(weekIds, false)]))
    const objectClosedByWeek = Object.fromEntries(
        locations
            .flatMap((location) => location.subRows)
            .map((objectRow) => [objectRow.id, emptyWeekMap(weekIds, false)])
    )

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
    const locationClosedByWeek = locations.reduce<Record<string, Record<string, boolean>>>(
        (acc, location) => ({
            ...acc,
            [location.id]: {...(acc[location.id] ?? {}), [weekId]: included},
        }),
        {...closure.locationClosedByWeek}
    )

    const objectClosedByWeek = locations
        .flatMap((location) => location.subRows)
        .reduce<Record<string, Record<string, boolean>>>(
            (acc, objectRow) => ({
                ...acc,
                [objectRow.id]: {...(acc[objectRow.id] ?? {}), [weekId]: included},
            }),
            {...closure.objectClosedByWeek}
        )

    return {
        ...closure,
        weekIncluded: {...closure.weekIncluded, [weekId]: included},
        locationClosedByWeek,
        objectClosedByWeek,
    }
}

/** Every geschlossen cell in the Ferien-week column (Standort rows + Objekte). */
function gatherWeekColumnClosedValues(closure: HolidayClosureState, locations: LocationRowData[], weekId: string): boolean[] {
    return locations.flatMap((location) => [
        closure.locationClosedByWeek[location.id]?.[weekId] ?? false,
        ...location.subRows.map((objectRow) => closure.objectClosedByWeek[objectRow.id]?.[weekId] ?? false),
    ])
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
export function cycleWeekColumnHeader(closure: HolidayClosureState, locations: LocationRowData[], weekId: string): HolidayClosureState {
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
    const weekIncluded = Object.fromEntries(
        weekIds.map((weekId, index) => {
            const oldWeekId = oldIds[index]
            return [weekId, oldWeekId !== undefined ? (prev.weekIncluded[oldWeekId] ?? false) : false]
        })
    )

    const migrateMap = (oldMap: Record<string, Record<string, boolean>>): Record<string, Record<string, boolean>> => {
        return Object.fromEntries(
            Object.keys(oldMap).map((entityId) => [
                entityId,
                Object.fromEntries(
                    weekIds.map((weekId, index) => {
                        const oldWeekId = oldIds[index]
                        const previousValue = oldWeekId !== undefined ? oldMap[entityId]?.[oldWeekId] : undefined
                        return [weekId, previousValue !== undefined ? previousValue : false]
                    })
                ),
            ])
        )
    }

    const locationClosedByWeek = locations.reduce<Record<string, Record<string, boolean>>>(
        (acc, location) => ({
            ...acc,
            [location.id]: acc[location.id] ?? emptyWeekMap(weekIds, false),
        }),
        migrateMap(prev.locationClosedByWeek)
    )

    const objectClosedByWeek = locations
        .flatMap((location) => location.subRows)
        .reduce<Record<string, Record<string, boolean>>>(
            (acc, objectRow) => ({
                ...acc,
                [objectRow.id]: acc[objectRow.id] ?? emptyWeekMap(weekIds, false),
            }),
            migrateMap(prev.objectClosedByWeek)
        )

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
    const row = weeks.reduce<Record<string, boolean>>((acc, weekId) => ({...acc, [weekId]: value}), {...(map[entityId] ?? {})})
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
    const next = setEntityAllActiveWeeks(closure, "locationClosedByWeek", locationId, value)
    const loc = locations.find((l) => l.id === locationId)
    if (!loc) {
        return next
    }
    return loc.subRows.reduce(
        (state, objectRow) => setEntityAllActiveWeeks(state, "objectClosedByWeek", objectRow.id, value),
        next
    )
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

    const objectClosedByWeek = loc.subRows.reduce<Record<string, Record<string, boolean>>>(
        (acc, objectRow) => ({
            ...acc,
            [objectRow.id]: {...(acc[objectRow.id] ?? {}), [weekId]: nextVal},
        }),
        {...closure.objectClosedByWeek}
    )

    return {
        ...closure,
        locationClosedByWeek: {
            ...closure.locationClosedByWeek,
            [locationId]: {...(closure.locationClosedByWeek[locationId] ?? {}), [weekId]: nextVal},
        },
        objectClosedByWeek,
    }
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
