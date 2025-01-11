import { Box } from "@mui/material";
import React from "react";
import Typography from "renderer/components/atoms/TextStyles";

type Props = {};
const WITHDRAW_ICONS = [
  {
    title: "Monero",
    Icon: "./assets/svg/MoneroBalanceIcon.svg",
  },
  /**{ title: "Etherum", Icon: "/assets/svg/Ethereum.svg" },
  {
    title: "Bitcoin",
    Icon: "/assets/svg/Bitcoin.svg",
  },
  {
    title: "Binance",
    Icon: "/assets/svg/Binance.svg",
  },
  { title: "Tether", Icon: "/assets/svg/Tether.svg" }, */
];

export const WithdrawIconBox = () => {
  return (
    <Box sx={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      {WITHDRAW_ICONS.map((element) => {
        return (
          <Box
            sx={{
              maxWidth: "128px",
              maxHeight: "128px",
              padding: "22px 30px",
              borderRadius: "50%",
              border: "1px solid #293040",
            }}
          >
            <Box sx={{ display: "flex", width: "50px", height: "50px" }}>
              <img
                src={element.Icon}
                alt=""
                style={{ objectFit: "contain", width: "100%" }}
              />
            </Box>
            <Typography variant="bodySmall" color="#EAEAEA">
              {element.title}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};
