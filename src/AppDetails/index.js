import React, {useState, useEffect} from 'react';
import {message, Spin} from "antd";
import {CanvasJSChart} from 'canvasjs-react-charts'
import {fetchAvgDailyInstall} from "../Action/app";
import "./appDetails.css"

const moment = require("moment");

const getDate = date => moment(date).format("YYYY-MM-DD")
const todayDate = new Date()

const AppDetails = (props) => {

    const [installObj, setInstallObj] = useState([])
    const [data, setData] = useState({});
    const [appDetail, setAppDetail] = useState({})
    const [age, setAge] = useState("");
    const [updated, setUpdated] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = () => {
        if (props && props.location && props.location.state && props.location.state.applicationDetail && props.location.state.applicationDetail[0] && props.location.state.applicationDetail[0].appId) {
            const appData = props.location.state.applicationDetail[0]
            setData(appData)
            avgDailyInstall(appData.appId)
            ageOfApplication(appData.released)
            getUpdatedDate(appData.updated)
        }
    };

    const avgDailyInstall = async (appId) => {
        setLoading(true)
        const res = await fetchAvgDailyInstall({appId});
        console.log("res",res)
        if (res.success) {
            message.success(res.message)
            setAppDetail({
                avgInstall: res.avgInstall,
                sumDownload: res.sumDownload
            })
            setInstallObj(res.installObject)
            setLoading(false);
        }
    };

    const ageOfApplication = (releseDate) => {
        const latestDate = getDate(todayDate);
        const releasedDate = moment(releseDate).format("YYYY-MM-DD")
        const abc = moment(new Date(releasedDate)).diff(new Date(latestDate), 'year', true);
        setAge(Math.abs(parseInt(abc)))
    };

    const getUpdatedDate = (count) => {
        const date = new Date(count);
        const updateDate = date.toDateString();
        setUpdated(updateDate)
    };

    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "dark2", // "light1","light2", "dark1", "dark2"
        title: {
            text: "Average Daily Installs"
        },
        axisY: {
            title: "Installs",
        },
        axisX: {
            title: "Date",
            interval: 1
        },
        data: [{
            type: "line",
            // toolTipContent: "{x}: {y}",
            dataPoints: installObj
        }]
    }

    return (
        <>
            <Spin spinning={loading}>
                <div className="container">
                    <div className="row no-gutters">
                        <div className="col logo p-1">
                            <img
                                src={data.icon}
                                className="test" referrerpolicy="no-referrer" alt=""/>
                        </div>
                        <div className="col">
                            <div className="row no-gutters">
                                <div className="col">
                                    <h1>{data.title}</h1>
                                    <h2>{data.summary}</h2>
                                    <div>
                                        <span>{data.developerId}</span>
                                        <span>{data.genre}</span>
                                        <span className="rating">
                                    <span className="star"/>{data.scoreText}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <table className="table table-striped table-borderless table-hover">
                                <tbody>
                                <tr>
                                    <th scope="row">{appDetail && appDetail.avgInstall}</th>
                                    <td>Avg daily installs</td>
                                </tr>
                                <tr>
                                    <th scope="row">{appDetail && appDetail.sumDownload}</th>
                                    <td>Downloads est., monthly</td>
                                </tr>
                                <tr title="Installs: 1000000000+">
                                    <th scope="row">{data.maxInstalls}</th>
                                    <td>Installs</td>
                                </tr>
                                <tr title="Release date: July 9, 2015">
                                    <th scope="row">{age} years</th>
                                    <td>Age</td>
                                </tr>
                                <tr title="Updated: Aug. 20, 2021">
                                    <th scope="row">{updated}</th>
                                    <td>Updated</td>
                                </tr>
                                <tr>
                                    <th scope="row">{data && data.version}</th>
                                    <td>Version</td>
                                </tr>
                                <tr>
                                    <th scope="row">{data && data.released}</th>
                                    <td>Release date</td>
                                </tr>
                                <tr>
                                    <th scope="row">{data && data.ratings}</th>
                                    <td>Ratings</td>
                                </tr>
                                <tr>
                                    <th scope="row">{data && data.reviews}</th>
                                    <td>Reviews</td>
                                </tr>
                                <tr>
                                    <th scope="row">{data && data.size}</th>
                                    <td>Size</td>
                                </tr>
                                <tr>
                                    <th scope="row">{data && data.priceText}</th>
                                    <td>PriceText</td>
                                </tr>
                                <tr>
                                    <th scope="row">{data && data.offersIAP && data.offersIAP.toString()}</th>
                                    <td>OffersIAP</td>
                                </tr>
                                <tr>
                                    <th scope="row">{data && data.adSupported && data.adSupported.toString()}</th>
                                    <td>AdSupported</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row" id="block_installs">
                        <div className="col">
                            <h3>Daily Installs</h3>
                            <div id="chart_installs"/>
                            <CanvasJSChart options={options}/>
                        </div>
                    </div>
                </div>
                <div style={{marginTop: "65px"}} className="container">
                    <div className="row" style={{
                        display: 'block',
                        width: 'auto',
                        position: 'relative',
                        overflowX: 'auto',
                        whiteSpace: 'nowrap',
                        padding: '0 15px'
                    }}>
                        <img style={{marginRight: "15px"}}
                            src={`${data && data.screenshots && data.screenshots[0]}`}
                            height={315} referrerpolicy="no-referrer"/>
                        <img style={{marginRight: "15px"}}
                            src={`${data && data.screenshots && data.screenshots[1]}`}
                            height={315} referrerpolicy="no-referrer"/>
                        <img style={{marginRight: "15px"}}
                            src={`${data && data.screenshots && data.screenshots[2]}`}
                            height={315} referrerpolicy="no-referrer"/>
                        <img style={{marginRight: "15px"}}
                            src={`${data && data.screenshots && data.screenshots[3]}`}
                            height={315} referrerpolicy="no-referrer"/>
                        <img style={{marginRight: "15px"}}
                            src={`${data && data.screenshots && data.screenshots[4]}`}
                            height={315} referrerpolicy="no-referrer"/>
                    </div>
                </div>
                <div style={{marginTop: "16px"}} id="descr" className="container">
                    <p dangerouslySetInnerHTML={{ __html: data && data.descriptionHTML && data.descriptionHTML }}/>
                </div>
            </Spin>
        </>
)
};

export default AppDetails
