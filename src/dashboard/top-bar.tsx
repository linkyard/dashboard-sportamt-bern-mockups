import {faEllipsisVertical} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import MenuIcon from "@mui/icons-material/Menu"
import {AppBar, Button, Container, IconButton, Menu, MenuItem, Toolbar} from "@mui/material"
import {useState} from "react"
import {useTranslation} from "react-i18next"
import {NavLink, useLocation} from "react-router"
import sportstadtBernLogo from "../assets/sportamt_bern_logo.svg"
import {getOrganisationForPublicPage} from "../dummyData"
import styles from "./top-bar.module.scss"

function organisationPublicOrgIdFromPathname(pathname: string): string | undefined {
    const match = pathname.match(/^\/organisationen\/([^/]+)(?:\/anlass\/[^/]+)?\/?$/)
    return match?.[1]
}

export const TopBar = () => {
    const {t} = useTranslation(["common", "dashboard"])
    const {pathname} = useLocation()
    const isStammdatenRoute = pathname === "/admin/stammdaten" || pathname.startsWith("/admin/stammdaten/")
    const organisationPublicOrgId = organisationPublicOrgIdFromPathname(pathname)

    const [navMenuAnchorEl, setNavMenuAnchorEl] = useState<null | HTMLElement>(null)
    const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null)

    return (
        <AppBar position="static" className={styles.topBar} color="transparent">
            <Toolbar className={styles.topBarToolbar}>
                <Container maxWidth="xl" className={styles.topBarContent}>
                    <div className={styles.leftActions}>
                        <img src={sportstadtBernLogo} alt="Sportstadt Bern" className={styles.sportamtLogo} />
                        {!organisationPublicOrgId ? (
                            <div className={styles.mobileNavActions}>
                                <IconButton
                                    size="large"
                                    aria-label={t("dashboard:dashboard.topbar.top-bar-menu-aria-label")}
                                    aria-controls="menu-appbar-pages"
                                    aria-haspopup="true"
                                    onClick={(event) => setNavMenuAnchorEl(event.currentTarget)}
                                    color="inherit"
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    id="sportamt-appbar-pages"
                                    anchorEl={navMenuAnchorEl}
                                    anchorOrigin={{vertical: "bottom", horizontal: "left"}}
                                    keepMounted
                                    transformOrigin={{vertical: "top", horizontal: "left"}}
                                    open={Boolean(navMenuAnchorEl)}
                                    onClose={() => setNavMenuAnchorEl(null)}
                                >
                                    <MenuItem
                                        key="/"
                                        component={NavLink}
                                        to="/"
                                        selected={pathname === "/"}
                                        onClick={() => setNavMenuAnchorEl(null)}
                                    >
                                        {t("common:app-name")}
                                    </MenuItem>
                                    <MenuItem
                                        key="/admin/stammdaten"
                                        component={NavLink}
                                        to="/admin/stammdaten"
                                        selected={isStammdatenRoute}
                                        onClick={() => setNavMenuAnchorEl(null)}
                                    >
                                        {t("dashboard:dashboard.topbar.stammdaten")}
                                    </MenuItem>
                                </Menu>
                            </div>
                        ) : null}
                    </div>

                    {organisationPublicOrgId ? (
                        <div className={`${styles.centerLinks} ${styles.centerLinksPublic}`}>
                            <Button
                                color="inherit"
                                component={NavLink}
                                to={`/organisationen/${organisationPublicOrgId}`}
                                className={`${styles.navButtonActive} ${styles.orgPublicNavButton}`}
                            >
                                {getOrganisationForPublicPage(organisationPublicOrgId)?.organisation ??
                                    t("dashboard:organisation-public.fallback-title")}
                            </Button>
                        </div>
                    ) : (
                        <div className={styles.centerLinks}>
                            <Button
                                color="inherit"
                                component={NavLink}
                                to="/"
                                className={pathname === "/" ? styles.navButtonActive : styles.navButton}
                            >
                                {t("common:app-name")}
                            </Button>

                            <div className={styles.desktopNavActions}>
                                <Button
                                    key="/admin/stammdaten"
                                    color="inherit"
                                    component={NavLink}
                                    to="/admin/stammdaten"
                                    className={isStammdatenRoute ? styles.navButtonActive : styles.navButton}
                                >
                                    {t("dashboard:dashboard.topbar.stammdaten")}
                                </Button>
                            </div>
                        </div>
                    )}

                    <IconButton
                        color="inherit"
                        aria-controls="menu-appbar-user"
                        aria-haspopup="true"
                        onClick={(event) => setUserMenuAnchorEl(event.currentTarget)}
                        aria-label={t("dashboard:dashboard.topbar.user-menu-aria-label")}
                        size="small"
                    >
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                    </IconButton>
                    <Menu
                        id="menu-appbar-user"
                        anchorEl={userMenuAnchorEl}
                        anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                        transformOrigin={{vertical: "top", horizontal: "right"}}
                        open={Boolean(userMenuAnchorEl)}
                        onClose={() => setUserMenuAnchorEl(null)}
                    >
                        <MenuItem onClick={() => setUserMenuAnchorEl(null)}>{t("dashboard:dashboard.topbar.profile")}</MenuItem>
                        <MenuItem onClick={() => setUserMenuAnchorEl(null)}>{t("dashboard:dashboard.topbar.logout")}</MenuItem>
                    </Menu>
                </Container>
            </Toolbar>
        </AppBar>
    )
}
