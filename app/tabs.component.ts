// tslint:disable-next-line:ordered-imports
import { AfterContentInit, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';
import { TabViewDirective } from 'nativescript-angular/directives';
import { RouterExtensions } from 'nativescript-angular/router';
import { NSLocationStrategy } from 'nativescript-angular/router/ns-location-strategy';


@Component({
  moduleId: module.id,
  // tslint:disable-next-line:component-selector
  selector: 'ns-tabs',
  templateUrl: './tabs.component.html',
})

export class TabsComponent implements OnInit, AfterContentInit {

  private isInitialNavigation = true;

  @ViewChild(TabViewDirective) tabView: TabViewDirective;

  constructor(private router: Router, private routerExt: RouterExtensions, private location: NSLocationStrategy) {
    console.log('Tabs::constructor');
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.isInitialNavigation = false;
        console.log('[ROUTER]: ' + e.toString());
        console.log(location.toString());
      }
    });
    this.router.navigate([{
      outlets: {
        playerTab: ['players'],
        teamTab: ['teams'],
      }
    }]);
  }

  ngAfterContentInit(): void {
    console.log('ngAfterContentInit');
  }
  ngOnInit(): void {
    console.log('ngOnInit');
  }

  public showTabs() {
    console.log('Tabs::showTabs');
  }
}
