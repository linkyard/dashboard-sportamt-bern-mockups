import TextField, {type TextFieldProps} from "@mui/material/TextField"
import {forwardRef} from "react"
import styles from "./inputs.module.scss"

export type DetailsNumberInputProps = Omit<TextFieldProps, "className" | "type"> & {
    readOnly?: boolean
}

export const DetailsNumberInput = forwardRef<HTMLDivElement, DetailsNumberInputProps>(function DetailsNumberInput(
    {size = "small", variant = "outlined", sx, slotProps, readOnly, ...props},
    ref
) {
    return (
        <TextField
            ref={ref}
            variant={variant}
            size={size}
            className={styles.detailsInput}
            sx={[{"& .MuiInputBase-input": {textAlign: "right"}}, ...(sx === undefined ? [] : Array.isArray(sx) ? sx : [sx])]}
            slotProps={{
                ...slotProps,
                htmlInput: {
                    ...slotProps?.htmlInput,
                    ...(readOnly ? {readOnly} : {}),
                },
            }}
            {...props}
            type="number"
        />
    )
})

export type DetailsTextInputProps = Omit<TextFieldProps, "className"> & {
    readOnly?: boolean
}

export const DetailsTextInput = forwardRef<HTMLDivElement, DetailsTextInputProps>(function DetailsTextInput(
    {size = "small", variant = "outlined", slotProps, readOnly, ...props},
    ref
) {
    return (
        <TextField
            ref={ref}
            variant={variant}
            size={size}
            className={styles.detailsInput}
            slotProps={{
                ...slotProps,
                htmlInput: {
                    ...slotProps?.htmlInput,
                    ...(readOnly ? {readOnly} : {}),
                },
            }}
            {...props}
        />
    )
})

export type DetailsTextareaProps = Omit<TextFieldProps, "multiline" | "className"> & {
    readOnly?: boolean
}

export const DetailsTextarea = forwardRef<HTMLDivElement, DetailsTextareaProps>(function DetailsTextarea(
    {rows = 4, variant = "outlined", slotProps, readOnly, ...props},
    ref
) {
    return (
        <TextField
            ref={ref}
            variant={variant}
            multiline
            rows={rows}
            className={`${styles.detailsInput} ${styles.commentInput}`}
            slotProps={{
                ...slotProps,
                htmlInput: {
                    ...slotProps?.htmlInput,
                    ...(readOnly ? {readOnly} : {}),
                },
            }}
            {...props}
        />
    )
})

// Display names for debugging so they dont show up in dev tools as just "forwardRef"
DetailsNumberInput.displayName = "DetailsNumberInput"
DetailsTextInput.displayName = "DetailsTextInput"
DetailsTextarea.displayName = "DetailsTextarea"
