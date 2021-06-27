import React from 'react';
import './App.css';
import {resolveResultByField} from "./thailand-address";
import {makeStyles, Theme} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';

interface AddressObject {
    subDistrict: string,
    district: string,
    province: string,
    postCode: string,
}

interface Action {
    type: string,
    payload: any
}

const initialState = {
    entities: [],
    searchKey: "",
    search: "",
    form: {
        address: "",
        subDistrict: "",
        district: "",
        province: "",
        postCode: ""
    }
};

const SEARCH_ACTION = "SEARCH_ACTION";
const FORM_CHANGE_ACTION = "FORM_CHANGE_ACTION";
const SELECT_ADDRESS = "SELECT_ADDRESS";

function reducer(state: any, action: Action) {
    const {payload} = action;
    switch (action.type) {
        case SEARCH_ACTION:
            return {
                ...state,
                entities: resolveResultByField(payload.type, payload.search),
                searchKey: payload.type,
                search: payload.search
            };
        case FORM_CHANGE_ACTION:
            return {
                ...state,
                form: {
                    ...state.form,
                    [payload.name]: payload.value
                }
            }
        case SELECT_ADDRESS:
            return {
                ...state,
                form: {
                    ...state.form,
                    ...payload
                }
            }
        default:
            throw new Error();
    }
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginTop: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2)
    },
    poper: {
        zIndex: theme.zIndex.modal,
    }
}));


function App() {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const classes = useStyles();
    const handlerFormChange = (event: any) => {
        dispatch({
            type: FORM_CHANGE_ACTION,
            payload: {
                name: event.target.name,
                search: event.target.value,
            }
        })
        dispatch({
            type: SEARCH_ACTION,
            payload: {
                type: event.target.name,
                search: event.target.value,
            }
        })
        setAnchorEl(event.currentTarget);
    }

    const handlerClick = (obj: any) => {
        setAnchorEl(null);
        dispatch({
            type: SELECT_ADDRESS,
            payload: {...obj}
        });
    }

    const onBlur = () => {
        setAnchorEl(null);
    }

    return (
        <Container maxWidth="sm" className={classes.root}>

            <Paper className={classes.paper}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom>
                            Address form
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Address"
                                   fullWidth
                                   name="address"
                                   variant="outlined"
                                   value={state.form.address}
                                   onChange={(e) => dispatch({
                                       type: FORM_CHANGE_ACTION,
                                       payload: {
                                           name: "address",
                                           search: e.target.value,
                                       }
                                   })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Sub district"
                                   fullWidth
                                   variant="outlined"
                                   name="subDistrict"
                                   value={state.form.subDistrict}
                                   onBlur={onBlur}
                                   onChange={handlerFormChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="District"
                                   fullWidth
                                   variant="outlined"
                                   name="district"
                                   value={state.form.district}
                                   onBlur={onBlur}
                                   onChange={handlerFormChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Province"
                                   fullWidth
                                   variant="outlined"
                                   name="province"
                                   value={state.form.province}
                                   onBlur={onBlur}
                                   onChange={handlerFormChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Postcode"
                                   fullWidth
                                   variant="outlined"
                                   name="postCode"
                                   value={state.form.postCode}
                                   onBlur={onBlur}
                                   onChange={handlerFormChange}
                        />
                    </Grid>
                </Grid>
            </Paper>
            {
                state.entities.length > 0 && (
                    <Popper open={Boolean(anchorEl)}
                            className={classes.poper}
                            anchorEl={anchorEl} placement="bottom-start" transition
                            keepMounted
                    >
                        {({ TransitionProps }) => (
                            <Fade {...TransitionProps} timeout={350}>
                                <Paper className={classes.paper}>
                                    {state.entities.map((x : AddressObject , idx : number) => (
                                        <MenuItem key={idx} onClick={() => handlerClick(x)}>
                                            {x.subDistrict}{'>'}{x.district}{'>'}{x.province}{'>'}{x.postCode}
                                        </MenuItem>
                                    ))}
                                </Paper>
                            </Fade>
                        )}
                    </Popper>
                )
            }
        </Container>
    );
}

export default App;
