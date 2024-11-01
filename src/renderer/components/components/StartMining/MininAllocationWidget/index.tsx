import { Box, Stack } from "@mui/material";
import { MINING_ALLOCATION_WIDGET_BOX_MC, MINING_ALLOCATION_WIDGET_BOX_XMR } from "../../../../../const";
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import Typography from "renderer/components/atoms/TextStyles";
import { MiningAllocationWidgetBox } from "renderer/components/molecules/StartMining-I/MiningAllocationWidgets";
import { fetchPoolInfo, ppsRatio } from "services/api.service";

export const MiningAllocationWidget: FunctionComponent<{}> = (): ReactElement => {
  const [mcPoints, setMcPoints] = useState<number>(0);
  const [xmrPoints, setXmrPoints] = useState<number>(0);
  const [isManualChange, setIsManualChange] = useState<boolean>(false);

  const handleIncreaseMC = (): void => {
    if (mcPoints < 100 && xmrPoints > 0) {
      setMcPoints(Math.min(mcPoints + 10, 100));
      setXmrPoints(Math.max(xmrPoints - 10, 0));
      setIsManualChange(true);
    }
  };

  const handleDecreaseMC = (): void => {
    if (mcPoints > 0 && xmrPoints < 100) {
      setMcPoints(Math.max(mcPoints - 10, 0));
      setXmrPoints(Math.min(xmrPoints + 10, 100));
      setIsManualChange(true);
    }
  };

  const handleIncreaseXMR = (): void => {
    if (xmrPoints < 100 && mcPoints > 0) {
      setXmrPoints(Math.min(xmrPoints + 10, 100));
      setMcPoints(Math.max(mcPoints - 10, 0));
      setIsManualChange(true);
    }
  };

  const handleDecreaseXMR = (): void => {
    if (xmrPoints > 0 && mcPoints < 100) {
      setXmrPoints(Math.max(xmrPoints - 10, 0));
      setMcPoints(Math.min(mcPoints + 10, 100));
      setIsManualChange(true);
    }
  };


  useEffect(() => {
    const getPoolInfo = async (): Promise<void> => {
      try {
        const data = await fetchPoolInfo();

        if (data?.ppsRatio != null) {
          const xmrValue = data.ppsRatio;

          setXmrPoints(xmrValue);
          setMcPoints(100 - xmrValue);
        }
      } catch (error) {
        console.error("Error fetching pool info", error);
      }
    };

    getPoolInfo();
  }, []);

  useEffect(() => {
    if (!isManualChange) return;

    const ppsRatioRatioPost = async (): Promise<void> => {
      try {
        await ppsRatio(xmrPoints);
      } catch (error) {
        console.error("Error posting ratio", error);
      } finally {
        setIsManualChange(false);
      }
    };

    ppsRatioRatioPost();
  }, [xmrPoints, isManualChange]);

  return (
    <Stack
      sx={{
        backgroundColor: "#0F141F",
        borderRadius: "8px",
        whiteSpace: "nowrap",
      }}
    >
      <Box
        sx={{
          padding: "20px 20px 0",
        }}
      >
        <Typography variant="heading2" color={"#FFF"}>
          Mining Allocation
        </Typography>
      </Box>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
        padding={"20px 20px 24px"}
        gap={"18px"}
      >
        {MINING_ALLOCATION_WIDGET_BOX_MC.map((element) => (
          <MiningAllocationWidgetBox
            key={element.label}
            label={element.label}
            points={mcPoints}
            isIconshows={element.isIconShow}
            onIncreasePoints={handleIncreaseMC}
            onDecreasePoints={handleDecreaseMC}
          />
        ))}

        {MINING_ALLOCATION_WIDGET_BOX_XMR.map((element) => (
          <MiningAllocationWidgetBox
            key={element.label}
            label={element.label}
            points={xmrPoints}
            isIconshows={element.isIconShow}
            onIncreasePoints={handleIncreaseXMR}
            onDecreasePoints={handleDecreaseXMR}
          />
        ))}
      </Stack>
    </Stack>
  );
};