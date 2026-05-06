import {Alert, AlertTitle, Button} from "@mui/material"
import {useState} from "react"
import {useTranslation} from "react-i18next"

import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import styles from "./banner.module.scss"

export const ConfirmContactAddressBanner = () => {
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
            icon={<FontAwesomeIcon icon={faExclamationTriangle} className={styles.warningIcon} />}
            slotProps={{
                closeButton: {
                    "aria-label": t("organisation-public.general-info.dismiss-aria"),
                    title: t("organisation-public.general-info.dismiss-aria"),
                },
            }}
        >
            <div className={styles.confirmContactAddressContent}>
                <AlertTitle className={styles.confirmText}>{t("organisation-public.confirm-contact-address")}</AlertTitle>
                <Button size="small" variant="contained" color="primary" onClick={() => setOpen(false)}>
                    {t("organisation-public.confirm-contact-address-button")}
                </Button>
            </div>
        </Alert>
    )
}
