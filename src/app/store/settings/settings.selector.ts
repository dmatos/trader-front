import {createFeatureSelector, createSelector} from "@ngrx/store";
import {SettingsState} from "./settings.state";

export const settingsFeatureKey = "settingsState";

export const settingsFeatureSelector = createFeatureSelector<SettingsState>(settingsFeatureKey);

export const selectSettings = createSelector(
  settingsFeatureSelector,
  (state: SettingsState) => {
    return state;
  }
);
