import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { useState } from "react";
import { WithdrawMoneroBox } from "./WithdrawMoneroBox";
import { WithdrawHistory } from "./WithdrawHistory";

export const Withdraw = () => {
  const [withdrawing, setWithdrawing] = useState(false);

  return (
    <Stack
      style={{
        width: "calc(100% - 430px)",
        marginLeft: "400px",
        padding: "16px",
        gap: "20px",
      }}
    >
      <Grid container>
        <Box>
          <Typography
            fontFamily="Poppins, sans-serif"
            style={{
              fontSize: "2rem",
              color: "#EAEAEA",
              fontWeight: 400,
            }}
          >
            Withdraw
          </Typography>
        </Box>
      </Grid>
      <WithdrawHistory />
      <Grid item sm={12}>
        <Box
          sx={{
            maxWidth: "200px", // width of the circle container
            minHeight: "200px", // height of the circle container
            backgroundColor: "#141A29", // circle container color
            borderRadius: "50%", // makes the box a circle
            display: "flex", // use flex to center the content inside the Box
            flexDirection: "column", // stack children vertically
            justifyContent: "center", // center vertically
            alignItems: "center", // center horizontally
            padding: "8px", // Add some padding around the content
            margin: { sm: "auto", md: 0, lg: 0 },
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src="/assets/img/MoneroIcon.webp"
              alt="Your Description"
              style={
                {
                  // maxWidth: "44px",
                  // maxHeight: "44px", // height of the image
                  // marginTop: "5px",
                }
              }
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              fontFamily="Poppins, sans-serif"
              style={{
                fontSize: "16px",
                color: "#EAEAEA",
                fontWeight: 400,
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              Monero
            </Typography>
          </div>
        </Box>
      </Grid>

      {/* <Grid>
        <Card
          elevation={0}
          style={{
            backgroundColor: "#0F141F",
            borderRadius: "7px",
          }}
        >
          {withdrawing ? (
            <div>
              <Typography variant="h6">XMR Amount</Typography>
            </div>
          ) : (
            <Stack padding={"22px"} gap={"1rem"}>
              <Box>
                <Typography
                  fontFamily="Poppins, sans-serif"
                  style={{
                    fontSize: "20px",
                    color: "#EAEAEA",
                  }}
                  variant="h6"
                >
                  Withdraw your Monero
                </Typography>
              </Box>
              <Box
                display={"grid"}
                gridTemplateColumns={{
                  sm: "1fr",
                  md: "1fr",
                  lg: "3fr 1fr",
                  xl: "3fr 1fr",
                }}
              >
                <Stack gap={"1rem"}>
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems="center"
                    gap="1rem"
                  >
                    <Typography
                      fontFamily="Poppins, sans-serif"
                      style={{
                        fontSize: "16px",
                        marginRight: "5px",
                        color: "#EAEAEA",
                        whiteSpace: "nowrap",
                      }}
                    >
                      XMR Amount:{" "}
                    </Typography>
                    <TextField
                      id="outlined-basic"
                      fullWidth
                      size="small"
                      variant="outlined"
                      onChange={this.emailChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">XMR</InputAdornment>
                        ),
                        type: "number",
                        inputProps: { min: 0 },
                      }}
                    />
                  </Stack>
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems="center"
                    gap="1rem"
                  >
                    <Typography
                      fontFamily="Poppins, sans-serif"
                      style={{
                        fontSize: "16px",
                        marginRight: "5px",
                        color: "#EAEAEA",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Monero Wallet Address:{" "}
                    </Typography>
                    <TextField
                      id="outlined-basic"
                      size="small"
                      fullWidth
                      label="e.g. 44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A"
                      variant="outlined"
                      onChange={this.emailChange}
                    />
                  </Stack>
                  <Button
                    variant="contained"
                    style={{
                      marginTop: "20px",
                      maxHeight: "40px",
                      maxWidth: "120px",
                      marginBottom: "1rem",
                      backgroundColor: "#FA6F15",
                    }}
                  >
                    Withdraw
                  </Button>
                </Stack>
                <Box>
                  <img
                    src="/assets/img/Withdraw-Illustration.webp"
                    alt="Description"
                    style={{
                      maxWidth: "325px",
                      maxHeight: "225px",
                    }}
                  />
                </Box>
              </Box>
            </Stack>
          )}
        </Card>
      </Grid> */}
      <WithdrawMoneroBox withdrawing={false} />
    </Stack>
  );
};
