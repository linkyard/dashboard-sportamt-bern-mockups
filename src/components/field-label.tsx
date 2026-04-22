import styles from "./field-label.module.scss"

interface FieldLabelProps {
    children: React.ReactNode
    htmlFor?: string
}

export const FieldLabel = ({children, htmlFor}: FieldLabelProps) => {
    return (
        <label htmlFor={htmlFor} className={styles.fieldLabel}>
            {children}
        </label>
    )
}
