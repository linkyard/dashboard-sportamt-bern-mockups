import type {ContactAddress} from "../../board/organisation"
import {newId} from "../locations/locations-types"

export type {ContactAddress}

export interface TrainerRowData {
    id: string
    rowKind: "trainer"
    firstName: string
    lastName: string
    phone: string
    email: string
}

export interface VereinRowData {
    id: string
    rowKind: "verein"
    name: string
    contact: ContactAddress
    billingContact?: ContactAddress
    subRows: TrainerRowData[]
}

export {newId}
