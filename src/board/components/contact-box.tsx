import {faBuilding, faEnvelope, faLocationDot, faPhone, faUser} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {TextField} from "@mui/material"
import {useState} from "react"
import {EditButton} from "../../components/edit-button"
import type {ContactAddress} from "../organisation"
import styles from "./contact-box.module.scss"

export const ContactDetails = ({title, contact, emptyText}: {title: string; contact?: ContactAddress; emptyText?: string}) => {
    const [isEditing, setIsEditing] = useState(false)
    const [draft, setDraft] = useState<ContactAddress>(
        contact ?? {
            organisationName: "",
            contactPerson: "",
            street: "",
            city: "",
            email: "",
            phone: "",
        }
    )

    return (
        <article className={styles.contactCard}>
            <span className={styles.editButton}>
                <EditButton onClick={() => setIsEditing((prev) => !prev)} />
            </span>
            <h3 className={styles.cardTitle}>{title}</h3>
            {isEditing ? (
                <div className={styles.contactContent}>
                    <label className={styles.inputRow}>
                        <FontAwesomeIcon icon={faBuilding} className={styles.rowIcon} />
                        <TextField
                            variant="standard"
                            size="small"
                            className={styles.inputField}
                            value={draft.organisationName}
                            onChange={(event) =>
                                setDraft((prev) => ({
                                    ...prev,
                                    organisationName: event.target.value,
                                }))
                            }
                        />
                    </label>
                    <label className={styles.inputRow}>
                        <FontAwesomeIcon icon={faUser} className={styles.rowIcon} />
                        <TextField
                            variant="standard"
                            size="small"
                            className={styles.inputField}
                            value={draft.contactPerson}
                            onChange={(event) =>
                                setDraft((prev) => ({
                                    ...prev,
                                    contactPerson: event.target.value,
                                }))
                            }
                        />
                    </label>
                    <label className={styles.inputRow}>
                        <FontAwesomeIcon icon={faLocationDot} className={styles.rowIcon} />
                        <TextField
                            variant="standard"
                            size="small"
                            className={styles.inputField}
                            value={draft.street}
                            onChange={(event) =>
                                setDraft((prev) => ({
                                    ...prev,
                                    street: event.target.value,
                                }))
                            }
                        />
                    </label>
                    {/* <label className={styles.inputRow}>
                        <span className={styles.rowIcon} />
                        <TextField
                            variant="standard"
                            size="small"
                            className={styles.inputField}
                            value={draft.city}
                            onChange={(event) =>
                                setDraft((prev) => ({
                                    ...prev,
                                    city: event.target.value,
                                }))
                            }
                        />
                    </label> */}
                    <label className={styles.inputRow}>
                        <FontAwesomeIcon icon={faEnvelope} className={styles.rowIcon} />
                        <TextField
                            variant="standard"
                            size="small"
                            className={styles.inputField}
                            value={draft.email}
                            onChange={(event) =>
                                setDraft((prev) => ({
                                    ...prev,
                                    email: event.target.value,
                                }))
                            }
                        />
                    </label>
                    <label className={styles.inputRow}>
                        <FontAwesomeIcon icon={faPhone} className={styles.rowIcon} />
                        <TextField
                            variant="standard"
                            size="small"
                            className={styles.inputField}
                            value={draft.phone}
                            onChange={(event) =>
                                setDraft((prev) => ({
                                    ...prev,
                                    phone: event.target.value,
                                }))
                            }
                        />
                    </label>
                </div>
            ) : contact ? (
                <div className={styles.contactContent}>
                    <p className={styles.infoRow}>
                        <FontAwesomeIcon icon={faBuilding} className={styles.rowIcon} />
                        <span>{contact.organisationName}</span>
                    </p>
                    <p className={styles.infoRow}>
                        <FontAwesomeIcon icon={faUser} className={styles.rowIcon} />
                        <span>{contact.contactPerson}</span>
                    </p>
                    <p className={styles.infoRow}>
                        <FontAwesomeIcon icon={faLocationDot} className={styles.rowIcon} />
                        <span>{contact.street}</span>
                    </p>
                    {/* <p className={styles.infoRow}>
                        <span className={styles.rowIcon} />
                        <span>{contact.city}</span>
                    </p> */}
                    <p className={styles.infoRow}>
                        <FontAwesomeIcon icon={faEnvelope} className={styles.rowIcon} />
                        <span>{contact.email}</span>
                    </p>
                    <p className={styles.infoRow}>
                        <FontAwesomeIcon icon={faPhone} className={styles.rowIcon} />
                        <span>{contact.phone}</span>
                    </p>
                </div>
            ) : (
                <p>{emptyText}</p>
            )}
        </article>
    )
}
