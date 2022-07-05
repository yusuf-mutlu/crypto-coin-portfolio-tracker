import * as React from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import {useEffect} from "react";
import Typography from "@mui/material/Typography";
import NumberFormat from "react-number-format";
import CircularProgress from '@mui/material/CircularProgress';

export default function UserTotalPortfolio(props) {
    const [userTotalPortfolio, setUserTotalPortfolio] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const URL = props.site_url + '/user-total-portfolio';

    const loadData = () => axios.get(`${URL}`)
        .then(res => {
            setUserTotalPortfolio(res.data);
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
        <Box sx={{ marginTop: 2 }}
             height="100%"
             display="flex"
             alignItems="center"
             flexDirection="column"
        >
            <Typography component="p" variant="h5" >
                <b style={{color: 'darkblue'}}>
                    {loading
                        ? <CircularProgress size="1.3rem" color="inherit" />
                        : <NumberFormat value={Math.floor(userTotalPortfolio * 100 ) / 100 } displayType={'text'} thousandSeparator={true} prefix={'$'} />
                    }
                </b>
            </Typography>

            <Typography component="p" sx={{fontSize: 13}}>
                (Total Portfolio Value)
            </Typography>
        </Box>
    );
}
