import {faCalendar} from "@fortawesome/free-regular-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {useTranslation} from "react-i18next"
import {useParams} from "react-router"
import {AppBreadcrumbs} from "../../../components/breadcrumbs"
import {LocationSelect} from "../../../components/location-select"
import {PageTitle} from "../../../components/page-title"
import {SportIconPicker} from "../../../components/sport-icon-badge"
import {getOrganisationById} from "../../../dummyData"
import {resolveReservationFromOrganisation} from "../organisation"
import styles from "./reservation-detail.module.scss"
import {ReservationHistoryLog} from "./reservation-history.log"
import {ReservationStatusPill} from "./reservation-status.pill"
import {ReservationTrainingsTable} from "./reservation-training.table"

export const ReservationDetail: React.FC = () => {
    const {orgId, anlassId} = useParams<{orgId: string; anlassId: string}>()
    const organisation = orgId ? getOrganisationById(orgId) : undefined
    const reservation = organisation && anlassId ? organisation.reservations.find((r) => r.id === anlassId) : undefined
    const {t} = useTranslation("dashboard")
    const reservationForDisplay = reservation ? resolveReservationFromOrganisation(reservation, organisation) : undefined

    const title = reservationForDisplay ? reservationForDisplay.name : t("dashboard:organisation-admin.reservation-detail.fallback-title")

    const periodLabel = reservationForDisplay ? (reservationForDisplay.period ?? "—") : null

    const organisationLocationOptions = [
        ...new Set((organisation?.reservations ?? []).flatMap(({location}) => (location ? [location] : []))),
    ].sort((a, b) => a.localeCompare(b, "de"))

    return (
        <>
            <div className={styles.topBar}>
                <div className={styles.breadcrumbsWrapper}>
                    <AppBreadcrumbs variant="reservation-detail" organisation={organisation} reservation={reservationForDisplay} />
                </div>
                {reservationForDisplay ? (
                    <div className={styles.topBarActions}>
                        <ReservationStatusPill status={reservationForDisplay.status} />
                        <SportIconPicker icon={reservationForDisplay.sportIcon} />
                    </div>
                ) : null}
            </div>
            <PageTitle title={title} editable />
            <LocationSelect value={reservationForDisplay.location ?? ""} locationOptions={organisationLocationOptions} />

            {periodLabel ? (
                <div className={styles.periodRow}>
                    <FontAwesomeIcon icon={faCalendar} className={styles.periodIcon} />
                    <span>{periodLabel}</span>
                </div>
            ) : null}

            {!reservationForDisplay ? <p>{t("dashboard:organisation-admin.reservation-detail.empty")}</p> : null}
            {reservationForDisplay ? (
                <>
                    <ReservationHistoryLog
                        title={t("dashboard:organisation-admin.reservation-detail.history-title")}
                        emptyText={t("dashboard:organisation-admin.reservation-detail.history-empty")}
                        entries={reservationForDisplay.history ?? []}
                    />
                    <div className={styles.trainingsTableSection}>
                        <ReservationTrainingsTable />
                    </div>
                </>
            ) : null}
        </>
    )
}
