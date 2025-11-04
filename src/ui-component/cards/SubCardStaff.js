import PropTypes from "prop-types";
import { forwardRef } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  Box,
} from "@mui/material";

// ==============================|| CUSTOM SUB CARD ||============================== //

const SubCardStaff = forwardRef(
  (
    {
      children,
      content,
      contentClass,
      darkTitle,
      secondary,
      sx = {},
      contentSX = {},
      title,
      startComponent,
      endComponent,
      ...others
    },
    ref
  ) => {
    const theme = useTheme();

    return (
      <Card
        ref={ref}
        sx={{
          border: "1px solid",
          marginTop: "30px",
          borderColor: theme.palette.primary.light,
          ":hover": {
            boxShadow: "0 2px 14px 0 rgb(32 40 45 / 8%)",
          },
          ...sx,
        }}
        {...others}
      >
        {/* card header and action */}
        {!darkTitle && title && (
          <CardHeader
            sx={{ p: 2.5 }}
            title={<Typography variant="h5">{title}</Typography>}
            action={secondary}
            disableTypography
          />
        )}
        {darkTitle && title && (
          <CardHeader
            sx={{ p: 2.5 }}
            title={<Typography variant="h4">{title}</Typography>}
            action={secondary}
            disableTypography
          />
        )}

        {/* content & header divider */}
        {title && (
          <Divider
            sx={{ opacity: 1, borderColor: theme.palette.primary.light }}
          />
        )}

        {/* card content */}
        {content && (
          <CardContent
            sx={{ p: 2.5, ...contentSX }}
            className={contentClass || ""}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              {startComponent}
              {children}
              {endComponent}
            </Box>
          </CardContent>
        )}
        {!content && children}
      </Card>
    );
  }
);

SubCardStaff.propTypes = {
  children: PropTypes.node,
  content: PropTypes.bool,
  contentClass: PropTypes.string,
  darkTitle: PropTypes.bool,
  secondary: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.object,
  ]),
  sx: PropTypes.object,
  contentSX: PropTypes.object,
  title: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.object,
  ]),
  startComponent: PropTypes.node,
  endComponent: PropTypes.node,
};

SubCardStaff.defaultProps = {
  content: true,
};

export default SubCardStaff;
