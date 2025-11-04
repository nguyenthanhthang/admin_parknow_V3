import { Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const GridItem = ({ title, value }) => {
  const theme = useTheme();

  return (
    <Grid item container direction="row" justifyContent="space-between">
      <Grid item>
        <Typography color={theme.palette.secondary.main} variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid item>
        <Typography color={theme.palette.common.black} variant="h4">
          {value}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default GridItem;
