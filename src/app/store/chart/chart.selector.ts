import {createFeatureSelector, createSelector} from "@ngrx/store";
import {ChartState} from "./chart.state";

//keys must be exported in the const /app/store/index.ts/reducers
export const chartFeatureKey = 'chartState';

export const chartFeatureSelector = createFeatureSelector<Map<string, ChartState>>(
  chartFeatureKey
);

export const selectChart = createSelector(
  chartFeatureSelector,
  (state: Map<string, ChartState>) => {
    return state;
  }
);
