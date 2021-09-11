import React, {useState} from 'react';
import {useHistory} from "react-router";
import {Input, Space, Spin, message} from 'antd';
import '../App.css';
import {fetchAllApplication, fetchAppByAppId} from "../Action/app";

const {Search} = Input;
message.config({top: 50});

const Home = () => {
    const history = useHistory()
    const [applicationId, setAppId] = useState("")
    const [loading, setLoading] = useState(false);

    const onSearch = (value) => {
        setAppId({...applicationId, "appId": value})
        fetchApplication(value)
    };

    const fetchApplication = async (value) => {debugger
        setLoading(true)
        const res = await fetchAppByAppId({appId: value});
        if (res && res.data) {
            setLoading(false);
            history.push({
                pathname: '/appDetail',
                state: {applicationDetail : res.data, appId : value}
            });
        }
    }

    const onFetchApplication = async () => {
        setLoading(true)
        const res = await fetchAllApplication();
        if(res.success){
            message.success(res.message)
            setLoading(false);
        }
    };

    return (
        <>
            <Spin spinning={loading}>
                <div className="App">
                    <button type="button" onClick={onFetchApplication}>Fetch Application</button>
                </div>
                <div className="App">
                    <h1>Search through 11,654,988 apps</h1>
                    <h3>Find Insights about Apps, Niches and Keywords</h3>
                </div>
                <div className="App mt-100">
                    <h3>Google Play Store</h3>
                    <Space direction="vertical">
                        <Search placeholder="input search text" onSearch={onSearch} enterButton/>
                    </Space>
                </div>
            </Spin>
        </>
    );
}

export default Home;
