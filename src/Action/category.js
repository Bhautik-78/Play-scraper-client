import axios from "axios";
import appConfig from "../Config";

export const fetchGetData = async (formData) => {
    try {
        const res = await axios.post(`${appConfig.appUrl}/category/fetchData`, formData);
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

export const fetchCategoryData = async (formData) => {
    try {
        const res = await axios.post(`${appConfig.appUrl}/category/fetchCategoryData`, formData);
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
};

export const fetchCriteriaData = async (formData) => {
    try {
        const res = await axios.post(`${appConfig.appUrl}/category/fetchCriteriaData`, formData);
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
};

export const fetchCompareData = async (formData) => {
    try {
        const res = await axios.post(`${appConfig.appUrl}/category/fetchCompareData`, formData);
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

