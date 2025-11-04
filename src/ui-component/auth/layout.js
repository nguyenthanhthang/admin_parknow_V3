import PropTypes from "prop-types";
// import NextLink from 'next/link';
import { Box, Typography, Grid, Stack } from "@mui/material";
import Logo from "../Logo";
import image from "../../assets/3.svg";
import { useTheme } from "@mui/material/styles";

import "./layout.scss";

// TODO: Change subtitle text

export const Layout = (props) => {
  const theme = useTheme();
  const { children } = props;
  const width = "230vw";
  const height = "230vh";

  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flex: "1 1 auto",
        height: "100%",
      }}
    >
      <Grid container>
        <Grid
          item
          xs={12}
          lg={6}
          sx={{
            backgroundColor: "background.paper",
            justifyContent: "center",
          }}
        >
          <Stack alignItems="center" marginTop="10%">
            <Logo width={width} height={height} />
          </Stack>
          <Stack>{children}</Stack>
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
          sx={{
            alignItems: "center",
            background:
              "radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)",
            color: "white",
            display: "flex",
            justifyContent: "center",
            "& img": {
              maxWidth: "100%",
            },
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography
              align="center"
              color="inherit"
              sx={{
                fontSize: "24px",
                lineHeight: "32px",
                mb: 1,
              }}
              variant="h1"
            >
              CHÀO MỪNG ĐẾN VỚI{" "}
              <Box component="a" sx={{ color: "#15B79E" }} target="_blank">
                PARKNOW
              </Box>
            </Typography>
            <Typography
              align="center"
              sx={{ mb: 3 }}
              color={theme.palette.secondary.light}
              variant="subtitle1"
            >
              Ứng dụng đặt vị trí gửi xe uy tín, chất lượng
            </Typography>
            <img alt="" src={image} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

Layout.prototypes = {
  children: PropTypes.node,
};
