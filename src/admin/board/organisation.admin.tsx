import {useTranslation} from "react-i18next"
import {useParams} from "react-router"
import {AppBreadcrumbs} from "../../components/breadcrumbs"
import {ContactDetails} from "../../components/contact-box"
import {PageTitle} from "../../components/page-title"
import {getOrganisationById} from "../../dummyData"
import styles from "./organisation-admin.module.scss"
import ReservationsCardList from "./reservation/reservation.list"

export const OrganisationAdminPage: React.FC = () => {
    const {orgId} = useParams<{orgId: string}>()
    const organisation = orgId ? getOrganisationById(orgId) : undefined
    const {t} = useTranslation("dashboard")

    if (!organisation) {
        return (
            <>
                <PageTitle title={t("dashboard:organisation-admin.title")} />
                <p>{t("dashboard:organisation-admin.empty")}</p>
            </>
        )
    }

    const title = organisation.organisation ? organisation.organisation : t("dashboard:organisation-admin.title")

    return (
        <div className={styles.orgAdminPage}>
            <AppBreadcrumbs variant="organisation-admin" organisation={organisation} />
            <div className={styles.paperTop}>
                <PageTitle title={title} editable />
                <div className={styles.contactGrid}>
                    <ContactDetails title={t("dashboard:organisation-admin.contact-address-title")} contact={organisation.contact} />
                    <ContactDetails
                        title={t("dashboard:organisation-admin.billing-address-title")}
                        contact={organisation.billingContact}
                        billingAddressMode
                    />
                </div>
            </div>
            <div className={styles.reservationsSection}>
                <ReservationsCardList reservations={organisation.reservations} organisation={organisation} />
            </div>
        </div>
    )
}
