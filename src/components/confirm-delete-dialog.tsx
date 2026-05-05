import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import type {ReactNode} from "react"
import {useTranslation} from "react-i18next"

export interface ConfirmDeleteDialogProps {
    open: boolean
    onClose: () => void
    onConfirm: () => void
    title: ReactNode
    children: ReactNode
}

export function ConfirmDeleteDialog({open, onClose, onConfirm, title, children}: ConfirmDeleteDialogProps) {
    const {t} = useTranslation("common")

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{children}</DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t("actions.cancel")}</Button>
                <Button color="error" variant="contained" onClick={onConfirm}>
                    {t("actions.delete")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
