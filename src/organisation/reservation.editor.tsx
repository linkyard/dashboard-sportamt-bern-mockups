import {faCalendar} from "@fortawesome/free-regular-svg-icons"
import {faLocationDot} from "@fortawesome/pro-regular-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Button} from "@mui/material"
import {useState} from "react"
import {useTranslation} from "react-i18next"
import {useParams} from "react-router"
import {resolveReservationFromOrganisation} from "../admin/board/organisation"
import reservationDetailStyles from "../admin/board/reservation-detail.module.scss"
import {AppBreadcrumbs} from "../components/breadcrumbs"
import {PageTitle} from "../components/page-title"
import {SportIconBadge} from "../components/sport-icon-badge"
import {UploadSection} from "../components/upload-section"
import {getOrganisationForPublicPage} from "../dummyData"
import {AdditionalDaysOffTable} from "./reservation-sections/additional-days-off.table"
import {CommentsSection} from "./reservation-sections/comments"
import {HolidayUsageTable} from "./reservation-sections/holiday-usage.table"
import {ParticipantsInputs} from "./reservation-sections/participant-inputs"
import {TrainingSection} from "./reservation-sections/training-section"
import styles from "./reservation.editor.module.scss"

function participantTotals(male: string, female: string, under20: string) {
    const total = +male + +female + +under20
    return {totalStr: String(total), showUpload: +under20 * 100 >= total * 90}
}

export const ReservationEditor: React.FC = () => {
    const {orgId, anlassId} = useParams<{orgId: string; anlassId: string}>()
    const organisation = getOrganisationForPublicPage(orgId)
    const reservationClicked = organisation && anlassId ? organisation.reservations.find((a) => a.id === anlassId) : undefined
    const reservationInfo = reservationClicked ? resolveReservationFromOrganisation(reservationClicked, organisation) : undefined
    const {t} = useTranslation("dashboard")

    const [maleParticipantCount, setMaleParticipantCount] = useState("")
    const [femaleParticipantCount, setFemaleParticipantCount] = useState("")
    const [under20ParticipantCount, setUnder20ParticipantCount] = useState("")

    const title = reservationInfo ? reservationInfo.name : t("organisation-public.reservation.not-found-title")

    if (!organisation || !reservationInfo) {
        const badge =
            organisation && reservationClicked ? (
                <SportIconBadge icon={resolveReservationFromOrganisation(reservationClicked, organisation).sportIcon} />
            ) : null

        return (
            <div className={styles.reservationEditorPage}>
                <div className={reservationDetailStyles.topBar}>
                    <div className={reservationDetailStyles.breadcrumbsWrapper}>
                        <AppBreadcrumbs
                            variant="organisation-reservation"
                            orgId={orgId}
                            organisation={organisation}
                            reservation={reservationClicked}
                        />
                    </div>
                    {badge}
                </div>
                <PageTitle title={title} />
                <p>{t("organisation-public.reservation.not-found-body")}</p>
            </div>
        )
    }

    const periodLabel = reservationInfo.period ?? "—"
    const participants = participantTotals(maleParticipantCount, femaleParticipantCount, under20ParticipantCount)

    return (
        <div className={styles.reservationEditorPage}>
            <div className={reservationDetailStyles.topBar}>
                <div className={reservationDetailStyles.breadcrumbsWrapper}>
                    <AppBreadcrumbs
                        variant="organisation-reservation"
                        orgId={orgId}
                        organisation={organisation}
                        reservation={reservationClicked}
                    />
                </div>
                <SportIconBadge icon={reservationInfo.sportIcon} />
            </div>

            <div className={styles.titleBand}>
                <div className={styles.titleBandMain}>
                    <PageTitle title={title} editable />
                    <div className={styles.periodRow}>
                        <FontAwesomeIcon icon={faLocationDot} className={styles.periodIcon} aria-hidden />
                        <span>{reservationInfo.location}</span>
                    </div>
                    <div className={styles.periodRow}>
                        <FontAwesomeIcon icon={faCalendar} className={styles.periodIcon} aria-hidden />
                        <span>{periodLabel}</span>
                    </div>
                </div>
                <div className={styles.titleBandActions}>
                    <Button variant="outlined" color="inherit" sx={{borderColor: "#c4c4c4", color: "#222"}}>
                        {t("organisation-public.reservation.actions.cancel-reservation")}
                    </Button>
                    <Button variant="contained" color="primary">
                        {t("organisation-public.reservation.actions.confirm-reservation")}
                    </Button>
                </div>
            </div>
            <div className={styles.reservationEditorContent}>
                <TrainingSection />
                <HolidayUsageTable periodLabel={periodLabel} />
                <AdditionalDaysOffTable />

                <ParticipantsInputs
                    maleCount={maleParticipantCount}
                    femaleCount={femaleParticipantCount}
                    under20Count={under20ParticipantCount}
                    totalPersonsDisplay={participants.totalStr}
                    onMaleCountChange={setMaleParticipantCount}
                    onFemaleCountChange={setFemaleParticipantCount}
                    onUnder20CountChange={setUnder20ParticipantCount}
                />

                {participants.showUpload ? (
                    <section className={styles.sectionCard}>
                        <div className={styles.sectionHeading}>
                            <PageTitle
                                title={t("organisation-public.reservation.participants-list-title")}
                                isSubTitle
                                toolTipContent={t("organisation-public.reservation.section-info-tooltip")}
                            />
                        </div>
                        <UploadSection variant="organisation" onFilesChange={() => undefined} isUploadSuccess={false} flushTop />
                    </section>
                ) : null}

                <CommentsSection />
            </div>
        </div>
    )
}
