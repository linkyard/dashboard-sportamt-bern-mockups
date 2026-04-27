import {useTranslation} from "react-i18next"
import {AppBreadcrumbs} from "../components/breadcrumbs"
import {PageTitle} from "../components/page-title"
import AnlaesseCardList from "./anlaesse"
import {ContactDetails} from "./components/contact-box"
import type {Organisation} from "./organisation"
import styles from "./organisation-admin.module.scss"

interface OrganisationAdminPageProps {
    organisation?: Organisation
}

export const OrganisationAdminPage: React.FC<OrganisationAdminPageProps> = ({organisation}) => {
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
        <>
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
                        sameAsContactAddress={organisation.billingContact == null}
                    />
                </div>
            </div>
            <div className={styles.anlaesseSection}>
                <AnlaesseCardList anlaesse={organisation.anlaesse} organisation={organisation} />
            </div>
        </>
    )
}
