import type {LocationRowData, ObjectRowData} from "./location-types"

export function findObjectParentAndIndex(locations: LocationRowData[], objectId: string): {locationId: string; index: number} | null {
    for (const loc of locations) {
        const index = loc.subRows.findIndex((o) => o.id === objectId)
        if (index !== -1) {
            return {locationId: loc.id, index}
        }
    }
    return null
}

export function removeObjectById(
    locations: LocationRowData[],
    objectId: string
): {locations: LocationRowData[]; removed: ObjectRowData | null} {
    let removed: ObjectRowData | null = null
    const next = locations.map((loc) => {
        const idx = loc.subRows.findIndex((o) => o.id === objectId)
        if (idx === -1) {
            return loc
        }
        removed = loc.subRows[idx]
        return {...loc, subRows: loc.subRows.filter((o) => o.id !== objectId)}
    })
    return {locations: next, removed}
}

export function insertObjectAt(
    locations: LocationRowData[],
    locationId: string,
    object: ObjectRowData,
    index: number | "append"
): LocationRowData[] {
    return locations.map((loc) => {
        if (loc.id !== locationId) {
            return loc
        }
        const sub = [...loc.subRows]
        if (index === "append") {
            sub.push(object)
        } else {
            sub.splice(index, 0, object)
        }
        return {...loc, subRows: sub}
    })
}

export function moveObjectRelativeToHover(locations: LocationRowData[], draggedObjectId: string, hoverObjectId: string): LocationRowData[] {
    if (draggedObjectId === hoverObjectId) {
        return locations
    }
    const {locations: without, removed} = removeObjectById(locations, draggedObjectId)
    if (!removed) {
        return locations
    }
    const targetPos = findObjectParentAndIndex(without, hoverObjectId)
    if (!targetPos) {
        return locations
    }
    return insertObjectAt(without, targetPos.locationId, removed, targetPos.index)
}

export function moveObjectToLocationEnd(
    locations: LocationRowData[],
    draggedObjectId: string,
    targetLocationId: string
): LocationRowData[] {
    const {locations: without, removed} = removeObjectById(locations, draggedObjectId)
    if (!removed) {
        return locations
    }
    return insertObjectAt(without, targetLocationId, removed, "append")
}
