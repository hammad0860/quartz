import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import makeStyles from "@mui/styles/makeStyles";
import { useEffect, useState } from "react";
import {
  IHistory,
  IRaffle,
  IRawHistory,
} from "renderer/interfaces/pages/dashboard";
import { History } from "./History";
import {
  fetchActiveEvent,
  fetchAllEvents,
  fetchCurrentHashrate,
} from "services/api.service";
import { CircularProgressLoader } from "renderer/components/CircularLoader";
import Typography from "renderer/components/atoms/TextStyles";
import { GameInstructionsBox } from "renderer/components/components/Gameroom/components/GameroomInstructions";
import { Stack } from "@mui/material";
import { GameRoomGiveAwayCard } from "renderer/components/components/Gameroom/GameRoomGiveawayCard";
import { MiningAllocationWidget } from "renderer/components/components/StartMining/MininAllocationWidget";
import { CurrentDrawings } from "renderer/components/components/Gameroom/components/CurrentDrawings";
import { SteamAmazonTabs } from "renderer/components/components/Gameroom/components/SteamAmazonTabs";

export const GameRoom = () => {
  const [raffles, setRaffles] = useState<IRaffle[]>([]);
  const [history, setHistory] = useState<IHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGiveAwayClicked, setIsGiveAwayClicked] = useState({
    isMoneroClicked: false,
    isGiveAwayGiftCardClicked: false,
  });
  const handleGiveAwayGiftCardCliked = () => {
    setIsGiveAwayClicked((prevState) => ({
      ...prevState,
      isGiveAwayGiftCardClicked: !prevState.isGiveAwayGiftCardClicked,
    }));
  };
  const handleMoneroCardCliked = () => {
    setIsGiveAwayClicked((prevState) => ({
      ...prevState,
      isGiveAwayGiftCardClicked: !prevState.isMoneroClicked,
    }));
  };
  useEffect(() => {
    const fetchActiveEventsData = async () => {
      try {
        const activeEventsData = await fetchActiveEvent();
        if (activeEventsData) {
          setRaffles(activeEventsData);
        }
      } catch (error) {
        console.error("Error fetching active events data:", error);
      }
    };
    fetchActiveEventsData();
  }, []);

  useEffect(() => {
    const fetchAllEventsData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAllEvents();
        if (data) {
          buildHistory(data);
        }
      } catch (error) {
        console.error("Error fetching all events data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllEventsData();
  }, []);

  const buildHistory = (data: IRawHistory[]) => {
    const historyMap: any = {};
    const history = [];

    data.forEach((entry) => {
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

    console.log(history);

    setHistory(history);
  };

  return (
    <Grid
      container
      item
      style={{ width: "calc(100% - 406px)", marginLeft: "406px" }}
    >
      {isLoading ? (
        <Box
          sx={{
            width: {
              xs: "100vw",
              sm: "100vw",
              md: "calc(100% - 406px)",
              lg: "calc(100% - 460px)",
            },
            marginLeft: "406px",
            padding: "1.5rem",
          }}
        >
          <CircularProgressLoader isLoaderInMainApp={false} />
        </Box>
      ) : (
        <>
          <Stack sx={{ padding: "24px 0 0 21px" }}>
            <Box>
              <Typography variant="heading1" color="#EAEAEA">
                Game Room
              </Typography>
            </Box>

            <Grid
              container
              spacing={2}
              sx={{ width: "100%" }}
              marginTop={"32px"}
            >
              <Grid item xs={12} sx={{ paddingTop: "0px !important" }}>
                <GameInstructionsBox />
              </Grid>

              <Grid
                item
                xs={8}
                md={12}
                lg={8}
                sx={{ marginTop: "32px !important" }}
              >
                <Grid
                  container
                  spacing={2}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    // paddingTop: "32px",
                  }}
                >
                  <Grid
                    item
                    xs={6}
                    sm={12}
                    md={6}
                    sx={{ paddingTop: "0px !important" }}
                  >
                    <GameRoomGiveAwayCard
                      giveAwayTitle="Monero Giveaways"
                      imgSrc={"./assets/svg/MoneroBalanceIcon.svg"}
                      width="68px"
                      height="68px"
                      isGiveAwayCardClicked={isGiveAwayClicked.isMoneroClicked}
                      onClick={handleMoneroCardCliked}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sm={12}
                    md={6}
                    sx={{ paddingTop: "0px !important" }}
                  >
                    <GameRoomGiveAwayCard
                      giveAwayTitle="Gift Card Giveaways"
                      imgSrc={"./assets/svg/GC.svg"}
                      width="102px"
                      height="68px"
                      isGiveAwayCardClicked={
                        isGiveAwayClicked.isGiveAwayGiftCardClicked
                      }
                      onClick={handleGiveAwayGiftCardCliked}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={4}
                sx={{
                  paddingTop: "0px !important",
                  marginTop: "32px",
                }}
              >
                <MiningAllocationWidget />
              </Grid>
            </Grid>
            <CurrentDrawings raffles={raffles} />
            <Box sx={{ marginTop: "32px", width: "99%" }}>
              <History history={history} />
            </Box>
          </Stack>
        </>
      )}
    </Grid>
  );
};
