import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-assets',
  templateUrl: './my-assets.component.html'
})
export class MyAssetsComponent implements OnInit {
  @Input() assets = [];
  assetesTableColumns: string[] = ['coinFullName','availableAmount','action'];

  constructor() { }

  ngOnInit(): void {
  }
  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
