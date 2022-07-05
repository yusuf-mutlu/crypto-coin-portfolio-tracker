import React, {useEffect} from 'react';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Box from "@mui/material/Box";
import NumberFormat from "react-number-format";
import axios from "axios";
import LinearProgress from "@mui/material/LinearProgress";

const CryptoInfoBar  = (props) => {
    const [cryptoInfoData, setCryptoInfoData] = React.useState(null);
    const URL = props.site_url + '/crypto-info-bar';
    const [loading, setLoading] = React.useState(true);

    const loadData = () => axios.get(`${URL}`)
        .then(res => {
            setCryptoInfoData(res.data);
        }).finally(function() {
            setLoading(false);
        });

    useEffect(() => {
        loadData();

        const interval = setInterval(() => {
            loadData();
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid #eff2f5' }}>
            <Container sx={{ minHeight: "24.8px" }}>
                <Box
                    component="div"
                    sx={{
                        display: "inline",
                        minHeight: "24.8px",
                    }}
                >
                    {loading
                        ? (<Box sx={{ width: '100%', marginTop: '10px'}}>
                                <LinearProgress color="inherit" />
                            </Box>
                        ) : cryptoInfoData && cryptoInfoData
                        .map(cryptoInfo => (
                        <Box key={cryptoInfo.id} sx={{ display: "inline" }}>
                            <Box
                                component="span"
                                sx={{
                                    fontSize: "11px",
                                    fontWeight: "bold",
                                    color: "darkblue",
                                }}
                            >
                                {cryptoInfo.name}:&nbsp;
                            </Box>

                            <Box
                                component="span"
                                sx={{
                                    fontSize: "10px",
                                    fontWeight: "bold",
                                }}
                            >
                                <NumberFormat value={cryptoInfo.price} displayType={'text'} thousandSeparator={true} prefix={'$'} />&nbsp;&nbsp;
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Container>
        </AppBar>
    );
}

export default CryptoInfoBar;
