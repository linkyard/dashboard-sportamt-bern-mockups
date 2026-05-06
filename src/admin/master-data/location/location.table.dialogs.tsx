import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material"
import {useState} from "react"
import {useTranslation} from "react-i18next"
import {type LocationRowData, type ObjektRowData, newId} from "./location-types"
import styles from "./location.table.module.scss"

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
            onValidationError(t("master-data.objects-table.validation-location-name"))
            return
        }
        if (objekte.some((o) => !o.name.trim())) {
            onValidationError(t("master-data.objects-table.validation-object-name"))
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
            <DialogTitle>{t("master-data.objects-table.create-location-title")}</DialogTitle>
            <DialogContent className={styles.dialogContent}>
                <Stack spacing={2} sx={{mt: 1}}>
                    <TextField
                        label={t("master-data.objects-table.columns.name")}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        fullWidth
                    />
                    <div className={styles.objekteSectionTitle}>{t("master-data.objects-table.objects-section")}</div>
                    {objekte.map((draft, index) => (
                        <Stack key={index} spacing={1} className={styles.objektDraftCard}>
                            <TextField
                                label={t("master-data.objects-table.object-name-label")}
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
                                    {t("master-data.objects-table.remove-object-draft")}
                                </Button>
                            ) : null}
                        </Stack>
                    ))}
                    <Button size="small" variant="outlined" onClick={() => setObjekte([...objekte, emptyObjektDraft()])}>
                        {t("master-data.objects-table.add-another-object")}
                    </Button>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t("master-data.objects-table.cancel")}</Button>
                <Button variant="contained" onClick={handleSave}>
                    {t("master-data.objects-table.save")}
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
            onValidationError(t("master-data.objects-table.validation-location-name"))
            return
        }
        onSave({
            ...location,
            name: editedValue,
        })
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{t("master-data.objects-table.edit-location-title")}</DialogTitle>
            <DialogContent className={styles.dialogContent}>
                <TextField
                    label={t("master-data.objects-table.columns.name")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t("master-data.objects-table.cancel")}</Button>
                <Button variant="contained" onClick={handleSave}>
                    {t("master-data.objects-table.save")}
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
            onValidationError(t("master-data.objects-table.validation-object-name"))
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
                {mode === "create" ? t("master-data.objects-table.create-object-title") : t("master-data.objects-table.edit-object-title")}
            </DialogTitle>
            <DialogContent className={styles.dialogContent}>
                <Stack spacing={2} sx={{mt: 1}}>
                    <TextField
                        label={t("master-data.objects-table.columns.name")}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t("master-data.objects-table.cancel")}</Button>
                <Button variant="contained" onClick={handleSave}>
                    {t("master-data.objects-table.save")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
