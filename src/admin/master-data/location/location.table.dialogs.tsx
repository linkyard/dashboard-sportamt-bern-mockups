import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material"
import {useState} from "react"
import {useTranslation} from "react-i18next"
import {type LocationRowData, type ObjectRowData, newId} from "./location-types"
import styles from "./location.table.module.scss"

type ObjectDraft = {
    name: string
}

const emptyObjectDraft = (): ObjectDraft => ({name: ""})

interface CreateLocationDialogProps {
    open: boolean
    onClose: () => void
    onSave: (loc: LocationRowData) => void
    onValidationError: (msg: string) => void
}

export const CreateLocationDialog = ({open, onClose, onSave, onValidationError}: CreateLocationDialogProps) => {
    const {t} = useTranslation("dashboard")
    const [name, setName] = useState("")
    const [objects, setObjects] = useState<ObjectDraft[]>([emptyObjectDraft()])

    const handleSave = () => {
        const editedValue = name.trim()
        if (!editedValue) {
            onValidationError(t("master-data.objects-table.validation-location-name"))
            return
        }
        if (objects.some((o) => !o.name.trim())) {
            onValidationError(t("master-data.objects-table.validation-object-name"))
            return
        }
        const subRows: ObjectRowData[] = objects.map((o) => ({
            id: newId(),
            rowKind: "object",
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
                    <div className={styles.objectsSectionTitle}>{t("master-data.objects-table.objects-section")}</div>
                    {objects.map((draft, index) => (
                        <Stack key={index} spacing={1} className={styles.objectDraftCard}>
                            <TextField
                                label={t("master-data.objects-table.object-name-label")}
                                value={draft.name}
                                onChange={(e) => {
                                    const next = [...objects]
                                    next[index] = {...next[index], name: e.target.value}
                                    setObjects(next)
                                }}
                                required
                                fullWidth
                                size="small"
                            />

                            {objects.length > 1 ? (
                                <Button size="small" color="inherit" onClick={() => setObjects(objects.filter((_, i) => i !== index))}>
                                    {t("master-data.objects-table.remove-object-draft")}
                                </Button>
                            ) : null}
                        </Stack>
                    ))}
                    <Button size="small" variant="outlined" onClick={() => setObjects([...objects, emptyObjectDraft()])}>
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

interface ObjectDialogProps {
    open: boolean
    mode: "create" | "edit"
    object?: ObjectRowData
    onClose: () => void
    onSave: (o: ObjectRowData) => void
    onValidationError: (msg: string) => void
}
export const ObjectDialog: React.FC<ObjectDialogProps> = ({
    open,
    mode,
    object,
    onClose,
    onSave,
    onValidationError,
}: {
    open: boolean
    mode: "create" | "edit"
    object?: ObjectRowData
    onClose: () => void
    onSave: (o: ObjectRowData) => void
    onValidationError: (msg: string) => void
}) => {
    const {t} = useTranslation("dashboard")
    const [name, setName] = useState(object?.name ?? "")

    const handleSave = () => {
        const editedValue = name.trim()
        if (!editedValue) {
            onValidationError(t("master-data.objects-table.validation-object-name"))
            return
        }
        if (mode === "create") {
            onSave({
                id: newId(),
                rowKind: "object",
                name: editedValue,
            })
        } else if (object) {
            onSave({
                ...object,
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
