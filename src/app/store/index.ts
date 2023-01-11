import {ActionReducerMap} from "@ngrx/store";
import {TickersState} from "./tickers/tickers-list.state";
import {tickersReducer} from "./tickers/tickers-list.reducer";
import {ChartState} from "./chart/chart.state";
import {chartReducer} from "./chart/chart.reducer";
import {SettingsState} from "./settings/settings.state";
import {settingsReducer} from "./settings/settings.reducer";

interface AppState {
  tickersState: TickersState;
  chartState: Map<string,ChartState|undefined>;
  settingsState: SettingsState;
}

export const reducers: ActionReducerMap<AppState> = {
  tickersState: tickersReducer,
  chartState: chartReducer,
  settingsState: settingsReducer
};
