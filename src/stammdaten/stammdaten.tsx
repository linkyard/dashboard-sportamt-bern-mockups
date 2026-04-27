import {Tab, Tabs} from "@mui/material"
import {useTranslation} from "react-i18next"
import {Navigate, useNavigate, useParams} from "react-router"
import {PageTitle} from "../components/page-title"
import {stammdatenSeedLocations} from "../dashboard/dummyData"
import {LocationsTable} from "./locations/locations-table"
import styles from "./stammdaten.module.scss"

type StammdatenTabId = "objekte" | "vereine" | "ferien-und-feiertage"

const STAMMDATEN_TAB_IDS: StammdatenTabId[] = ["objekte", "vereine", "ferien-und-feiertage"]

function isStammdatenTabId(value: string): value is StammdatenTabId {
    return STAMMDATEN_TAB_IDS.includes(value as StammdatenTabId)
}

export const StammdatenEditor = () => {
    const {t} = useTranslation("dashboard")
    const navigate = useNavigate()
    const {tabId} = useParams<{tabId: string}>()

    if (!tabId || !isStammdatenTabId(tabId)) {
        return <Navigate to="/stammdaten/objekte" replace />
    }

    const activeTab = tabId

    return (
        <>
            <PageTitle title={t("dashboard:stammdaten.title")} />
            <Tabs
                value={activeTab}
                onChange={(_, newValue) => navigate(`/stammdaten/${newValue}`)}
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
                    ) : null}
                </div>
            ))}
        </>
    )
}
