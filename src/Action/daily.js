import axios from "axios";
import appConfig from "../Config";

export const fetchDailyGetData = async (formData) => {
    try {
        const res = await axios.post(`${appConfig.appUrl}/daily/fetchData`,formData);
        if(res.data){
            return {success: res.data.success, message: res.data.message};
        }
    } catch (err) {
        console.log("error in getting info : ", err);
        return {
            success: false,
            message: (err) || "something went wrong"
        };
    }
};

export const loadDailyData = async (formData) => {
    try {
        const res = await axios.post(`${appConfig.appUrl}/daily/loadData`,formData);
        if(res.data){
            return {success: res.data.success, message: res.data.message, data: res.data.data};
        }
    } catch (err) {
        console.log("error in getting info : ", err);
        return {
            success: false,
            message: (err) || "something went wrong"
        };
    }
}

export const fetchDailyInstall = async (formData) => {
    try {
        const res = await axios.post(`${appConfig.appUrl}/daily/avgDailyInstall`, formData);
        if(res.data){
            return {success: res.data.success, avgInstall: res.data.avgInstall, sumDownload: res.data.sumDownload, installObject : res.data.installObject};
        }
    } catch (err) {
        console.log("error in getting info : ", err);
        return {
            success: false,
            message: (err) || "something went wrong"
        };
    }
}
