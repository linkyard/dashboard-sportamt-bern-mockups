import {faCalendar} from "@fortawesome/free-regular-svg-icons"
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Container, Paper} from "@mui/material"
import {useTranslation} from "react-i18next"
import {useNavigate} from "react-router"
import commonStyles from "../common.module.scss"
import {PageTitle} from "../components/page-title"
import styles from "./anlass-detail.module.scss"
import {AnlassHistoryLog} from "./components/anlass-history-log"
import {resolveAnlassFromOrganisation, type Anlass, type Organisation} from "./organisation"

interface AnlassDetailProps {
    anlass?: Anlass
    organisation?: Organisation
}

export const AnlassDetail: React.FC<AnlassDetailProps> = ({anlass, organisation}) => {
    const {t} = useTranslation("dashboard")
    const navigate = useNavigate()
    const anlassForDisplay = anlass ? resolveAnlassFromOrganisation(anlass, organisation) : undefined

    const title = anlassForDisplay
        ? `${anlassForDisplay.name} - ${anlassForDisplay.location ?? "-"}`
        : t("dashboard:organisation-admin.anlass-detail.fallback-title")

    const periodLabel = anlassForDisplay ? (anlassForDisplay.period ?? anlassForDisplay.date ?? "—") : null

    const goToOrganisationAdmin = () => {
        if (organisation?.id) {
            navigate(`/organisation-admin/${organisation.id}`)
        } else {
            navigate("/")
        }
    }

    const breadcrumbLabel = organisation?.organisation?.trim() || t("dashboard:organisation-admin.anlass-detail.breadcrumb-fallback")

    return (
        <Container maxWidth="xl" className={commonStyles.pageContainer}>
            <Paper className={commonStyles.pagePaper}>
                <button
                    type="button"
                    className={styles.breadcrumb}
                    onClick={goToOrganisationAdmin}
                    aria-label={t("dashboard:organisation-admin.anlass-detail.back-aria-label")}
                >
                    <FontAwesomeIcon icon={faArrowLeft} className={styles.breadcrumbIcon} />
                    <span>{breadcrumbLabel}</span>
                </button>
                <PageTitle title={title} />
                {periodLabel ? (
                    <div className={styles.periodRow}>
                        <FontAwesomeIcon icon={faCalendar} className={styles.periodIcon} />
                        <span>{periodLabel}</span>
                    </div>
                ) : null}
                {!anlassForDisplay ? <p>{t("dashboard:organisation-admin.anlass-detail.empty")}</p> : null}
                {anlassForDisplay ? (
                    <AnlassHistoryLog
                        title={t("dashboard:organisation-admin.anlass-detail.history-title")}
                        emptyText={t("dashboard:organisation-admin.anlass-detail.history-empty")}
                        entries={anlassForDisplay.history ?? []}
                        status={anlassForDisplay.status}
                    />
                ) : null}
            </Paper>
        </Container>
    )
}
