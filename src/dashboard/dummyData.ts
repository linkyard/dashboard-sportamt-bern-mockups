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
