import * as React from "react";
import CryptoCard from '../../Components/UI/CryptoCard';
import Grid from '@mui/material/Grid';
import Box from "@mui/material/Box";
import axios from "axios";
import {useEffect} from "react";
import LinearProgress from '@mui/material/LinearProgress';
import DialogModal from "../DialogModal";
import EditCryptoCurrency from "./EditCryptoCurrency";
import DeleteCryptoCurrency from "./DeleteCryptoCurrency";

export default function UserCryptoGrid(props) {
    const [openEditCryptoCurrency, setOpenEditCryptoCurrency] = React.useState(false);
    const [openDeleteCryptoCurrency, setOpenDeleteCryptoCurrency] = React.useState(false);
    const [rowData, setRowData] = React.useState(null);
    const [userPortfolio, setUserPortfolio] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const URL = props.site_url + '/user-rest-portfolio';


    const handleClickOpenEditCryptoCurrency = (event, rowData) => {
        setRowData(rowData);
        setOpenEditCryptoCurrency(true);
    };

    const handleClickOpenDeleteCryptoCurrency = (event, rowData) => {
        setRowData(rowData);
        setOpenDeleteCryptoCurrency(true);
    };

    const loadData = () => axios.get(`${URL}?requireTotalCount=true&skip=0&take=500&sort=null`)
        .then(res => {
            setUserPortfolio(res.data);
        })
        .finally(function() {
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
        <>
            <DialogModal open={openEditCryptoCurrency} onClose={() => setOpenEditCryptoCurrency(false)} disableClose={false}>
                <EditCryptoCurrency props={props} portfolioStyle="grid" rowData={rowData} />
            </DialogModal>

            <DialogModal open={openDeleteCryptoCurrency} onClose={() => setOpenDeleteCryptoCurrency(false)} disableClose={false}>
                <DeleteCryptoCurrency props={props} portfolioStyle="grid"  rowData={rowData} />
            </DialogModal>

            <Box sx={{ marginTop: 2 }}>
                <Grid container spacing={2} >
                    {loading
                        ? (<Box sx={{ width: '100%' }}>
                               <LinearProgress color="inherit" />
                           </Box>
                        ) : userPortfolio && userPortfolio.data.map((crypto, index) => (
                        <Grid key={index} item xs={12} sm={6} md={4} lg={3} xl={2}>
                            <CryptoCard
                                userCoinTotalValue = {crypto.holdings}
                                userCoinName = {crypto.name}
                                userCoinSymbol = {crypto.symbol.toUpperCase()}
                                userCoinImage = {crypto.image_thumb}
                                userCoinAmount = {crypto.quantity}
                                userCoinOneAmountPrice = {crypto.price}
                            />

                            <Box
                                sx={{
                                    border: "1px solid rgba(224, 224, 224, 1)",
                                    borderTop: "1px dotted #e3e3e3",
                                    borderWidth: "1px 1px 1px 1px",
                                    borderRadius: "0 0 4px 4px",
                                    fontSize: "9px",
                                    textAlign: "center",
                                    padding: '3px 0 3px 0',
                                }}
                                component="div"
                            >
                                <Box
                                    component="span"
                                    sx={{ display: "inline", cursor: "pointer" }}
                                    onClick={(e) => {
                                        handleClickOpenEditCryptoCurrency(e, crypto)
                                    }}
                                >
                                    EDIT
                                </Box>

                                <Box
                                    component="span"
                                    sx={{ display: "inline" }}
                                >
                                    &nbsp;|&nbsp;
                                </Box>

                                <Box
                                    component="span"
                                    sx={{ display: "inline", cursor: "pointer" }}
                                    onClick={(e) => {
                                        handleClickOpenDeleteCryptoCurrency(e, crypto)
                                    }}
                                >
                                    DELETE
                                </Box>
                            </Box>
                        </Grid>
                    ))}

                    {!loading && userPortfolio && userPortfolio.data.length === 0 && (
                        <Box sx={{width: '100%', textAlign: 'center'}}>
                            No data
                        </Box>
                    )}
                </Grid>
            </Box>
        </>
    );
}
