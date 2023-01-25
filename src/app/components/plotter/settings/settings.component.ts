import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SettingsModel} from "../../../model/settings.model";

export interface DialogData{
  settings: SettingsModel[]
}

@Component({
  selector: 'app-macd-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  constructor(
    public dialogRef: MatDialogRef<SettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ){
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
