import SearchIcon from "@mui/icons-material/Search"
import {InputAdornment} from "@mui/material"
import {
    MaterialReactTable,
    MRT_GlobalFilterTextField,
    useMaterialReactTable,
    type MRT_ColumnDef,
    type MRT_RowData,
    type MRT_TableOptions,
    type MRT_Theme,
} from "material-react-table"
import {MRT_Localization_DE} from "material-react-table/locales/de"
import {useMemo, type ReactElement, type ReactNode} from "react"
import {useTranslation} from "react-i18next"
import mrt from "./material-react-table-styles.module.scss"

const sportamtMrtTheme: Partial<MRT_Theme> = {
    baseBackgroundColor: "#f8f8f8",
}

interface Props<R extends MRT_RowData> {
    data: R[]
    columns: MRT_ColumnDef<R>[]
    options?: Partial<MRT_TableOptions<R>>
    toolbarStart?: ReactNode
    toolbarActionButtons?: ReactNode
    /** When true, omits the global filter field */
    disableSearch?: boolean
}

export function SportamtMaterialReactTableBase<R extends MRT_RowData>({
    data: tableData,
    columns,
    options,
    toolbarStart,
    toolbarActionButtons,
    disableSearch,
}: Props<R>): ReactElement {
    const {t} = useTranslation(["common"])

    const {
        muiTableBodyRowProps: callerRowOpts,
        muiTableBodyCellProps: callerCellOpts,
        displayColumnDefOptions: callerDisplayColumns,
        ...callerRestOpts
    } = options ?? {}

    const muiSearchTextFieldProps = useMemo(
        (): MRT_TableOptions<R>["muiSearchTextFieldProps"] =>
            ({
                placeholder: t("common:actions.search"),
                size: "small",
                slotProps: {
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" color="action" aria-hidden />
                            </InputAdornment>
                        ),
                    },
                    htmlInput: {
                        "aria-label": t("common:actions.search"),
                        style: {
                            paddingTop: "4px",
                            paddingBottom: "4px",
                        },
                    },
                },
            }) as MRT_TableOptions<R>["muiSearchTextFieldProps"],
        [t]
    )

    const table = useMaterialReactTable({
        columns,
        data: tableData,
        mrtTheme: sportamtMrtTheme,
        localization: {...MRT_Localization_DE, language: "de-CH"},
        layoutMode: "grid",
        defaultColumn: {minSize: 60},
        enablePagination: false,
        enableColumnActions: false,
        enableColumnFilters: false,
        enableDensityToggle: false,
        enableHiding: false,
        enableFullScreenToggle: false,
        enableTopToolbar: false,
        enableBottomToolbar: false,
        enableGlobalFilter: true,
        globalFilterFn: "contains",
        muiSearchTextFieldProps,
        muiTablePaperProps: {elevation: 0, className: mrt.tablePaper},
        muiTableHeadCellProps: {className: mrt.headCell},
        ...callerRestOpts,
        displayColumnDefOptions: {
            ...callerDisplayColumns,
            "mrt-row-expand": {...callerDisplayColumns?.["mrt-row-expand"], header: ""},
        },
        muiTableBodyCellProps: (args) => {
            const base = typeof callerCellOpts === "function" ? callerCellOpts(args) : callerCellOpts
            const mergedClassName = base?.className ? `${base.className} ${mrt.bodyCell}` : mrt.bodyCell
            return {...(base ?? {}), className: mergedClassName || undefined}
        },
        muiTableBodyRowProps: (args) => ({
            ...(typeof callerRowOpts === "function" ? callerRowOpts(args) : (callerRowOpts ?? {})),
            ...(args.row.depth > 0 || args.isDetailPanel ? {"data-sportamt-mrt-inner": ""} : {}),
        }),
    })

    return (
        <>
            <div className={mrt.tableToolbar} style={toolbarStart ? {justifyContent: "space-between"} : {justifyContent: "flex-end"}}>
                {toolbarStart}

                <div className={mrt.tableToolbarSearch}>
                    {!disableSearch ? <MRT_GlobalFilterTextField table={table} fullWidth /> : null}
                </div>
                {toolbarActionButtons ? <div className={mrt.toolbarActions}>{toolbarActionButtons}</div> : null}
            </div>
            <MaterialReactTable table={table} />
        </>
    )
}
