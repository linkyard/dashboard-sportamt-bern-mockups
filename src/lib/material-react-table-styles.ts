import type {PaperProps} from "@mui/material"
import type {Theme} from "@mui/material/styles"
import type {MRT_Theme} from "material-react-table"

export const mrtSharedMrtTheme: Partial<MRT_Theme> = {
    baseBackgroundColor: "#f8f8f8",
}

export const mrtSharedHeaderPaddingX = "0.75rem" as const

export function mrtSharedTableHeadCellSx(theme: Theme) {
    const py = theme.spacing(0.75)
    const px = theme.spacing(2)
    return {
        backgroundColor: theme.palette.grey[100],
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        pt: py,
        pb: py,
        pl: px,
        pr: px,
        "& .Mui-TableHeadCell-Content": {
            letterSpacing: "0.09em",
            textTransform: "uppercase" as const,
            fontWeight: 700,
            fontSize: "0.8rem",
        },
        "& .MuiTableSortLabel-root, & .MuiTableSortLabel-root .MuiTableSortLabel-icon": {
            fontSize: "1rem",
        },
    }
}

export function mrtSharedTableBodyCellSx(theme: Theme) {
    return {
        borderBottom: `1px solid ${theme.palette.divider}`,
        py: 0.75,
        fontSize: "0.875rem",
    }
}

export const mrtSharedTablePaperProps: PaperProps = {
    elevation: 0,
    sx: {
        backgroundColor: "#f8f8f8",
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        overflow: "hidden",
    },
}
