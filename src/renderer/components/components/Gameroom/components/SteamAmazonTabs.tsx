import {
  Box,
  CardContent,
  CardMedia,
  Grid,
  Typography as MuiTypography,
} from "@mui/material";
import Typography from "renderer/components/atoms/TextStyles";
import Card from "@mui/material/Card";
import { GiveAwayPriceCardTag } from "renderer/components/atoms/GitftCards/GiveAwayPriceCardTag";
import { PurchasedProgressBar } from "renderer/components/molecules/Gameroom-I/PurchasedProgressBar";
// type Props = {};
const CURRENT__DRAWING = [
  {
    price: "99.58",
    imgSrc: "/assets/Illustrations/img/Gameroom/Sapphire.svg",
    cardMileStoneName: "Sapphire 1",
    moneroPoints: "0.33XMR",
    moneroIcon: "",
    cardBodyTitle: "Sapphire 1",
    ticketPrice: "22MC",
    priceTagColor: "#4A83F2",
  },
  {
    price: "1.58",
    imgSrc: "/assets/Illustrations/img/Gameroom/Bronze.svg",
    cardMileStoneName: "Bronze 123",
    moneroPoints: "0.004XMR",
    moneroIcon: "",
    cardBodyTitle: "Bronze 125",
    ticketPrice: "1MC",
    priceTagColor: "#E5A639",
  },
  {
    price: "8.33",
    imgSrc: "/assets/Illustrations/img/Gameroom/Emerald.svg",
    cardMileStoneName: "Emerald 6",
    moneroPoints: "0.03XMR",
    moneroIcon: "",
    cardBodyTitle: "Emerald 6",
    ticketPrice: "8MC",
    priceTagColor: "#1DC47A",
  },
];

import * as React from "react";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
export const SteamAmazonTabs = () => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ maxWidth: "1473px", typography: "body1" }}>
      <TabContext value={value}>
        <Box>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            sx={{
              display: "flex",
              width: "100%",
              paddingRight: "20px",
              borderBottom: "none",
              "& .MuiTabs-indicator": {
                display: "none",
              },
            }}
          >
            <Tab
              label="Steam"
              value="1"
              sx={{
                border:
                  value === "1"
                    ? "1px solid transparent"
                    : " 1px solid #0F141F",
                borderTopLeftRadius: "7px",
                borderTopRightRadius: "7px",
                marginRight: "1vw",
                "&.Mui-selected": {
                  color: "#EAEAEA",
                },
                padding: "16px",
                backgroundColor: value === "1" ? "#0F141F" : "transparent",
              }}
            />
            <Tab
              label="Amazon"
              value="2"
              sx={{
                border:
                  value === "2"
                    ? "1px solid transparent"
                    : " 1px solid #0F141F",
                borderTopLeftRadius: "7px",
                borderTopRightRadius: "7px",
                "&.Mui-selected": {
                  color: "#EAEAEA",
                },
                padding: "16px",
                color: value === "2" ? "#EAEAEA" : "",
                backgroundColor: value === "2" ? "#0F141F" : "transparent",
              }}
            />
          </TabList>
          <Box marginTop={{ md: "20px", lg: "0px", xl: "0px", width: "99%" }}>
            <Box
              sx={{
                display: "flex",
                padding: "40px",
                backgroundColor: "#0F141F",
              }}
            >
              <Grid
                container
                xs={12}
                // spacing={2}
                sx={{
                  display: "flex",
                  flex: "wrap",
                  // gap: "10px",
                  justifyContent: "space-between",
                  background: "#080A0F",
                  border: "1px solid #293040",
                  borderRadius: "7px",
                  padding: "40px",
                }}
              >
                {CURRENT__DRAWING.map((element) => {
                  return (
                    <Grid
                      item
                      xs={4}
                      md={5}
                      lg={5}
                      xl={3.5}
                      sx={{
                        display: "flex",
                        marginBottom: {
                          md: "20px",
                          lg: "20px",
                          xl: "0px",
                        },
                        paddingLeft: "0px !important",
                        paddingTop: "0px !important",
                      }}
                    >
                      <Card sx={{ width: "100%", borderRadius: "7px" }}>
                        <CardMedia title="green iguana">
                          <Box
                            sx={{
                              backgroundColor: "#141A29",
                              position: "relative",
                            }}
                          >
                            <GiveAwayPriceCardTag
                              text={element.price}
                              backgroundColor={element.priceTagColor}
                            />
                            <Box>
                              <Box
                                sx={{
                                  paddingTop: "30px",
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <Box
                                  sx={{
                                    padding: "16px 16px 15px 15px",
                                    width: "72px",
                                    height: "72px",
                                    borderRadius: "50%",
                                    backgroundColor: "#EAEAEA",
                                  }}
                                >
                                  <img
                                    style={{
                                      height: "100%",
                                      width: "100%",
                                    }}
                                    src={element.imgSrc}
                                  />
                                </Box>
                              </Box>
                              <Box
                                sx={{
                                  paddingTop: "16px",
                                  textAlign: "center",
                                  justifyContent: "center",
                                  paddingBottom: "36px",
                                }}
                              >
                                <Typography variant="heading4">
                                  {element.cardMileStoneName}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: "8px",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <img
                                    src="./assets/svg/MoneroBalanceIcon.svg"
                                    style={{ width: "16px", height: "16px" }}
                                  />
                                  <Typography
                                    variant="bodySmall"
                                    color="#EAEAEA"
                                  >
                                    {element.moneroPoints}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </CardMedia>
                        <CardContent
                          sx={{
                            backgroundColor: "#0F141F",
                            padding: "20px 20px 21px 20px",
                          }}
                        >
                          <Box>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px",
                              }}
                            >
                              <MuiTypography
                                fontWeight="600"
                                fontSize={"14px"}
                                fontFamily={"Poppins"}
                              >
                                {element.cardBodyTitle}
                              </MuiTypography>
                              <Typography color="#8C8C8C" variant="bodySmall">
                                Ticket price: {element.ticketPrice}
                              </Typography>
                            </Box>
                            <PurchasedProgressBar caption="1000 out of 1000" />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Box>
        </Box>
      </TabContext>
    </Box>
  );
};
