import React, {useState, useEffect} from 'react';
import {message, Select, Spin, Table,Space,DatePicker} from "antd";
import iso3311a2 from 'iso-3166-1-alpha-2';
import * as exceljs from 'exceljs';
import {saveAs} from 'file-saver';
import moment from "moment";
import {categoryItem, collection, criteria, days} from "../Constants/index"
import "./category.css"
import {fetchCategoryData, fetchCompareData, fetchCriteriaData, fetchGetData} from "../Action/category";
import {fetchDailyGetData} from "../Action/daily";

message.config({top: 50});
const DATE_FORMATE = 'YYYY-MM-DD';

const Category = () => {

    const [loading, setLoading] = useState(false);
    const [detail, setDetail] = useState({})
    const [appDetail, setAppDetail] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [releaseDate, setReleaseDate] = useState({});

    useEffect(()=>{
        const CountryList = iso3311a2.getCountries()
        setCountryList(CountryList)
    },[])

    const getCategoryData = async () => {
        setAppDetail([])
        const {appCategory, appCollection, country} = detail
        setLoading(true)
        const res = await fetchCategoryData({appCategory, appCollection, country});
        if (res.success) {
            setAppDetail(res.data)
            setLoading(false);
        }else {
            setLoading(false);
        }
    };

    const onChange = (date, name) => {
        setReleaseDate({...releaseDate, [name]: date && moment(date).format(DATE_FORMATE)})
    };

    const onHandleSearch = (value) => {
        if (value) {
            handleChange({target: {name: "country", value}})
        } else {
            const CountryList = iso3311a2.getCountries()
            setCountryList(CountryList)
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        if (name === "country") {
            const countryCode = iso3311a2.getCode(value)
            setDetail({...detail, [name]: countryCode})
        }else {
            setDetail({...detail, [name]: value})
        }
    };

    const handleGetData = async () => {
        const {appCategory, appCollection, country} = detail
        setLoading(true)
        const res = await fetchGetData({appCategory, appCollection, country});
        if (res.success) {
            message.success(res.message)
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    // const dailyNewData = async () => {
    //     setLoading(true)
    //     const res = await fetchDailyGetData();
    //     if (res.success) {
    //         message.success(res.message)
    //         setLoading(false);
    //     }else {
    //         setLoading(false);
    //     }
    // }

    const getCriteriaData = async () => {
        setAppDetail([])
        const {country, selectedDay, criteria} = detail
        setLoading(true)
        const res = await fetchCriteriaData({selectedDay, criteria, country});
        if (res.success) {
            setAppDetail(res.data)
            setLoading(false);
        }else {
            setLoading(false);
        }
    };

    const getCompareData = async () => {
        const {country} = detail
        setLoading(true)
        const res = await fetchCompareData({country});
        if (res.success) {
            setAppDetail(res.data)
            setLoading(false);
        }else {
            setLoading(false);
        }
    }

    const downloadTxtFile = () => {
        const {country, selectedDay, criteria} = detail;
        const countryName = iso3311a2.getCountry(country);
        setLoading(true)
        const payload = [];
        appDetail.forEach(item => {
            const result =  {
                Country : countryName,
                DayDiff : selectedDay,
                Criteria : criteria,
                MaxInstall : item.maxInstalls,
                AppName : item.title,
                AppId : `https://play.google.com/store/apps/details?id=${item.appId}`,
                Date : item.CreatedDate,
                ReleaseDate : item.released
            };
            payload.push(result)
        })
        prepareAndDownload(payload);
    };

    const prepareAndDownload = (rows) => {
        const workbook = new exceljs.Workbook();
        workbook.creator = 'new Creator';
        workbook.created = new Date();
        workbook.modified = new Date();

        const worksheet = workbook.addWorksheet("App Gross");
        worksheet.columns = [
            {header: 'App ID', key: 'AppId', width: 60},
            {header: 'App Name', key: 'AppName', width: 40, style: {alignment: {wrapText: true}}},
            {header: 'Country', key: 'Country', width: 25, style: {alignment: {wrapText: true}}},
            {header: 'Release Date', key: 'ReleaseDate', width: 25, style: {alignment: {wrapText: true}}},
            {header: 'Date', key: 'Date', width: 25, style: {alignment: {wrapText: true}}},
            {header: 'Max Install', key: 'MaxInstall', width: 25, style: {alignment: {wrapText: true}}},
            {header: 'Day Diff', key: 'DayDiff', width: 25, style: {alignment: {wrapText: true}}},
            {header: 'Criteria', key: 'Criteria', width: 25, style: {alignment: {wrapText: true}}},
        ];
        rows.forEach((x) => {
            worksheet.addRow(x);
        });

        const firstRow = worksheet.getRow(1);
        firstRow.font = {name: 'New Times Roman', family: 4, size: 10, bold: true};
        firstRow.alignment = {vertical: 'middle', horizontal: 'center'};
        firstRow.height = 30;

        workbook.xlsx.writeBuffer().then(function (data) {
            const blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
            saveAs(blob, "AppList");
        });
        setLoading(false)
    }

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
            title: 'App Category',
            dataIndex: 'appCategory',
            width: 50,
            sorter: (a, b) => a.appCategory.length - b.appCategory.length,
        },
        {
            title: 'App Collection',
            dataIndex: 'appCollection',
            width: 60,
            sorter: (a, b) => a.appCollection.length - b.appCollection.length,
        },
        {
            title : "Created Date",
            dataIndex: "CreatedDate",
            width: 60,
        },
        {
            title: "Released Date",
            dataIndex: "released",
            width: 60,
            sorter: (a, b) =>  moment(b.released || "1899-12-12") - moment(a.released || "1899-12-12"),
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
            dataIndex: 'appId',
            width: 140,
            ellipsis: true,
            sorter: (a, b) => a.appId.length - b.appId.length,
        },
        {
            title: 'priceText',
            width: 40,
            dataIndex: 'priceText',
        },
        {
            title: 'Summary',
            width: 120,
            dataIndex: 'summary',
            ellipsis: true,
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
                    {countryList.map(items => (
                        <Select.Option key={items}
                                       value={items}>{items}</Select.Option>
                    ))}
                </Select>
                <Select defaultValue="Select Days" className="customersDropdown"
                        onChange={value => handleChange({target: {name: "selectedDay", value}})}>
                    {Object.keys(days).map(items => (
                        <Select.Option key={items}
                                       value={days[items]}>{items}</Select.Option>
                    ))}
                </Select>
                <Select defaultValue="Select Criteria" className="customersDropdown"
                        onChange={value => handleChange({target: {name: "criteria", value}})}>
                    {Object.keys(criteria).map(items => (
                        <Select.Option key={items}
                                       value={criteria[items]}>{items}</Select.Option>
                    ))}
                </Select>
                <Space direction="vertical">
                    <DatePicker
                        onChange={(date) => onChange(date, "date")}
                        value={releaseDate && releaseDate.date && moment(releaseDate.date, DATE_FORMATE)}
                        placeholder="Release Date"
                        format={DATE_FORMATE}
                        name='date'
                    />
                </Space>
                <button style={{marginLeft: "25px" }} type="button" className="btn btn-primary"
                        onClick={handleGetData}
                        disabled={!detail.appCategory || !detail.appCollection || !detail.country}>Fetch Data
                </button>
                <button style={{marginLeft: "25px" }} type="button" className="btn btn-primary"
                        onClick={getCategoryData}
                        disabled={!detail.appCategory || !detail.appCollection}>All Load Data
                </button>
                <button style={{marginLeft: "25px" }} type="button" className="btn btn-primary"
                        onClick={getCriteriaData}
                        disabled={!detail.criteria || !detail.selectedDay || !detail.country}>Load Data
                </button>
                <button style={{marginLeft: "25px" }} type="button" className="btn btn-primary"
                        onClick={getCompareData}
                        disabled={!detail.country}>Compare Data
                </button>
                <button style={{marginLeft: "25px" }} type="button" className="btn btn-primary"
                        onClick={downloadTxtFile}
                        disabled={!appDetail.length}>Download
                </button>
                <br/><br/>
                <Table columns={columns} dataSource={appDetail || []} size="middle"
                       footer={()=> appDetail && appDetail.length}/>
            </Spin>
        </div>
    )
};

export default Category;
