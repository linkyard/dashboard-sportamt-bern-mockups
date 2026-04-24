export type ContactAddress = {
    organisationName: string
    contactPerson: string
    street: string
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
    anlaesse: Anlass[]
}

export type AnlassStatus = "pending" | "confirmed"

export type AnlassHistoryEntry = {
    id: string
    title: string
    actorName: string
    atLabel: string
}

export type Anlass = {
    id: string
    name: string
    date?: string
    period?: string
    location?: string
    times?: string[]
    status?: AnlassStatus
    history?: AnlassHistoryEntry[]
}

// Wont be needed when graphql is set up:
export function resolveAnlassFromOrganisation(anlass: Anlass, organisation: Organisation | undefined): Anlass {
    if (!organisation?.anlaesse.length) return anlass
    return organisation.anlaesse.find((row) => row.id === anlass.id) ?? anlass
}
