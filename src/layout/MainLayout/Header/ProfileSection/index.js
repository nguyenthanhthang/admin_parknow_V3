import { useState, useRef, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import config from "config";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Typography,
} from "@mui/material";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";

// project imports
import MainCard from "ui-component/cards/MainCard";
import Transitions from "ui-component/extend/Transitions";
import User1 from "assets/images/users/user-round.svg";

// assets
import { IconLogout, IconSettings } from "@tabler/icons-react";
import ChangePassword from "ui-component/modal/password/ChangePassword";
import WalletModal from "ui-component/modal/wallet/WalletModal";

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const navigate = useNavigate();

  const admin = localStorage.getItem("admin"); // Set the authentication status here
  const adminData = JSON.parse(admin);
  const token = localStorage.getItem("tokenStaff");
  const staff = localStorage.getItem("staff"); // Set the authentication status here
  const staffData = JSON.parse(staff);
  const apiUrl = config.apiUrl;

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenWallet, setIsOpenWallet] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState();
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);
  const handleLogout = () => {
    localStorage.removeItem("tokenAdmin");
    localStorage.removeItem("tokenStaff");
    localStorage.removeItem("staff");

    navigate("/login");
  };

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
  };

  const fetchData = async () => {
    const response = await fetch(
      `${apiUrl}/staff-account-management/${staffData?._id}`,
      requestOptions
    );

    const data = response.json();
    if (data) {
      setData(data.data);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, []);

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
    setIsOpenWallet(false);
  };

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    handleClose(event);
    setIsOpen(true);
  };

  const handleListItemClickClose = () => {
    setIsOpen(false);
    setIsOpenWallet(false);
    setSelectedIndex(-1);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Chip
        sx={{
          height: "48px",
          alignItems: "center",
          borderRadius: "27px",
          transition: "all .2s ease-in-out",
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            "& svg": {
              stroke: theme.palette.primary.light,
            },
          },
          "& .MuiChip-label": {
            lineHeight: 0,
          },
        }}
        icon={
          <Avatar
            src={data?.avatar ? data?.avatar : User1}
            sx={{
              ...theme.typography.mediumAvatar,
              margin: "8px 0 8px 8px !important",
              cursor: "pointer",
            }}
            ref={anchorRef}
            aria-controls={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={
          <IconSettings
            stroke={1.5}
            size="1.5rem"
            color={theme.palette.primary.main}
          />
        }
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 14],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper sx={{ transform: "translate(-2px, -25px)" }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  border={false}
                  elevation={16}
                  content={false}
                  boxShadow
                  shadow={theme.shadows[16]}
                >
                  <Box sx={{ p: 2 }}>
                    <Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="h4">Chào mừng,</Typography>
                        <Typography
                          component="span"
                          variant="h4"
                          sx={{ fontWeight: 400 }}
                        >
                          {adminData?.name ? adminData?.name : data?.name}
                        </Typography>
                      </Stack>
                      <Typography variant="subtitle2">
                        {adminData?.role === "Admin" ? "Admin" : "Nhân viên"}
                      </Typography>
                    </Stack>
                  </Box>
                  <PerfectScrollbar
                    style={{
                      height: "100%",
                      maxHeight: "calc(100vh - 250px)",
                      overflowX: "hidden",
                    }}
                  >
                    <Box sx={{ p: 2 }}>
                      <Divider />
                      <List
                        component="nav"
                        sx={{
                          width: "100%",
                          maxWidth: 350,
                          minWidth: 300,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: "10px",
                          [theme.breakpoints.down("md")]: {
                            minWidth: "100%",
                          },
                          "& .MuiListItemButton-root": {
                            mt: 0.5,
                          },
                        }}
                      >
                        {staff ? (
                          <>
                            <ListItemButton
                              sx={{
                                borderRadius: `${customization.borderRadius}px`,
                              }}
                              selected={selectedIndex === 0}
                              onClick={(event) => handleListItemClick(event, 0)}
                            >
                              <ListItemIcon>
                                <IconSettings stroke={1.5} size="1.3rem" />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography variant="body2">
                                    Đổi mật khẩu
                                  </Typography>
                                }
                              />
                            </ListItemButton>

                            {/* <ListItemButton
                              sx={{
                                borderRadius: `${customization.borderRadius}px`,
                              }}
                              selected={selectedIndex === 1}
                              onClick={(event) =>
                                handleListItemProfileClick(event, 1, "/profile")
                              }
                            >
                              <ListItemIcon>
                                <IconUser stroke={1.5} size="1.3rem" />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Grid
                                    container
                                    spacing={1}
                                    justifyContent="space-between"
                                  >
                                    <Grid item>
                                      <Typography variant="body2">
                                        Hồ sơ
                                      </Typography>
                                    </Grid>
                                    <Grid item>
                                      <Chip
                                        label="02"
                                        size="small"
                                        sx={{
                                          bgcolor: theme.palette.warning.dark,
                                          color:
                                            theme.palette.background.default,
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                }
                              />
                            </ListItemButton> */}
                          </>
                        ) : (
                          <></>
                        )}

                        <ListItemButton
                          sx={{
                            borderRadius: `${customization.borderRadius}px`,
                          }}
                          selected={selectedIndex === 3}
                          onClick={handleLogout}
                        >
                          <ListItemIcon>
                            <IconLogout stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body2">Đăng xuất</Typography>
                            }
                          />
                        </ListItemButton>
                      </List>
                    </Box>
                  </PerfectScrollbar>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>

      <ChangePassword isOpen={isOpen} handleClose={handleListItemClickClose} />
      <WalletModal
        isOpen={isOpenWallet}
        handleClose={handleListItemClickClose}
      />
    </>
  );
};

export default ProfileSection;
