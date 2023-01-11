import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Observable, of, switchMap} from "rxjs";
import {
  getSettings,
  getSettingsFail,
  getSettingsSuccess,
  setSettings,
  setSettingsFail,
  setSettingsSuccess
} from "./settings.actions";
import {catchError, mergeMap} from "rxjs/operators";

@Injectable()
export class SettingsEffects{

  $getSettings = createEffect( (): Observable<any> =>
    this.actions$.pipe(
      ofType(getSettings),
      switchMap( () => {
        return of(getSettingsSuccess());
      }),
      catchError(error => of(getSettingsFail({error: error})))
    )
  );

  $setSettings = createEffect( (): Observable<any> =>
    this.actions$.pipe(
      ofType(setSettings),
      switchMap( (settings) => {
        return of(setSettingsSuccess(settings));
      }),
      catchError(error => of(setSettingsFail({error: error})))
    )
  );

  constructor(private actions$: Actions){}
}
