import {ChartState} from "./chart.state";
import {createReducer, on} from "@ngrx/store";
import * as ChartActions from "./chart.actions";

export const initialState : ChartState = {title: 'null', dataModel: {data: [], timestamps: []}};

export const chartReducer = createReducer(
  initialState,
  on(ChartActions.getCandlestickAndEmaSuccess, (state, action) => {
    if(!action.dataModel) {
      return {...state}
    }
    return {
      ...state,
      ...action
    }
  }),
  on(ChartActions.getCandlestickAndEmaFail, state => state)
);
