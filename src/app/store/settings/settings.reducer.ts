import * as SettingsActions from "./settings.actions";
import {SettingsModel} from "../../model/settings.model";
import {createReducer, on} from "@ngrx/store";
import {SettingsState} from "./settings.state";

const initialState: SettingsState = {settings: new Map<string, SettingsModel>()};
initialState.settings.set("numberOfCandles", {name: "numberOfCandles", value: 7, text:"Number of candles", type:"number"});
initialState.settings.set("chartTimeframe", {name: "timeframe", value: 5, text:"Candle width", type:"number"});
initialState.settings.set("macdTimeframe1", {name: "timeframe1", value: 5, text:"Fast EMA", type:"number"});
initialState.settings.set("macdTimeframe2", {name: "timeframe2", value: 25, text:"Slow EMA", type:"number"});
initialState.settings.set("macdSignalTimeframe", {name: "signalTimeframe", value: 10, text:"Signal", type:"number"});

export const settingsReducer = createReducer(
  initialState,
  on(SettingsActions.getSettings, (state) => {
    return state;
  }),
  on(SettingsActions.getSettingsSuccess, (state) => {
    return state;
  }),
  on(SettingsActions.setSettings, (state) => {
    return {
      ...state
    }
  }),
  on(SettingsActions.setSettingsSuccess, (state, action) => {
    action.settings.forEach((setting) => {
      state.settings.set(setting.name, setting);
    });
    return {
      ...state,
      action
    }
  }),
  on(SettingsActions.getSettingsFail, (state, action) =>{
    return {
      ...state,
      action
    };
  }),
  on(SettingsActions.setSettingsFail, (state, action) => {
    return {
      ...state,
      action
    };
  })
);
