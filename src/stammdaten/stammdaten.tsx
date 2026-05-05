import {Tab, Tabs} from "@mui/material"
import {useTranslation} from "react-i18next"
import {Navigate, useNavigate, useParams} from "react-router"
import {PageTitle} from "../components/page-title"
import {stammdatenSeedLocations} from "../dummyData"
import {FerienTable} from "./ferien/ferien-table"
import {LocationsTable} from "./locations/locations-table"
import {OrganisationenTable} from "./organisationen/orgs-list"
import styles from "./stammdaten.module.scss"

type StammdatenTabId = "objekte" | "organisationen" | "ferien"

const STAMMDATEN_TAB_IDS: StammdatenTabId[] = ["objekte", "organisationen", "ferien"]

function isStammdatenTabId(value: string): value is StammdatenTabId {
    return STAMMDATEN_TAB_IDS.includes(value as StammdatenTabId)
}

export const StammdatenEditor = () => {
    const {t} = useTranslation("dashboard")
    const navigate = useNavigate()
    const {tabId} = useParams<{tabId: string}>()

    if (!tabId || !isStammdatenTabId(tabId)) {
        return <Navigate to="/admin/stammdaten/objekte" replace />
    }

    const activeTab = tabId

    return (
        <>
            <PageTitle title={t("dashboard:stammdaten.title")} />
            <Tabs
                value={activeTab}
                onChange={(_, newValue) => navigate(`/admin/stammdaten/${newValue}`)}
                aria-label={t("dashboard:stammdaten.tabs-aria-label")}
                className={styles.tabsRoot}
            >
                {STAMMDATEN_TAB_IDS.map((tabId) => (
                    <Tab
                        key={tabId}
                        value={tabId}
                        label={t(`dashboard:stammdaten.tabs.${tabId}`)}
                        id={`stammdaten-tab-${tabId}`}
                        aria-controls={`stammdaten-panel-${tabId}`}
                    />
                ))}
            </Tabs>
            {STAMMDATEN_TAB_IDS.map((tabId) => (
                <div
                    key={tabId}
                    id={`stammdaten-panel-${tabId}`}
                    role="tabpanel"
                    hidden={activeTab !== tabId}
                    aria-labelledby={`stammdaten-tab-${tabId}`}
                >
                    {tabId === "objekte" ? (
                        <LocationsTable key="stammdaten-objekte" initialLocations={stammdatenSeedLocations} />
                    ) : tabId === "organisationen" ? (
                        <OrganisationenTable key="stammdaten-organisationen" />
                    ) : tabId === "ferien" ? (
                        <FerienTable key="stammdaten-ferien" />
                    ) : null}
                </div>
            ))}
        </>
    )
}
