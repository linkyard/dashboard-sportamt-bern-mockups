import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation } from "react-router";
import sportstadtBernLogo from "../assets/sportamt_bern_logo.svg";
import styles from "./top-bar.module.scss";

export const TopBar = () => {
  const { t } = useTranslation(["common", "dashboard"]);
  const { pathname } = useLocation();

  const [navMenuAnchorEl, setNavMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );

  return (
    <AppBar position="static" className={styles.topBar} color="transparent">
      <Toolbar>
        <Box
          component="img"
          src={sportstadtBernLogo}
          alt="Sportstadt Bern"
          className={styles.sportamtLogo}
        />

        <Button
          color="inherit"
          component={NavLink}
          to="/"
          className={
            pathname === "/" ? styles.appTitleLinkActive : styles.appTitleLink
          }
        >
          <h5 className={styles.appTitle}>{t("common:app-name")}</h5>
        </Button>

        <Box sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}>
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
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            open={Boolean(navMenuAnchorEl)}
            onClose={() => setNavMenuAnchorEl(null)}
          >
            <Button
              key="/board-admin"
              color="inherit"
              component={NavLink}
              to="/board-admin"
              className={styles.navButton}
            >
              {t("dashboard:dashboard.topbar.board-admin")}
            </Button>
            <Button
              key="/new-board"
              color="inherit"
              component={NavLink}
              to="/new-board"
              className={styles.navButton}
            >
              {t("dashboard:dashboard.topbar.new-board")}
            </Button>
          </Menu>
        </Box>

        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
          <Button
            key="/board-admin"
            color="inherit"
            component={NavLink}
            to="/board-admin"
            className={
              pathname === "/board-admin"
                ? styles.navButtonActive
                : styles.navButton
            }
          >
            {t("dashboard:dashboard.topbar.board-admin")}
          </Button>
          <Button
            key="/new-board"
            color="inherit"
            component={NavLink}
            to="/new-board"
            className={
              pathname === "/new-board"
                ? styles.navButtonActive
                : styles.navButton
            }
          >
            {t("dashboard:dashboard.topbar.new-board")}
          </Button>
        </Box>

        <Box className={styles.spacer} />

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
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={Boolean(userMenuAnchorEl)}
          onClose={() => setUserMenuAnchorEl(null)}
        >
          <MenuItem onClick={() => setUserMenuAnchorEl(null)}>
            {t("dashboard:dashboard.topbar.profile")}
          </MenuItem>
          <MenuItem onClick={() => setUserMenuAnchorEl(null)}>
            {t("dashboard:dashboard.topbar.logout")}
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
