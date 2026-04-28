import {Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Stack, TextField} from "@mui/material"
import {useState} from "react"
import {useTranslation} from "react-i18next"
import type {ContactAddress} from "../../board/organisation"
import styles from "./vereine-list.module.scss"
import {type TrainerRowData, type VereinRowData, newId} from "./vereine-types"

const emptyContact = (): ContactAddress => ({
    organisationName: "",
    contactPerson: "",
    street: "",
    postalCode: "",
    city: "",
    email: "",
    phone: "",
})

function ContactFields({prefix, value, onChange}: {prefix: string; value: ContactAddress; onChange: (next: ContactAddress) => void}) {
    const {t} = useTranslation("dashboard")
    const label = (key: string) => t(`organisation-admin.contact-box.${key}` as const)

    return (
        <Stack spacing={2}>
            <TextField
                label={label("organisation")}
                value={value.organisationName}
                onChange={(e) => onChange({...value, organisationName: e.target.value})}
                fullWidth
                size="small"
                name={`${prefix}-organisationName`}
            />
            <TextField
                label={label("contactPerson")}
                value={value.contactPerson}
                onChange={(e) => onChange({...value, contactPerson: e.target.value})}
                fullWidth
                size="small"
                name={`${prefix}-contactPerson`}
            />
            <TextField
                label={label("street")}
                value={value.street}
                onChange={(e) => onChange({...value, street: e.target.value})}
                fullWidth
                size="small"
                name={`${prefix}-street`}
            />
            <Stack direction="row" spacing={2}>
                <TextField
                    label={label("postalCode")}
                    value={value.postalCode}
                    onChange={(e) => onChange({...value, postalCode: e.target.value})}
                    fullWidth
                    size="small"
                    name={`${prefix}-postalCode`}
                />
                <TextField
                    label={label("city")}
                    value={value.city}
                    onChange={(e) => onChange({...value, city: e.target.value})}
                    fullWidth
                    size="small"
                    name={`${prefix}-city`}
                />
            </Stack>
            <TextField
                label={label("email")}
                type="email"
                value={value.email}
                onChange={(e) => onChange({...value, email: e.target.value})}
                fullWidth
                size="small"
                name={`${prefix}-email`}
            />
            <TextField
                label={label("phone")}
                value={value.phone}
                onChange={(e) => onChange({...value, phone: e.target.value})}
                fullWidth
                size="small"
                name={`${prefix}-phone`}
            />
        </Stack>
    )
}

interface CreateVereinDialogProps {
    open: boolean
    onClose: () => void
    onSave: (v: VereinRowData) => void
    onValidationError: (msg: string) => void
}

export const CreateVereinDialog = ({open, onClose, onSave, onValidationError}: CreateVereinDialogProps) => {
    const {t} = useTranslation("dashboard")
    const [name, setName] = useState("")
    const [contact, setContact] = useState<ContactAddress>(() => emptyContact())
    const [billingSameAsContact, setBillingSameAsContact] = useState(true)
    const [billing, setBilling] = useState<ContactAddress>(() => emptyContact())

    const handleSave = () => {
        const trimmedName = name.trim()
        if (!trimmedName) {
            onValidationError(t("stammdaten.vereine-table.validation-verein-name"))
            return
        }
        const contactDraft: ContactAddress = {
            ...contact,
            organisationName: contact.organisationName.trim() || trimmedName,
        }
        onSave({
            id: newId(),
            rowKind: "verein",
            name: trimmedName,
            contact: contactDraft,
            ...(billingSameAsContact ? {} : {billingContact: {...billing}}),
            subRows: [],
        })
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{t("stammdaten.vereine-table.create-verein-title")}</DialogTitle>
            <DialogContent className={styles.dialogContent}>
                <Stack spacing={2} sx={{mt: 1}}>
                    <TextField
                        label={t("stammdaten.vereine-table.columns.verein-name")}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        fullWidth
                    />
                    <div className={styles.addressSectionTitle}>{t("organisation-admin.contact-address-title")}</div>
                    <ContactFields prefix="create-kontakt" value={contact} onChange={setContact} />
                    <div className={styles.addressSectionTitle}>{t("organisation-admin.billing-address-title")}</div>
                    <FormControlLabel
                        control={<Checkbox checked={billingSameAsContact} onChange={(e) => setBillingSameAsContact(e.target.checked)} />}
                        label={t("organisation-admin.same-as-contact")}
                    />
                    {!billingSameAsContact ? <ContactFields prefix="create-rechnung" value={billing} onChange={setBilling} /> : null}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t("stammdaten.vereine-table.cancel")}</Button>
                <Button variant="contained" onClick={handleSave}>
                    {t("stammdaten.vereine-table.save")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

interface TrainerDialogProps {
    open: boolean
    mode: "create" | "edit"
    trainer?: TrainerRowData
    onClose: () => void
    onSave: (tr: TrainerRowData) => void
    onValidationError: (msg: string) => void
}

export const TrainerDialog = ({open, mode, trainer, onClose, onSave, onValidationError}: TrainerDialogProps) => {
    const {t} = useTranslation("dashboard")
    const [firstName, setFirstName] = useState(trainer?.firstName ?? "")
    const [lastName, setLastName] = useState(trainer?.lastName ?? "")
    const [phone, setPhone] = useState(trainer?.phone ?? "")
    const [email, setEmail] = useState(trainer?.email ?? "")

    const handleSave = () => {
        const fn = firstName.trim()
        const ln = lastName.trim()
        if (!fn || !ln) {
            onValidationError(t("stammdaten.vereine-table.validation-trainer-name"))
            return
        }
        if (mode === "create") {
            onSave({
                id: newId(),
                rowKind: "trainer",
                firstName: fn,
                lastName: ln,
                phone: phone.trim(),
                email: email.trim(),
            })
        } else if (trainer) {
            onSave({
                ...trainer,
                firstName: fn,
                lastName: ln,
                phone: phone.trim(),
                email: email.trim(),
            })
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>
                {mode === "create" ? t("stammdaten.vereine-table.create-trainer-title") : t("stammdaten.vereine-table.edit-trainer-title")}
            </DialogTitle>
            <DialogContent className={styles.dialogContent}>
                <Stack spacing={2} sx={{mt: 1}}>
                    <TextField
                        label={t("stammdaten.vereine-table.columns.first-name")}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        fullWidth
                    />
                    <TextField
                        label={t("stammdaten.vereine-table.columns.last-name")}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        fullWidth
                    />
                    <TextField
                        label={t("stammdaten.vereine-table.columns.phone")}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label={t("stammdaten.vereine-table.columns.email")}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t("stammdaten.vereine-table.cancel")}</Button>
                <Button variant="contained" onClick={handleSave}>
                    {t("stammdaten.vereine-table.save")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
