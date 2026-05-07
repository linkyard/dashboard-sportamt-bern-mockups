import {Checkbox} from "@mui/material"
import Box from "@mui/material/Box"
import {MRT_ExpandButton, type MRT_ColumnDef, type MRT_TableOptions} from "material-react-table"
import {useCallback, useMemo, useState, type ReactElement} from "react"
import {useTranslation} from "react-i18next"
import {splitIntoFerienwochen} from "../../admin/master-data/holiday/holiday-closure"
import type {HolidayRowData} from "../../admin/master-data/holiday/holiday-types"
import {PageTitle} from "../../components/page-title"
import {stammdatenSeedHolidays} from "../../dummyData"
import {MaterialReactTableBase} from "../../lib/material-react-table-base"
import mrt from "../../lib/material-react-table-styles.module.scss"
import {formatDateSwiss} from "../../util/date"
import styles from "../reservation.editor.module.scss"

function parseYearFromPeriod(period: string | undefined): number {
    if (!period?.trim()) {
        return 2026
    }
    const m = /\b(20\d{2})\b/.exec(period)
    return m ? Number(m[1]) : 2026
}

export type HolidayWeekRow = {
    rowKind: "week"
    id: string
    parentFerienId: string
    weekIndex: number
    startDate: string
    endDate: string
}

export type HolidayParentRow = {
    rowKind: "ferien"
    id: string
    name: string
    startDate: string
    endDate: string
    subRows: HolidayWeekRow[]
}

export type HolidayUsageTableRow = HolidayParentRow | HolidayWeekRow

function buildRows(holidays: HolidayRowData[]): HolidayParentRow[] {
    return holidays.map((h) => {
        const weekMetas = splitIntoFerienwochen(h.startDate, h.endDate)
        const subRows: HolidayWeekRow[] = weekMetas.map((w, i) => ({
            rowKind: "week",
            id: `${h.id}-${w.id}`,
            parentFerienId: h.id,
            weekIndex: i + 1,
            startDate: w.startDate,
            endDate: w.endDate,
        }))

        return {
            rowKind: "ferien",
            id: h.id,
            name: h.name,
            startDate: h.startDate,
            endDate: h.endDate,
            subRows,
        }
    })
}

export interface HolidayUsageTableProps {
    periodLabel?: string
}

export function HolidayUsageTable({periodLabel}: HolidayUsageTableProps): ReactElement {
    const {t} = useTranslation("dashboard")
    const year = parseYearFromPeriod(periodLabel)

    const holidays = useMemo(
        () =>
            stammdatenSeedHolidays.filter((h) => h.startDate.startsWith(`${year}-`)).sort((a, b) => a.startDate.localeCompare(b.startDate)),
        [year]
    )

    const tableRows = useMemo(() => buildRows(holidays), [holidays])

    const [weekSelected, setWeekSelected] = useState<Record<string, boolean>>({})

    const toggleWeek = useCallback((weekId: string) => {
        setWeekSelected((prev) => ({...prev, [weekId]: !prev[weekId]}))
    }, [])

    const toggleFerienWeeks = useCallback((parent: HolidayParentRow) => {
        const ids = parent.subRows.map((w) => w.id)
        setWeekSelected((prev) => {
            const allOn = ids.length > 0 && ids.every((id) => prev[id])
            const next = {...prev}
            if (allOn) {
                for (const id of ids) {
                    next[id] = false
                }
            } else {
                for (const id of ids) {
                    next[id] = true
                }
            }
            return next
        })
    }, [])

    const columns = useMemo<MRT_ColumnDef<HolidayUsageTableRow>[]>(
        () => [
            {
                id: "name",
                accessorFn: (row) => (row.rowKind === "ferien" ? row.name : row.weekIndex),
                header: t("organisation-public.reservation.holidays.columns.name"),
                grow: true,
                minSize: 160,
                size: 220,
                enableSorting: false,
                Cell: ({row}) =>
                    row.original.rowKind === "ferien" ? (
                        <span>{row.original.name}</span>
                    ) : (
                        <span>
                            {t("organisation-public.reservation.holidays.week-label", {
                                n: row.original.weekIndex,
                            })}
                        </span>
                    ),
            },
            {
                accessorKey: "startDate",
                header: t("organisation-public.reservation.holidays.columns.from"),
                size: 200,
                grow: false,
                enableSorting: false,
                Cell: ({row}) => formatDateSwiss(row.original.startDate),
            },
            {
                accessorKey: "endDate",
                header: t("organisation-public.reservation.holidays.columns.to"),
                size: 200,
                grow: false,
                enableSorting: false,
                Cell: ({row}) => formatDateSwiss(row.original.endDate),
            },
            {
                id: "benutzung",
                header: t("organisation-public.reservation.holidays.columns.usage"),
                size: 120,
                maxSize: 120,
                minSize: 120,
                grow: false,
                enableSorting: false,
                muiTableHeadCellProps: {align: "center"},
                muiTableBodyCellProps: {align: "center"},
                Cell: ({row}) => {
                    if (row.original.rowKind === "week") {
                        const id = row.original.id
                        const checked = Boolean(weekSelected[id])
                        return (
                            <Checkbox
                                size="small"
                                checked={checked}
                                onChange={(e) => {
                                    e.stopPropagation()
                                    toggleWeek(id)
                                }}
                                slotProps={{
                                    input: {
                                        "aria-label": t("organisation-public.reservation.holidays.usage-week-aria", {
                                            name: t("organisation-public.reservation.holidays.week-label", {n: row.original.weekIndex}),
                                        }),
                                    },
                                }}
                            />
                        )
                    }

                    const parent = row.original
                    const weekIds = parent.subRows.map((w) => w.id)
                    const n = weekIds.length
                    const selectedCount = weekIds.filter((wid) => weekSelected[wid]).length
                    const checked = n > 0 && selectedCount === n
                    const indeterminate = selectedCount > 0 && selectedCount < n

                    return (
                        <Checkbox
                            size="small"
                            checked={checked}
                            indeterminate={indeterminate}
                            onChange={(e) => {
                                e.stopPropagation()
                                toggleFerienWeeks(parent)
                            }}
                            slotProps={{
                                input: {
                                    "aria-label": t("organisation-public.reservation.holidays.usage-holidays-aria", {name: parent.name}),
                                },
                            }}
                        />
                    )
                },
            },
        ],
        [t, toggleFerienWeeks, toggleWeek, weekSelected]
    )

    const tableOptions = useMemo((): Partial<MRT_TableOptions<HolidayUsageTableRow>> => {
        return {
            getRowId: (row) => row.id,
            getSubRows: (row) => (row.rowKind === "ferien" ? row.subRows : undefined),
            enableExpanding: true,
            enableExpandAll: false,
            enableSorting: false,
            enableGlobalFilter: false,
            positionGlobalFilter: "none",
            muiExpandButtonProps: {size: "small"},
            displayColumnDefOptions: {
                "mrt-row-expand": {
                    size: 40,
                    grow: false,
                    maxSize: 40,
                    minSize: 40,
                    muiTableHeadCellProps: {
                        align: "center",
                        className: `${mrt.headCell} ${mrt.treeColumnPadding}`,
                    },
                    muiTableBodyCellProps: ({row}) => ({
                        align: "center",
                        className: row.depth > 0 ? `${mrt.nestedRowRail} ${mrt.bodyCell}` : mrt.bodyCell,
                        sx: {verticalAlign: "middle"},
                    }),
                    Cell: ({row, staticRowIndex, table}) =>
                        row.original.rowKind === "ferien" ? (
                            <MRT_ExpandButton row={row} staticRowIndex={staticRowIndex} table={table} />
                        ) : (
                            <Box sx={{width: "100%"}} />
                        ),
                },
            },
            muiTableContainerProps: {
                sx: {
                    maxHeight: "min(70vh, 520px)",
                    // Keeps column widths steady when overflow scrollbar appears after expanding rows.
                    scrollbarGutter: "stable",
                },
            },
        }
    }, [])

    return (
        <section className={styles.sectionCard}>
            <div className={styles.sectionHeading}>
                <PageTitle
                    title={t("organisation-public.reservation.holidays.title")}
                    isSubTitle
                    toolTipContent={t("organisation-public.reservation.section-info-tooltip")}
                />
            </div>
            {holidays.length === 0 ? (
                <p>{t("organisation-public.reservation.holidays.empty-year", {year})}</p>
            ) : (
                <MaterialReactTableBase data={tableRows} columns={columns} options={tableOptions} disableSearch />
            )}
        </section>
    )
}
