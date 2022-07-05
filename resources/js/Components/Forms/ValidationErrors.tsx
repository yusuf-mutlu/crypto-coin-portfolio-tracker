import React from "react";
import {List, ListItem} from "@mui/material";

export default function ValidationErrors(props) {
    return (
        Object.keys(props.errors).length > 0 && (
            <List sx={{ listStyleType: 'disc' }}>
                {Object.keys(props.errors).map(function (key, index) {
                    return <ListItem key={index} sx={{ display: 'list-item', color: 'red' }}>{props.errors[key]}</ListItem>
                })}
            </List>
        )
    );
}
