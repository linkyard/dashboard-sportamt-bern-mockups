import {faAddressCard, faArrowRotateLeft, faEnvelope, faPhone} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {IconButton, TextField, Tooltip, type TextFieldProps} from "@mui/material"
import {useState} from "react"
import {useTranslation} from "react-i18next"
import {EditButton} from "../../components/edit-button"
import editButtonStyles from "../../components/edit-button.module.scss"
import type {ContactAddress} from "../organisation"
import styles from "./contact-box.module.scss"

const emptyContact = (): ContactAddress => ({
    organisationName: "",
    contactPerson: "",
    street: "",
    postalCode: "",
    city: "",
    email: "",
    phone: "",
})

type ContactInputProps = TextFieldProps & {fieldKey: string}

const ContactInput: React.FC<ContactInputProps> = ({value, onChange, fieldKey, slotProps: userSlotProps, ...props}) => {
    const {t} = useTranslation("dashboard")
    const fieldLabel = t(`organisation-admin.contact-box.${fieldKey}`)

    return (
        <TextField
            {...props}
            variant="standard"
            size="small"
            value={value}
            onChange={onChange}
            placeholder={fieldLabel}
            slotProps={{
                ...userSlotProps,
                input: {disableUnderline: true as const, ...userSlotProps?.input},
                htmlInput: {"aria-label": fieldLabel, ...userSlotProps?.htmlInput},
            }}
        />
    )
}

type ContactDetailsProps = {
    title: string
    contact?: ContactAddress
    /**
     * Rechnungsadresse: revert control while editing, and “same as contact” when `contact` is absent.
     */
    billingAddressMode?: boolean
}

export const ContactDetails = ({title, contact, billingAddressMode = false}: ContactDetailsProps) => {
    const {t} = useTranslation("dashboard")
    const isBilling = billingAddressMode
    const [isEditing, setIsEditing] = useState(false)
    const [draft, setDraft] = useState<ContactAddress>(contact ?? emptyContact())

    const toggleEdit = () => {
        setIsEditing((prev) => {
            const next = !prev
            if (next) setDraft(contact ?? emptyContact())
            return next
        })
    }

    const handleBillingRevert = () => {
        setIsEditing(false)
        setDraft(contact ?? emptyContact())
    }

    return (
        <article className={styles.contactCard}>
            <span className={styles.editButton}>
                {isBilling && isEditing ? (
                    <Tooltip title={t("organisation-admin.same-as-contact")}>
                        <IconButton
                            className={editButtonStyles.editButton}
                            onClick={handleBillingRevert}
                            size="small"
                            aria-label={t("organisation-admin.same-as-contact")}
                        >
                            <FontAwesomeIcon icon={faArrowRotateLeft} className={editButtonStyles.editIcon} />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <EditButton onClick={toggleEdit} />
                )}
            </span>
            <h3 className={styles.cardTitle}>{title}</h3>
            {!isEditing && isBilling && !contact && (
                <div className={styles.contactContent}>
                    <p className={styles.sameAsContactText}>{t("organisation-admin.same-as-contact")}</p>
                </div>
            )}
            {contact && !isEditing && (
                <div className={styles.contactContent}>
                    <div className={styles.addressGroup}>
                        <FontAwesomeIcon icon={faAddressCard} className={styles.addressGroupIcon} aria-hidden />
                        <div className={styles.addressStack}>
                            <p>{contact.organisationName}</p>
                            <p>{contact.contactPerson}</p>
                            <p>{contact.street}</p>
                            <p>{[contact.postalCode, contact.city].filter(Boolean).join(" ")}</p>
                        </div>
                    </div>
                    <p className={styles.infoRowWithIcon}>
                        <FontAwesomeIcon icon={faEnvelope} className={styles.rowIcon} />
                        <span>{contact.email}</span>
                    </p>
                    <p className={styles.infoRowWithIcon}>
                        <FontAwesomeIcon icon={faPhone} className={styles.rowIcon} />
                        <span>{contact.phone}</span>
                    </p>
                </div>
            )}
            {isEditing && (
                <div className={styles.contactContent}>
                    <div className={styles.addressGroup}>
                        <FontAwesomeIcon icon={faAddressCard} className={styles.addressGroupIcon} />
                        <div className={styles.addressStack}>
                            <ContactInput
                                fieldKey="organisation"
                                value={draft.organisationName}
                                onChange={(event) => setDraft((prev) => ({...prev, organisationName: event.target.value}))}
                            />
                            <ContactInput
                                fieldKey="contactPerson"
                                value={draft.contactPerson}
                                onChange={(event) => setDraft((prev) => ({...prev, contactPerson: event.target.value}))}
                            />
                            <ContactInput
                                fieldKey="street"
                                value={draft.street}
                                onChange={(event) => setDraft((prev) => ({...prev, street: event.target.value}))}
                            />
                            <div className={styles.postalCityRow}>
                                <ContactInput
                                    className={styles.postalField}
                                    fieldKey="postalCode"
                                    value={draft.postalCode}
                                    onChange={(event) => setDraft((prev) => ({...prev, postalCode: event.target.value}))}
                                    slotProps={{htmlInput: {inputMode: "text"}}}
                                />
                                <ContactInput
                                    className={styles.cityField}
                                    fieldKey="city"
                                    value={draft.city}
                                    onChange={(event) => setDraft((prev) => ({...prev, city: event.target.value}))}
                                />
                            </div>
                        </div>
                    </div>

                    <label className={styles.infoRowWithIcon}>
                        <FontAwesomeIcon icon={faEnvelope} className={styles.rowIcon} />
                        <ContactInput
                            fieldKey="email"
                            type="email"
                            value={draft.email}
                            onChange={(event) => setDraft((prev) => ({...prev, email: event.target.value}))}
                        />
                    </label>
                    <label className={`${styles.infoRowWithIcon} ${styles.phoneRow}`}>
                        <FontAwesomeIcon icon={faPhone} className={styles.rowIcon} />
                        <ContactInput
                            fieldKey="phone"
                            value={draft.phone}
                            onChange={(event) => setDraft((prev) => ({...prev, phone: event.target.value}))}
                        />
                    </label>
                </div>
            )}
        </article>
    )
}
