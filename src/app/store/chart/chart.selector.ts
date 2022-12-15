import {createFeatureSelector, createSelector} from "@ngrx/store";
import {ChartState} from "./chart.state";

//keys must be exported in the const /app/store/index.ts/reducers
export const selectCandlestickWithEmaFeatureKey = 'selectCandlestickWithEmaFeature';
export const selectMacdAndSignalFeatureKey = 'selectMacdAndSignalFeature'

export const selectCandlestickWithEmaFeatureSelector = createFeatureSelector<ChartState>(
  selectCandlestickWithEmaFeatureKey
);

export const selectMacdAndSignalFeatureSelector = createFeatureSelector<ChartState>(
  selectMacdAndSignalFeatureKey
);

function getStateOrElseNewChartState(state: ChartState){
  if(!state){
    return {
      title: '',
      dataModel: {
        data: [],
        timestamps:[]
      }
    };
  } else {
    return state
  }
}

export const selectCandlestickWithEma = createSelector(
  selectCandlestickWithEmaFeatureSelector,
  (state: ChartState) => {
    return getStateOrElseNewChartState(state);
  }
);

export const selectMacdWithSignal = createSelector(
  selectMacdAndSignalFeatureSelector,
  (state: ChartState) => {
    getStateOrElseNewChartState(state);
  }
);
