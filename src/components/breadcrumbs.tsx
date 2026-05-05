import {faAngleRight} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import Breadcrumbs from "@mui/material/Breadcrumbs"
import Link from "@mui/material/Link"
import type {TFunction} from "i18next"
import {useTranslation} from "react-i18next"
import {Link as RouterLink} from "react-router"
import {resolveAnlassFromOrganisation, type Anlass, type Organisation} from "../board/organisation"
import {getBoardById} from "../dummyData"
import styles from "./breadcrumbs.module.scss"

type Crumb = {label: string; to?: string}

export type AppBreadcrumbsProps =
    | {variant: "board-detail"; boardName: string; isNew: boolean}
    | {variant: "organisation-admin"; organisation: Organisation}
    | {variant: "anlass-detail"; organisation: Organisation | undefined; anlass: Anlass | undefined}
    | {variant: "verein-public-anlass"; organisationId: string | undefined; organisation: Organisation | undefined; anlass: Anlass | undefined}
    | {variant: "ferien-editor"; holidayName: string}
    | {variant: "verein-editor"; vereinName: string}

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
        case "anlass-detail": {
            const {organisation, anlass} = props
            const anlassName =
                (anlass ? resolveAnlassFromOrganisation(anlass, organisation) : undefined)?.name?.trim() ||
                t("dashboard:organisation-admin.anlass-detail.fallback-title")
            return (
                <BreadcrumbsList
                    items={[
                        ...dashboardAndBoard(organisation, t),
                        {
                            to: organisation?.id ? `/organisation-admin/${organisation.id}` : "/",
                            label: organisation?.organisation || t("dashboard:organisation-admin.anlass-detail.breadcrumb-fallback"),
                        },
                        {label: anlassName},
                    ]}
                />
            )
        }
        case "verein-public-anlass": {
            const {organisationId, organisation, anlass} = props
            const anlassName =
                (anlass ? resolveAnlassFromOrganisation(anlass, organisation) : undefined)?.name?.trim() ||
                t("dashboard:organisation-admin.anlass-detail.fallback-title")
            const vereinLabel = organisation?.organisation?.trim() || t("dashboard:verein-public.fallback-title")
            const items: Crumb[] = []
            if (organisationId) {
                items.push({to: `/vereine/${organisationId}`, label: vereinLabel})
            }
            items.push({label: anlassName})
            return <BreadcrumbsList items={items} />
        }
        case "ferien-editor": {
            const {holidayName} = props
            return (
                <BreadcrumbsList
                    items={[
                        {to: "/admin/stammdaten/ferien", label: t("dashboard:stammdaten.tabs.ferien")},
                        {
                            label: holidayName.trim() ? holidayName : t("dashboard:stammdaten.ferien-editor.breadcrumb-current"),
                        },
                    ]}
                />
            )
        }
        case "verein-editor": {
            const {vereinName} = props
            return (
                <BreadcrumbsList
                    items={[
                        {to: "/admin/stammdaten/vereine", label: t("dashboard:stammdaten.tabs.vereine")},
                        {
                            label: vereinName.trim() ? vereinName : t("dashboard:stammdaten.vereine-editor.breadcrumb-current"),
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
