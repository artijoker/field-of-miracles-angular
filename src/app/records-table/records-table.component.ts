import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { IRecord } from '../IRecord';

@Component({
  selector: 'app-records-table',
  templateUrl: './records-table.component.html',
  styleUrls: ['./records-table.component.css']
})

export class RecordsTableComponent implements OnInit {

  records: IRecord[] = [];

  constructor(private _dataService: DataService) { }

  ngOnInit(): void {
    this._dataService.getRecords()
      .subscribe(
        data => {
          data.sort((a, b) => {
            if (a.score < b.score)
              return 1;
            if (a.score > b.score)
              return -1;
            return 0;
          })

          this.records = data
        }
      );
  }

}
