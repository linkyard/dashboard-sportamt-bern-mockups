import type {IconDefinition} from "@fortawesome/fontawesome-svg-core"

export interface ObjectRowData {
    id: string
    rowKind: "object"
    name: string
    sportIcon?: IconDefinition
}

export interface LocationRowData {
    id: string
    rowKind: "location"
    name: string
    subRows: ObjectRowData[]
}

export type StammdatenObjectsRow = LocationRowData | ObjectRowData

export function newId(): string {
    return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
}
