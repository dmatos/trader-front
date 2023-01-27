import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../settings/settings.component";

@Component({
  selector: 'app-download-csv',
  templateUrl: './download-csv.component.html',
  styleUrls: ['./download-csv.component.css']
})
export class DownloadCsvComponent {
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(
    public dialogRef: MatDialogRef<DownloadCsvComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ){
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
