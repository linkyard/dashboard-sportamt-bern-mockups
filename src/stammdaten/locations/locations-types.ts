export interface ObjektRowData {
    id: string
    rowKind: "objekt"
    name: string
}

export interface LocationRowData {
    id: string
    rowKind: "location"
    name: string
    subRows: ObjektRowData[]
}

export type StammdatenObjekteRow = LocationRowData | ObjektRowData

export function newId(): string {
    return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
}
