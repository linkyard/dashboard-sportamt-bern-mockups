import {
    faChildReaching,
    faDumbbell,
    faFeather,
    faFutbol,
    faParachuteBox,
    faPersonSwimming,
    faVolleyball,
} from "@fortawesome/free-solid-svg-icons"
import type {Anlass, AnlassHistoryEntry, Organisation} from "../board/organisation"
import type {LocationRowData, ObjektRowData} from "../stammdaten/locations/locations-types"
import type {TrainerRowData, VereinRowData} from "../stammdaten/vereine/vereine-types"

const demoObjekt = (id: string, name: string): ObjektRowData => ({
    id,
    rowKind: "objekt",
    name,
})

const demoLocation = (id: string, name: string, subRows: ObjektRowData[]): LocationRowData => ({
    id,
    rowKind: "location",
    name,
    subRows,
})

/** Demo Standorte / Objekte for Stammdaten (global master data, not scoped to a board). */
export const stammdatenSeedLocations: LocationRowData[] = [
    demoLocation("st-loc-b1-1", "Turnhalle Wankdorf", [
        demoObjekt("st-obj-b1-1", "Hauptsaal"),
        demoObjekt("st-obj-b1-2", "Nebenraum A"),
        demoObjekt("st-obj-b1-3", "Kraftraum"),
    ]),
    demoLocation("st-loc-b1-2", "Sportanlage Breitenrain", [
        demoObjekt("st-obj-b1-4", "Kunstrasenplatz"),
        demoObjekt("st-obj-b1-5", "Naturrasen"),
    ]),
]

const demoTrainer = (id: string, firstName: string, lastName: string, phone: string, email: string): TrainerRowData => ({
    id,
    rowKind: "trainer",
    firstName,
    lastName,
    phone,
    email,
})

/** Demo Vereine / Trainer for Stammdaten (global master data). */
export const stammdatenSeedVereine: VereinRowData[] = [
    {
        id: "st-verein-1",
        rowKind: "verein",
        name: "Turnverein Nord",
        contact: {
            organisationName: "Turnverein Nord",
            contactPerson: "Claudia Steiner",
            street: "Lorrainestrasse 50",
            postalCode: "3013",
            city: "Bern",
            email: "sekretariat@turnverein-nord.example",
            phone: "+41 31 333 44 55",
        },
        subRows: [
            demoTrainer("st-tr-1", "Anna", "Meier", "+41 79 111 22 33", "anna.meier@example.ch"),
            demoTrainer("st-tr-2", "Jonas", "Keller", "+41 78 444 55 66", "jonas.keller@example.ch"),
        ],
    },
    {
        id: "st-verein-2",
        rowKind: "verein",
        name: "FC Bern Ost",
        contact: {
            organisationName: "FC Bern Ost",
            contactPerson: "Marc Gerber",
            street: "Schlossstrasse 23",
            postalCode: "3008",
            city: "Bern",
            email: "info@fcbern-ost.example",
            phone: "+41 31 222 11 00",
        },
        billingContact: {
            organisationName: "FC Bern Ost Rechnungen",
            contactPerson: "Buchhaltung",
            street: "Postfach 88",
            postalCode: "3000",
            city: "Bern 1",
            email: "rechnungen@fcbern-ost.example",
            phone: "+41 31 222 11 09",
        },
        subRows: [demoTrainer("st-tr-3", "Sandra", "Frei", "+41 77 888 99 00", "sandra.frei@example.ch")],
    },
]

/** Demo organisation ids (slug-style, stable for routing and fixtures). */
export const DEMO_ORG_ID = {
    linkyardSports: "demo-id-linkyard-sports",
    turnvereinNord: "demo-id-turnverein-nord",
    fcBernOst: "demo-id-fc-bern-ost",
    schwimmclubMitte: "demo-id-schwimmclub-mitte",
} as const

/** Seed shape before each `anlass.id` is set (`${org.id}-anlass-${index}`). */
type OrganisationSeed = Omit<Organisation, "anlaesse"> & {
    anlaesse: Omit<Anlass, "id">[]
}

function organisationWithAnlassIds(seed: OrganisationSeed): Organisation {
    return {
        ...seed,
        anlaesse: seed.anlaesse.map((anlass, index) => ({
            ...anlass,
            id: `${seed.id}-anlass-${index}`,
        })),
    }
}

export type BoardLabel = "Wintersaison" | "Jahresperiode"

export const boardLabelDateRanges: Record<BoardLabel, string> = {
    Wintersaison: "(31.10.2026 - 30.04.2027)",
    Jahresperiode: "(01.01.2027 - 31.12.2027)",
}

export type BoardStatus = "erstellt" | "versandBereit"

export type Board = {
    id: string
    name: string
    bemerkung: string
    startDate: string
    endDate: string
    status: BoardStatus
    anlaesseConfirmed: number
    anlaesseTotal: number
    labels: BoardLabel[]
}

export const dummyBoards: Board[] = [
    {
        id: "board-1",
        name: "Board 1",
        bemerkung: "Fokus auf Hallenbelegung in den Wintermonaten mit priorisierten Jugendzeiten.",
        startDate: "2026-10-31",
        endDate: "2027-04-30",
        status: "erstellt",
        anlaesseConfirmed: 20,
        anlaesseTotal: 134,
        labels: ["Wintersaison"],
    },
    {
        id: "board-2",
        name: "Board 2",
        bemerkung: "Jahresplanung mit mehreren Abstimmungen zwischen Vereinen und Schulsport.",
        startDate: "2027-01-01",
        endDate: "2027-12-31",
        status: "versandBereit",
        anlaesseConfirmed: 134,
        anlaesseTotal: 134,
        labels: ["Jahresperiode"],
    },
    {
        id: "board-3",
        name: "Board 3",
        bemerkung: "Pilot fuer kombinierte Perioden; beinhaltet Sonderzeiten fuer Feiertage und Turniere.",
        startDate: "2026-10-31",
        endDate: "2027-12-31",
        status: "erstellt",
        anlaesseConfirmed: 0,
        anlaesseTotal: 89,
        labels: ["Wintersaison", "Jahresperiode"],
    },
    {
        id: "board-4",
        name: "Board 4",
        bemerkung:
            "Dieses Board enthaelt eine laengere Bemerkung, damit das Ellipsis-Verhalten in der Tabelle sichtbar ist und kein Zeilenumbruch erfolgt.",
        startDate: "2027-02-01",
        endDate: "2027-09-30",
        status: "versandBereit",
        anlaesseConfirmed: 12,
        anlaesseTotal: 12,
        labels: ["Jahresperiode"],
    },
]

export function getBoardById(id: string): Board | undefined {
    return dummyBoards.find((b) => b.id === id)
}

const demoAnlassCommunicationHistory = (idBase: string): AnlassHistoryEntry[] => [
    {
        id: `${idBase}-a`,
        title: "Erneuerungs mail gesendet",
        actorName: "Sportamt Bern",
        atLabel: "18. Apr. 2026, 09:14",
    },
    {
        id: `${idBase}-b`,
        title: "Reminder 1 gesendet - 12.12.12",
        actorName: "Sportamt Bern",
        atLabel: "12. Apr. 2026, 08:00",
    },
]

const withAnlassHistory = (organisations: Organisation[]): Organisation[] =>
    organisations.map((org) => ({
        ...org,
        anlaesse: org.anlaesse.map((anlass, index) => ({
            ...anlass,
            history:
                anlass.history != null && anlass.history.length > 0
                    ? anlass.history
                    : demoAnlassCommunicationHistory(`${org.id}-${index}-${anlass.name}-${anlass.period ?? ""}`),
        })),
    }))

export const dummyOrganisation: Organisation = organisationWithAnlassIds({
    id: DEMO_ORG_ID.linkyardSports,
    boardId: "board-1",
    organisation: "Linkyard Sports",
    contact: {
        organisationName: "Linkyard Sports",
        contactPerson: "Roman Frey",
        street: "Junkerngasse 39",
        postalCode: "3011",
        city: "Bern",
        email: "roman.frey@linkyard.ch",
        phone: "+41 79 512 26 11",
    },
    anlaesse: [
        {
            name: "Schwimmen",
            sportIcon: faPersonSwimming,
            period: "Sommerperiode (Mai - September)",
            location: "Freibad Marzili",
            times: ["Dienstag, 16:30 - 17:30", "Freitag, 11:30 - 12:30"],
            status: "pending",
            history: [
                {
                    id: "sw-1",
                    title: "Erneuerungs mail gesendet",
                    actorName: "Sportamt Bern",
                    atLabel: "18. Apr. 2026, 09:14",
                },
                {
                    id: "sw-2",
                    title: "Reminder 1 gesendet - 12.12.12",
                    actorName: "Sportamt Bern",
                    atLabel: "12. Apr. 2026, 08:00",
                },
                {
                    id: "sw-3",
                    title: "Kontaktdaten der Organisation aktualisiert",
                    actorName: "Roman Frey",
                    atLabel: "3. Apr. 2026, 16:42",
                },
            ],
        },
        {
            name: "Badminton",
            sportIcon: faFeather,
            period: "Jahresperiode (August - Juli)",
            location: "Turnhalle Marzili",
            times: ["Donnerstag, 20:00 - 21:00"],
            status: "pending",
            history: [
                {
                    id: "bd-1",
                    title: "Erneuerungs mail gesendet",
                    actorName: "Sportamt Bern",
                    atLabel: "10. Apr. 2026, 11:05",
                },
            ],
        },
        {
            name: "Luftakrobatik",
            sportIcon: faParachuteBox,
            period: "Jahresperiode (August - Juli)",
            location: "Turnhalle Matte",
            times: ["Mittwoch, 18:30 - 20:00"],
            status: "confirmed",
            history: [
                {
                    id: "la-1",
                    title: "Reservation bestätigt",
                    actorName: "Sportamt Bern",
                    atLabel: "28. März 2026, 14:22",
                },
            ],
        },
    ],
})

const dummyOrganisationSeeds: OrganisationSeed[] = [
    {
        id: DEMO_ORG_ID.turnvereinNord,
        boardId: "board-1",
        organisation: "Turnverein Nord",
        contact: {
            organisationName: "Turnverein Nord",
            contactPerson: "Mara Keller",
            phone: "+41 31 555 10 11",
            email: "mara.keller@tvnord.ch",
            street: "Breitenrainstrasse 20",
            postalCode: "3013",
            city: "Bern",
        },
        anlaesse: [
            {
                name: "Turnen",
                sportIcon: faChildReaching,
                period: "Winterperiode (31.10.2026 - 30.04.2027)",
                location: "Turnhalle Breitenrain",
                times: ["Montag, 18:00 - 19:30"],
                status: "pending",
            },
            {
                name: "Turnen",
                sportIcon: faChildReaching,
                period: "Jahresperiode (01.01.2027 - 31.12.2027)",
                location: "Turnhalle Breitenrain",
                times: ["Samstag, 09:30 - 12:00"],
                status: "confirmed",
            },
            {
                name: "Geräteturnen",
                sportIcon: faDumbbell,
                period: "Sommerperiode (01.05.2026 - 30.09.2026)",
                location: "Turnhalle Wankdorf",
                times: ["Sonntag, 08:00 - 17:00"],
                status: "pending",
            },
            {
                name: "Turnen",
                sportIcon: faChildReaching,
                period: "Übergangsperiode (Sept. - Okt. 2026)",
                location: "Turnhalle Breitenrain",
                times: ["Mittwoch, 15:00 - 16:00", "Mittwoch, 16:15 - 17:15"],
                status: "confirmed",
            },
            {
                name: "Turnen",
                sportIcon: faChildReaching,
                period: "Winterperiode (31.10.2026 - 30.04.2027)",
                location: "Gemeindesaal Breitenrain",
                times: ["Freitag, 18:30 - 23:00"],
                status: "pending",
            },
        ],
    },
    {
        id: DEMO_ORG_ID.fcBernOst,
        boardId: "board-1",
        organisation: "FC Bern Ost",
        contact: {
            organisationName: "FC Bern Ost",
            contactPerson: "Jonas Wyss",
            phone: "+41 31 555 21 34",
            email: "jonas.wyss@fc-bern-ost.ch",
            street: "Murifeldweg 8",
            postalCode: "3006",
            city: "Bern",
        },
        anlaesse: [
            {
                name: "Fussball",
                sportIcon: faFutbol,
                period: "Jahresperiode (01.01.2027 - 31.12.2027)",
                location: "Sportplatz Murifeld",
                times: ["Samstag, 10:00 - 16:00"],
                status: "confirmed",
            },
            {
                name: "Fussball",
                sportIcon: faFutbol,
                period: "Winterperiode (31.10.2026 - 30.04.2027)",
                location: "Sportplatz Murifeld",
                times: ["Samstag, 09:00 - 15:30"],
                status: "pending",
            },
            {
                name: "Fussball",
                sportIcon: faFutbol,
                period: "Übergangsperiode (Sept. - Okt. 2026)",
                location: "Sportplatz Murifeld",
                times: ["Freitag, 19:30 - 21:00"],
                status: "pending",
            },
            {
                name: "Fussball",
                sportIcon: faFutbol,
                period: "Sommerperiode (01.05.2026 - 30.09.2026)",
                location: "Sportplatz Murifeld",
                times: ["Dienstag, 19:00 - 21:00", "Donnerstag, 19:00 - 21:00"],
                status: "confirmed",
            },
            {
                name: "Fussball",
                sportIcon: faFutbol,
                period: "Jahresperiode (01.01.2027 - 31.12.2027)",
                location: "Stadion Wankdorf",
                times: ["Samstag, 14:00 - 17:30"],
                status: "pending",
            },
            {
                name: "Fussball",
                sportIcon: faFutbol,
                period: "Winterperiode (31.10.2026 - 30.04.2027)",
                location: "Sportplatz Murifeld",
                times: ["Sonntag, 10:00 - 14:00"],
                status: "confirmed",
            },
        ],
    },
    {
        id: DEMO_ORG_ID.schwimmclubMitte,
        boardId: "board-1",
        organisation: "Schwimmclub Mitte",
        contact: {
            organisationName: "Schwimmclub Mitte",
            contactPerson: "Lea Gerber",
            phone: "+41 31 555 44 90",
            email: "lea.gerber@sc-mitte.ch",
            street: "Aareweg 2",
            postalCode: "3011",
            city: "Bern",
        },
        anlaesse: [
            {
                name: "Schwimmen",
                sportIcon: faPersonSwimming,
                period: "Winterperiode (31.10.2026 - 30.04.2027)",
                location: "Schwimmbad Aarebad",
                times: ["Samstag, 08:00 - 13:00"],
                status: "confirmed",
            },
            {
                name: "Schwimmen",
                sportIcon: faPersonSwimming,
                period: "Jahresperiode (01.01.2027 - 31.12.2027)",
                location: "Schwimmbad Aarebad",
                times: ["Dienstag, 17:00 - 18:00", "Donnerstag, 17:00 - 18:00"],
                status: "confirmed",
            },
            {
                name: "Schwimmen",
                sportIcon: faPersonSwimming,
                period: "Sommerperiode (01.05.2026 - 30.09.2026)",
                location: "Freibad Marzili",
                times: ["Sonntag, 10:00 - 12:00"],
                status: "pending",
            },
            {
                name: "Schwimmen",
                sportIcon: faPersonSwimming,
                period: "Übergangsperiode (Sept. - Okt. 2026)",
                location: "Schwimmbad Aarebad",
                times: ["Samstag, 07:30 - 16:00"],
                status: "pending",
            },
            {
                name: "Wasserball",
                sportIcon: faVolleyball,
                period: "Winterperiode (31.10.2026 - 30.04.2027)",
                location: "Hallenbad City",
                times: ["Sonntag, 18:00 - 20:00"],
                status: "confirmed",
            },
        ],
    },
]

export const dummyOrganisations: Organisation[] = withAnlassHistory(dummyOrganisationSeeds.map(organisationWithAnlassIds))

/** All demo orgs (table + default Linkyard) for ID lookup until GraphQL replaces this. */
export const allDummyOrganisations: Organisation[] = [dummyOrganisation, ...dummyOrganisations]

export function getOrganisationById(organisationId: string): Organisation | undefined {
    return allDummyOrganisations.find((o) => o.id === organisationId)
}
