import SearchIcon from "@mui/icons-material/Search"
import { InputAdornment } from "@mui/material"
import { MaterialReactTable, type MRT_ColumnDef, MRT_GlobalFilterTextField, useMaterialReactTable } from "material-react-table"
import { MRT_Localization_DE } from "material-react-table/locales/de"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { allDummyOrganisations } from "../dashboard/dummyData"
import {
    mrtSharedHeaderPaddingX,
    mrtSharedMrtTheme,
    mrtSharedTableBodyCellSx,
    mrtSharedTableHeadCellSx,
    mrtSharedTablePaperProps,
} from "../lib/material-react-table-styles"
import styles from "./board-detail.module.scss"
import { AnlassInlineRow } from "./components/anlass-inline-row"
import type { Organisation } from "./organisation"

export interface OrganisationTableProps {
    selectedFileName: string
}

export const OrganisationTable: React.FC<OrganisationTableProps> = () => {
    const navigate = useNavigate()
    const {t} = useTranslation("dashboard")

    const organisationColumns = useMemo<MRT_ColumnDef<Organisation>[]>(
        () => [
            {
                accessorKey: "organisation",
                header: t("board-detail.organisation-table.columns.organisation") as string,
                sortDescFirst: false,
                grow: false,
                size: 350,
                maxSize: 350,
                minSize: 350,
            },
            {
                accessorFn: (row) =>
                    `${row.contact.contactPerson} ${row.contact.phone} ${row.contact.street} ${row.contact.postalCode} ${row.contact.city}`,
                id: "contact",
                header: t("board-detail.organisation-table.columns.contact") as string,
                grow: false,
                Cell: ({row}) => {
                    const {contactPerson, phone, street, postalCode, city} = row.original.contact
                    const plzOrt = [postalCode, city].filter(Boolean).join(" ")
                    return (
                        <div>
                            <div>{contactPerson}</div>
                            <div>{phone}</div>
                            <div>{street}</div>
                            {plzOrt ? <div>{plzOrt}</div> : null}
                        </div>
                    )
                },
                size: 300,
                maxSize: 300,
                minSize: 300,
            },
            {
                accessorFn: (row) => row.anlaesse.length,
                id: "anlaesseCount",
                header: t("dashboard:board-detail.organisation-table.columns.anlaesse-count") as string,
                grow: true,
                minSize: 80,
                size: 120,
            },
        ],
        [t]
    )

    const organisationsTable = useMaterialReactTable({
        columns: organisationColumns,
        mrtTheme: mrtSharedMrtTheme,
        layoutMode: "grid",
        defaultColumn: {
            grow: false,
            minSize: 0,
        },
        localization: {...MRT_Localization_DE, language: "de-CH"},
        enablePagination: false,
        data: allDummyOrganisations,
        enableColumnActions: false,
        enableGlobalFilter: true,
        globalFilterFn: "contains",
        enableSorting: true,
        enableColumnFilters: false,
        enableDensityToggle: false,
        enableHiding: false,
        enableFullScreenToggle: false,
        enableTopToolbar: false,
        enableBottomToolbar: false,
        enableExpanding: true,
        enableExpandAll: false,
        muiTableBodyRowProps: ({row}) => ({
            onClick: () => navigate(`/organisation-admin/${row.original.id}`),
            sx: {
                cursor: "pointer",
            },
        }),
        displayColumnDefOptions: {
            "mrt-row-expand": {
                grow: false,
                size: 50,
                maxSize: 50,
                minSize: 50,
                header: "",
                Header: () => "",
                muiTableHeadCellProps: {
                    sx: (theme) => ({
                        ...mrtSharedTableHeadCellSx(theme),
                        pl: mrtSharedHeaderPaddingX,
                        pr: mrtSharedHeaderPaddingX,
                    }),
                },
            },
        },
        initialState: {
            density: "comfortable",
            showGlobalFilter: true,
            sorting: [{id: "organisation", desc: false}],
        },
        muiSearchTextFieldProps: {
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
        },
        muiTableHeadCellProps: {
            sx: mrtSharedTableHeadCellSx,
        },
        muiTableBodyCellProps: {
            sx: mrtSharedTableBodyCellSx,
        },
        muiTablePaperProps: mrtSharedTablePaperProps,
        muiTableContainerProps: {
            sx: {
                maxHeight: {xs: "none", sm: "calc(100vh - 575px)"},
                overflowX: "auto",
                overflowY: {xs: "visible", sm: "auto"},
            },
        },
        renderDetailPanel: ({row}) => (
            <div className={styles.anlaesseList}>
                {row.original.anlaesse.map((anlass) => (
                    <AnlassInlineRow key={anlass.id} anlass={anlass} organisationId={row.original.id} />
                ))}
            </div>
        ),
    })
    return (
        <>
            <div className={styles.tableToolbar}>
                <div className={styles.tableToolbarSearch}>
                    <MRT_GlobalFilterTextField table={organisationsTable} fullWidth />
                </div>
            </div>
            <div className={styles.organisationsTableWrapper}>
                <MaterialReactTable table={organisationsTable} />
            </div>
        </>
    )
}
