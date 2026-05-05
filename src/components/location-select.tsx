import {faLocationDot} from "@fortawesome/pro-regular-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {FormControl, MenuItem, Select, type SelectChangeEvent, Tooltip} from "@mui/material"
import {useEffect, useMemo, useState} from "react"
import {useTranslation} from "react-i18next"
import {EditButton} from "./edit-button"
import styles from "./location-select.module.scss"

export type LocationSelectProps = {
    value: string
    locationOptions: string[]
    onLocationChange?: (location: string) => void
}

export function LocationSelect({value, locationOptions, onLocationChange}: LocationSelectProps) {
    const {t} = useTranslation("dashboard")
    const {t: tCommon} = useTranslation("common")
    const [isEditing, setIsEditing] = useState(false)
    const [draft, setDraft] = useState(value)

    useEffect(() => {
        setDraft(value)
    }, [value])

    const options = useMemo(() => {
        const set = new Set(locationOptions)
        if (value) {
            set.add(value)
        }
        return [...set].sort((a, b) => a.localeCompare(b, "de"))
    }, [locationOptions, value])

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const next = event.target.value
        setDraft(next)
        onLocationChange?.(next)
    }

    return (
        <div className={styles.row}>
            <div className={styles.group}>
                <FontAwesomeIcon icon={faLocationDot} className={styles.icon} aria-hidden />
                <div className={styles.valueSlot}>
                    <div
                        className={`${styles.valueLayer} ${!isEditing ? styles.valueLayerVisible : ""}`}
                        aria-hidden={isEditing ? true : undefined}
                    >
                        <span className={styles.readText}>{draft ? draft.trim() : "—"}</span>
                    </div>
                    <div className={`${styles.valueLayer} ${isEditing ? styles.valueLayerVisible : ""}`} aria-hidden={!isEditing}>
                        <FormControl size="small" className={styles.selectWrap} variant="outlined">
                            <Select
                                displayEmpty
                                value={draft}
                                onChange={handleSelectChange}
                                aria-label={t("organisation-public.anlass.location-select-aria")}
                                renderValue={(selected) =>
                                    selected ? (
                                        <span>{selected}</span>
                                    ) : (
                                        <span className={styles.placeholderValue}>
                                            {t("organisation-public.anlass.location-select-placeholder")}
                                        </span>
                                    )
                                }
                            >
                                <MenuItem value="">
                                    <em>{t("organisation-public.anlass.location-select-placeholder")}</em>
                                </MenuItem>
                                {options.map((loc) => (
                                    <MenuItem key={loc} value={loc}>
                                        {loc}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </div>
            <Tooltip title={isEditing ? tCommon("actions.finish-editing") : tCommon("actions.edit")}>
                <span>
                    <EditButton isActive={isEditing} onClick={() => setIsEditing((previous) => !previous)} />
                </span>
            </Tooltip>
        </div>
    )
}
