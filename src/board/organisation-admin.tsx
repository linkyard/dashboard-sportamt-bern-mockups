import {Container, Paper} from "@mui/material"
import {useTranslation} from "react-i18next"
import commonStyles from "../common.module.scss"
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
            <Container maxWidth="xl" className={commonStyles.pageContainer}>
                <Paper className={`${commonStyles.pagePaper} ${styles.organisationPaper}`}>
                    <PageTitle title={t("dashboard:organisation-admin.title")} />
                    <p>{t("dashboard:organisation-admin.empty")}</p>
                </Paper>
            </Container>
        )
    }

    const title = organisation.organisation ? organisation.organisation : t("dashboard:organisation-admin.title")

    return (
        <Container maxWidth="xl" className={commonStyles.pageContainer}>
            <Paper className={`${commonStyles.pagePaper} ${styles.organisationPaper}`}>
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
                            emptyText={t("dashboard:organisation-admin.same-as-contact")}
                        />
                    </div>
                </div>
                <div className={styles.anlaesseSection}>
                    <AnlaesseCardList anlaesse={organisation.anlaesse} organisation={organisation} />
                </div>
            </Paper>
        </Container>
    )
}
