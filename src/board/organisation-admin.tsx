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

const dummyOrganisation: Organisation = {
    id: "dummy-organisation",
    organisation: "Linkyard Sports",
    contact: {
        organisationName: "Linkyard Sports",
        contactPerson: "Roman Frey",
        street: "Junkerngasse 39, 3011 Bern",
        city: "",
        email: "roman.frey@linkyard.ch",
        phone: "+41 79 512 26 11",
    },
    anlaesse: [
        {name: "Hallenbelegung", date: "12.09.2026"},
        {name: "Saisonturnier", date: "01.10.2026"},
    ],
}

export const OrganisationAdminPage: React.FC<OrganisationAdminPageProps> = ({organisation}) => {
    const {t} = useTranslation("dashboard")
    const organisationToDisplay = organisation ?? dummyOrganisation
    const title = organisationToDisplay.organisation ? organisationToDisplay.organisation : t("dashboard:organisation-admin.title")

    return (
        <Container maxWidth="xl" className={commonStyles.pageContainer}>
            <Paper className={commonStyles.pagePaper}>
                <PageTitle title={title} editable />
                <div className={styles.contactGrid}>
                    <ContactDetails
                        title={t("dashboard:organisation-admin.contact-address-title")}
                        contact={organisationToDisplay.contact}
                    />
                    <ContactDetails
                        title={t("dashboard:organisation-admin.billing-address-title")}
                        contact={organisationToDisplay.billingContact}
                        emptyText={t("dashboard:organisation-admin.same-as-contact")}
                    />
                </div>
                <div>
                    <AnlaesseCardList />
                </div>
            </Paper>
        </Container>
    )
}
