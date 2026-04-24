import type {Anlass, AnlassHistoryEntry, Organisation} from "../board/organisation";

/** Demo organisation ids (slug-style, stable for routing and fixtures). */
export const DEMO_ORG_ID = {
    linkyardSports: "demo-id-linkyard-sports",
    turnvereinNord: "demo-id-turnverein-nord",
    fcBernOst: "demo-id-fc-bern-ost",
    schwimmclubMitte: "demo-id-schwimmclub-mitte",
} as const;

/** Seed shape before each `anlass.id` is set (`${org.id}-anlass-${index}`). */
type OrganisationSeed = Omit<Organisation, "anlaesse"> & {
    anlaesse: Omit<Anlass, "id">[];
};

function organisationWithAnlassIds(seed: OrganisationSeed): Organisation {
    return {
        ...seed,
        anlaesse: seed.anlaesse.map((anlass, index) => ({
            ...anlass,
            id: `${seed.id}-anlass-${index}`,
        })),
    };
}

export type BoardLabel = "Wintersaison" | "Jahresperiode";

export type Board = {
    name: string;
    bemerkung: string;
    startDate: string;
    endDate: string;
    labels: BoardLabel[];
};

export const dummyBoards: Board[] = [
    {
        name: "Board 1",
        bemerkung:
            "Fokus auf Hallenbelegung in den Wintermonaten mit priorisierten Jugendzeiten.",
        startDate: "31.10.2026",
        endDate: "30.04.2027",
        labels: ["Wintersaison"],
    },
    {
        name: "Board 2",
        bemerkung:
            "Jahresplanung mit mehreren Abstimmungen zwischen Vereinen und Schulsport.",
        startDate: "01.01.2027",
        endDate: "31.12.2027",
        labels: ["Jahresperiode"],
    },
    {
        name: "Board 3",
        bemerkung:
            "Pilot fuer kombinierte Perioden; beinhaltet Sonderzeiten fuer Feiertage und Turniere.",
        startDate: "31.10.2026",
        endDate: "31.12.2027",
        labels: ["Wintersaison", "Jahresperiode"],
    },
    {
        name: "Board 4",
        bemerkung:
            "Dieses Board enthaelt eine laengere Bemerkung, damit das Ellipsis-Verhalten in der Tabelle sichtbar ist und kein Zeilenumbruch erfolgt.",
        startDate: "01.02.2027",
        endDate: "30.09.2027",
        labels: ["Jahresperiode"],
    },
];

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
];

const withAnlassHistory = (organisations: Organisation[]): Organisation[] =>
    organisations.map((org) => ({
        ...org,
        anlaesse: org.anlaesse.map((anlass, index) => ({
            ...anlass,
            history:
                anlass.history != null && anlass.history.length > 0
                    ? anlass.history
                    : demoAnlassCommunicationHistory(`${org.id}-${index}-${anlass.name}-${anlass.date ?? anlass.period ?? ""}`),
        })),
    }));

export const dummyOrganisation: Organisation = organisationWithAnlassIds({
    id: DEMO_ORG_ID.linkyardSports,
    organisation: "Linkyard Sports",
    contact: {
        organisationName: "Linkyard Sports",
        contactPerson: "Roman Frey",
        street: "Junkerngasse 39, 3011 Bern",
        city: "",
        email: "roman.frey@linkyard.ch",
        phone: "+41 79 512 26 11",
    },
    anlaesse: [
            {
                name: "Schwimmen",
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
});

const dummyOrganisationSeeds: OrganisationSeed[] = [
    {
        id: DEMO_ORG_ID.turnvereinNord,
        organisation: "Turnverein Nord",
        contact: {
            organisationName: "Turnverein Nord",
            contactPerson: "Mara Keller",
            phone: "+41 31 555 10 11",
            email: "mara.keller@tvnord.ch",
            street: "Breitenrainstrasse 20, 3013 Bern",
            city: "",
        },
        anlaesse: [
            {
                name: "Turnen",
                period: "Winterperiode (31.10.2026 - 30.04.2027)",
                location: "Turnhalle Breitenrain",
                times: ["Montag, 18:00 - 19:30"],
                status: "pending",
            },
            {
                name: "Turnen",
                period: "Jahresperiode (01.01.2027 - 31.12.2027)",
                location: "Turnhalle Breitenrain",
                times: ["Samstag, 09:30 - 12:00"],
                status: "confirmed",
            },
            {
                name: "Geräteturnen",
                period: "Sommerperiode (01.05.2026 - 30.09.2026)",
                location: "Turnhalle Wankdorf",
                times: ["Sonntag, 08:00 - 17:00"],
                status: "pending",
            },
            {
                name: "Turnen",
                period: "Übergangsperiode (Sept. - Okt. 2026)",
                location: "Turnhalle Breitenrain",
                times: ["Mittwoch, 15:00 - 16:00", "Mittwoch, 16:15 - 17:15"],
                status: "confirmed",
            },
            {
                name: "Turnen",
                period: "Winterperiode (31.10.2026 - 30.04.2027)",
                location: "Gemeindesaal Breitenrain",
                times: ["Freitag, 18:30 - 23:00"],
                status: "pending",
            },
        ],
    },
    {
        id: DEMO_ORG_ID.fcBernOst,
        organisation: "FC Bern Ost",
        contact: {
            organisationName: "FC Bern Ost",
            contactPerson: "Jonas Wyss",
            phone: "+41 31 555 21 34",
            email: "jonas.wyss@fc-bern-ost.ch",
            street: "Murifeldweg 8, 3006 Bern",
            city: "",
        },
        billingContact: {
            organisationName: "FC Bern Ost",
            contactPerson: "Buchhaltung FC Bern Ost",
            phone: "+41 31 555 21 40",
            email: "rechnung@fc-bern-ost.ch",
            street: "Murifeldweg 10, 3006 Bern",
            city: "",
        },
        anlaesse: [
            {
                name: "Fussball",
                period: "Jahresperiode (01.01.2027 - 31.12.2027)",
                location: "Sportplatz Murifeld",
                times: ["Samstag, 10:00 - 16:00"],
                status: "confirmed",
            },
            {
                name: "Fussball",
                period: "Winterperiode (31.10.2026 - 30.04.2027)",
                location: "Sportplatz Murifeld",
                times: ["Samstag, 09:00 - 15:30"],
                status: "pending",
            },
            {
                name: "Fussball",
                period: "Übergangsperiode (Sept. - Okt. 2026)",
                location: "Sportplatz Murifeld",
                times: ["Freitag, 19:30 - 21:00"],
                status: "pending",
            },
            {
                name: "Fussball",
                period: "Sommerperiode (01.05.2026 - 30.09.2026)",
                location: "Sportplatz Murifeld",
                times: ["Dienstag, 19:00 - 21:00", "Donnerstag, 19:00 - 21:00"],
                status: "confirmed",
            },
            {
                name: "Fussball",
                period: "Jahresperiode (01.01.2027 - 31.12.2027)",
                location: "Stadion Wankdorf",
                times: ["Samstag, 14:00 - 17:30"],
                status: "pending",
            },
            {
                name: "Fussball",
                period: "Winterperiode (31.10.2026 - 30.04.2027)",
                location: "Sportplatz Murifeld",
                times: ["Sonntag, 10:00 - 14:00"],
                status: "confirmed",
            },
        ],
    },
    {
        id: DEMO_ORG_ID.schwimmclubMitte,
        organisation: "Schwimmclub Mitte",
        contact: {
            organisationName: "Schwimmclub Mitte",
            contactPerson: "Lea Gerber",
            phone: "+41 31 555 44 90",
            email: "lea.gerber@sc-mitte.ch",
            street: "Aareweg 2, 3011 Bern",
            city: "",
        },
        anlaesse: [
            {
                name: "Schwimmen",
                period: "Winterperiode (31.10.2026 - 30.04.2027)",
                location: "Schwimmbad Aarebad",
                times: ["Samstag, 08:00 - 13:00"],
                status: "confirmed",
            },
            {
                name: "Schwimmen",
                period: "Jahresperiode (01.01.2027 - 31.12.2027)",
                location: "Schwimmbad Aarebad",
                times: ["Dienstag, 17:00 - 18:00", "Donnerstag, 17:00 - 18:00"],
                status: "confirmed",
            },
            {
                name: "Schwimmen",
                period: "Sommerperiode (01.05.2026 - 30.09.2026)",
                location: "Freibad Marzili",
                times: ["Sonntag, 10:00 - 12:00"],
                status: "pending",
            },
            {
                name: "Schwimmen",
                period: "Übergangsperiode (Sept. - Okt. 2026)",
                location: "Schwimmbad Aarebad",
                times: ["Samstag, 07:30 - 16:00"],
                status: "pending",
            },
            {
                name: "Wasserball",
                period: "Winterperiode (31.10.2026 - 30.04.2027)",
                location: "Hallenbad City",
                times: ["Sonntag, 18:00 - 20:00"],
                status: "confirmed",
            },
        ],
    },
];

export const dummyOrganisations: Organisation[] = withAnlassHistory(dummyOrganisationSeeds.map(organisationWithAnlassIds));

/** All demo orgs (table + default Linkyard) for ID lookup until GraphQL replaces this. */
export const allDummyOrganisations: Organisation[] = [dummyOrganisation, ...dummyOrganisations];

export function getOrganisationById(organisationId: string): Organisation | undefined {
    return allDummyOrganisations.find((o) => o.id === organisationId);
}
