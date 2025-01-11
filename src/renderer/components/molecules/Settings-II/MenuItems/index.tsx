import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { StartIcon } from "renderer/components/atoms/Settings/Settings-I/StreamerMode/StartIcon";
import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DropupIcon from "renderer/components/atoms/Settings/Settings-III/DropupIcon";
import DropdownIcon from "renderer/components/atoms/Settings/Settings-III/DropdownIcon";
import { StrteamerModeOffIcon } from "renderer/components/atoms/Settings/Settings-I/StreamerMode/StrteamerModeOffIcon";
const ITEM_HEIGHT = 48;

export function IconLabelMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [iconState, setIconState] = React.useState({
    isHovered: false,
    isToggled: false,
  });
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIconState((prevState) => ({
      ...prevState,
      isToggled: !prevState.isToggled,
    }));
  };
  const handleHovered = (event: React.MouseEvent<HTMLInputElement>) => {
    setIconState((prevState) => ({
      ...prevState,
      isHovered: !prevState.isHovered,
    }));
  };
  const handleClose = () => {
    setAnchorEl(null);
    setIconState((prevState) => ({
      ...prevState,
      isToggled: false,
    }));
  };
  const handlerLogout = () => {
    localStorage.clear();
    window.location.href = "index.html";
    // <Redirect to={"/"} />;
  };
  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{
          paddingTop: "0px !important",
          width: "44px",
          height: "44px",
          paddingBottom: "0px !important",
        }}
        onMouseEnter={() => {
          setIconState((prevState) => ({
            ...prevState,
            isHovered: true,
          }));
        }}
        onMouseLeave={() => {
          setIconState((prevState) => ({
            ...prevState,
            isHovered: false,
          }));
        }}
      >
        {iconState.isToggled ? (
          <DropupIcon rectangleColor="transparent" pathColor={"#EAEAEA"} />
        ) : (
          <DropdownIcon rectangleColor="transparent" pathColor={"#EAEAEA"} />
        )}
      </IconButton>
      {iconState.isToggled && (
        <Paper
          sx={{
            background: "#0F141F",
            color: "#656565",
            display: "flex",
            justifyContent: "center",
            maxHeight: "242px",
          }}
        >
          <Menu
            id="long-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            disableScrollLock={true}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            sx={{
              paddingTop: "0px !important",
              paddingBottom: "0px !important",
            }}
            PaperProps={{
              style: {
                padding: "0 20px",
                background: "#0F141F",
                borderRadius: "7px",
              },
            }}
          >
            <MenuList
              sx={{
                padding: "0px !important",
                paddingTop: "0px !important",
                paddingBottom: "0px !important",
              }}
            >
              <MenuItem
                onClick={handleClose}
                sx={{
                  borderBottom: "1px solid #293040",
                  maxHeight: "60px",
                }}
              >
                <ListItemIcon></ListItemIcon>{" "}
                <ListItemText
                  sx={{
                    color: "#8C8C8C",
                    fontSize: "14px",
                    "&:hover": {
                      color: "#EAEAEA",
                    },
                  }}
                >
                  Streamer Mode
                </ListItemText>
                <StrteamerModeOffIcon />
              </MenuItem>
              <MenuItem
                onClick={handleClose}
                sx={{
                  borderBottom: "1px solid #293040",
                  minHeight: "58px !important",
                }}
              >
                <ListItemIcon></ListItemIcon>
                <ListItemText
                  sx={{
                    color: "#8C8C8C",
                    fontSize: "14px",
                    minHeight: "100% !important",
                    "&:hover": {
                      color: "#EAEAEA",
                    },
                  }}
                  style={{
                    height: "100%",
                  }}
                >
                  Settings
                </ListItemText>
              </MenuItem>
              <MenuItem
                onClick={handleClose}
                sx={{
                  borderBottom: "1px solid #293040",
                  maxHeight: "60px",
                }}
              >
                <ListItemIcon></ListItemIcon>
                <ListItemText
                  sx={{
                    color: "#8C8C8C",
                    fontSize: "14px",
                    "&:hover": {
                      color: "#EAEAEA",
                    },
                  }}
                >
                  Mining Tutorial
                </ListItemText>
                <StartIcon pathColor="#8C8C8C" />
              </MenuItem>
              <MenuItem
                onClick={handlerLogout}
                sx={{
                  minHeight: "58px !important",
                }}
              >
                <ListItemIcon></ListItemIcon>
                <ListItemText
                  sx={{
                    color: "#8C8C8C",
                    fontSize: "14px",
                    minHeight: "100% !important",
                    "&:hover": {
                      color: "#EAEAEA",
                    },
                  }}
                >
                  Logout
                </ListItemText>
              </MenuItem>
            </MenuList>
          </Menu>
        </Paper>
      )}
    </div>
  );
}
