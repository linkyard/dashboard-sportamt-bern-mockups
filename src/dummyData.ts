import {
    faChildReaching,
    faDumbbell,
    faFeather,
    faFutbol,
    faParachuteBox,
    faPersonSwimming,
    faVolleyball,
} from "@fortawesome/free-solid-svg-icons"
import type {Anlass, AnlassHistoryEntry, Organisation} from "./board/organisation"
import type {HolidayRowData} from "./stammdaten/ferien/ferien-types"
import type {LocationRowData, ObjektRowData} from "./stammdaten/locations/locations-types"
import type {OrganisationRowData, TrainerRowData} from "./stammdaten/organisationen/orgs-types"

const demoObjekt = (id: string, name: string, sportIcon?: ObjektRowData["sportIcon"]): ObjektRowData => ({
    id,
    rowKind: "objekt",
    name,
    ...(sportIcon ? {sportIcon} : {}),
})

const demoLocation = (id: string, name: string, subRows: ObjektRowData[]): LocationRowData => ({
    id,
    rowKind: "location",
    name,
    subRows,
})

/** Demo Ferien & Feiertage for Stammdaten (static mock data until GraphQL exists). */
/** Demo Standorte / Objekte for Stammdaten (global master data, not scoped to a board). */
export const stammdatenSeedHolidays: HolidayRowData[] = [
    {
        id: "st-ferien-1",
        name: "Sommerferien",
        startDate: "2026-07-06",
        endDate: "2026-08-09",
        closedObjekteCount: 0,
    },
    {
        id: "st-ferien-2",
        name: "Herbstferien",
        startDate: "2026-10-05",
        endDate: "2026-10-16",
        closedObjekteCount: 0,
    },
    {
        id: "st-ferien-3",
        name: "Winterferien",
        startDate: "2026-12-21",
        endDate: "2027-01-02",
        closedObjekteCount: 0,
    },
    {
        id: "st-ferien-4",
        name: "Sportferien",
        startDate: "2026-02-02",
        endDate: "2026-02-13",
        closedObjekteCount: 0,
    },
    {
        id: "st-ferien-5",
        name: "Frühlingsferien",
        startDate: "2026-04-06",
        endDate: "2026-04-17",
        closedObjekteCount: 0,
    },
    {
        id: "st-ferien-6",
        name: "Pfingstferien",
        startDate: "2026-05-18",
        endDate: "2026-05-29",
        closedObjekteCount: 0,
    },
    {
        id: "st-ferien-7",
        name: "Osterferien",
        startDate: "2027-04-05",
        endDate: "2027-04-16",
        closedObjekteCount: 0,
    },
    {
        id: "st-ferien-8",
        name: "Sommerferien",
        startDate: "2027-07-12",
        endDate: "2027-08-15",
        closedObjekteCount: 0,
    },
    {
        id: "st-ferien-9",
        name: "Herbstferien",
        startDate: "2027-10-04",
        endDate: "2027-10-15",
        closedObjekteCount: 0,
    },
    {
        id: "st-ferien-10",
        name: "Sportferien",
        startDate: "2028-01-31",
        endDate: "2028-02-11",
        closedObjekteCount: 0,
    },
]

export const stammdatenSeedLocations: LocationRowData[] = [
    demoLocation("st-loc-b1-1", "Turnhalle Wankdorf", [
        demoObjekt("st-obj-b1-1", "Hauptsaal", faVolleyball),
        demoObjekt("st-obj-b1-2", "Nebenraum A", faFeather),
        demoObjekt("st-obj-b1-3", "Kraftraum", faDumbbell),
    ]),
    demoLocation("st-loc-b1-2", "Sportanlage Breitenrain", [
        demoObjekt("st-obj-b1-4", "Kunstrasenplatz", faFutbol),
        demoObjekt("st-obj-b1-5", "Naturrasen", faFutbol),
    ]),
    demoLocation("st-loc-b1-3", "Stadtbad Bern", [
        demoObjekt("st-obj-b1-6", "25 m Sportbecken", faPersonSwimming),
        demoObjekt("st-obj-b1-7", "Kinderplanschbereich", faChildReaching),
        demoObjekt("st-obj-b1-8", "Sauna & Wellness", faFeather),
    ]),
    demoLocation("st-loc-b1-4", "Sporthalle Bümpliz", [
        demoObjekt("st-obj-b1-9", "Mehrzweckhalle", faVolleyball),
        demoObjekt("st-obj-b1-10", "Parkett Training", faDumbbell),
        demoObjekt("st-obj-b1-11", "Gruppefitness-Raum", faChildReaching),
    ]),
    demoLocation("st-loc-b1-5", "Leichtathletik Matte", [
        demoObjekt("st-obj-b1-12", "400 m Runde", faFeather),
        demoObjekt("st-obj-b1-13", "Weitsprunganlage", faVolleyball),
        demoObjekt("st-obj-b1-14", "Wurfzentrum", faDumbbell),
    ]),
    demoLocation("st-loc-b1-6", "Kunsteisbahn Allmend", [
        demoObjekt("st-obj-b1-15", "Hockeyfeld", faFutbol),
        demoObjekt("st-obj-b1-16", "Öffentliches Eislaufen", faPersonSwimming),
        demoObjekt("st-obj-b1-17", "Kursraum Schotte", faDumbbell),
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

export const DEMO_ORG_ID = {
    linkyardSports: "demo-id-linkyard-sports",
    turnvereinNord: "demo-id-turnverein-nord",
    fcBernOst: "demo-id-fc-bern-ost",
    schwimmclubMitte: "demo-id-schwimmclub-mitte",
} as const

/** Demo Organisationen / Trainer for Stammdaten (global master data). */
export const stammdatenSeedOrganisationen: OrganisationRowData[] = [
    {
        id: DEMO_ORG_ID.linkyardSports,
        rowKind: "organisation",
        name: "Linkyard Sports",
        contact: {
            organisationName: "Linkyard Sports",
            contactPerson: "Roman Frey",
            street: "Junkergasse 39",
            postalCode: "3011",
            city: "Bern",
            email: "roman.frey@linkyard.ch",
            phone: "+41 79 512 26 11",
        },
        subRows: [],
    },
    {
        id: DEMO_ORG_ID.turnvereinNord,
        rowKind: "organisation",
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
        id: DEMO_ORG_ID.fcBernOst,
        rowKind: "organisation",
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
    {
        id: DEMO_ORG_ID.schwimmclubMitte,
        rowKind: "organisation",
        name: "Schwimmclub Mitte",
        contact: {
            organisationName: "Schwimmclub Mitte",
            contactPerson: "Elena Favre",
            street: "Schützenmattweg 39",
            postalCode: "3014",
            city: "Bern",
            email: "info@schwimmclub-mitte.example",
            phone: "+41 31 351 12 34",
        },
        subRows: [
            demoTrainer("st-tr-4", "Lukas", "Hunziker", "+41 79 201 30 40", "lukas.hunziker@example.ch"),
            demoTrainer("st-tr-5", "Nina", "Baumgartner", "+41 78 912 45 67", "nina.baumgartner@example.ch"),
            demoTrainer("st-tr-6", "Felix", "Roth", "+41 76 334 55 66", "felix.roth@example.ch"),
        ],
    },
    {
        id: "st-verein-4",
        rowKind: "organisation",
        name: "TV Länggasse",
        contact: {
            organisationName: "Turnverein Länggasse",
            contactPerson: "Simon Wyss",
            street: "Laubeggstrasse 77",
            postalCode: "3013",
            city: "Bern",
            email: "sekretariat@tv-laenggasse.example",
            phone: "+41 31 982 10 20",
        },
        subRows: [demoTrainer("st-tr-7", "Corinne", "Stalder", "+41 79 445 77 88", "corinne.stalder@example.ch")],
    },
    {
        id: "st-verein-5",
        rowKind: "organisation",
        name: "HV Region Bern",
        contact: {
            organisationName: "Handballverein Region Bern",
            contactPerson: "Patrick Zahnd",
            street: "Brückfeldstrasse 16",
            postalCode: "3013",
            city: "Bern",
            email: "vorstand@hv-regionbern.example",
            phone: "+41 31 388 90 11",
        },
        billingContact: {
            organisationName: "HV Region Bern – Rechnungswesen",
            contactPerson: "Ruth Steffen",
            street: "Brückfeldstrasse 16",
            postalCode: "3013",
            city: "Bern",
            email: "rechnungen@hv-regionbern.example",
            phone: "+41 31 388 90 12",
        },
        subRows: [
            demoTrainer("st-tr-8", "Michael", "Aebi", "+41 78 556 12 13", "michael.aebi@example.ch"),
            demoTrainer("st-tr-9", "Laura", "Kuhn", "+41 77 667 23 24", "laura.kuhn@example.ch"),
        ],
    },
    {
        id: "st-verein-6",
        rowKind: "organisation",
        name: "Berner Leichtathletik Club",
        contact: {
            organisationName: "Berner Leichtathletik Club",
            contactPerson: "Thomas Gerber",
            street: "Mingerstrasse 110",
            postalCode: "3030",
            city: "Bern",
            email: "kontakt@blc-athletics.example",
            phone: "+41 31 971 44 55",
        },
        subRows: [],
    },
]

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
        bemerkung: "Jahresplanung mit mehreren Abstimmungen zwischen Organisationen und Schulsport.",
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

export function getOrganisationById(orgId: string): Organisation | undefined {
    return allDummyOrganisations.find((o) => o.id === orgId)
}

/** Older Stammdaten-only ids still found in bookmarks or docs. */
const LEGACY_PUBLIC_VEREIN_ROUTE_IDS: Record<string, string> = {
    "st-verein-1": DEMO_ORG_ID.turnvereinNord,
    "st-verein-2": DEMO_ORG_ID.fcBernOst,
    "st-verein-3": DEMO_ORG_ID.schwimmclubMitte,
}

/** Resolve board/org payload for `/organisationen/:orgId` (direct id or legacy Stammdaten row id). */
export function getOrganisationForPublicPage(routeParam: string | undefined): Organisation | undefined {
    if (!routeParam) return undefined
    const direct = getOrganisationById(routeParam)
    if (direct) return direct
    const mapped = LEGACY_PUBLIC_VEREIN_ROUTE_IDS[routeParam]
    return mapped ? getOrganisationById(mapped) : undefined
}

/** --- Organisation-public Anlass editor (demo seeds) --- */

export type AusfalltagRowData = {
    id: string
    grund: string
    vonDate: string
    bisDate: string
}

export const organisationPublicSeedAusfalltage: AusfalltagRowData[] = [
    {
        id: "demo-trainingslager",
        grund: "Trainingslager",
        vonDate: "2026-08-10",
        bisDate: "2026-08-17",
    },
]

export type KursTimeBlock = {
    id: string
    weekdayKey: "weekdays.tuesday" | "weekdays.friday"
    timeRange: string
}

export type TrainerOptionSeed = {
    id: string
    name: string
    phone: string
    email: string
}

export const organisationPublicObjekteCatalog = ["Bahn 1", "Bahn 2", "Bahn 3", "Halle A"] as const

export type OrganisationPublicKursObjektAssignment = {
    id: string
    label: string
}

export const organisationPublicKursObjekteByTimeBlockSeed: Record<string, OrganisationPublicKursObjektAssignment[]> = {
    "kurs-1": [
        {id: "kurs-zuweisung-1", label: "Bahn 1"},
        {id: "kurs-zuweisung-2", label: "Bahn 2"},
    ],
    "kurs-2": [],
}

export const organisationPublicKursTimeBlocks: KursTimeBlock[] = [
    {id: "kurs-1", weekdayKey: "weekdays.tuesday", timeRange: "16:30 – 17:30"},
    {id: "kurs-2", weekdayKey: "weekdays.friday", timeRange: "11:30 – 12:30"},
]

export const organisationPublicTrainerOptions: TrainerOptionSeed[] = [
    {
        id: "roman-frey",
        name: "Roman Frey",
        phone: "+41 79 512 26 11",
        email: "roman.frey@linkyard.ch",
    },
    {
        id: "mia-keller",
        name: "Mia Keller",
        phone: "+41 79 000 00 00",
        email: "mia.keller@example.ch",
    },
]
