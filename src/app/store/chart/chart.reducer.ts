import {ChartState} from "./chart.state";
import {createReducer, on} from "@ngrx/store";
import * as ChartActions from "./chart.actions";

const initialState = new Map<string, ChartState|undefined>();



export const chartReducer = createReducer(
  initialState,
  on(ChartActions.getCandlestickAndEmaSuccess, (state, action) => {
    state.set(action['type'], action);
    return state;
  }),
  on(ChartActions.getCandlestickAndEmaFail, state => state),
  on(ChartActions.getMacdAndSignalSuccess, (state, action) => {
    state.set(action['type'], action);
    return state;
  }),
  on(ChartActions.getMacdAndSignalFail, state => state)
);
