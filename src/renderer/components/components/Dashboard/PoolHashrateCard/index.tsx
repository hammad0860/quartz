import { DashboardCard } from "renderer/components/atoms/Dashboard/DashboardCard";
import { StatsIcon } from "renderer/components/atoms/Dashboard/DashboardCardIcons/StatsIcon";

type Props = {};

export const PoolHashrateCard = (props: Props) => {
  return (
    <DashboardCard
      cardTitle="Pool Hashrate"
      cardInfo=""
      cardImgSrc="./assets/Illustrations/DM2.webp"
      LinkHoverTitle="Pool Stats"
      LinkIcon={StatsIcon}
      LinkPath=""
    />
  );
};
