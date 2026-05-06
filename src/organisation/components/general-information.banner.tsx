import {Alert, AlertTitle, Box} from "@mui/material"
import {useState} from "react"
import {useTranslation} from "react-i18next"

import {faInfoCircle} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import styles from "./general-information.module.scss"

export function GeneralInformationBanner() {
    const {t} = useTranslation("dashboard")
    const [open, setOpen] = useState(true)

    if (!open) return null

    return (
        <Alert
            className={styles.alert}
            severity="info"
            variant="outlined"
            sx={{
                padding: "16px",
                borderColor: "#d0d0d0",
                "&.MuiAlert-outlined": {borderColor: "#d0d0d0"},
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08)",
            }}
            onClose={() => setOpen(false)}
            icon={<FontAwesomeIcon icon={faInfoCircle} className={styles.infoIcon} />}
            slotProps={{
                closeButton: {
                    "aria-label": t("organisation-public.general-info.dismiss-aria"),
                    title: t("organisation-public.general-info.dismiss-aria"),
                },
            }}
        >
            <AlertTitle className={styles.alertTitle}>{t("organisation-public.general-info.title")}</AlertTitle>
            <Box component="p" className={styles.body}>
                {t("organisation-public.general-info.body")}
            </Box>
        </Alert>
    )
}
