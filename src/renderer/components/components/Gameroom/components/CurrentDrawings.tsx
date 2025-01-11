import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  CardContent,
  CardMedia,
  Grid,
  Typography as MuiTypoGraphy,
} from "@mui/material";
import Button from '@mui/material/Button';
import Card from "@mui/material/Card";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { formatMoney } from 'accounting-js';
import axios from "axios";
import * as React from 'react';
import { useContext } from "react";
import { GiveAwayPriceCardTag } from "renderer/components/atoms/GitftCards/GiveAwayPriceCardTag";
import { PurchasedProgressBar } from "renderer/components/molecules/Gameroom-I/PurchasedProgressBar";
import { MinerConsumer, reloadContext } from "renderer/pages/Dashboard";
import {

  IRaffle,
} from "renderer/interfaces/pages/dashboard";

type Props = {
  raffles: IRaffle[]
};

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

const commonImagePath = "./assets/Illustrations/img/Gameroom/"

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export const CurrentDrawings = ({ raffles }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState({
    modalShow: false,
    setModalShow: false,
    drawOption: 0,
    tickets: 1,
    purchasedTickets: [],
    countdownString: [],
    raffle: [],
    error: "",
    USD: 0,
    success: "",
  });

  const { reload, setReload } = useContext(reloadContext)

  React.useEffect(() => {
    axios
      .get(`https://min-api.cryptocompare.com/data/price?fsym=XMR&tsyms=USD`)
      .then((response) => {
        setData((prev) => ({ ...prev, USD: response.data.USD }));
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });

    setData((prev) => ({
      ...prev,
      raffle: raffles,
    }));
  }, [raffles, data.USD]);

  const handleClickOpen = (i: number) => {
    setOpen(true);
    setData((prev) => ({
      ...prev,
      drawOption: i,
    }));
  };

  const getHistory = (purchasedTickets: any[]) => {
    const historyMap = {};
    const history = [];

    purchasedTickets.forEach((entry) => {
      let cur = historyMap[entry.contentId];
      if (cur) {
        cur.tickets += entry.tickets;
        cur.purchased = Math.max(cur.purchased, entry.purchased);
        if (entry.status == 2) {
          cur.status = 2;
        }
      } else {
        cur = Object.assign({}, entry);
      }

      historyMap[entry.contentId] = cur;
    });

    for (const entry in historyMap) {
      history.push(historyMap[entry]);
    }

    return history;
  }

  const appendPurchase = (raffle) => {
    const purchase = {
      id: 1,
      title: raffle.public.title,
      tickets: data.tickets,
      amount: raffle.public.prizeAmount,
      lockType: 10,
      eventTime: raffle.public.expiry,
      contentId: raffle.id,
      status: 1,
      purchased: new Date().getTime() / 1000,
      winner: '-',
    };

    const purchasedTickets = data.purchasedTickets.slice();
    purchasedTickets.push(purchase);
    setData((prev) => ({ ...prev, purchasedTickets: getHistory(purchasedTickets) }));
  }

  const handleClose = (purchase, miner) => {
    setReload((prev) => !prev)

    setOpen(false);
    // setData({ modalShow: false });
    let component = this;

    if (purchase) {
      const raffle = data.raffle[data.drawOption];

      const options = {
        method: 'post',
        url: `https://staging.myriade.io/metrics/v1/credits/buy`,
        data: {
          amount: Number(data.tickets) * raffle.public.entryPrice,
          contentId: raffle.id,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      };

      axios(options)
        .then((response) => {

          if (response.status == 200) {
            miner.mcBalance -= options.data.amount;
            miner.refresh();
            appendPurchase(raffle);
            component.setState({
              success: 'Ticket purchase successful!',
            });
          } else {
            return component.setState({
              error:
                'Unable to purchase the ticket, please check your connection, and try again later',
            });
          }
        })
        .catch(function (error) {
          console.error('There was an error!', error);
          return setData((prev) => ({ ...prev, error: 'Unable to purchase the ticket, please check your connection, and try again later' })

          );
        });
    }
  };


  const updateTicketNum = (val: number) => {
    console.log(val)
    const tickets = val < 1 ? 0 : Math.floor(val);

    setData((prev) => ({
      ...prev,
      tickets,
    }));
  }

  const validateRaffle = (raffle) => {
    return (
      raffle.public &&
      raffle.public.title &&
      raffle.public.description &&
      raffle.public.entryPrice &&
      raffle.public.prizeAmount &&
      (raffle.public.expiry || raffle.public.totalTickets)
    );
  };

  return (

    <MinerConsumer>
      {(miner) => (
        <Box marginTop={{ md: "20px", lg: "0px", xl: "0px", width: "99%" }}>
          <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
          >
            <DialogTitle variant="h5" sx={{ m: 0, p: 2, width: '450px', maxWidth: '100%' }} id="customized-dialog-title">
              Ticket Purchase
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent dividers >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MuiTypoGraphy color="#8C8C8C" >
                  Drawing Amount: &nbsp;
                </MuiTypoGraphy>
                <MuiTypoGraphy variant="h6">
                  {formatMoney(data.raffle[data.drawOption]?.public.prizeAmount * data.USD)} USD
                </MuiTypoGraphy>
                <MuiTypoGraphy color="#8C8C8C" >
                  &nbsp;({
                    data.raffle[data.drawOption]?.public
                      .prizeAmount
                  }
                  XMR)
                </MuiTypoGraphy>
              </Box>
              <Box sx={{ display: 'flex' }} mt={1}>
                <MuiTypoGraphy color="#8C8C8C">
                  Ticket Price:  </MuiTypoGraphy>
                <MuiTypoGraphy>&nbsp;{data.raffle[data.drawOption]?.public.entryPrice} MC
                </MuiTypoGraphy>
              </Box>
              <Box sx={{ display: "flex", alignItems: 'center', justifyContent: 'space-between' }} gap={1} mb={2} gutterBottom>
                <MuiTypoGraphy color="#8C8C8C">
                  Tickets:
                </MuiTypoGraphy>
                <Box display="flex" justifyContent="flex-end" gap={1}> <Button variant="contained"
                  onClick={() =>
                    updateTicketNum(
                      (0.25 * miner.mcBalance) /
                      data.raffle[data.drawOption].public
                        .entryPrice
                    )
                  }
                >25%</Button>
                  <Button variant="contained" onClick={() =>
                    updateTicketNum(
                      (0.5 * miner.mcBalance) /
                      data.raffle[data.drawOption].public
                        .entryPrice
                    )
                  }>50%</Button>
                  <Button variant="contained" onClick={() =>
                    updateTicketNum(
                      (0.75 * miner.mcBalance) /
                      data.raffle[data.drawOption].public
                        .entryPrice
                    )
                  }>75%</Button>
                  <Button variant="contained" onClick={() =>
                    updateTicketNum(
                      (miner.mcBalance) /
                      data.raffle[data.drawOption].public
                        .entryPrice
                    )
                  }>Max</Button>
                </Box>
              </Box>
              <TextField
                id="outlined-basic"
                variant="outlined"
                // defaultValue={data.tickets}
                value={data.tickets}
                type="number"
                inputProps={{ min: 1 }}
                sx={{ width: '100%' }}
                onChange={(e) =>
                  updateTicketNum(e.target.value)
                }
              />
              <Box sx={{ display: 'flex' }} mt={1}>
                <MuiTypoGraphy color="#8C8C8C" >
                  Total Price:     </MuiTypoGraphy>
                <MuiTypoGraphy >&nbsp;{data.raffle[data.drawOption]?.public
                  .entryPrice * data.tickets}MC</MuiTypoGraphy>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleClose} variant="contained" color="error">
                Cancel
              </Button>
              <Button autoFocus onClick={() => {
                handleClose(true, miner);
              }} variant="contained">
                Confirm Purchase
              </Button>
            </DialogActions>
          </BootstrapDialog>
          <Box
            sx={{
              padding: "16px 0 14px 20px",
              borderTopLeftRadius: "4px",
              borderTopRightRadius: "4px",
              backgroundColor: "#0F141F",
              maxWidth: "226px",
              boxSizing: "border-box",
            }}
          >
            <MuiTypoGraphy color="#EAEAEA" variant="heading2">
              Current Drawings
            </MuiTypoGraphy>
          </Box>
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
              {raffles.map((element, index) => {
                const type = element.public.type;
                const valid =
                  validateRaffle(element) &&
                  data.countdownString[index] != 'EXPIRED' &&
                  !type;
                return (
                  valid && (
                    <>
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
                        <Card sx={{ width: "100%", borderRadius: "7px" }}
                          onClick={() => handleClickOpen(index)}
                        >
                          <CardMedia title="green iguana">
                            <Box
                              sx={{ backgroundColor: "#141A29", position: "relative" }}
                            >
                              <GiveAwayPriceCardTag
                                text={formatMoney(element?.public?.prizeAmount * data?.USD)}
                                // backgroundColor={element?.priceTagColor}
                                backgroundColor={'#4A83F2'}
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
                                      style={
                                        element.public.title.toLowerCase().includes("ruby")
                                          ? {
                                            height: "100%",
                                            width: "100%",
                                            objectFit: "contain"
                                          }
                                          : {
                                            height: "100%",
                                            width: "100%",
                                          }
                                      }
                                      src={
                                        element.public.title.toLowerCase().includes("diamond")
                                          ? commonImagePath + "Diamond.png"
                                          : element.public.title.toLowerCase().includes("sapphire")
                                            ? commonImagePath + "Sapphire.svg"
                                            : element.public.title.toLowerCase().includes("bronze")
                                              ? commonImagePath + "Bronze.svg"
                                              : element.public.title.toLowerCase().includes("ruby")
                                                ? commonImagePath + "Ruby.png"
                                                : element.public.title.toLowerCase().includes("emerald")
                                                  ? commonImagePath + "Emerald.svg"
                                                  : commonImagePath + 'Default.svg'
                                      }
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
                                  <MuiTypoGraphy variant="heading4" fontFamily={"Poppins"}>
                                    {element?.public?.title}
                                  </MuiTypoGraphy>
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
                                    <MuiTypoGraphy variant="bodySmall" fontFamily={"Poppins"} color="#EAEAEA">
                                      {element?.public?.prizeAmount}
                                    </MuiTypoGraphy>
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
                                <MuiTypoGraphy
                                  fontWeight="600"
                                  fontSize={"14px"}
                                  fontFamily={"Poppins"}
                                >
                                  {element?.cardBodyTitle}
                                </MuiTypoGraphy>
                                <MuiTypoGraphy color="#8C8C8C" variant="bodySmall" fontFamily={"Poppins"}>
                                  Ticket price: {element?.public?.entryPrice} MC
                                </MuiTypoGraphy>
                              </Box>
                              <PurchasedProgressBar caption={`${element?.public?.numTickets} out of ${element?.public?.totalTickets || "N/A"}`} progress={(element?.public?.numTickets / element?.public?.totalTickets) * 100} />
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </>
                  )
                );
              })}
            </Grid>
          </Box>
        </Box>)}
    </MinerConsumer>
  );
};
