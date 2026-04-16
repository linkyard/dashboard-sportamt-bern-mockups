import { Box, Button, Chip, Container, Paper, Tooltip } from "@mui/material";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";
import styles from "./dashboard.module.scss";
import { type Board, type BoardLabel, dummyBoards } from "./dummyData";

const labelDateRanges: Record<BoardLabel, string> = {
  Wintersaison: "(31.10.2026 - 30.04.2027)",
  Jahresperiode: "(01.01.2027 - 31.12.2027)",
};

export const Dashboard = () => {
  const { t } = useTranslation(["common", "dashboard"]);

  const columns = useMemo<MRT_ColumnDef<Board>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("dashboard:table.columns.name"),
        size: 200,
      },
      {
        accessorKey: "bemerkung",
        header: t("dashboard:table.columns.bemerkung"),
        size: 300,
        Cell: ({ row }) => (
          <Box component="span" className={styles.ellipsisText}>
            {row.original.bemerkung}
          </Box>
        ),
      },
      {
        accessorKey: "startDate",
        header: t("dashboard:table.columns.start-date"),
        size: 140,
      },
      {
        accessorKey: "endDate",
        header: t("dashboard:table.columns.end-date"),
        size: 140,
      },
      {
        accessorFn: (row) => row.labels.join(" "),
        id: "labels",
        header: t("dashboard:table.columns.labels"),
        Cell: ({ row }) => (
          <Box className={styles.labelsCell}>
            {row.original.labels.map((label) => (
              <Tooltip
                key={`${row.original.name}-${label}`}
                title={`${label} ${labelDateRanges[label]}`}
                arrow
              >
                <Chip label={label} size="small" />
              </Tooltip>
            ))}
          </Box>
        ),
      },
    ],
    [t],
  );

  const table = useMaterialReactTable({
    columns,
    data: dummyBoards,
    layoutMode: "grid-no-grow",
    initialState: { showGlobalFilter: true },
    enableGlobalFilter: true,
    globalFilterFn: "contains",
    enableColumnActions: false,
    enableColumnFilters: false,
    enableDensityToggle: false,
    enableColumnResizing: true,
    enableHiding: false,
    enableFullScreenToggle: false,
    renderToolbarInternalActions: () => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Button
          component={NavLink}
          to="/new-board"
          variant="contained"
          size="small"
        >
          {t("dashboard:table.create-new-board-button")}
        </Button>
      </Box>
    ),
    muiSearchTextFieldProps: {
      placeholder: t("dashboard:table.global-search-placeholder"),
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
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      },
    },
  });
  return (
    <Container maxWidth="xl" className={styles.pageContainer}>
      <Paper className={styles.pagePaper}>
        <h2 className={styles.pageTitle}>{t("dashboard:title")}</h2>
        <MaterialReactTable table={table} />
      </Paper>
    </Container>
  );
};
