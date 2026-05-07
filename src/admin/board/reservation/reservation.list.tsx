import {faCalendar, faClock} from "@fortawesome/free-regular-svg-icons"
import {faLocationDot} from "@fortawesome/pro-regular-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import SearchIcon from "@mui/icons-material/Search"
import {TextField} from "@mui/material"
import {useMemo, useState} from "react"
import {useTranslation} from "react-i18next"
import {useNavigate} from "react-router"
import {PageTitle} from "../../../components/page-title"
import {SportIconBadge} from "../../../components/sport-icon-badge"
import {type Organisation, type Reservation} from "../organisation"
import {ReservationStatusPill} from "./reservation-status.pill"
import styles from "./reservation.module.scss"

export type ReservationsCardListDetailHref = "organisation-admin" | "organisation-public"

function reservationDetailPath(kind: ReservationsCardListDetailHref, organisation: Organisation, reservation: Reservation): string {
    switch (kind) {
        case "organisation-public":
            return `/organisationen/${organisation.id}/anlass/${reservation.id}`
        default:
            return `/organisation-admin/${organisation.id}/anlass/${reservation.id}`
    }
}

interface ReservationsCardListProps {
    reservations: Reservation[]
    organisation?: Organisation
    /** Target route when a reservation card row is clicked from ReservationsCardList. */
    reservationDetailHref?: ReservationsCardListDetailHref
}

export const ReservationsCardList: React.FC<ReservationsCardListProps> = ({
    reservations,
    organisation,
    reservationDetailHref = "organisation-admin",
}) => {
    const {t} = useTranslation("dashboard")
    const [query, setQuery] = useState("")

    const filteredReservations = useMemo(() => {
        const searchQuery = query.trim().toLowerCase()
        if (!searchQuery) return reservations

        return reservations.filter((reservation) => {
            const searchableText = [
                reservation.name,
                reservation.period ?? "",
                reservation.location ?? "",
                (reservation.times ?? []).join(" "),
                reservation.status ? t(`organisation-admin.reservations.status.${reservation.status}`) : "",
            ]
                .join(" ")
                .toLowerCase()

            return searchableText.includes(searchQuery)
        })
    }, [reservations, query, t])

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <div className={styles.headerTitle}>
                    <PageTitle
                        title={t("organisation-admin.reservations.title")}
                        isSubTitle
                        toolTipContent={t("organisation-public.reservations.section-info-tooltip")}
                    />
                </div>
                <TextField
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={t("common:actions.search")}
                    aria-label={t("common:actions.search")}
                    className={styles.searchInput}
                    size="small"
                    slotProps={{
                        input: {
                            startAdornment: <SearchIcon className={styles.searchIcon} />,
                        },
                    }}
                />
            </div>

            <div className={styles.cards}>
                {filteredReservations.map((reservation) => (
                    <ReservationCard
                        key={reservation.id}
                        reservation={reservation}
                        organisation={organisation}
                        reservationDetailHref={reservationDetailHref}
                    />
                ))}
            </div>
        </div>
    )
}

export default ReservationsCardList

interface ReservationCardProps {
    reservation: Reservation
    organisation?: Organisation
    reservationDetailHref: ReservationsCardListDetailHref
}

const ReservationCard: React.FC<ReservationCardProps> = ({reservation, organisation, reservationDetailHref}) => {
    const navigate = useNavigate()

    const openDetail = () => {
        if (!organisation?.id) return
        navigate(reservationDetailPath(reservationDetailHref, organisation, reservation))
    }

    return (
        <article
            className={styles.card}
            role="button"
            tabIndex={0}
            onClick={openDetail}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    openDetail()
                }
            }}
        >
            <span className={styles.sportBadgeCell}>
                <SportIconBadge icon={reservation.sportIcon} />
            </span>

            <h3 className={styles.title}>{reservation.name}</h3>

            <div className={`${styles.infoRow} ${styles.periodRow}`}>
                <span className={styles.infoIconCell}>
                    <FontAwesomeIcon icon={faCalendar} className={styles.infoIcon} />
                </span>
                <span>{reservation.period ?? "-"}</span>
            </div>

            <div className={`${styles.infoRow} ${styles.locationRow}`}>
                <span className={styles.infoIconCell}>
                    <FontAwesomeIcon icon={faLocationDot} className={styles.infoIcon} />
                </span>
                <span>{reservation.location ?? "-"}</span>
            </div>

            <div className={styles.timesColumn}>
                {(reservation.times ?? []).map((time) => (
                    <div key={`${reservation.name}-${time}`} className={styles.infoRow}>
                        <span className={styles.infoIconCell}>
                            <FontAwesomeIcon icon={faClock} className={styles.infoIcon} />
                        </span>
                        <span>{time}</span>
                    </div>
                ))}
            </div>

            <div className={styles.statusCell}>
                <ReservationStatusPill status={reservation.status} />
            </div>
        </article>
    )
}
