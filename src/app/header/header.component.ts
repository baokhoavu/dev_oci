import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  logoUrl = '/images/content/pagebuilder/rcto_2018_logo_rgb_full_400x178.png';

  constructor(private data: DataService) {}

  ngOnInit() {}
  // Calling on the isLoggedIn() function from the global data service to check the logged in state
  isLoggedIn() {
    return this.data.isLoggedIn();
  }
}
