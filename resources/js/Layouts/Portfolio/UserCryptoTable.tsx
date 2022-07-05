import React, {
    useReducer, useState, useEffect, useMemo,
} from 'react';
import Paper from '@mui/material/Paper';
import {
    VirtualTableState,
    DataTypeProvider,
    SortingState,
    createRowCache,
    DataTypeProviderProps,
} from '@devexpress/dx-react-grid';
import {
    Grid,
    VirtualTable,
    TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import {Loading} from '../../Components/UI/theme-sources/material-ui/components/loading';
import Box from "@mui/material/Box";
import NumberFormat from 'react-number-format';
import Button from "@mui/material/Button";
import DialogModal from "../DialogModal";
import EditCryptoCurrency from "./EditCryptoCurrency";
import DeleteCryptoCurrency from "./DeleteCryptoCurrency";
import Tooltip from "@mui/material/Tooltip";

const VIRTUAL_PAGE_SIZE = 100;
const MAX_ROWS = 50000;
const getRowId = (row: { id: any; }) => row.id;

const CurrencyFormatter = ({value}) => (
    <b style={{color: 'darkblue'}}>
        <NumberFormat value={value} displayType={'text'} thousandSeparator={true} prefix={'$'} />
    </b>
);

const CurrencyTypeProvider = (props: JSX.IntrinsicAttributes & DataTypeProviderProps & { children?: React.ReactNode; }) => (
    <DataTypeProvider
        formatterComponent={CurrencyFormatter}
        {...props}
    />
);

const DateFormatter = ({ value }) => value.replace(/(\d{4})-(\d{2})-(\d{2})(T.*)/, '$3.$2.$1');

const DateTypeProvider = (props: JSX.IntrinsicAttributes & DataTypeProviderProps & { children?: React.ReactNode; }) => (
    <DataTypeProvider
        formatterComponent={DateFormatter}
        {...props}
    />
);

const initialState = {
    rows: [],
    skip: 0,
    requestedSkip: 0,
    take: VIRTUAL_PAGE_SIZE * 2,
    totalCount: 0,
    loading: false,
    lastQuery: '',
    sorting: [],
    forceReload: false,
};

function reducer(state, { type, payload }) {
    switch (type) {
        case 'UPDATE_ROWS':
            return {
                ...state,
                ...payload,
                loading: false,
            };
        case 'CHANGE_SORTING':
            return {
                ...state,
                forceReload: true,
                rows: [],
                sorting: payload,
            };
        case 'CHANGE_FILTERS':
            return {
                ...state,
                forceReload: true,
                requestedSkip: 0,
                rows: [],
            };
        case 'START_LOADING':
            return {
                ...state,
                requestedSkip: payload.requestedSkip,
                take: payload.take,
            };
        case 'REQUEST_ERROR':
            return {
                ...state,
                loading: false,
            };
        case 'FETCH_INIT':
            return {
                ...state,
                loading: true,
                forceReload: false,
            };
        case 'UPDATE_QUERY':
            return {
                ...state,
                lastQuery: payload,
            };
        default:
            return state;
    }
}

export default (props) => {
    const URL = props.site_url + '/user-rest-portfolio';
    const [openEditCryptoCurrency, setOpenEditCryptoCurrency] = React.useState(false);
    const [openDeleteCryptoCurrency, setOpenDeleteCryptoCurrency] = React.useState(false);
    const [rowData, setRowData] = React.useState(null);

    const handleClickOpenEditCryptoCurrency = (event, rowData) => {
        setRowData(rowData);
        setOpenEditCryptoCurrency(true);
    };

    const handleClickOpenDeleteCryptoCurrency = (event, rowData) => {
        setRowData(rowData);
        setOpenDeleteCryptoCurrency(true);
    };

    const showDetailedPriceInformation = (priceData) => {
        return (
            <Tooltip title={<NumberFormat isNumericString={true} value={priceData} displayType={'text'} thousandSeparator={true} prefix={'$'} />} placement="top-start" arrow>
                    <span
                        style={{ cursor: 'default' }}
                    >
                        <b style={{color: 'darkblue'}}>
                            <NumberFormat isNumericString={true} value={priceData} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                        </b>
                    </span>
            </Tooltip>
        );
    }

    const showDetailedPercentageInformation = (percentageData) => {
        const color = percentageData > 0 ? 'green' : 'red';
        const arrow = percentageData > 0 ? '▲' : '▼';

        const percentageDataFormatted = percentageData < 0 ? percentageData * -1 : percentageData;

        return (
            <Tooltip title={<NumberFormat value={percentageDataFormatted} decimalScale={2} displayType={'text'} thousandSeparator={true} suffix={'%'} />} placement="top-start" arrow>
                    <span
                        style={{ cursor: 'default' }}
                    >
                        <b style={{color: color}}>
                            {arrow}
                            <NumberFormat value={percentageDataFormatted} decimalScale={2} displayType={'text'} thousandSeparator={true} suffix={'%'} />
                        </b>
                    </span>
            </Tooltip>
        );
    }

    const [state, dispatch] = useReducer(reducer, initialState);
    const [columns] = useState([
        { name: 'name', title: 'Name', getCellValue: row => {
                return (
                    <Box component="div" sx={{
                        display: 'flex',
                        alignContent: 'space-between',
                        justifyContent: 'flex-start'
                    }} >
                        <img
                            loading="lazy"
                            width="20"
                            src={row.image_thumb}
                            srcSet={row.image_thumb}
                            alt=""
                        />
                        &nbsp;{row.name + ' (' + row.symbol.toUpperCase() + ')'}
                    </Box>
                );
            }
         },
        { name: 'price', title: 'Price', getCellValue: row => showDetailedPriceInformation(row.price)},
        { name: 'price_change_percentage_24h', title: '24h %', getCellValue: row => showDetailedPercentageInformation(row.price_change_percentage_24h)},
        { name: 'quantity', title: 'Quantity', getCellValue: row => <NumberFormat value={row.quantity} displayType={'text'} thousandSeparator={true} /> },
        { name: 'holdings', title: 'Holdings', getCellValue: row => showDetailedPriceInformation(Math.floor(row.holdings * 100 ) / 100)},
        { name: '', title: '', getCellValue: row => {
                return (
                    <>
                        <Button
                            sx={{marginRight: '8px'}}
                            size="small"
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={(e) => {
                                handleClickOpenEditCryptoCurrency(e, row)
                            }}
                        >
                            Edit
                        </Button>
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            onClick={(e) => {
                                handleClickOpenDeleteCryptoCurrency(e, row)
                            }}
                        >
                            Delete
                        </Button>
                    </>
                );
            }
        },
    ]);

    const [tableColumnExtensions] = useState([
        { columnName: 'Name', width: 260 },
        { columnName: 'Price', width: 100 },
        { columnName: 'price_change_percentage_24h', width: 110 },
        { columnName: 'Quantity', width: 80 },
        { columnName: 'Holdings', width: 220 },
        { columnName: '', width: 220 },
    ]);

    const cache = useMemo(() => createRowCache(VIRTUAL_PAGE_SIZE), [VIRTUAL_PAGE_SIZE]);
    const updateRows = (skip: number, count: number, newTotalCount: number) => {
        dispatch({
            type: 'UPDATE_ROWS',
            payload: {
                skip: Math.min(skip, newTotalCount),
                rows: cache.getRows(skip, count),
                totalCount: newTotalCount < MAX_ROWS ? newTotalCount : MAX_ROWS,
            },
        });
    };

    const getRemoteRows = (requestedSkip: any, take: any) => {
        dispatch({ type: 'START_LOADING', payload: { requestedSkip, take } });
    };

    const buildQueryString = () => {
        const {
            requestedSkip, take, sorting,
        } = state;
        const sortingConfig = sorting
            .map(({ columnName, direction }) => ({
                selector: columnName,
                desc: direction === 'desc',
            }));
        const sortingStr = JSON.stringify(sortingConfig);
        const sortQuery = sortingStr ? `&sort=${escape(`${sortingStr}`)}` : '';

        return `${URL}?requireTotalCount=true&skip=${requestedSkip}&take=${take}${sortQuery}`;
    };

    const loadData = () => {
        const {
            requestedSkip, take, lastQuery, loading, forceReload, totalCount,
        } = state;
        const query = buildQueryString();
        if ((query !== lastQuery || forceReload) && !loading) {
            if (forceReload) {
                cache.invalidate();
            }
            const cached = cache.getRows(requestedSkip, take);
            if (cached.length === take) {
                updateRows(requestedSkip, take, totalCount);
            } else {
                dispatch({ type: 'FETCH_INIT', payload: ''});
                fetch(query)
                    .then(response => response.json())
                    .then(({ data, totalCount: newTotalCount }) => {
                        cache.setRows(requestedSkip, data);
                        updateRows(requestedSkip, take, newTotalCount);
                    })
                    .catch(() => dispatch({ type: 'REQUEST_ERROR', payload: ''}));
            }
            dispatch({ type: 'UPDATE_QUERY', payload: query });
        }
    };

    const changeSorting = (value: any) => {
        dispatch({ type: 'CHANGE_SORTING', payload: value });
    };

    useEffect(() => loadData())

    useEffect(() => {
        const interval = setInterval(() => {
            loadData();
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const {
        rows, skip, totalCount, loading, sorting,
    } = state;

    return (
        <>
            <DialogModal open={openEditCryptoCurrency} onClose={() => setOpenEditCryptoCurrency(false)} disableClose={false}>
                <EditCryptoCurrency props={props} portfolioStyle="list" rowData={rowData} />
            </DialogModal>

            <DialogModal open={openDeleteCryptoCurrency} onClose={() => setOpenDeleteCryptoCurrency(false)} disableClose={false}>
                <DeleteCryptoCurrency props={props} portfolioStyle="list" rowData={rowData} />
            </DialogModal>

            <Box sx={{ marginTop: 2 }}>
                <Paper>
                    <Grid
                        rows={rows}
                        columns={columns}
                        getRowId={getRowId}
                    >
                        <DateTypeProvider for={['DateKey']} />
                        <VirtualTableState
                            loading={loading}
                            totalRowCount={totalCount}
                            pageSize={VIRTUAL_PAGE_SIZE}
                            skip={skip}
                            getRows={getRemoteRows}
                            infiniteScrolling
                        />
                        <SortingState
                            sorting={sorting}
                            onSortingChange={changeSorting}
                        />
                        <VirtualTable columnExtensions={tableColumnExtensions} />
                        <TableHeaderRow showSortingControls />
                    </Grid>
                    {loading && <Loading />}
                </Paper>
            </Box>
        </>
    );
};
