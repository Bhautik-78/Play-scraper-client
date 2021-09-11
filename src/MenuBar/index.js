import React from 'react';
import {Link} from "react-router-dom";
import {Layout, Menu} from "antd";
import image from "../Assets/image/photo-1607252650355-f7fd0460ccdb.jpg"
import "./menubar.css"

const {Header} = Layout;

const MenuBar = () => {
    return (
        <Layout className="layout">
            <Header>
                <div>
                    <img className="logo" src={image} height={60} width={120}/>
                </div>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['home']}>
                    <Menu.Item key="home"><Link to="/">Home</Link></Menu.Item>
                    <Menu.Item key="category"><Link to="/category">Category</Link></Menu.Item>
                    <Menu.Item key="daily"><Link to="/daily">Daily</Link></Menu.Item>
                    {/*<Menu.Item key="appDetail"><Link to="/appDetail">App Detail</Link></Menu.Item>*/}
                    {/*<Menu.Item key="dailyAppDetail"><Link to="/dailyAppDetail">Daily App Detail</Link></Menu.Item>*/}
                </Menu>
            </Header>
        </Layout>
    )
};

export default MenuBar;
