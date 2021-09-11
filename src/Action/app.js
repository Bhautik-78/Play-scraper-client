import axios from "axios";
import appConfig from "../Config";

export const fetchAppByAppId = async (appId) => {
    let result = {};
    try {
        const res = await axios.post(`${appConfig.appUrl}/users/getApplication`, appId);
        result = res.data || {};
        return {success: true, data: result};
    } catch (err) {
        console.log("error in getting info : ", err);
        return {
            success: false,
            message: (err) || "something went wrong"
        };
    }
};

export const fetchAllApplication = async () => {
    try {
        const res = await axios.get(`${appConfig.appUrl}/users/get`);
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
}

export const fetchAvgDailyInstall = async (formData) => {
    try {
        const res = await axios.post(`${appConfig.appUrl}/users/avgDailyInstall`, formData);
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
