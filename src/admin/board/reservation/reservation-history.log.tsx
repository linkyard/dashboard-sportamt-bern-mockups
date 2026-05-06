import Timeline from "@mui/lab/Timeline"
import TimelineConnector from "@mui/lab/TimelineConnector"
import TimelineContent from "@mui/lab/TimelineContent"
import TimelineDot from "@mui/lab/TimelineDot"
import TimelineItem from "@mui/lab/TimelineItem"
import TimelineSeparator from "@mui/lab/TimelineSeparator"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import {useState} from "react"
import {useTranslation} from "react-i18next"
import {FieldLabel} from "../../../components/field-label"
import {DetailsTextarea} from "../../../components/inputs"
import type {ReservationHistoryEntry, ReservationStatus} from "../organisation"
import styles from "./reservation-history.log.module.scss"
import {ReservationStatusPill} from "./reservation-status.pill"

type ReservationHistoryLogProps = {
    title: string
    emptyText: string
    entries: ReservationHistoryEntry[]
    status?: ReservationStatus
}

export const ReservationHistoryLog = ({title, emptyText, entries, status}: ReservationHistoryLogProps) => {
    const {t} = useTranslation("dashboard")
    const [comment, setComment] = useState("")

    return (
        <Box component="section" aria-label={title}>
            <div className={styles.historyHeader}>
                <h2 className={styles.sectionTitle}>{title}</h2>
                <ReservationStatusPill status={status} />
            </div>
            <div className={styles.panel}>
                <div className={styles.timelineArea}>
                    {entries.length === 0 ? (
                        <p className={styles.emptyText}>{emptyText}</p>
                    ) : (
                        <Timeline position="right" className={styles.timeline}>
                            {entries.map((entry, index) => (
                                <TimelineItem key={entry.id}>
                                    <TimelineSeparator>
                                        <TimelineDot variant="filled" className={styles.timelineDot} />
                                        {index < entries.length - 1 ? <TimelineConnector /> : null}
                                    </TimelineSeparator>
                                    <TimelineContent className={styles.timelineContent}>
                                        <Stack className={styles.entryStack}>
                                            <p className={styles.entryTitle}>{entry.title}</p>
                                            <p className={styles.entryMeta}>
                                                {entry.actorName}
                                                <span aria-hidden> • </span>
                                                {entry.atLabel}
                                            </p>
                                        </Stack>
                                    </TimelineContent>
                                </TimelineItem>
                            ))}
                        </Timeline>
                    )}
                </div>
                <div className={styles.commentSection}>
                    <FieldLabel htmlFor="anlass-history-comment">{t("board-detail.fields.comment")}</FieldLabel>
                    <DetailsTextarea
                        id="anlass-history-comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        placeholder={t("board-detail.fields.comment-placeholder")}
                    />
                </div>
            </div>
        </Box>
    )
}
