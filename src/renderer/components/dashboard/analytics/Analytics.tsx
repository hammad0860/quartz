import Grow from "@mui/material/Grow";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { MinerConsumer } from "renderer/pages/Dashboard";
import { useState, useEffect } from "react";
import { AverageHashrateCard } from "renderer/components/components/Dashboard/AverageHashrateCard";
import { FriendsActivityCard } from "renderer/components/components/Friends/FriendsActivity";
import { Grid } from "@mui/material";
import Typography from "renderer/components/atoms/TextStyles";
import { RangeSelectorButtonGroup } from "renderer/components/atoms/Dashboard/RangeSelectors";
import Chart from './Chart'

export const Analytics = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [selectedRange, setSelectedRange] = useState<string>('');
  const handleButtonClick = (title: string) => {
    setSelectedRange(title);
  };

  console.log("screenSizescreenSize", screenSize);
  return (
    <MinerConsumer>
      {(miner) => (
        
        
        <Grid
          container
          spacing={2}
          sx={{
            width: {
              xs: "80px",
              sm: "80vw",
              md: "calc(100% - 406px)",
              lg: "calc(100% - 406px)",
            },

            height: {
              xs: "50px",
              sm: "100vw",
              md: "calc(100% - 406px)",
              lg: "calc(100% - 406px)",
            },
            marginLeft: "406px",
            
            padding: "0 21px",

            
            marginTop: "24px",
          }}
        >
          <Grid item lg={12} sx={{ paddingLeft: "0px !important" }}>
            <Box>
              <Typography
                fontFamily="Poppins, sans-serif"
                style={{
                  fontSize: "28px",
                  color: "#EAEAEA",
                  fontWeight: 400,
                }}
              >
                Dashboard
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            container
            lg={12}
            spacing={2}
            sx={{ 
              paddingLeft: "0px !important",
              
            }}
          >
            <Grid item md={12} lg={6} xl={4}
            
            >
              <Link
                to={""}
                style={{ textDecoration: "none", cursor: "pointer" }}
              >
                <Grow in={true}>
                  <Box sx={{
                    position: 'relative',
                    paddingRight: {
                      xs: '150px', 
                      sm: '80px',
                      md: '30px',
                      lg: '40px',
                    },
                    
                    width: '100%',  
                    height: 'auto', 
                  }}>
                              

                    <AverageHashrateCard
                      cardPointUnit="H/sec"
                      cardTitle="Average Hashrate(24h)"
                      cardPoints={miner.avgHashrate}
                      imgSrc="./assets/Illustrations/DM.webp"
                      
                    />
                    
                  </Box>
                </Grow>
              </Link>
            </Grid>
            <Grid item md={12} lg={6} xl={4}>
              <Link
                to={""}
                style={{ textDecoration: "none", cursor: "pointer" }}
              >
                <Grow in={true}>
                <Box sx={{
                    position: 'relative',
                    paddingRight: {
                      xs: '170px', 
                      sm: '120px',
                      md: '30px',
                      lg: '40px',
                    },
                    width: '100%',  
                    height: 'auto', 
                  }}>
                    <AverageHashrateCard
                      cardTitle="Pool Hashrate"
                      cardPoints={"2039570"}
                      cardPointUnit="H/sec"
                      imgSrc="./assets/Illustrations/DM2.webp"
                    />
                  </Box>
                </Grow>
              </Link>
            </Grid>
            <Grid item md={12} lg={6} xl={4}>
              <Link
                to={""}
                style={{ textDecoration: "none", cursor: "pointer" }}
              >
                <Grow in={true}>
                <Box sx={{
                    position: 'relative',
                    paddingRight: {
                      xs: '150px', 
                      sm: '100px',
                      md: '30px',
                      lg: '40px',
                    },
                    
                    
                    width: '100%',  
                    height: 'auto', 
                  }}>
                    <AverageHashrateCard
                      cardPointUnit=""
                      cardTitle="Total Mining Time"
                      cardPoints={"11:22:51:00"}
                      imgSrc="./assets/Illustrations/DM3.webp"
                    />
                  </Box>
                </Grow>
              </Link>
            </Grid>
          </Grid>
          <Grid
            item
            container
            lg={12}
            spacing={2}
            marginTop="20px"
            sx={{
              paddingTop: "0px !important",
              gap: { md: "20px", lg: "20px", xl: 0 },
            }}
          >
            <Grid
              item
              md={12}
              lg={12}
              xl={80}
              sx={{
                background: "#0F141F",
                position: "relative",
                borderRadius: "7px",
                boxSizing: "border-box",
                paddingLeft: "0px !important"
              }}
            >
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "8px", pl: "20px" }}
              >
                <Typography variant="heading2" color="#EAEAEA">
                  Historical Metrics
                </Typography>
                <Typography color="#8C8C8C">
                  See how your hashrate changes over time.
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  marginRight: "20px",
                }}
              >
                <RangeSelectorButtonGroup
                  firstButtonTitle="Hour"
                  SecondButtonTitle="Day"
                  ThirdButtonTitle="Week"
                  FourthButtonTitle="3 Month"
                  FifthButtonTitle="Year"
                  onButtonClick={handleButtonClick}
                />
              </Box>
              <Box sx={{ height: "100%" }}>
                <Box
                  style={{
                  }}
                  sx={{
                    height: {
                      xs: "45vh",
                      sm: "45vh",
                      md: "45vh",
                      lg: "52 vh",
                      xl: "65 vh",
                    },
                    padding: "20px",
                    width: {
                      sm: "500px",

                    
                    },
                    
                  }}
                >
                  {/* <img
                    src="/assets/Illustrations/Historical-Metrics-3-Month-Card.webp"
                    alt="Your Image Alt Text"
                    style={{
                      maxWidth: "-webkit-fill-available",
                      height: "100%",
                      objectFit: "fill",
                      position: "absolute",
                      zIndex: 3,
                    }}
                  /> */}
                  <Chart selectedRange={selectedRange} />
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              md={12}
              lg={12}
              xl={4}
              sx={{
                paddingTop: { md: "20px", lg: "20px", xl: "0px !important" },
                paddingLeft: {
                  md: "0px !important",
                  lg: "0px !important",
                  xl: "16px !important",
                },
              }}
            >



            </Grid>
          </Grid>
        </Grid>
      )}
    </MinerConsumer>
  );
};
