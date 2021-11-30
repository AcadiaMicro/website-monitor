import { grey, yellow } from "@mui/material/colors";
import { AppBar, Toolbar } from "@mui/material";

const StyledBar = () => {
  return (
    <AppBar
      sx={{ background: yellow[200], boxShadow: "none" }}
      position="static"
    >
      <Toolbar>
        <img height={50} src="/amp_monitor.png" />
      </Toolbar>
    </AppBar>
  );
};

export default StyledBar;