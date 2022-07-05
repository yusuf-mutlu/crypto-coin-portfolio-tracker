import React from 'react';
import Helmet from 'react-helmet';
import CryptoInfoBar from '../Layouts/CryptoInfoBar';
import ApplicationBar from "../Layouts/ApplicationBar";
import ApplicationContent from "../Layouts/ApplicationContent";
import Box from "@mui/material/Box";
import UserNotLoggedInText from "./Auth/UserNotLoggedInText";

// @ts-ignore
const Layout  = ({ props, title, children }) => {
    return (
        <>
            <Helmet titleTemplate={title + ' | ' + props.settings.app_name} title={title} />
            <CryptoInfoBar  {...props} />
            <ApplicationBar
                {...props}
            >
            </ApplicationBar>
            <ApplicationContent
                {...props}
            >
                {!props.auth.user && (
                    <UserNotLoggedInText />
                )}
                {children}
            </ApplicationContent>
        </>
    );
}

export default Layout;
