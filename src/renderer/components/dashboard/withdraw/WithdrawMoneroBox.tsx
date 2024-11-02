import { Grid, Card, Box, TextField, Checkbox, Snackbar } from "@mui/material";
import Stack from "@mui/material/Stack";
import React, { useState } from "react";
import PrimaryButton from "renderer/components/atoms/Login/PrimaryButtons";
import Typography from "renderer/components/atoms/TextStyles";
import emailjs from "@emailjs/browser";
import Alert from "@mui/material/Alert";
type WithdrawMoneroBoxProps = {
  withdrawing: boolean;
  miner: any;
  setWithdrawModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const defaultAddress =
  "44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A";
const validateAddress = (address: string) => {
  return /[48][0-9AB][123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{93}/gm.test(
    address
  );
};
export const WithdrawMoneroBox = ({
  withdrawing,
  setWithdrawModalOpen,
  miner,
}: //   setEmailChange,
WithdrawMoneroBoxProps) => {
  // emailjs.init({
  //   publicKey: "YOUR_PUBLIC_KEY",
  // });
  const [withDrawFormState, setWithDrawState] = useState({
    walletAddress: "",
    amount: 0,
    addressCheckbox: false,
  });
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [toastMessageStatus, setToastMessageStatus] = useState("");
  const [minerDetails, setMinerDetails] = useState({
    minerName: "",
    minerEmail: "",
    minerId: 0,
    uuid: 0,
    minerAmountBalance: 0,
    accountWallet: false,
    wallet: "",
  });
  let templateParams = {
    minerName: miner.name,
    minerEmail: miner.email,
    minerId: miner.shortId,
    amount: Number(withDrawFormState.amount),
    uuid: miner.id,
    wallet: withDrawFormState.walletAddress,
  };
  const handlerWithdraw = (e) => {
    setWithDrawState({ ...withDrawFormState, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (templateParams.amount >= 0.01) {
      if (validateAddress(withDrawFormState.walletAddress)) {
        setToastMessageStatus("success");
        setWithdrawModalOpen(true);
        setErrorMessage(
          "Your withdrawal request has been submitted successfully."
        );
        emailjs
          .send(
            "myriade",
            "myriade_checkout",
            templateParams,
            "user_mW0DdzT5qaDfThP4Nyd3E"
          )
          .then(
            (result) => {
              // setWithdrawModalOpen(true);
              console.log(result.text);
            },
            (error) => {
              console.log(error.text);
            }
          );
      } else {
        setToastMessageStatus("error");
        setErrorMessage("Incorrect wallet address. please check it.");
      }
    } else {
      setToastMessageStatus("error");
      setErrorMessage(
        "Not enough Monero (XMR) for withdrawal. Minimum: 0.001 XMR"
      );
    }
  };
  return (
    <Grid>
      <form onSubmit={handleSubmit}>
        <Card
          elevation={0}
          style={{
            backgroundColor: "#0F141F",
            borderRadius: "7px",
          }}
        >
          {withdrawing ? (
            <div>
              <Typography variant="heading6" color="#EAEAEA">
                XMR Amount
              </Typography>
            </div>
          ) : (
            <Stack padding={"22px"} gap={"1rem"}>
              <Box>
                <Typography variant="heading4" color="#EAEAEA">
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
                <Stack gap={"1rem"} direction={"row"}>
                  <Stack
                    direction={"column"}
                    alignItems="flex-end"
                    gap="1rem"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    {errorMessage && (
                      <Snackbar
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        sx={{}}
                        open={!!errorMessage}
                        onClose={() => setErrorMessage(null)}
                        message={errorMessage}
                        autoHideDuration={3000}
                      >
                        <Alert
                          // onClose={handleClose}
                          severity={toastMessageStatus}
                          variant="filled"
                          sx={{
                            height: "50px",
                            width: "100%",
                            fontSize: "16px",
                            fontWeight: "500",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {errorMessage}
                        </Alert>
                      </Snackbar>
                    )}
                    <Typography variant="body" color="#EAEAEA">
                      XMR Amount:{" "}
                    </Typography>
                    <Box sx={{ marginTop: "16px" }}>
                      <Typography variant="body" color="#EAEAEA">
                        Monero Wallet Address:{" "}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack
                    direction={"column"}
                    alignItems="baseline"
                    gap="1rem"
                    sx={{ width: "80%" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        width: "100%",
                      }}
                    >
                      <TextField
                        name="amount"
                        variant="standard"
                        id="outlined-basic"
                        type="number"
                        InputProps={{
                          disableUnderline: true,
                        }}
                        style={{
                          maxWidth: "360px",
                          minHeight: "32px",
                          fontSize: "14px",
                          marginBottom: "16px",
                        }}
                        inputProps={{
                          style: {
                            padding: 5,
                          },
                          min: 0,
                        }}
                        size="small"
                        fullWidth
                        placeholder="XMR"
                        sx={{
                          border: "1px solid #414E66",
                          borderRadius: "3px",
                          "& input:focus": {
                            borderBottom: "2px solid #FA6F15",
                            outline: "none",
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                border: "none",
                              },
                              "&.Mui-focused fieldset": {
                                border: "none",
                              },
                              "&:hover fieldset": {
                                border: "none",
                              },
                            },
                          },
                          "&:focus": {
                            outline: "none",
                            border: "0",
                          },
                        }}
                        onChange={handlerWithdraw}
                      />
                      <TextField
                        variant="standard"
                        id="outlined-basic"
                        name="walletAddress"
                        InputProps={{
                          disableUnderline: true,
                        }}
                        style={{
                          width: "100%",
                          maxHeight: "32px",
                          fontSize: "14px",
                        }}
                        inputProps={{
                          style: {
                            padding: 5,
                          },
                        }}
                        size="small"
                        fullWidth
                        placeholder="e.g. 44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A"
                        sx={{
                          border: "1px solid #414E66",
                          borderRadius: "3px",
                          "& input:focus": {
                            borderBottom: "2px solid #FA6F15",
                            outline: "none",
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                border: "none",
                              },
                              "&.Mui-focused fieldset": {
                                border: "none",
                              },
                              "&:hover fieldset": {
                                border: "none",
                              },
                            },
                          },
                          "&:focus": {
                            outline: "none",
                            border: "0",
                          },
                        }}
                        onChange={handlerWithdraw}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          gap: "2px",
                          alignItems: "center",
                          position: "relative",
                          left: "-6px",
                        }}
                      >
                        <Checkbox
                          style={{
                            color: "#FA6F15",
                            width: "32px",
                            height: "32px",
                          }}
                          name="addressCheckbox"
                          value="cryon"
                          disabled={miner.xmrBalance == null}
                          onChange={handlerWithdraw}
                        />
                        <Typography color="#8C8C8C" variant="bodySmall">
                          Use my default wallet address
                        </Typography>
                      </Box>
                      <Box sx={{ alignSelf: "start" }}>
                        <PrimaryButton text="Withdraw" type="submit" />
                      </Box>
                    </Box>
                  </Stack>
                </Stack>
                <Box
                  sx={{
                    maxWidth: "340px",
                    height: "auto",
                    marginTop: "20px",
                  }}
                >
                  <img
                    src="./assets/Illustrations/Withdraw-Illustration.webp"
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
      </form>
    </Grid>
  );
};
