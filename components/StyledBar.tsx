import { grey, yellow } from "@mui/material/colors";
import { AppBar, Toolbar, Box, IconButton } from "@mui/material";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const StyledBar = () => {
  return (
    <AppBar sx={{ background: grey[200], boxShadow: "none" }} position="static">
      <Toolbar>
        <img height={50} src="/amp_monitor.png" />
        <Box sx={{ flexGrow: 1 }} />
        <div>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={() => {
              window.location.href = '/api/logout'
            }}
            color="primary"
          >
            <ExitToAppIcon />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default StyledBar;
