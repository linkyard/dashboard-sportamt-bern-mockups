import {faPenToSquare, faTrash} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import DomainIcon from "@mui/icons-material/Domain"
import {Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, Snackbar, Tooltip} from "@mui/material"
import {type MRT_ColumnDef, type MRT_TableOptions} from "material-react-table"
import {useMemo, useState} from "react"
import {useTranslation} from "react-i18next"
import {useNavigate} from "react-router"
import {ConfirmDeleteDialog} from "../../../components/confirm-delete-dialog"
import {stammdatenSeedHolidays, stammdatenSeedLocations} from "../../../dummyData"
import {MaterialReactTableBase} from "../../../lib/material-react-table-base"
import mrt from "../../../lib/material-react-table-styles.module.scss"
import {formatDateSwiss} from "../../../util/date"
import {ensureHolidayClosure} from "./holiday-closure"
import type {HolidayRowData} from "./holiday-types"
import styles from "./holiday.table.module.scss"

const MOCK_YEAR_OPTIONS = [2030, 2029, 2028, 2027, 2026, 2025, 2024]

const DEFAULT_YEAR = 2027

function holidayOverlapsYear(h: HolidayRowData, year: number): boolean {
    const ys = `${year}-01-01`
    const ye = `${year}-12-31`
    return h.startDate <= ye && h.endDate >= ys
}

export const FerienTable = () => {
    const {t} = useTranslation("dashboard")
    const navigate = useNavigate()
    const [selectedYear, setSelectedYear] = useState<number>(DEFAULT_YEAR)
    const [snackbar, setSnackbar] = useState<string | null>(null)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

    const holidays = useMemo(() => stammdatenSeedHolidays.map((h) => ensureHolidayClosure(h, stammdatenSeedLocations)), [])

    const tableData = useMemo(() => {
        return [...holidays].filter((h) => holidayOverlapsYear(h, selectedYear)).sort((a, b) => a.startDate.localeCompare(b.startDate))
    }, [holidays, selectedYear])

    const columns = useMemo<MRT_ColumnDef<HolidayRowData>[]>(
        () => [
            {
                accessorKey: "name",
                header: t("master-data.holidays-table.columns.name"),
                grow: true,
                size: 200,
                minSize: 160,
                muiTableHeadCellProps: {align: "left"},
                muiTableBodyCellProps: {align: "left"},
                Cell: ({row}) => <span className={styles.ellipsis}>{row.original.name}</span>,
            },
            {
                accessorKey: "startDate",
                id: "startDate",
                header: t("master-data.holidays-table.columns.start"),
                size: 120,
                maxSize: 120,
                minSize: 120,
                grow: false,
                enableSorting: false,
                accessorFn: (row) => row.startDate,
                Cell: ({row}) => formatDateSwiss(row.original.startDate),
                muiTableHeadCellProps: {align: "left"},
                muiTableBodyCellProps: {align: "left"},
            },
            {
                accessorKey: "endDate",
                id: "endDate",
                header: t("master-data.holidays-table.columns.end"),
                size: 120,
                maxSize: 120,
                minSize: 120,
                grow: false,
                enableSorting: false,
                accessorFn: (row) => row.endDate,
                Cell: ({row}) => formatDateSwiss(row.original.endDate),
                muiTableHeadCellProps: {align: "left"},
                muiTableBodyCellProps: {align: "left"},
            },
            {
                id: "closedObjekte",
                accessorFn: (row) => row.closedObjekteCount,
                header: t("master-data.holidays-table.columns.closed-objects"),
                size: 200,
                minSize: 180,
                grow: true,
                enableSorting: false,
                muiTableHeadCellProps: {align: "left"},
                muiTableBodyCellProps: {align: "left"},
                Cell: ({row}) => (
                    <div className={styles.closedObjekteCell}>
                        <DomainIcon fontSize="small" color="action" aria-hidden />
                        <span>{t("master-data.holidays-table.closed-objects-summary", {count: row.original.closedObjekteCount})}</span>
                    </div>
                ),
            },
        ],
        [t]
    )

    const ferienTableOptions = useMemo((): Partial<MRT_TableOptions<HolidayRowData>> => {
        return {
            getRowId: (row) => row.id,
            initialState: {
                density: "comfortable",
            },
            enableExpanding: false,
            enableSorting: false,
            enableGlobalFilter: false,
            enableStickyHeader: true,
            enableRowDragging: false,
            enableRowOrdering: false,
            positionToolbarAlertBanner: "none",
            positionGlobalFilter: "none",
            enableRowActions: true,
            positionActionsColumn: "last",
            displayColumnDefOptions: {
                "mrt-row-actions": {
                    size: 96,
                    maxSize: 96,
                    minSize: 96,
                    grow: false,
                    muiTableHeadCellProps: {
                        align: "right",
                        className: `${mrt.headCell} ${mrt.treeColumnPadding}`,
                        sx: {textAlign: "right"},
                    },
                    muiTableBodyCellProps: {
                        align: "right",
                        className: mrt.bodyCell,
                        sx: {verticalAlign: "middle"},
                    },
                },
            },
            muiTableContainerProps: {
                sx: {maxHeight: "min(70vh, 560px)"},
            },
            muiTableBodyRowProps: {
                hover: true,
            },
            renderRowActions: ({row}) => (
                <Box className={styles.rowActions}>
                    <Tooltip title={t("master-data.holidays-table.edit")}>
                        <IconButton
                            size="small"
                            aria-label={t("master-data.holidays-table.edit")}
                            onClick={() => navigate(`/admin/stammdaten/ferien/holiday/${row.original.id}/edit`)}
                        >
                            <FontAwesomeIcon icon={faPenToSquare} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t("master-data.holidays-table.delete")}>
                        <IconButton
                            size="small"
                            aria-label={t("master-data.holidays-table.delete")}
                            onClick={() => setDeleteTargetId(row.original.id)}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        }
    }, [navigate, t])

    return (
        <>
            <MaterialReactTableBase
                columns={columns}
                data={tableData}
                options={ferienTableOptions}
                disableSearch
                toolbarStart={
                    <FormControl size="small" className={styles.toolbarYear}>
                        <InputLabel id="ferien-year-label">{t("master-data.holidays-table.year-label")}</InputLabel>
                        <Select<number>
                            labelId="ferien-year-label"
                            label={t("master-data.holidays-table.year-label")}
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                        >
                            {MOCK_YEAR_OPTIONS.map((y) => (
                                <MenuItem key={y} value={y}>
                                    {y}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                }
                toolbarActionButtons={
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => {
                            setCreateDialogOpen(true)
                        }}
                    >
                        {t("master-data.holidays-table.add-holiday")}
                    </Button>
                }
            />

            {createDialogOpen ? (
                // TODO: Create dialog here:
                <></>
            ) : null}

            <ConfirmDeleteDialog
                open={Boolean(deleteTargetId)}
                onClose={() => setDeleteTargetId(null)}
                onConfirm={() => {
                    setDeleteTargetId(null)
                }}
                title={t("master-data.holidays-table.delete-title")}
            >
                {t("master-data.holidays-table.delete-body")}
            </ConfirmDeleteDialog>

            <Snackbar open={Boolean(snackbar)} autoHideDuration={5000} onClose={() => setSnackbar(null)} message={snackbar} />
        </>
    )
}
