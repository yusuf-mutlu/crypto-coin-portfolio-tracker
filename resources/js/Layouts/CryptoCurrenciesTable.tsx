import React, {
    useReducer, useState, useEffect, useMemo,
} from 'react';
import Paper from '@mui/material/Paper';
import {
    VirtualTableState,
    DataTypeProvider,
    FilteringState,
    SortingState,
    createRowCache,
} from '@devexpress/dx-react-grid';
import {
    Grid,
    VirtualTable,
    TableHeaderRow,
    TableFilterRow,
} from '@devexpress/dx-react-grid-material-ui';
import {Loading} from '../Components/UI/theme-sources/material-ui/components/loading';
import Box from "@mui/material/Box";
import NumberFormat from "react-number-format";
import DialogModal from "./DialogModal";
import { TableFixedColumns } from '@devexpress/dx-react-grid-material-ui';
import Tooltip from "@mui/material/Tooltip";

const VIRTUAL_PAGE_SIZE = 100;
const MAX_ROWS = 50000;
const getRowId = row => row.id;

const CurrencyFormatter = ({value}) => (
    <b style={{color: 'darkblue'}}>
        <NumberFormat value={value} displayType={'text'} thousandSeparator={true} prefix={'$'} />
    </b>
);

const CurrencyTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={CurrencyFormatter}
        {...props}
    />
);

const DateFormatter = ({ value }) => value.replace(/(\d{4})-(\d{2})-(\d{2})(T.*)/, '$3.$2.$1');

const initialState = {
    rows: [],
    skip: 0,
    requestedSkip: 0,
    take: VIRTUAL_PAGE_SIZE * 2,
    totalCount: 0,
    loading: false,
    lastQuery: '',
    sorting: [],
    filters: [],
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
                filters: payload,
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
    const URL = props.site_url + '/cryptocurrencies';
    const [state, dispatch] = useReducer(reducer, initialState);
    const [openDialog, setOpenDialog] = useState(false);
    const [popupTextData, setPopupTextData] = useState(null);
    const [popupTitle, setPopupTitle] = useState('');

    const showDetailedTextInformation = (title, data: any) => {
        return (
            <Tooltip title={<div dangerouslySetInnerHTML={{__html: data}} />} placement="top-start" >
                    <span
                        dangerouslySetInnerHTML={{__html: data }}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            setPopupTitle(title);
                            setPopupTextData(data);
                            setOpenDialog(true);
                        }}
                    >
                    </span>
            </Tooltip>
        );
    }

    const showDetailedNumberInformation = (number, symbol) => {
        return (
            <Tooltip title={<><NumberFormat value={number} displayType={'text'} thousandSeparator={true} /> {symbol}</>} placement="top-start" arrow>
                    <span
                        style={{ cursor: 'default' }}
                    >
                        <NumberFormat value={number} displayType={'text'} thousandSeparator={true} /> {symbol}
                    </span>
            </Tooltip>
        );
    }

    const showDetailedPriceInformation = (priceData) => {
        return (
            <Tooltip title={<NumberFormat value={priceData} displayType={'text'} thousandSeparator={true} prefix={'$'} />} placement="top-start" arrow>
                    <span
                        style={{ cursor: 'default' }}
                    >
                        <b style={{color: 'darkblue'}}>
                            <NumberFormat value={priceData} displayType={'text'} thousandSeparator={true} prefix={'$'} />
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
        { name: 'market_volume_24h', title: '24h Volume', getCellValue: row => showDetailedPriceInformation(row.market_volume_24h)},
        { name: 'market_cap_usd', title: 'Market Cap Total', getCellValue: row => showDetailedPriceInformation(row.market_cap_usd)},
        { name: 'circulating_supply', title: 'Circulating Supply', getCellValue: row => showDetailedNumberInformation(row.circulating_supply, row.symbol.toUpperCase())},
        { name: 'max_supply', title: 'Max Supply', getCellValue: row => <>
                {row.max_supply === 0
                    ? <span style={{color: '#cecece'}}>No max supply</span>
                    : showDetailedNumberInformation(row.max_supply, row.symbol.toUpperCase())
                }
            </>
        },
        { name: 'categories', title: 'Categories', getCellValue: row => showDetailedTextInformation('Categories', row.categories) },
        { name: 'description', title: 'Description', getCellValue: row => showDetailedTextInformation('Description', row.description)},
    ]);

    const [tableColumnExtensions] = useState([
        { columnName: 'name', width: 330 },
        { columnName: 'price', width: 140 },
        { columnName: 'price_change_percentage_24h', width: 110 },
        { columnName: 'market_volume_24h', width: 160 },
        { columnName: 'market_cap_usd', width: 160 },
        { columnName: 'circulating_supply', width: 165 },
        { columnName: 'max_supply', width: 165 },
        { columnName: 'categories', width: 165 },
        { columnName: 'description', width: 165 },
    ]);

    const cache = useMemo(() => createRowCache(VIRTUAL_PAGE_SIZE), [VIRTUAL_PAGE_SIZE]);
    const updateRows = (skip, count, newTotalCount) => {
        dispatch({
            type: 'UPDATE_ROWS',
            payload: {
                skip: Math.min(skip, newTotalCount),
                rows: cache.getRows(skip, count),
                totalCount: newTotalCount < MAX_ROWS ? newTotalCount : MAX_ROWS,
            },
        });
    };

    const getRemoteRows = (requestedSkip, take) => {
        dispatch({ type: 'START_LOADING', payload: { requestedSkip, take } });
    };

    const buildQueryString = () => {
        const {
            requestedSkip, take, filters, sorting,
        } = state;
        const filterStr = filters
            .map(({ columnName, value, operation }) => (
                `["${columnName}","${operation}","${value}"]`
            )).join(',"and",');
        const sortingConfig = sorting
            .map(({ columnName, direction }) => ({
                selector: columnName,
                desc: direction === 'desc',
            }));
        const sortingStr = JSON.stringify(sortingConfig);
        const filterQuery = filterStr ? `&filter=[${escape(filterStr)}]` : '';
        const sortQuery = sortingStr ? `&sort=${escape(`${sortingStr}`)}` : '';

        return `${URL}?requireTotalCount=true&skip=${requestedSkip}&take=${take}${filterQuery}${sortQuery}`;
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

            dispatch({ type: 'FETCH_INIT', payload: '' });

            fetch(query)
                .then(response => response.json())
                .then(({ data, totalCount: newTotalCount }) => {
                    cache.setRows(requestedSkip, data);
                    updateRows(requestedSkip, take, newTotalCount);
                })
                .catch(() => dispatch({ type: 'REQUEST_ERROR', payload: '' }));

            dispatch({ type: 'UPDATE_QUERY', payload: query });
        }
    };

    const changeFilters = (value) => {
        dispatch({ type: 'CHANGE_FILTERS', payload: value });
    };

    const changeSorting = (value) => {
        dispatch({ type: 'CHANGE_SORTING', payload: value });
    };

    useEffect(() => loadData());

    useEffect(() => {
        const interval = setInterval(() => {
            loadData();
        }, 60000);
        return () => clearInterval(interval);
    } ,[]);

    const {
        rows, skip, totalCount, loading, sorting, filters,
    } = state;

    return (
        <>
            <DialogModal open={openDialog} onClose={() => setOpenDialog(false)} disableClose={false}>
                <div
                    style={{fontSize: '18px', textDecoration: 'underline', paddingBottom: '11px'}}
                >
                    {popupTitle}
                </div>
                <div dangerouslySetInnerHTML={{__html: popupTextData }} /><br/><br/>
            </DialogModal>

            <Paper>
                <Grid
                    rows={rows}
                    columns={columns}
                    getRowId={getRowId}
                >
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
                        columnExtensions={[
                            { columnName: 'categories', sortingEnabled: false },
                            { columnName: 'description', sortingEnabled: false }
                        ]}
                    />
                    <FilteringState
                        filters={filters}
                        onFiltersChange={changeFilters}
                        columnExtensions={[
                            { columnName: 'market_cap_usd', filteringEnabled: false },
                            { columnName: 'price', filteringEnabled: false },
                            { columnName: 'circulating_supply', filteringEnabled: false },
                            { columnName: 'max_supply', filteringEnabled: false },
                            { columnName: 'categories', filteringEnabled: false },
                            { columnName: 'description', filteringEnabled: false },
                            { columnName: 'price_change_percentage_24h', filteringEnabled: false },
                            { columnName: 'market_volume_24h', filteringEnabled: false },
                        ]}
                    />
                    <VirtualTable columnExtensions={tableColumnExtensions} />
                    <TableHeaderRow showSortingControls />
                    <TableFilterRow />
                    {/* <TableFixedColumns leftColumns={['name', 'price']} /> */}
                </Grid>
                {loading && <Loading />}
            </Paper>
        </>
    );
};
