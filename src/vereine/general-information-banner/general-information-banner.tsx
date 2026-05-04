import {Alert, AlertTitle, Box} from "@mui/material"
import {useState} from "react"
import {useTranslation} from "react-i18next"

import {faInfoCircle} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import styles from "./general-information-banner.module.scss"

export function GeneralInformationBanner() {
    const {t} = useTranslation("dashboard")
    const [open, setOpen] = useState(true)

    if (!open) return null

    return (
        <Alert
            className={styles.alert}
            severity="info"
            variant="outlined"
            onClose={() => setOpen(false)}
            icon={<FontAwesomeIcon icon={faInfoCircle} className={styles.infoIcon} />}
            slotProps={{
                closeButton: {
                    "aria-label": t("verein-public.general-info.dismiss-aria"),
                    title: t("verein-public.general-info.dismiss-aria"),
                },
            }}
        >
            <AlertTitle className={styles.alertTitle}>{t("verein-public.general-info.title")}</AlertTitle>
            <Box component="p" className={styles.body}>
                {t("verein-public.general-info.body")}
            </Box>
        </Alert>
    )
}
