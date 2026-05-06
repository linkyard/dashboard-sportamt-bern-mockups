import {faAngleRight} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import Breadcrumbs from "@mui/material/Breadcrumbs"
import Link from "@mui/material/Link"
import type {TFunction} from "i18next"
import {useTranslation} from "react-i18next"
import {Link as RouterLink} from "react-router"
import {resolveReservationFromOrganisation, type Organisation, type Reservation} from "../admin/board/organisation"
import {getBoardById} from "../dummyData"
import styles from "./breadcrumbs.module.scss"

type Crumb = {label: string; to?: string}

export type AppBreadcrumbsProps =
    | {variant: "board-detail"; boardName: string; isNew: boolean}
    | {variant: "organisation-admin"; organisation: Organisation}
    | {variant: "reservation-detail"; organisation: Organisation | undefined; reservation: Reservation | undefined}
    | {
          variant: "organisation-reservation"
          orgId: string | undefined
          organisation: Organisation | undefined
          reservation: Reservation | undefined
      }
    | {variant: "holidays-editor"; holidayName: string}
    | {variant: "organisation-editor"; organisationName: string}

function dashboardAndBoard(organisation: Organisation | undefined, t: TFunction<"dashboard">): Crumb[] {
    const id = organisation?.boardId
    const board = id ? getBoardById(id) : undefined
    const to = id ? `/board/${id}` : "/board"
    const label = board?.name?.trim() || t("dashboard:organisation-admin.breadcrumb-board-fallback")
    return [
        {label: t("dashboard:dashboard.title"), to: "/"},
        {label, to},
    ]
}

function BreadcrumbsList({items}: {items: Crumb[]}) {
    return (
        <Breadcrumbs
            className={styles.root}
            aria-label="breadcrumbs"
            separator={<FontAwesomeIcon icon={faAngleRight} className={styles.separator} />}
        >
            {items.map((item, index) => {
                const key = `${index}-${item.label}`
                if (item.to) {
                    return (
                        <Link key={key} component={RouterLink} to={item.to} underline="hover" color="inherit" variant="body2">
                            {item.label}
                        </Link>
                    )
                }
                return (
                    <span key={key} className={styles.current}>
                        {item.label}
                    </span>
                )
            })}
        </Breadcrumbs>
    )
}

export const AppBreadcrumbs: React.FC<AppBreadcrumbsProps> = (props) => {
    const {t} = useTranslation("dashboard")

    switch (props.variant) {
        case "board-detail": {
            const {boardName, isNew} = props
            return (
                <BreadcrumbsList
                    items={[
                        {to: "/", label: t("dashboard:dashboard.title")},
                        {label: isNew || !boardName.trim() ? t("dashboard:board-detail.title") : boardName},
                    ]}
                />
            )
        }
        case "organisation-admin": {
            const {organisation} = props
            return (
                <BreadcrumbsList
                    items={[
                        ...dashboardAndBoard(organisation, t),
                        {
                            label: organisation.organisation?.trim() ? organisation.organisation : t("dashboard:organisation-admin.title"),
                        },
                    ]}
                />
            )
        }
        case "reservation-detail": {
            const {organisation, reservation} = props
            const reservationName =
                (reservation ? resolveReservationFromOrganisation(reservation, organisation) : undefined)?.name?.trim() ||
                t("dashboard:organisation-admin.reservation-detail.fallback-title")
            return (
                <BreadcrumbsList
                    items={[
                        ...dashboardAndBoard(organisation, t),
                        {
                            to: organisation?.id ? `/organisation-admin/${organisation.id}` : "/",
                            label: organisation?.organisation || t("dashboard:organisation-admin.reservation-detail.breadcrumb-fallback"),
                        },
                        {label: reservationName},
                    ]}
                />
            )
        }
        case "organisation-reservation": {
            const {orgId, organisation, reservation} = props
            const reservationName =
                (reservation ? resolveReservationFromOrganisation(reservation, organisation) : undefined)?.name?.trim() ||
                t("dashboard:organisation-admin.reservation-detail.fallback-title")
            const organisationLabel = organisation?.organisation?.trim() || t("dashboard:organisation-public.fallback-title")
            const items: Crumb[] = []
            if (orgId) {
                items.push({to: `/organisationen/${orgId}`, label: organisationLabel})
            }
            items.push({label: reservationName})
            return <BreadcrumbsList items={items} />
        }
        case "holidays-editor": {
            const {holidayName} = props
            return (
                <BreadcrumbsList
                    items={[
                        {to: "/admin/stammdaten/ferien", label: t("dashboard:master-data.tabs.holidays")},
                        {
                            label: holidayName.trim() ? holidayName : t("dashboard:master-data.holidays-editor.breadcrumb-current"),
                        },
                    ]}
                />
            )
        }
        case "organisation-editor": {
            const {organisationName} = props
            return (
                <BreadcrumbsList
                    items={[
                        {to: "/admin/stammdaten/organisationen", label: t("dashboard:master-data.tabs.organisations")},
                        {
                            label: organisationName.trim()
                                ? organisationName
                                : t("dashboard:master-data.organisation-editor.breadcrumb-current"),
                        },
                    ]}
                />
            )
        }
        default: {
            throw new Error("AppBreadcrumbs: unhandled variant")
        }
    }
}
