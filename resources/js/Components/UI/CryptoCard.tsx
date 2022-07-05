import * as React from "react";
import CardActions from "@mui/material/CardActions";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import NumberFormat from "react-number-format";
import Box from "@mui/material/Box";

class CryptoCard extends React.Component<{ userCoinTotalValue: any, userCoinName: any, userCoinSymbol: any, userCoinImage: any, userCoinAmount: any, userCoinOneAmountPrice: any }> {
    render() {
        let {userCoinTotalValue, userCoinName, userCoinSymbol, userCoinImage, userCoinAmount, userCoinOneAmountPrice} = this.props;

        return (
            <Card sx={{
                    border: "1px solid rgba(224, 224, 224, 1)",
                    borderWidth: "1px 1px 0 1px",
                    minHeight: "120px",
                    fontSize: "11px",
                    borderRadius: "4px 4px 0 0",
                }}
                  elevation={0}
            >
                <CardHeader
                    sx={{minHeight: '99px', padding: '7px'}}
                    avatar={<img src={userCoinImage} style={{height: '25px'}}/>}
                    title={
                        <Box sx={{fontSize: '13px', fontWeight: 'bold', marginBottom: '4px'}}>
                            <span>{userCoinName}</span>
                        </Box>
                    }
                    subheader={
                        <Box component = 'div' sx={{fontSize: '14px'}}>
                            <b style={{color: 'darkblue'}}>
                                <NumberFormat value={Math.floor(userCoinTotalValue * 100 ) / 100 } displayType={'text'} thousandSeparator={true} prefix={'$'} />
                            </b>
                            <br/>
                            <Box component = 'div' sx={{fontSize: '10px'}}>
                                (<NumberFormat value={userCoinAmount} displayType={'text'} thousandSeparator={true} /> <span>{userCoinSymbol}</span>)
                            </Box>
                        </Box>
                    }
                />
                <CardActions disableSpacing sx={{
                        display: 'grid',
                        textAlign: 'center',
                        borderTop: '1px dotted #e3e3e3',
                        fontWeight: 'bold',
                        fontSize: '10px',
                    }}
                >
                    <Box component = 'div' >
                        1 {userCoinSymbol} = <b style={{color: 'darkblue'}}> <NumberFormat value={userCoinOneAmountPrice} displayType={'text'} thousandSeparator={true} prefix={'$'} /></b>
                    </Box>
                </CardActions>
            </Card>
        );
    }
}

export default CryptoCard;
