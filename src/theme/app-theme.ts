import {createTheme} from "@mui/material/styles"

/** Matches `$sportamtGreen` in `src/variables.module.scss` / `SPORTAMT_ACCENT` in ferien-closure. */
const SPORTAMT_GREEN = "#d7e054"

/**
 * Global MUI theme defaults. Checkbox checked / indeterminate use Sportamt green app-wide.
 */
export const appTheme = createTheme({
    components: {
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: "rgba(0, 0, 0, 0.28)",
                    "&.Mui-checked, &.MuiCheckbox-indeterminate": {
                        color: SPORTAMT_GREEN,
                    },
                },
            },
        },
    },
})
