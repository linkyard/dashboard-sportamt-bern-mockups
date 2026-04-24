import styles from "./field-label.module.scss"

interface FieldLabelProps {
    children: React.ReactNode
    htmlFor?: string
    id?: string
}

export const FieldLabel = ({children, htmlFor, id}: FieldLabelProps) => {
    return (
        <label htmlFor={htmlFor} id={id} className={styles.fieldLabel}>
            {children}
        </label>
    )
}
