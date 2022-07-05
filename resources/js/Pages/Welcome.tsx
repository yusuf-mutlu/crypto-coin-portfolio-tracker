import * as React from 'react';
import { Inertia } from '@inertiajs/inertia';
import Layout from '../Layouts/Layout';
import UserCryptoGrid from '../Layouts/Portfolio/UserCryptoGrid';
import UserCryptoTable from '../Layouts/Portfolio/UserCryptoTable';
import CryptoCurrenciesTable from '../Layouts/CryptoCurrenciesTable';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import DialogModal from "../Layouts/DialogModal";
import AddCryptoCurrency from "../Layouts/Portfolio/AddCryptoCurrency";
import UserTotalPortfolio from "../Layouts/Portfolio/UserTotalPortfolio";
import {useEffect} from "react";
import axios from "axios";

const Welcome = ( props ) => {
    const [toggleButton, setToggleButton] = React.useState('list');
    const [toggleUserCryptoData, setToggleUserCryptoData] = React.useState(false);
    const [openAddNewCryptoCurrency, setOpenAddNewCryptoCurrency] = React.useState(false);
    const [portfolioRenderer, setPortfolioRenderer] = React.useState(1);

    useEffect(() => {
        if (props.settings.user_portfolio_style === 'list') {
            setToggleButton('list');
            setToggleUserCryptoData(false);
        } else {
            setToggleButton('grid');
            setToggleUserCryptoData(true);
        }
    }, []);

    const sendRandomNumberToParent = (renderer) => {
        setPortfolioRenderer(renderer);
    };

    const handleClickOpenAddNewCryptoCurrency = () => {
        setOpenAddNewCryptoCurrency(true);
    };

    useEffect(() => {
        setOpenAddNewCryptoCurrency(false);
    }, [portfolioRenderer]);

    const handleChange = (event: any, toggleButton: React.SetStateAction<string>) => {
        if (toggleButton === 'list') {
            setToggleButton(toggleButton);
            setToggleUserCryptoData(false);
        }

        if (toggleButton === 'grid') {
            setToggleButton(toggleButton);
            setToggleUserCryptoData(true);
        }

        axios.get(props.site_url + '/portfolio-style?portfolioStyle=' + toggleButton);
    };

    return (
        <Layout
            props = {props}
            title="Welcome"
        >
            {props.auth.user &&
                (
                    <>
                        <UserTotalPortfolio key={portfolioRenderer} {...props} />
                        <Divider sx={{ marginTop: 2 }} component="div" />

                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            sx={{
                                marginTop: 3,
                                textTransform: 'none'
                            }}
                            onClick={handleClickOpenAddNewCryptoCurrency}
                        >
                            Add a coin to your portfolio
                        </Button>

                        <DialogModal open={openAddNewCryptoCurrency} onClose={() => setOpenAddNewCryptoCurrency(false)} disableClose={false}>
                            <AddCryptoCurrency props = {props} sendRandomNumberToParent={sendRandomNumberToParent} />
                        </DialogModal>

                        <Box sx={{ marginTop: 4 }}>
                            <Typography
                                component="p"
                                variant="h6"
                                display="flex"
                                alignItems="center"
                                flexDirection="column"
                                sx={{ display: 'inline' }}
                            >
                                My Portfolio
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={4}
                                display="flex"
                                alignItems="end"
                                flexDirection="column"
                            >
                                <ToggleButtonGroup
                                    value={toggleButton}
                                    exclusive
                                    size="small"
                                    onChange={handleChange}
                                    aria-label="Crypto View Types"
                                >
                                    <ToggleButton value="list" aria-label="list">
                                        <Tooltip TransitionComponent={Zoom} title="List View" arrow placement="top">
                                            <ViewListIcon />
                                        </Tooltip>
                                    </ToggleButton>

                                    <ToggleButton value="grid" aria-label="module">
                                        <Tooltip TransitionComponent={Zoom} title="Grid View" arrow placement="top">
                                            <ViewModuleIcon />
                                        </Tooltip>
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Stack>
                        </Box>

                        {toggleUserCryptoData
                            ? <UserCryptoGrid key = {portfolioRenderer + 1} {...props} />
                            : <UserCryptoTable key = {portfolioRenderer + 2} {...props} />
                        }
                    </>
                )
            }

            <Box sx={{ marginTop: 7, marginBottom: 5 }}>
                <Typography
                    component="p"
                    variant="h6"
                    display="flex"
                    alignItems="center"
                    flexDirection="column"
                    sx={{ display: 'inline' }}
                >
                    Cryptocurrencies
                </Typography>
            </Box>

            <CryptoCurrenciesTable  {...props} />
        </Layout>
    );
};

export default Welcome;
