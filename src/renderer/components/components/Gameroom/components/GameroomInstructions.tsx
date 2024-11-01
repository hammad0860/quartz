import { Box } from "@mui/material";
import { GAME_INSTRUCTIONS_DATA } from "../../../../../const";
import { Instructions } from "renderer/components/molecules/StartMining-I/Instructions";
type Props = {};
console.log("GAME_INSTRUCTIONS_DATA", GAME_INSTRUCTIONS_DATA);
export const GameInstructionsBox = () => {
  console.log("insructions");
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          sm: "1fr",
          md: "1fr",
          lg: "1fr 1fr 1fr 1fr",
        },
        flexDirection: {
          sm: "column",
          md: "column",
          lg: "row",
          xl: "row",
        },
        width: { xs: "100%", sm: "100%", md: "100%" },
        alignItems: "center",
        backgroundColor: "#080A0F",
        marginRight: "10px",
        zIndex: 2,
        borderRadius: "0 0 7px 7px",
        border: "1px solid #293040",
      }}
    >
      {GAME_INSTRUCTIONS_DATA.map((element, index) => {
        return (
          <Instructions
            instructions={element.title}
            InstructionIcon={element.InstructionIcon}
          />
        );
      })}
    </Box>
  );
};
