import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormLabel,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material"
import {useState} from "react"
import {useTranslation} from "react-i18next"
import {allDummyOrganisations} from "../../dummyData"
import styles from "./send-emails-dialog.module.scss"

const BOARD_EMAIL_TYPES = [
    "Registrierung E-Mail senden",
    "Erinnerung 1 E-Mail senden",
    "Erinnerung 2 E-Mail senden",
    "Erinnerung 3 E-Mail senden",
] as const

type BoardEmailType = (typeof BOARD_EMAIL_TYPES)[number]

interface SendEmailsDialogProps {
    open: boolean
    onClose: () => void
}

export function SendEmailsDialog({open, onClose}: SendEmailsDialogProps) {
    const {t} = useTranslation("dashboard")
    const [selectedEmailType, setSelectedEmailType] = useState<BoardEmailType>(BOARD_EMAIL_TYPES[0])
    const [selectedOrganisationIds, setSelectedOrganisationIds] = useState<Set<string>>(
        () => new Set(allDummyOrganisations.map((o) => o.id))
    )

    const toggleOrganisationSelection = (organisationId: string) => {
        setSelectedOrganisationIds((prev) => {
            const next = new Set(prev)
            if (next.has(organisationId)) {
                next.delete(organisationId)
            } else {
                next.add(organisationId)
            }
            return next
        })
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{t("board-detail.send-emails.dialog-title")}</DialogTitle>
            <DialogContent className={styles.sendEmailsDialogContent}>
                <div className={styles.emailTypeField}>
                    <FormLabel className={styles.emailTypeLabel}>{t("board-detail.send-emails.email-type-label")}</FormLabel>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        slotProps={{
                            input: {
                                "aria-label": t("board-detail.send-emails.email-type-label"),
                            },
                        }}
                        value={selectedEmailType}
                        onChange={(event) => setSelectedEmailType(event.target.value as BoardEmailType)}
                    >
                        {BOARD_EMAIL_TYPES.map((emailType) => (
                            <MenuItem key={emailType} value={emailType}>
                                {emailType}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>

                <TableContainer className={styles.sendEmailsOrganisationTable}>
                    <Table size="small" aria-label="Organisations email selection">
                        <TableHead>
                            <TableRow>
                                <TableCell>{t("board-detail.send-emails.table.headers.organisation")}</TableCell>
                                <TableCell align="center">{t("board-detail.send-emails.table.headers.send")}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allDummyOrganisations.map((organisation) => (
                                <TableRow key={organisation.id} hover>
                                    <TableCell>{organisation.organisation}</TableCell>
                                    <TableCell align="center">
                                        <Checkbox
                                            checked={selectedOrganisationIds.has(organisation.id)}
                                            onChange={() => toggleOrganisationSelection(organisation.id)}
                                            slotProps={{
                                                input: {
                                                    "aria-label": `Send ${selectedEmailType} to ${organisation.organisation}`,
                                                },
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button size="small" onClick={onClose}>
                    {t("common:actions.cancel")}
                </Button>
                <Button size="small" variant="contained" onClick={onClose}>
                    {t("dashboard:board-detail.send-emails.send-button")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
