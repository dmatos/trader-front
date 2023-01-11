import {createAction, props} from "@ngrx/store";
import {SettingsState} from "./settings.state";

export const GET_CURRENT_SETTINGS_TYPE: string = "[Settings] Get current settings values";
export const GET_CURRENT_SETTINGS_FAIL_TYPE: string = "[Settings] Get current settings values failed";
export const GET_CURRENT_SETTINGS_SUCCESS_TYPE: string = "[Settings] Get current settings values succeeded";
export const SET_SETTINGS_TYPE: string = "[Settings] Upsert settings";
export const SET_SETTINGS_SUCCESS_TYPE: string = "[Settings] Upsert settings success";
export const SET_SETTINGS_FAIL_TYPE: string = "[Settings] Upsert settings failed";


export const setSettings = createAction(
  SET_SETTINGS_TYPE,
  props<SettingsState>()
);

export const setSettingsSuccess = createAction(
  SET_SETTINGS_SUCCESS_TYPE,
  props<SettingsState>()
);

export const getSettings = createAction(
  GET_CURRENT_SETTINGS_TYPE
);

export const getSettingsSuccess = createAction(
  GET_CURRENT_SETTINGS_SUCCESS_TYPE
);

export const getSettingsFail = createAction(
  GET_CURRENT_SETTINGS_FAIL_TYPE,
  props<{error: Error}>()
);

export const setSettingsFail = createAction(
  SET_SETTINGS_FAIL_TYPE,
  props<{error: Error}>()
);
