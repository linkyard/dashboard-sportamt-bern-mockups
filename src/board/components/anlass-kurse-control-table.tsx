import {faPenToSquare, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Box, Button, Chip, IconButton, Snackbar, Tooltip} from "@mui/material"
import {type MRT_ColumnDef, type MRT_TableOptions} from "material-react-table"
import {useMemo, useState} from "react"
import {useTranslation} from "react-i18next"
import {
    organisationPublicKursObjekteByTimeBlockSeed,
    organisationPublicKursTimeBlocks,
    organisationPublicTrainerOptions,
} from "../../dummyData"
import {SportamtMaterialReactTableBase} from "../../lib/material-react-table-base"
import mrt from "../../lib/material-react-table-styles.module.scss"
import styles from "./anlass-kurse-control-table.module.scss"

type KursControlRow = {
    id: string
    weekdayLabel: string
    timeRange: string
    objekte: string[]
    trainersLabel: string
}

function buildKurseRows(t: (key: string, options?: Record<string, unknown>) => string): KursControlRow[] {
    const trainerByTimeBlockId: Record<string, string[]> = {
        "kurs-1": ["roman-frey"],
        "kurs-2": [],
    }

    return organisationPublicKursTimeBlocks.map((block) => {
        const objekte = organisationPublicKursObjekteByTimeBlockSeed[block.id] ?? []
        const trainerNames = (trainerByTimeBlockId[block.id] ?? [])
            .map((trainerId) => organisationPublicTrainerOptions.find((option) => option.id === trainerId)?.name)
            .filter((name): name is string => Boolean(name))

        return {
            id: block.id,
            weekdayLabel: t(`organisation-public.anlass.kurse.${block.weekdayKey}`),
            timeRange: block.timeRange,
            objekte: objekte.map((objekt) => objekt.label),
            trainersLabel: trainerNames.length > 0 ? trainerNames.join(", ") : "—",
        }
    })
}

export const AnlassKurseControlTable: React.FC = () => {
    const {t} = useTranslation("dashboard")
    const [snackbar, setSnackbar] = useState<string | null>(null)
    const data = useMemo(() => buildKurseRows(t), [t])

    const columns = useMemo<MRT_ColumnDef<KursControlRow>[]>(
        () => [
            {
                accessorKey: "weekdayLabel",
                header: t("organisation-admin.anlass-detail.kurse-table.columns.weekday"),
                size: 130,
                minSize: 120,
                muiTableHeadCellProps: {align: "left"},
                muiTableBodyCellProps: {align: "left"},
            },
            {
                accessorKey: "timeRange",
                header: t("organisation-admin.anlass-detail.kurse-table.columns.time"),
                size: 150,
                minSize: 130,
                muiTableHeadCellProps: {align: "left"},
                muiTableBodyCellProps: {align: "left"},
            },
            {
                accessorKey: "trainersLabel",
                header: t("organisation-admin.anlass-detail.kurse-table.columns.trainers"),
                grow: true,
                minSize: 240,
                muiTableHeadCellProps: {align: "left"},
                muiTableBodyCellProps: {align: "left"},
            },
            {
                id: "objekte",
                accessorFn: (row) => row.objekte.join(" "),
                header: t("organisation-admin.anlass-detail.kurse-table.columns.objekte"),
                grow: true,
                minSize: 220,
                muiTableHeadCellProps: {align: "left"},
                muiTableBodyCellProps: {align: "left"},
                Cell: ({row}) =>
                    row.original.objekte.length > 0 ? (
                        <Box className={styles.objekteChips}>
                            {row.original.objekte.map((label) => (
                                <Chip key={`${row.original.id}-${label}`} label={label} className={styles.objektChip} variant="outlined" />
                            ))}
                        </Box>
                    ) : (
                        "—"
                    ),
            },
        ],
        [t]
    )

    const options = useMemo(
        (): Partial<MRT_TableOptions<KursControlRow>> => ({
            getRowId: (row) => row.id,
            initialState: {density: "comfortable", showGlobalFilter: true},
            enableExpanding: false,
            enableSorting: false,
            manualFiltering: false,
            enableStickyHeader: true,
            enableRowDragging: false,
            enableRowOrdering: false,
            positionToolbarAlertBanner: "none",
            positionGlobalFilter: "none",
            enableRowActions: true,
            positionActionsColumn: "last",
            displayColumnDefOptions: {
                "mrt-row-actions": {
                    size: 88,
                    maxSize: 88,
                    minSize: 88,
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
                "aria-label": t("organisation-admin.anlass-detail.kurse-table.list-aria-label"),
            },
            muiTableBodyRowProps: {hover: true},
            renderRowActions: () => (
                <Box className={styles.rowActions}>
                    <Tooltip title={t("organisation-admin.anlass-detail.kurse-table.edit")}>
                        <IconButton size="small" onClick={() => setSnackbar(t("organisation-admin.anlass-detail.kurse-table.coming-soon"))}>
                            <FontAwesomeIcon icon={faPenToSquare} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t("organisation-admin.anlass-detail.kurse-table.delete")}>
                        <IconButton size="small" onClick={() => setSnackbar(t("organisation-admin.anlass-detail.kurse-table.coming-soon"))}>
                            <FontAwesomeIcon icon={faTrash} />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        }),
        [t]
    )

    return (
        <>
            <SportamtMaterialReactTableBase
                columns={columns}
                data={data}
                options={options}
                toolbarActionButtons={
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<FontAwesomeIcon icon={faPlus} />}
                        onClick={() => setSnackbar(t("organisation-admin.anlass-detail.kurse-table.coming-soon"))}
                    >
                        {t("organisation-admin.anlass-detail.kurse-table.add")}
                    </Button>
                }
            />
            <Snackbar open={Boolean(snackbar)} autoHideDuration={2500} onClose={() => setSnackbar(null)} message={snackbar} />
        </>
    )
}
