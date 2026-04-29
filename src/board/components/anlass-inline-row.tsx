import {faCalendar, faClock} from "@fortawesome/free-regular-svg-icons"
import {faLocationDot} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {useNavigate} from "react-router"
import type {Anlass} from "../organisation"
import styles from "./anlass-inline-row.module.scss"
import {AnlassStatusPill} from "./anlass-status-pill"

type AnlassInlineRowProps = {
    anlass: Anlass
    organisationId: string
}

export const AnlassInlineRow = ({anlass, organisationId}: AnlassInlineRowProps) => {
    const navigate = useNavigate()
    const dates = (anlass.times ?? []).filter(Boolean).join(" · ")

    const openAnlass = () => {
        navigate(`/organisation-admin/${organisationId}/anlass/${anlass.id}`)
    }

    return (
        <div
            className={styles.row}
            role="button"
            tabIndex={0}
            onClick={(e) => {
                e.stopPropagation()
                openAnlass()
            }}
        >
            <div className={styles.nameCol}>
                <span className={styles.sportIconWrap} aria-hidden>
                    <FontAwesomeIcon icon={anlass.sportIcon} className={styles.sportIcon} />
                </span>
                <span className={styles.nameText}>{anlass.name}</span>
            </div>

            <div className={styles.cell}>
                <span className={styles.iconWrapper}>
                    <FontAwesomeIcon icon={faCalendar} className={styles.icon} />
                </span>
                <span className={styles.cellValue}>{anlass.period ?? "-"}</span>
            </div>

            <div className={styles.cell}>
                <span className={styles.iconWrapper}>
                    <FontAwesomeIcon icon={faLocationDot} className={styles.icon} />
                </span>
                <span className={styles.cellValue}>{anlass.location ?? "-"}</span>
            </div>

            <div className={styles.cell}>
                <span className={styles.iconWrapper}>
                    <FontAwesomeIcon icon={faClock} className={styles.icon} />
                </span>
                <span className={styles.cellValue}>{dates ?? "-"}</span>
            </div>

            <div className={styles.pill}>
                <AnlassStatusPill status={anlass.status} compact />
            </div>
        </div>
    )
}
