import {useTranslation} from "react-i18next"
import {useParams} from "react-router"
import {getOrganisationById} from "../dummyData"
import {AppBreadcrumbs} from "../components/breadcrumbs"
import {PageTitle} from "../components/page-title"
import AnlaesseCardList from "./anlaesse"
import {ContactDetails} from "./components/contact-box"
import styles from "./organisation-admin.module.scss"

export const OrganisationAdminPage: React.FC = () => {
    const {organisationId} = useParams<{organisationId: string}>()
    const organisation = organisationId ? getOrganisationById(organisationId) : undefined
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
                    <ContactDetails
                        title={t("dashboard:organisation-admin.contact-address-title")}
                        contact={organisation.contact}
                    />
                    <ContactDetails
                        title={t("dashboard:organisation-admin.billing-address-title")}
                        contact={organisation.billingContact}
                        billingAddressMode
                    />
                </div>
            </div>
            <div className={styles.anlaesseSection}>
                <AnlaesseCardList anlaesse={organisation.anlaesse} organisation={organisation} />
            </div>
        </div>
    )
}
