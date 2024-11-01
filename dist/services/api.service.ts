import { Miner } from "renderer/interfaces/pages/dashboard";
import { coreApi } from "./apiInstance";
import axios from "axios";

export const selfAccount = async (miner: Miner) => {
  try {
    const response = await coreApi.get("/id/v1/account/self");
    const data = response.data;
    const minerClone = { ...miner };
    minerClone.shortId = data.shortId;
    minerClone.name = data.name;
    minerClone.email = data.email;
    minerClone.id = data.id;
    return { minerClone, selfFetched: true };
  } catch (error) {
    console.error("Error fetching self account data:", error);
    throw error;
  }
};

export const fetchCredit = async (miner: Miner) => {
  try {
    const response = await coreApi.get("/metrics/v1/stats/credit");
    const data = response.data;
    const minerClone = { ...miner };
    minerClone.mcBalance = data.credits;
    minerClone.xmrBalance = data.monero_balance / Math.pow(10, 12);
    return { minerClone, selfFetched: true };
  } catch (error) {
    console.error("There was an error!", error);
    throw error;
  }
};

export const fetchCurrentHashrate = async () => {
  try {
    const response = await coreApi.get("/metrics/v1/public/poolinfo");
    const data = response.data;
    return data;
  } catch (error) {
    console.error("There was an error!", error);
    throw error;
  }
};
export const fetchHashrates = async (miner: Miner) => {
  try {
    const { data } = await coreApi.get("/metrics/v1/stats/hashrates");

    const minerClone = { ...miner };
    let avg = 0;
    let count = 0;

    minerClone.hashrates = data.map((entry: any) => {
      if (count < 30) {
        avg += parseInt(entry.rate);
        count++;
      }

      return {
        time: new Date(entry.time).getTime(),
        rate: entry.rate,
      };
    });

    avg /= count;
    minerClone.avgHashrate = avg.toFixed(2);
    return { minerClone };
  } catch (error) {
    console.error("There was an error for fetching hashrates!", error);
    throw error;
  }
};
export const FetchCurrentMoneroUSDRate = async () => {
  try {
    const response = await axios.get(
      "https://min-api.cryptocompare.com/data/price?fsym=XMR&tsyms=USD"
    );
    const data = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};
export const fetchActiveEvent = async () => {
  try {
    const response = await coreApi.get("/metrics/v1/eventContent/active");
    const data = response.data;
    return data;
  } catch (error) {
    console.error("There was an error for fetching active events!", error);
    throw error;
  }
};

export const fetchAllEvents = async () => {
  try {
    const response = await coreApi.get("/metrics/v1/credits/allEvents");
    const data = response.data;
    return data;
  } catch (error) {
    console.error("There was an error for fetching events!", error);
    throw error;
  }
};

export const userLogin = async (email: string, password: string) => {
  try {
    const response = await coreApi.post("/id/v1/account/login", {
      email,
      password,
    });
    const { accessToken } = response.data;
    localStorage.setItem("access_token", accessToken);
    return { ...response.data };
  } catch (error) {
    const errorMessage = error?.response.data;
    return { errorMessage };
  }
};

export const fetchPoolInfo = async () => {
  try {
    const response = await coreApi.get("/metrics/v1/stats/ppsratio");
    const data = response.data;
    return data;
  } catch (error) {
    console.error("There was an error for fetching events!", error);
    throw error;
  }
};

export const ppsRatio = async (value: number) => {
  try {
    const response = await coreApi.post("/metrics/v1/stats/ppsratio", { ppsRatio: value });
    return { ...response.data };
  } catch (error) {
    const errorMessage = error?.response?.data?.error || 'An error occurred';
    const errorCode = error?.response?.data?.code || error?.response?.status || 500;
    console.error(`Error posting ratio: ${errorMessage} (Code: ${errorCode})`);
    return { errorMessage, errorCode };
  }
};