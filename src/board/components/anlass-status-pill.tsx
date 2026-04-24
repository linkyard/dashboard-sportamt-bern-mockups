import {faCheckCircle, faClock as faClockSolid} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {useTranslation} from "react-i18next"
import type {AnlassStatus} from "../organisation"
import styles from "./anlass-status-pill.module.scss"

const statusVariantByValue: Record<string, string> = {
    pending: "pending",
    confirmed: "confirmed",
}

type AnlassStatusPillProps = {
    status?: AnlassStatus
}

export const AnlassStatusPill = ({status}: AnlassStatusPillProps) => {
    const {t} = useTranslation("dashboard")
    const statusValue = status ?? "pending"
    const statusVariant = statusVariantByValue[statusValue] ?? "pending"
    const statusLabel = t(`organisation-admin.anlaesse.status.${statusValue}`)

    return (
        <div
            className={`${styles.statusPill} ${styles[`status${statusVariant}`]}`}
            role="status"
            aria-label={statusLabel}
        >
            <span>{statusLabel}</span>
            {statusValue === "confirmed" ? (
                <FontAwesomeIcon icon={faCheckCircle} size="sm" />
            ) : (
                <FontAwesomeIcon icon={faClockSolid} size="sm" />
            )}
        </div>
    )
}
