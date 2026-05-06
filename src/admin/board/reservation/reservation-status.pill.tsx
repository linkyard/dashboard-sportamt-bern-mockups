import {faCheckCircle, faClock} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {useTranslation} from "react-i18next"
import type {ReservationStatus} from "../organisation"
import styles from "./reservation-status.pill.module.scss"

const statusVariantByValue: Record<string, string> = {
    pending: "pending",
    confirmed: "confirmed",
}

type ReservationStatusPillProps = {
    status?: ReservationStatus
    /** Single-line / table contexts */
    compact?: boolean
}

export const ReservationStatusPill = ({status, compact}: ReservationStatusPillProps) => {
    const {t} = useTranslation("dashboard")
    const statusValue = status ?? "pending"
    const statusVariant = statusVariantByValue[statusValue] ?? "pending"
    const statusLabel = t(`organisation-admin.reservations.status.${statusValue}`)

    return (
        <div
            className={`${compact ? styles.statusPillCompact : styles.statusPill} ${styles[`status${statusVariant}`]}`}
            role="status"
            aria-label={statusLabel}
        >
            <span>{statusLabel}</span>
            <span className={styles.iconDisc} aria-hidden>
                {statusValue === "confirmed" ? <FontAwesomeIcon icon={faCheckCircle} /> : <FontAwesomeIcon icon={faClock} />}
            </span>
        </div>
    )
}
