import { Box } from "@mui/material";
import { MINER_INSTRUCTIONS_ARRAY } from "const";
import React from "react";
import { Instructions } from "renderer/components/molecules/StartMining-I/Instructions";
type Props = {};

export const MiningInstructionsBox = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          sm: "column",
          md: "column",
          lg: "row",
          xl: "row",
        },
        width: { xs: "100%", sm: "100%", md: "inherit" },
        alignItems: "center",
        backgroundColor: "#080A0F",
        marginTop: "20px",
        marginRight: "10px",
        zIndex: 2,
        borderRadius: "0 0 7px 7px",
        border: "1px solid rgba(234, 234, 234, 0.2)",
      }}
    >
      {MINER_INSTRUCTIONS_ARRAY.map((element, index) => {
        return (
          <Instructions
            key={element.alt}
            instructions={element.title}
            InstructionIcon={element.InstructionIcon}
          />
        );
      })}
    </Box>
  );
};
