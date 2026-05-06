import {faCalendar, faClock} from "@fortawesome/free-regular-svg-icons"
import {faLocationDot} from "@fortawesome/pro-regular-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {useNavigate} from "react-router"
import type {Reservation} from "../organisation"
import styles from "./reservation-inline.row.module.scss"
import {ReservationStatusPill} from "./reservation-status.pill"

type ReservationInlineRowProps = {
    reservation: Reservation
    orgId: string
}

export const ReservationInlineRow = ({reservation, orgId}: ReservationInlineRowProps) => {
    const navigate = useNavigate()
    const dates = (reservation.times ?? []).filter(Boolean).join(" · ")

    const openReservation = () => {
        navigate(`/organisation-admin/${orgId}/anlass/${reservation.id}`)
    }

    return (
        <div
            className={styles.row}
            role="button"
            tabIndex={0}
            onClick={(e) => {
                e.stopPropagation()
                openReservation()
            }}
        >
            <div className={styles.nameCol}>
                <span className={styles.sportIconWrap} aria-hidden>
                    <FontAwesomeIcon icon={reservation.sportIcon} className={styles.sportIcon} />
                </span>
                <span className={styles.nameText}>{reservation.name}</span>
            </div>

            <div className={styles.cell}>
                <span className={styles.iconWrapper}>
                    <FontAwesomeIcon icon={faCalendar} className={styles.icon} />
                </span>
                <span className={styles.cellValue}>{reservation.period ?? "-"}</span>
            </div>

            <div className={styles.cell}>
                <span className={styles.iconWrapper}>
                    <FontAwesomeIcon icon={faLocationDot} className={styles.icon} />
                </span>
                <span className={styles.cellValue}>{reservation.location ?? "-"}</span>
            </div>

            <div className={styles.cell}>
                <span className={styles.iconWrapper}>
                    <FontAwesomeIcon icon={faClock} className={styles.icon} />
                </span>
                <span className={styles.cellValue}>{dates ?? "-"}</span>
            </div>

            <div className={styles.pill}>
                <ReservationStatusPill status={reservation.status} compact />
            </div>
        </div>
    )
}
