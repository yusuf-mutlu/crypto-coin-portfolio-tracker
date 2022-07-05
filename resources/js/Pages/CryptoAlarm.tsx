import * as React from 'react';
import Layout from '../Layouts/Layout';

const CryptoAlarm = ( props ) => {

    return (
        <Layout
            props = {props}
            title="Crypto Alarm"
        >
            {props.auth.user && (
                <>
                    Under Development!
                </>
            )}
        </Layout>
    );
};

export default CryptoAlarm;
