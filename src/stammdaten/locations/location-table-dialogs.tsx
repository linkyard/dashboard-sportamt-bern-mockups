import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material"
import {useState} from "react"
import {useTranslation} from "react-i18next"
import styles from "./locations-table.module.scss"
import {type LocationRowData, type ObjektRowData, newId} from "./locations-types"

type ObjektDraft = {
    name: string
}

const emptyObjektDraft = (): ObjektDraft => ({name: ""})

interface CreateLocationDialogProps {
    open: boolean
    onClose: () => void
    onSave: (loc: LocationRowData) => void
    onValidationError: (msg: string) => void
}

export const CreateLocationDialog = ({open, onClose, onSave, onValidationError}: CreateLocationDialogProps) => {
    const {t} = useTranslation("dashboard")
    const [name, setName] = useState("")
    const [objekte, setObjekte] = useState<ObjektDraft[]>([emptyObjektDraft()])

    const handleSave = () => {
        const editedValue = name.trim()
        if (!editedValue) {
            onValidationError(t("stammdaten.objekte-table.validation-location-name"))
            return
        }
        if (objekte.some((o) => !o.name.trim())) {
            onValidationError(t("stammdaten.objekte-table.validation-objekt-name"))
            return
        }
        const subRows: ObjektRowData[] = objekte.map((o) => ({
            id: newId(),
            rowKind: "objekt",
            name: o.name.trim(),
        }))
        onSave({
            id: newId(),
            rowKind: "location",
            name: editedValue,
            subRows,
        })
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{t("stammdaten.objekte-table.create-location-title")}</DialogTitle>
            <DialogContent className={styles.dialogContent}>
                <Stack spacing={2} sx={{mt: 1}}>
                    <TextField
                        label={t("stammdaten.objekte-table.columns.name")}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        fullWidth
                    />
                    <div className={styles.objekteSectionTitle}>{t("stammdaten.objekte-table.objekte-section")}</div>
                    {objekte.map((draft, index) => (
                        <Stack key={index} spacing={1} className={styles.objektDraftCard}>
                            <TextField
                                label={t("stammdaten.objekte-table.objekt-name-label")}
                                value={draft.name}
                                onChange={(e) => {
                                    const next = [...objekte]
                                    next[index] = {...next[index], name: e.target.value}
                                    setObjekte(next)
                                }}
                                required
                                fullWidth
                                size="small"
                            />

                            {objekte.length > 1 ? (
                                <Button size="small" color="inherit" onClick={() => setObjekte(objekte.filter((_, i) => i !== index))}>
                                    {t("stammdaten.objekte-table.remove-objekt-draft")}
                                </Button>
                            ) : null}
                        </Stack>
                    ))}
                    <Button size="small" variant="outlined" onClick={() => setObjekte([...objekte, emptyObjektDraft()])}>
                        {t("stammdaten.objekte-table.add-another-objekt")}
                    </Button>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t("stammdaten.objekte-table.cancel")}</Button>
                <Button variant="contained" onClick={handleSave}>
                    {t("stammdaten.objekte-table.save")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

interface EditLocationDialogProps {
    open: boolean
    location: LocationRowData
    onClose: () => void
    onSave: (loc: LocationRowData) => void
    onValidationError: (msg: string) => void
}

export const EditLocationDialog = ({open, location, onClose, onSave, onValidationError}: EditLocationDialogProps) => {
    const {t} = useTranslation("dashboard")
    const [name, setName] = useState(location.name)

    const handleSave = () => {
        const editedValue = name.trim()
        if (!editedValue) {
            onValidationError(t("stammdaten.objekte-table.validation-location-name"))
            return
        }
        onSave({
            ...location,
            name: editedValue,
        })
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{t("stammdaten.objekte-table.edit-location-title")}</DialogTitle>
            <DialogContent className={styles.dialogContent}>
                <TextField
                    label={t("stammdaten.objekte-table.columns.name")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t("stammdaten.objekte-table.cancel")}</Button>
                <Button variant="contained" onClick={handleSave}>
                    {t("stammdaten.objekte-table.save")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

interface ObjektDialogProps {
    open: boolean
    mode: "create" | "edit"
    objekt?: ObjektRowData
    onClose: () => void
    onSave: (o: ObjektRowData) => void
    onValidationError: (msg: string) => void
}
export const ObjektDialog: React.FC<ObjektDialogProps> = ({
    open,
    mode,
    objekt,
    onClose,
    onSave,
    onValidationError,
}: {
    open: boolean
    mode: "create" | "edit"
    objekt?: ObjektRowData
    onClose: () => void
    onSave: (o: ObjektRowData) => void
    onValidationError: (msg: string) => void
}) => {
    const {t} = useTranslation("dashboard")
    const [name, setName] = useState(objekt?.name ?? "")

    const handleSave = () => {
        const editedValue = name.trim()
        if (!editedValue) {
            onValidationError(t("stammdaten.objekte-table.validation-objekt-name"))
            return
        }
        if (mode === "create") {
            onSave({
                id: newId(),
                rowKind: "objekt",
                name: editedValue,
            })
        } else if (objekt) {
            onSave({
                ...objekt,
                name: editedValue,
            })
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>
                {mode === "create" ? t("stammdaten.objekte-table.create-objekt-title") : t("stammdaten.objekte-table.edit-objekt-title")}
            </DialogTitle>
            <DialogContent className={styles.dialogContent}>
                <Stack spacing={2} sx={{mt: 1}}>
                    <TextField
                        label={t("stammdaten.objekte-table.columns.name")}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t("stammdaten.objekte-table.cancel")}</Button>
                <Button variant="contained" onClick={handleSave}>
                    {t("stammdaten.objekte-table.save")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
