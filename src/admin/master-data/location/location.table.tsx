import {faPenToSquare, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Box, Button, IconButton, Snackbar, Tooltip} from "@mui/material"
import {type MRT_ColumnDef, MRT_ExpandButton, type MRT_Row, MRT_TableBodyRowGrabHandle, type MRT_TableOptions} from "material-react-table"
import {type ReactNode, useCallback, useMemo, useState} from "react"
import {useTranslation} from "react-i18next"
import {ConfirmDeleteDialog} from "../../../components/confirm-delete-dialog"
import {SportamtMaterialReactTableBase} from "../../../lib/material-react-table-base"
import mrt from "../../../lib/material-react-table-styles.module.scss"
import {type LocationRowData, type ObjektRowData, type StammdatenObjekteRow} from "./location-types"
import {CreateLocationDialog, EditLocationDialog, ObjektDialog} from "./location.table.dialogs"
import {moveObjektRelativeToHover, moveObjektToLocationEnd} from "./location"
import styles from "./location.table.module.scss"

function filterLocationsForSearch(locations: LocationRowData[], query: string): LocationRowData[] {
    const q = query.trim().toLowerCase()
    if (!q) {
        return locations
    }
    return locations
        .map((loc) => {
            if (loc.name.toLowerCase().includes(q)) {
                return loc
            }
            const subRows = loc.subRows.filter((o) => o.name.toLowerCase().includes(q))
            return subRows.length ? {...loc, subRows} : null
        })
        .filter((row): row is LocationRowData => row != null)
}

function StammdatenNameCell({row, renderedCellValue}: {row: MRT_Row<StammdatenObjekteRow>; renderedCellValue: ReactNode}) {
    return (
        <Box sx={{display: "flex", alignItems: "center", gap: 0.5, minWidth: 0, width: "100%"}}>
            {row.original.rowKind === "objekt" && row.original.sportIcon ? (
                <span className={styles.sportIconWrap} aria-hidden>
                    <FontAwesomeIcon icon={row.original.sportIcon} className={styles.sportIcon} />
                </span>
            ) : null}
            <span className={styles.nameCellText}>{renderedCellValue}</span>
        </Box>
    )
}

export interface LocationsTableProps {
    initialLocations: LocationRowData[]
}

export const LocationsTable = ({initialLocations}: LocationsTableProps) => {
    const {t} = useTranslation("dashboard")
    const [locations, setLocations] = useState<LocationRowData[]>(() => structuredClone(initialLocations))
    const [snackbar, setSnackbar] = useState<string | null>(null)

    const [locationDialog, setLocationDialog] = useState<null | {mode: "create" | "edit"; location?: LocationRowData}>(null)
    const [objektDialog, setObjektDialog] = useState<null | {mode: "create" | "edit"; locationId: string; objekt?: ObjektRowData}>(null)
    const [deleteTarget, setDeleteTarget] = useState<
        null | {kind: "location"; id: string} | {kind: "objekt"; id: string; locationId: string}
    >(null)
    const [createLocationDialogKey, setCreateLocationDialogKey] = useState(0)
    const [searchQuery, setSearchQuery] = useState("")

    const showError = useCallback((message: string) => setSnackbar(message), [])

    const tableData = useMemo(() => filterLocationsForSearch(locations, searchQuery), [locations, searchQuery])

    const columns = useMemo<MRT_ColumnDef<StammdatenObjekteRow>[]>(
        () => [
            {
                accessorKey: "name",
                header: t("master-data.objects-table.columns.name"),
                grow: true,
                size: 200,
                minSize: 200,
                maxSize: 200,
                muiTableHeadCellProps: {align: "left"},
                muiTableBodyCellProps: {align: "left"},
                Cell: ({row, renderedCellValue}) => <StammdatenNameCell row={row} renderedCellValue={renderedCellValue} />,
            },
            {
                id: "objekteCount",
                accessorFn: (row) => (row.rowKind === "location" ? row.subRows.length : null),
                header: t("master-data.objects-table.columns.object-count"),
                size: 88,
                maxSize: 88,
                minSize: 88,
                grow: false,
                enableSorting: false,
                muiTableHeadCellProps: {
                    align: "right",
                    className: mrt.headCell,
                    sx: {
                        textAlign: "right",
                        whiteSpace: "nowrap",
                    },
                },
                muiTableBodyCellProps: {
                    align: "right",
                    sx: {textAlign: "right", fontVariantNumeric: "tabular-nums"},
                },
                Cell: ({row, renderedCellValue}) => (row.original.rowKind === "location" ? <span>{renderedCellValue}</span> : ""),
            },
        ],
        [t]
    )

    const showNoSearchResults = locations.length > 0 && tableData.length === 0 && Boolean(searchQuery.trim())

    const locationsTableOptions = useMemo((): Partial<MRT_TableOptions<StammdatenObjekteRow>> => {
        return {
            getRowId: (row) => row.id,
            getSubRows: (row) => (row.rowKind === "location" ? row.subRows : undefined),
            initialState: {
                density: "comfortable",
                expanded: true,
                showGlobalFilter: true,
            },
            enableExpanding: true,
            enableExpandAll: true,
            muiExpandAllButtonProps: {
                size: "small",
                sx: {
                    width: "1.5rem",
                    height: "1.5rem",
                    mt: 0,
                    "& .MuiSvgIcon-root": {fontSize: "1.125rem"},
                },
            },
            muiExpandButtonProps: {size: "small"},
            enableSorting: false,
            manualFiltering: true,
            enableStickyHeader: true,
            enableRowDragging: false,
            enableRowOrdering: false,
            positionToolbarAlertBanner: "none",
            positionGlobalFilter: "none",
            state: {globalFilter: searchQuery},
            onGlobalFilterChange: (updater) => {
                setSearchQuery((prev) => {
                    const resolved = typeof updater === "function" ? updater(prev) : updater
                    return resolved ?? ""
                })
            },
            enableRowActions: true,
            positionActionsColumn: "last",
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
                    Cell: ({row, rowRef, staticRowIndex, table}) =>
                        row.original.rowKind === "location" ? (
                            <MRT_ExpandButton row={row} staticRowIndex={staticRowIndex} table={table} />
                        ) : row.original.rowKind === "objekt" && rowRef ? (
                            <Box sx={{display: "flex", width: "100%", justifyContent: "center", alignItems: "center"}}>
                                <MRT_TableBodyRowGrabHandle row={row} rowRef={rowRef} table={table} />
                            </Box>
                        ) : null,
                },
                "mrt-row-actions": {
                    size: 112,
                    maxSize: 112,
                    minSize: 112,
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
            muiRowDragHandleProps: ({table}) => ({
                size: "small",
                sx: (theme) => ({
                    color: theme.palette.grey[400],
                    opacity: 0.55,
                    padding: theme.spacing(0.25),
                    "&:hover": {
                        color: theme.palette.grey[600],
                        opacity: 1,
                    },
                    "& .MuiSvgIcon-root": {
                        fontSize: "1.05rem",
                    },
                }),
                onDragEnd: () => {
                    const {draggingRow, hoveredRow} = table.getState()
                    if (!draggingRow?.original || !hoveredRow?.original) {
                        return
                    }
                    const drag = draggingRow.original
                    const hover = hoveredRow.original
                    if (drag.rowKind !== "objekt") {
                        return
                    }
                    if (hover.rowKind === "location") {
                        setLocations((prev) => moveObjektToLocationEnd(prev, drag.id, hover.id))
                    } else {
                        setLocations((prev) => moveObjektRelativeToHover(prev, drag.id, hover.id))
                    }
                },
            }),
            muiTableContainerProps: {
                sx: {maxHeight: "min(70vh, 560px)"},
            },
            muiTableBodyRowProps: ({row, table}) => ({
                hover: true,
                onDragEnter: () => {
                    if (table.getState().draggingRow) {
                        table.setHoveredRow(row)
                    }
                },
                onDragOver: (e) => {
                    e.preventDefault()
                },
                ...(row.original.rowKind === "location"
                    ? {
                          // Standorte are drop targets only — not part of the drag preview styling.
                          sx: {opacity: 1},
                      }
                    : {}),
            }),
            renderRowActions: ({row}) => (
                <LocationTableActions
                    row={row}
                    locations={locations}
                    setLocationDialog={setLocationDialog}
                    setObjektDialog={setObjektDialog}
                    setDeleteTarget={setDeleteTarget}
                />
            ),
            ...(showNoSearchResults
                ? {
                      muiTablePaperProps: {elevation: 0, className: mrt.tablePaper, sx: {display: "none"}},
                  }
                : {}),
        }
    }, [locations, searchQuery, showNoSearchResults, setLocations])

    return (
        <>
            <SportamtMaterialReactTableBase
                columns={columns}
                data={tableData}
                options={locationsTableOptions}
                toolbarActionButtons={
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => {
                            setCreateLocationDialogKey((k) => k + 1)
                            setLocationDialog({mode: "create"})
                        }}
                    >
                        {t("master-data.objects-table.add-location")}
                    </Button>
                }
            />
            {showNoSearchResults ? <p className={styles.objekteSearchEmpty}>{t("common:no-search-results")}</p> : null}

            {locationDialog?.mode === "create" ? (
                <CreateLocationDialog
                    key={createLocationDialogKey}
                    open
                    onClose={() => setLocationDialog(null)}
                    onSave={(loc) => {
                        setLocations((prev) => [...prev, loc])
                        setLocationDialog(null)
                    }}
                    onValidationError={showError}
                />
            ) : null}

            {locationDialog?.mode === "edit" && locationDialog.location ? (
                <EditLocationDialog
                    key={locationDialog.location.id}
                    open
                    location={locationDialog.location}
                    onClose={() => setLocationDialog(null)}
                    onSave={(updated) => {
                        setLocations((prev) => prev.map((l) => (l.id === updated.id ? updated : l)))
                        setLocationDialog(null)
                    }}
                    onValidationError={showError}
                />
            ) : null}

            {objektDialog ? (
                <ObjektDialog
                    key={objektDialog.mode === "edit" && objektDialog.objekt ? objektDialog.objekt.id : "new-objekt"}
                    open
                    mode={objektDialog.mode}
                    objekt={objektDialog.objekt}
                    onClose={() => setObjektDialog(null)}
                    onSave={(o) => {
                        if (objektDialog.mode === "create") {
                            setLocations((prev) =>
                                prev.map((l) => (l.id === objektDialog.locationId ? {...l, subRows: [...l.subRows, o]} : l))
                            )
                        } else {
                            setLocations((prev) =>
                                prev.map((l) =>
                                    l.id === objektDialog.locationId ? {...l, subRows: l.subRows.map((s) => (s.id === o.id ? o : s))} : l
                                )
                            )
                        }
                        setObjektDialog(null)
                    }}
                    onValidationError={showError}
                />
            ) : null}

            {deleteTarget ? (
                <ConfirmDeleteDialog
                    open
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={() => setDeleteTarget(null)}
                    title={
                        deleteTarget.kind === "location"
                            ? t("master-data.objects-table.delete-location-title")
                            : t("master-data.objects-table.delete-object-title")
                    }
                >
                    {deleteTarget.kind === "location"
                        ? t("master-data.objects-table.delete-location-body")
                        : t("master-data.objects-table.delete-object-body")}
                </ConfirmDeleteDialog>
            ) : null}

            <Snackbar open={Boolean(snackbar)} autoHideDuration={5000} onClose={() => setSnackbar(null)} message={snackbar} />
        </>
    )
}

function findParentLocationId(locations: LocationRowData[], objektId: string): string | undefined {
    for (const loc of locations) {
        if (loc.subRows.some((o) => o.id === objektId)) {
            return loc.id
        }
    }
    return undefined
}

interface LocationTableActionsProps {
    row: MRT_Row<StammdatenObjekteRow>
    locations: LocationRowData[]
    setLocationDialog: (dialog: null | {mode: "create" | "edit"; location?: LocationRowData}) => void
    setObjektDialog: (dialog: null | {mode: "create" | "edit"; locationId: string; objekt?: ObjektRowData}) => void
    setDeleteTarget: (target: null | {kind: "location"; id: string} | {kind: "objekt"; id: string; locationId: string}) => void
}

function LocationTableActions({row, locations, setLocationDialog, setObjektDialog, setDeleteTarget}: LocationTableActionsProps) {
    const {t} = useTranslation("dashboard")

    return (
        <Box className={styles.rowActions}>
            <Box className={styles.rowActionsAddWrapper}>
                {row.original.rowKind === "location" ? (
                    <Tooltip title={t("master-data.objects-table.add-object")}>
                        <IconButton
                            size="small"
                            aria-label={t("master-data.objects-table.add-object")}
                            onClick={() => setObjektDialog({mode: "create", locationId: row.original.id})}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </IconButton>
                    </Tooltip>
                ) : null}
            </Box>
            <Tooltip title={t("master-data.objects-table.edit")}>
                <IconButton
                    size="small"
                    aria-label={t("master-data.objects-table.edit")}
                    onClick={() => {
                        const r = row.original
                        if (r.rowKind === "location") {
                            const fullLocation = locations.find((l) => l.id === r.id) ?? r
                            setLocationDialog({mode: "edit", location: fullLocation})
                        } else {
                            const parentId = findParentLocationId(locations, r.id)
                            if (parentId) {
                                setObjektDialog({mode: "edit", locationId: parentId, objekt: r})
                            }
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faPenToSquare} />
                </IconButton>
            </Tooltip>
            <Tooltip title={t("master-data.objects-table.delete")}>
                <IconButton
                    size="small"
                    aria-label={t("master-data.objects-table.delete")}
                    onClick={() => {
                        const r = row.original
                        if (r.rowKind === "location") {
                            setDeleteTarget({kind: "location", id: r.id})
                        } else {
                            const parentId = findParentLocationId(locations, r.id)
                            if (parentId) {
                                setDeleteTarget({kind: "objekt", id: r.id, locationId: parentId})
                            }
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </IconButton>
            </Tooltip>
        </Box>
    )
}
