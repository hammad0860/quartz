import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { MINER_STATS_ARRAY } from "../../../const";
import Typography from "../atoms/TextStyles";
import { SecondaryButton } from "../atoms/Settings/Settings-II/SecondaryButton";

export const MiningStats = ({ CurrentHashrateData }: any) => {
  return (
    <Stack
      sx={{
        borderRadius: "8px",
      }}
      gap={"1.3rem"}
    >
      <Box>
        <Typography variant="heading2" color="#EAEAEA">
          Mining Stats
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: "#0F141F",
          maxWidth: { md: "95%", lg: "100%", xl: "100%" },
          padding: "21px 20px 24px 21px",
          borderRadius: "8px",
        }}
      >
        <Stack
          sx={{
            width: "100%",
            gridTemplateColumns: {
              md: "1fr",
              lg: "1fr 1fr",
              xl: "1fr 1fr",
            },
          }}
          flexWrap={"wrap"}
          direction={"row"}
          gap={"1rem"}
        >
          {MINER_STATS_ARRAY.map((stats, index) => {
            return (
              <Box
                sx={{
                  width: { md: "100%", lg: "100%", xl: "40%" },
                  whiteSpace: "nowrap",
                  backgroundColor: "transparent",
                  border: "1px solid #293040",
                  borderRadius: "7px",
                  marginBottom: "20px",
                  padding: "1rem",
                }}
                key={index}
              >
                <Stack>
                  <Typography variant="bodySmall" color="#8C8C8C">
                    {stats.heading}
                  </Typography>
                  {stats.isDivider ? (
                    <Typography variant="bodySmall" color="#EAEAEA">
                      {CurrentHashrateData?.hashrate}
                    </Typography>
                  ) : (
                    <Typography color="#EAEAEA" variant="body">
                      {stats.time}
                    </Typography>
                  )}
                </Stack>
              </Box>
            );
          })}
        </Stack>
        <Box
          sx={{
            width: "100%",
            marginTop: "auto",
            justifyContent: "end",
            display: "flex",
          }}
        >
          {" "}
          <SecondaryButton
            width="120px"
            text="Pool Stats"
            textTransform="capitalize"
          />
        </Box>
      </Box>
    </Stack>
  );
};
