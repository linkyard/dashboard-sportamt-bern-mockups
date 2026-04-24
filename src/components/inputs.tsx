import TextField, {type TextFieldProps} from "@mui/material/TextField"
import {forwardRef} from "react"
import styles from "./inputs.module.scss"

function mergeClassNames(...classes: (string | undefined)[]): string {
    return classes.filter(Boolean).join(" ")
}

export const DetailsTextInput = forwardRef<HTMLDivElement, TextFieldProps>(function DetailsTextInput(
    {className, size = "small", variant = "outlined", ...props},
    ref
) {
    return <TextField ref={ref} variant={variant} size={size} className={mergeClassNames(styles.detailsInput, className)} {...props} />
})

export type DetailsTextareaProps = Omit<TextFieldProps, "multiline">

export const DetailsTextarea = forwardRef<HTMLDivElement, DetailsTextareaProps>(function DetailsTextarea(
    {className, rows = 4, variant = "outlined", ...props},
    ref
) {
    return (
        <TextField
            ref={ref}
            variant={variant}
            multiline
            rows={rows}
            className={mergeClassNames(styles.detailsInput, styles.commentInput, className)}
            {...props}
        />
    )
})

// Display names for debugging so they dont show up in dev tools as just "forwardRef"
DetailsTextInput.displayName = "DetailsTextInput"
DetailsTextarea.displayName = "DetailsTextarea"
