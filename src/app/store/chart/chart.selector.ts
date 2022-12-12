import {createFeatureSelector, createSelector} from "@ngrx/store";
import {ChartsMapState, ChartState} from "./chart.state";

export const selectCandlestickWithEmaFeatureKey = 'selectCandlestickWithEmaFeature'; //this string must be exported in the const store/index.ts/reducers

export const selectCandlestickWithEmaFeatureSelector = createFeatureSelector<ChartState>(
  selectCandlestickWithEmaFeatureKey
);

const stateMap: ChartsMapState = {charts: new Map<String, ChartState>()};

export const selectCandlestickWithEma = createSelector(
  selectCandlestickWithEmaFeatureSelector,
  (state: ChartState) => {
    if(!state){
        stateMap.charts.set(selectCandlestickWithEmaFeatureKey, {
          title: '',
          dataModel: {
            data: [],
            timestamps:[]
          }
        });
    } else {
      stateMap.charts.set(selectCandlestickWithEmaFeatureKey, state);
    }
    return stateMap.charts.get(selectCandlestickWithEmaFeatureKey);
  }
);
