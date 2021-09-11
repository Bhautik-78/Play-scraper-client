import React, {useState,useEffect} from 'react';
import {Link} from "react-router-dom";
import {useHistory} from "react-router";
import {fetchDailyGetData, loadDailyData} from "../Action/daily";
import {message, Select, Spin, Table} from "antd";
import {categoryItem, collection} from "../Constants";
import iso3311a2 from "iso-3166-1-alpha-2";
import moment from "moment";
import "./index.css"

const Daily = () => {

    const [loading, setLoading] = useState(false);
    const [detail, setDetail] = useState({})
    const [countryList, setCountryList] = useState([]);
    const [appDetail, setAppDetail] = useState([]);

    useEffect(()=>{
        const CountryList = iso3311a2.getCountries()
        setCountryList(CountryList)
    },[])

    const handleChange = (e) => {
        const {name, value} = e.target;
        if (name === "country") {
            const countryCode = iso3311a2.getCode(value)
            setDetail({...detail, [name]: countryCode})
        }else {
            setDetail({...detail, [name]: value})
        }
    };

    const onHandleSearch = (value) => {
        if (value) {
            handleChange({target: {name: "country", value}})
        } else {
            const CountryList = iso3311a2.getCountries()
            setCountryList(CountryList)
        }
    };

    const handleGetData = async () => {
        const {appCategory, appCollection, country} = detail
        setLoading(true)
        const response = await fetchDailyGetData({appCategory, appCollection, country});
        if (response.success) {
            message.success(response.message)
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    const handleLoadData = async () => {
        const {appCategory, appCollection, country} = detail
        setLoading(true)
        const response = await loadDailyData({appCategory, appCollection, country});
        if (response.success) {
            setAppDetail(response.data)
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'ID',
            width: 30,
            align: 'center',
            render: (text, record, index) => (
                <span>{index + 1}</span>
            )
        },
        {
            title: "Icon",
            width: 40,
            render: (text, record, index) => (
                <img src={record.icon} width={35} height={35} alt=""/>
            )
        },
        {
            title: "Released Date",
            dataIndex: "released",
            width: 60,
            sorter: (a, b) =>  moment(b.released || "1899-12-12") - moment(a.released || "1899-12-12"),
        },
        {
            title: "App Size",
            dataIndex: "size",
            width: 60,
            sorter: (a, b) =>  a.size -  b.size,
        },
        {
            title: "YesterDay Install",
            dataIndex: "yesterDayInstall",
            width: 60,
            sorter: (a, b) =>  a.yesterDayInstall -  b.yesterDayInstall,
        },
        {
            title: 'App Install',
            dataIndex: 'maxInstalls',
            width: 50,
            sorter: (a, b) =>  a.maxInstalls -  b.maxInstalls,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            width: 140,
            ellipsis: true,
            sorter: (a, b) => a.title.length - b.title.length,
        },
        {
            title: 'AppId',
            // dataIndex: 'appId',
            width: 140,
            ellipsis: true,
            render: (record) => (
                <Link to={{pathname: "/dailyAppDetail", state: {applicationDetail : record}}}>{record.appId}</Link>
            ),
            sorter: (a, b) => a.appId.length - b.appId.length,
        },
    ];

    return (
        <div className="app">
            <Spin spinning={loading}>
                <Select defaultValue="Select App Category" className="customersDropdown padding"
                        onChange={value => handleChange({target: {name: "appCategory", value}})}>
                    {Object.keys(categoryItem).map(items => (
                        <Select.Option key={categoryItem[items]}
                                       value={categoryItem[items]}>{categoryItem[items]}</Select.Option>
                    ))}
                </Select>
                <Select defaultValue="Select App Collection" className="customersDropdown"
                        onChange={value => handleChange({target: {name: "appCollection", value}})}>
                    {Object.keys(collection).map(items => (
                        <Select.Option key={items}
                                       value={collection[items]}>{items}</Select.Option>
                    ))}
                </Select>
                <Select defaultValue="Select Country" className="customersDropdown"
                        showSearch
                        onSearch={onHandleSearch}
                        onChange={value => handleChange({target: {name: "country", value}})}>
                    {countryList && countryList.map(items => (
                        <Select.Option key={items}
                                       value={items}>{items}</Select.Option>
                    ))}
                </Select>
                <button style={{marginLeft: "25px"}} type="button" className="btn btn-primary"
                        onClick={handleGetData}
                        disabled={!detail.appCategory || !detail.appCollection || !detail.country}>Fetch Data
                </button>
                <button style={{marginLeft: "25px"}} type="button" className="btn btn-primary"
                        onClick={handleLoadData}
                        disabled={!detail.appCategory || !detail.appCollection || !detail.country}>Load Data
                </button>
                <br/><br/>
                <Table columns={columns} dataSource={appDetail || []} size="middle"
                       footer={()=> appDetail && appDetail.length}/>
            </Spin>
        </div>
    )
};

export default Daily;
