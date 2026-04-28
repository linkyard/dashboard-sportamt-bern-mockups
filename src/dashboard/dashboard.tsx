import {Button, Chip, Tooltip} from "@mui/material"
import {MaterialReactTable, type MRT_ColumnDef, MRT_GlobalFilterTextField, useMaterialReactTable} from "material-react-table"
import {MRT_Localization_DE} from "material-react-table/locales/de"
import {useMemo} from "react"
import {useTranslation} from "react-i18next"
import {NavLink, useNavigate} from "react-router"
import {PageTitle} from "../components/page-title"
import {
    mrtSharedMrtTheme,
    mrtSharedTableBodyCellSx,
    mrtSharedTableHeadCellSx,
    mrtSharedTablePaperProps,
} from "../lib/material-react-table-styles"
import {formatDateSwiss} from "../util/date"
import styles from "./dashboard.module.scss"
import {type Board, boardLabelDateRanges, type BoardStatus, dummyBoards} from "./dummyData"

const boardStatusChipClass: Record<BoardStatus, string> = {
    erstellt: styles.statusChipErstellt,
    versandBereit: styles.statusChipVersandBereit,
}

export const Dashboard = () => {
    const {t} = useTranslation(["common", "dashboard"])
    const navigate = useNavigate()

    const columns = useMemo<MRT_ColumnDef<Board>[]>(
        () => [
            {
                accessorKey: "name",
                header: t("dashboard:dashboard.table.columns.name"),
                size: 200,
                sortDescFirst: false,
            },
            {
                accessorKey: "bemerkung",
                header: t("dashboard:dashboard.table.columns.bemerkung"),
                size: 300,
                Cell: ({row}) => <span className={styles.ellipsisText}>{row.original.bemerkung}</span>,
            },
            {
                accessorKey: "startDate",
                header: t("dashboard:dashboard.table.columns.start-date"),
                size: 100,
                Cell: ({row}) => formatDateSwiss(row.original.startDate),
            },
            {
                accessorKey: "endDate",
                header: t("dashboard:dashboard.table.columns.end-date"),
                size: 100,
                Cell: ({row}) => formatDateSwiss(row.original.endDate),
            },
            {
                accessorKey: "status",
                header: t("dashboard:dashboard.table.columns.status"),
                size: 150,
                Cell: ({row}) => {
                    const key = row.original.status
                    return <Chip label={t(`dashboard:dashboard.table.status.${key}`)} size="small" className={boardStatusChipClass[key]} />
                },
            },
            {
                id: "anlaesseBestaetigt",
                accessorFn: (row) => `${row.anlaesseConfirmed} / ${row.anlaesseTotal}`,
                header: t("dashboard:dashboard.table.columns.bestaetigt"),
                size: 120,
                Cell: ({row}) => {
                    const c = row.original.anlaesseConfirmed
                    const n = row.original.anlaesseTotal
                    const label = t("dashboard:dashboard.table.anlaesse-fraction", {confirmed: c, total: n})
                    const detail = t("dashboard:dashboard.table.anlaesse-fraction-detail", {confirmed: c, total: n})
                    return (
                        <Tooltip title={detail} arrow>
                            <span className={styles.bestaetigtFraction}>{label}</span>
                        </Tooltip>
                    )
                },
            },
            {
                accessorFn: (row) => row.labels.join(" "),
                id: "labels",
                header: t("dashboard:dashboard.table.columns.labels"),
                Cell: ({row}) => (
                    <div className={styles.labelsCell}>
                        {row.original.labels.map((label) => (
                            <Tooltip key={`${row.original.name}-${label}`} title={`${label} ${boardLabelDateRanges[label]}`} arrow>
                                <Chip label={label} size="small" />
                            </Tooltip>
                        ))}
                    </div>
                ),
            },
        ],
        [t]
    )

    const table = useMaterialReactTable({
        columns,
        data: dummyBoards,
        mrtTheme: mrtSharedMrtTheme,
        localization: {...MRT_Localization_DE, language: "de-CH"},
        layoutMode: "grid",
        defaultColumn: {minSize: 60},
        initialState: {
            density: "comfortable",
            showGlobalFilter: true,
            sorting: [
                {id: "startDate", desc: true},
                {id: "endDate", desc: true},
                {id: "name", desc: false},
            ],
        },
        enablePagination: false,
        enableGlobalFilter: true,
        globalFilterFn: "contains",
        enableColumnActions: false,
        enableColumnFilters: false,
        enableDensityToggle: false,
        enableColumnResizing: true,
        enableHiding: false,
        enableFullScreenToggle: false,
        enableTopToolbar: false,
        enableBottomToolbar: false,
        muiTableBodyRowProps: ({row}) => ({
            onClick: () => navigate(`/board/${row.original.id}`),
            sx: {
                cursor: "pointer",
            },
        }),
        muiSearchTextFieldProps: {
            placeholder: t("common:actions.search"),
            size: "small",
            slotProps: {
                htmlInput: {
                    "aria-label": t("common:actions.search"),
                    style: {
                        paddingTop: "4px",
                        paddingBottom: "4px",
                    },
                },
            },
        },

        muiTableHeadCellProps: () => ({
            sx: (theme) => ({
                ...mrtSharedTableHeadCellSx(theme),
            }),
        }),
        muiTableBodyCellProps: {
            sx: mrtSharedTableBodyCellSx,
        },
        muiTablePaperProps: mrtSharedTablePaperProps,
        muiTableContainerProps: {
            sx: {
                maxHeight: {xs: "none", sm: "calc(100vh - 300px)"},
                overflowX: "auto",
                overflowY: {xs: "visible", sm: "auto"},
            },
        },
    })
    return (
        <>
            <PageTitle title={t("dashboard:dashboard.title")} />
            <div className={styles.tableToolbar}>
                <div className={styles.tableToolbarSearch}>
                    <MRT_GlobalFilterTextField table={table} fullWidth />
                </div>
                <div className={styles.toolbarActions}>
                    <Button component={NavLink} to="/board" variant="contained" size="small">
                        {t("dashboard:dashboard.table.create-new-board-button")}
                    </Button>
                </div>
            </div>
            <MaterialReactTable table={table} />
        </>
    )
}
