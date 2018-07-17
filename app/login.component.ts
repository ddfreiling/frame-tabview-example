// tslint:disable-next-line:ordered-imports
import { AfterContentInit, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { NSLocationStrategy } from 'nativescript-angular/router/ns-location-strategy';


@Component({
  moduleId: module.id,
  // tslint:disable-next-line:component-selector
  selector: 'ns-login',
  templateUrl: './login.component.html',
})

export class LoginComponent {

  constructor(private routerExt: RouterExtensions, private route: ActivatedRoute) {
    console.log('Login::constructor');
  }

  public showTabs() {
    console.log('Login::showTabs');
  }
}
