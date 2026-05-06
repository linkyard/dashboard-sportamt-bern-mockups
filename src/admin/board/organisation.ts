import type {IconProp} from "@fortawesome/fontawesome-svg-core"

export type ContactAddress = {
    organisationName: string
    contactPerson: string
    street: string
    postalCode: string
    city: string
    email: string
    phone: string
}

export type Organisation = {
    id: string
    boardId?: string
    organisation: string
    contact: ContactAddress
    billingContact?: ContactAddress
    reservations: Reservation[]
}

export type ReservationStatus = "pending" | "confirmed"

export type ReservationHistoryEntry = {
    id: string
    title: string
    actorName: string
    atLabel: string
}

export type Reservation = {
    id: string
    name: string
    sportIcon: IconProp
    period?: string
    location?: string
    times?: string[]
    status?: ReservationStatus
    history?: ReservationHistoryEntry[]
}

// Wont be needed when graphql is set up:
export function resolveReservationFromOrganisation(reservation: Reservation, organisation: Organisation | undefined): Reservation {
    if (!organisation?.reservations.length) return reservation
    return organisation.reservations.find((row) => row.id === reservation.id) ?? reservation
}
