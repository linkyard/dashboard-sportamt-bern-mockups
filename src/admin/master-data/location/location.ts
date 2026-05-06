import type {LocationRowData, ObjektRowData} from "./location-types"

export function findObjektParentAndIndex(locations: LocationRowData[], objektId: string): {locationId: string; index: number} | null {
    for (const loc of locations) {
        const index = loc.subRows.findIndex((o) => o.id === objektId)
        if (index !== -1) {
            return {locationId: loc.id, index}
        }
    }
    return null
}

export function removeObjektById(
    locations: LocationRowData[],
    objektId: string
): {locations: LocationRowData[]; removed: ObjektRowData | null} {
    let removed: ObjektRowData | null = null
    const next = locations.map((loc) => {
        const idx = loc.subRows.findIndex((o) => o.id === objektId)
        if (idx === -1) {
            return loc
        }
        removed = loc.subRows[idx]
        return {...loc, subRows: loc.subRows.filter((o) => o.id !== objektId)}
    })
    return {locations: next, removed}
}

export function insertObjektAt(
    locations: LocationRowData[],
    locationId: string,
    objekt: ObjektRowData,
    index: number | "append"
): LocationRowData[] {
    return locations.map((loc) => {
        if (loc.id !== locationId) {
            return loc
        }
        const sub = [...loc.subRows]
        if (index === "append") {
            sub.push(objekt)
        } else {
            sub.splice(index, 0, objekt)
        }
        return {...loc, subRows: sub}
    })
}

export function moveObjektRelativeToHover(locations: LocationRowData[], draggedObjektId: string, hoverObjektId: string): LocationRowData[] {
    if (draggedObjektId === hoverObjektId) {
        return locations
    }
    const {locations: without, removed} = removeObjektById(locations, draggedObjektId)
    if (!removed) {
        return locations
    }
    const targetPos = findObjektParentAndIndex(without, hoverObjektId)
    if (!targetPos) {
        return locations
    }
    return insertObjektAt(without, targetPos.locationId, removed, targetPos.index)
}

export function moveObjektToLocationEnd(
    locations: LocationRowData[],
    draggedObjektId: string,
    targetLocationId: string
): LocationRowData[] {
    const {locations: without, removed} = removeObjektById(locations, draggedObjektId)
    if (!removed) {
        return locations
    }
    return insertObjektAt(without, targetLocationId, removed, "append")
}
