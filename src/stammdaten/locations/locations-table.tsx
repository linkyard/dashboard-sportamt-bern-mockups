import {faPenToSquare, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Snackbar, TextField, Tooltip} from "@mui/material"
import {
    type MRT_ColumnDef,
    MRT_ExpandButton,
    type MRT_Row,
    MRT_TableBodyRowGrabHandle,
    MaterialReactTable,
    useMaterialReactTable,
} from "material-react-table"
import {MRT_Localization_DE} from "material-react-table/locales/de"
import {useCallback, useMemo, useState} from "react"
import {useTranslation} from "react-i18next"
import {SHOW_SPORT_ICONS} from "../../config/show-sport-icons"
import {
    mrtNestedRowRailSx,
    mrtSharedHeaderPaddingX,
    mrtSharedMrtTheme,
    mrtSharedTableBodyCellSx,
    mrtSharedTableHeadCellSx,
    mrtSharedTablePaperProps,
} from "../../lib/material-react-table-styles"
import {CreateLocationDialog, EditLocationDialog, ObjektDialog} from "./location-table-dialogs"
import {moveObjektRelativeToHover, moveObjektToLocationEnd} from "./locations"
import styles from "./locations-table.module.scss"
import {type LocationRowData, type ObjektRowData, type StammdatenObjekteRow} from "./locations-types"

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

function StammdatenNameCell({row}: {row: MRT_Row<StammdatenObjekteRow>}) {
    return (
        <Box sx={{display: "flex", alignItems: "center", gap: 0.5, minWidth: 0, width: "100%"}}>
            {row.original.rowKind === "objekt" && SHOW_SPORT_ICONS && row.original.sportIcon ? (
                <span className={styles.sportIconWrap} aria-hidden>
                    <FontAwesomeIcon icon={row.original.sportIcon} className={styles.sportIcon} />
                </span>
            ) : null}
            <span className={styles.nameCellText}>{row.original.name}</span>
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
                header: t("stammdaten.objekte-table.columns.name"),
                grow: true,
                size: 200,
                minSize: 200,
                maxSize: 200,
                muiTableHeadCellProps: {align: "left"},
                muiTableBodyCellProps: {align: "left"},
                Cell: ({row}) => <StammdatenNameCell row={row} />,
            },
            {
                id: "objekteCount",
                accessorFn: (row) => (row.rowKind === "location" ? row.subRows.length : null),
                header: t("stammdaten.objekte-table.columns.objekteCount"),
                size: 88,
                maxSize: 88,
                minSize: 88,
                grow: false,
                enableSorting: false,
                muiTableHeadCellProps: {
                    align: "right",
                    sx: (theme) => ({
                        ...mrtSharedTableHeadCellSx(theme),
                        textAlign: "right",
                        whiteSpace: "nowrap",
                    }),
                },
                muiTableBodyCellProps: {
                    align: "right",
                    sx: {textAlign: "right", fontVariantNumeric: "tabular-nums"},
                },
                Cell: ({row}) => (row.original.rowKind === "location" ? row.original.subRows.length : ""),
            },
        ],
        [t]
    )

    const table = useMaterialReactTable({
        columns,
        data: tableData,
        mrtTheme: mrtSharedMrtTheme,
        getRowId: (row) => row.id,
        getSubRows: (row) => (row.rowKind === "location" ? row.subRows : undefined),
        localization: {...MRT_Localization_DE, language: "de-CH"},
        layoutMode: "grid",
        defaultColumn: {minSize: 60},
        initialState: {
            density: "comfortable",
            expanded: true,
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
        enablePagination: false,
        enableGlobalFilter: false,
        enableColumnActions: false,
        enableColumnFilters: false,
        enableDensityToggle: false,
        enableHiding: false,
        enableFullScreenToggle: false,
        enableStickyHeader: true,
        enableTopToolbar: false,
        enableBottomToolbar: false,
        enableRowDragging: false,
        enableRowOrdering: false,
        positionToolbarAlertBanner: "none",
        positionGlobalFilter: "none",
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
                    sx: (theme) => ({
                        ...mrtSharedTableHeadCellSx(theme),
                        pl: mrtSharedHeaderPaddingX,
                        pr: mrtSharedHeaderPaddingX,
                    }),
                },
                muiTableBodyCellProps: ({row}) => ({
                    align: "center",
                    sx: (theme) => ({
                        ...mrtSharedTableBodyCellSx(theme),
                        ...mrtNestedRowRailSx(theme, row.depth),
                        verticalAlign: "middle",
                    }),
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
                    sx: (theme) => ({
                        ...mrtSharedTableHeadCellSx(theme),
                        pl: mrtSharedHeaderPaddingX,
                        pr: mrtSharedHeaderPaddingX,
                        textAlign: "right",
                    }),
                },
                muiTableBodyCellProps: {
                    align: "right",
                    sx: (theme) => ({
                        ...mrtSharedTableBodyCellSx(theme),
                        verticalAlign: "middle",
                    }),
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
        muiTablePaperProps: mrtSharedTablePaperProps,
        muiTableContainerProps: {
            sx: {maxHeight: "min(70vh, 560px)"},
        },
        muiTableHeadCellProps: {
            sx: mrtSharedTableHeadCellSx,
        },
        muiTableBodyCellProps: {
            sx: mrtSharedTableBodyCellSx,
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
    })

    return (
        <>
            <div className={styles.tableToolbar}>
                <div className={styles.tableToolbarSearch}>
                    <TextField
                        size="small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t("common:actions.search")}
                        aria-label={t("common:actions.search")}
                        fullWidth
                        slotProps={{
                            htmlInput: {
                                style: {
                                    paddingTop: "4px",
                                    paddingBottom: "4px",
                                },
                            },
                        }}
                    />
                </div>
                <div className={styles.toolbarActions}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => {
                            setCreateLocationDialogKey((k) => k + 1)
                            setLocationDialog({mode: "create"})
                        }}
                    >
                        {t("stammdaten.objekte-table.add-location")}
                    </Button>
                </div>
            </div>
            {locations.length > 0 && tableData.length === 0 && searchQuery.trim() ? (
                <p className={styles.objekteSearchEmpty}>{t("common:no-search-results")}</p>
            ) : (
                <MaterialReactTable table={table} />
            )}

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
                <Dialog open onClose={() => setDeleteTarget(null)}>
                    <DialogTitle>
                        {deleteTarget.kind === "location"
                            ? t("stammdaten.objekte-table.delete-location-title")
                            : t("stammdaten.objekte-table.delete-objekt-title")}
                    </DialogTitle>
                    <DialogContent>
                        {deleteTarget.kind === "location"
                            ? t("stammdaten.objekte-table.delete-location-body")
                            : t("stammdaten.objekte-table.delete-objekt-body")}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteTarget(null)}>{t("stammdaten.objekte-table.cancel")}</Button>
                        <Button
                            color="error"
                            variant="contained"
                            onClick={() => {
                                if (deleteTarget.kind === "location") {
                                    setLocations((prev) => prev.filter((l) => l.id !== deleteTarget.id))
                                } else {
                                    const loc = locations.find((l) => l.id === deleteTarget.locationId)
                                    if (loc && loc.subRows.length <= 1) {
                                        showError(t("stammdaten.objekte-table.last-objekt-error"))
                                        setDeleteTarget(null)
                                        return
                                    }
                                    setLocations((prev) =>
                                        prev.map((l) =>
                                            l.id === deleteTarget.locationId
                                                ? {...l, subRows: l.subRows.filter((s) => s.id !== deleteTarget.id)}
                                                : l
                                        )
                                    )
                                }
                                setDeleteTarget(null)
                            }}
                        >
                            {t("stammdaten.objekte-table.delete")}
                        </Button>
                    </DialogActions>
                </Dialog>
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
                    <Tooltip title={t("stammdaten.objekte-table.add-objekt")}>
                        <IconButton
                            size="small"
                            aria-label={t("stammdaten.objekte-table.add-objekt")}
                            onClick={() => setObjektDialog({mode: "create", locationId: row.original.id})}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </IconButton>
                    </Tooltip>
                ) : null}
            </Box>
            <Tooltip title={t("stammdaten.objekte-table.edit")}>
                <IconButton
                    size="small"
                    aria-label={t("stammdaten.objekte-table.edit")}
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
            <Tooltip title={t("stammdaten.objekte-table.delete")}>
                <IconButton
                    size="small"
                    aria-label={t("stammdaten.objekte-table.delete")}
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
