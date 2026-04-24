import {Button, Chip, Container, Paper, Tooltip} from "@mui/material"
import {MaterialReactTable, type MRT_ColumnDef, useMaterialReactTable} from "material-react-table"
import {useMemo} from "react"
import {useTranslation} from "react-i18next"
import {NavLink, useNavigate} from "react-router"
import commonStyles from "../common.module.scss"
import {PageTitle} from "../components/page-title"
import styles from "./dashboard.module.scss"
import {type Board, type BoardLabel, dummyBoards} from "./dummyData"

const labelDateRanges: Record<BoardLabel, string> = {
    Wintersaison: "(31.10.2026 - 30.04.2027)",
    Jahresperiode: "(01.01.2027 - 31.12.2027)",
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
                size: 140,
            },
            {
                accessorKey: "endDate",
                header: t("dashboard:dashboard.table.columns.end-date"),
                size: 140,
            },
            {
                accessorFn: (row) => row.labels.join(" "),
                id: "labels",
                header: t("dashboard:dashboard.table.columns.labels"),
                Cell: ({row}) => (
                    <div className={styles.labelsCell}>
                        {row.original.labels.map((label) => (
                            <Tooltip key={`${row.original.name}-${label}`} title={`${label} ${labelDateRanges[label]}`} arrow>
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
        layoutMode: "grid-no-grow",
        initialState: {showGlobalFilter: true},
        enableGlobalFilter: true,
        globalFilterFn: "contains",
        enableColumnActions: false,
        enableColumnFilters: false,
        enableDensityToggle: false,
        enableColumnResizing: true,
        enableHiding: false,
        enableFullScreenToggle: false,
        enableStickyHeader: true,
        muiTableBodyRowProps: ({row}) => ({
            onClick: () =>
                navigate("/board-admin", {
                    state: {board: row.original},
                }),
            sx: {
                cursor: "pointer",
            },
        }),
        renderToolbarInternalActions: () => (
            <div className={styles.toolbarActions}>
                <Button component={NavLink} to="/new-board" variant="contained" size="small">
                    {t("dashboard:dashboard.table.create-new-board-button")}
                </Button>
            </div>
        ),
        muiSearchTextFieldProps: {
            placeholder: t("dashboard:dashboard.table.global-search-placeholder"),
            size: "small",
            slotProps: {
                htmlInput: {
                    style: {
                        paddingTop: "4px",
                        paddingBottom: "4px",
                    },
                },
            },
        },
        muiTableHeadCellProps: {
            sx: {
                py: 0.75,
                "& .Mui-TableHeadCell-Content, & .MuiTableSortLabel-root, & .MuiTableSortLabel-root .MuiTableSortLabel-icon": {
                    letterSpacing: "0.09em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                },
            },
        },
        muiTableBodyCellProps: {
            sx: {
                py: 0.75,
            },
        },
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
            },
        },
        muiTableContainerProps: {
            sx: {
                maxHeight: {xs: "none", sm: "calc(100vh - 300px)"},
            },
        },
    })
    return (
        <Container maxWidth="xl" className={commonStyles.pageContainer}>
            <Paper className={commonStyles.pagePaper}>
                <PageTitle title={t("dashboard:dashboard.title")} />
                <MaterialReactTable table={table} />
            </Paper>
        </Container>
    )
}
