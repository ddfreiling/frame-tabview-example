import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataService, DataItem } from '../data.service';
import { Subscription } from 'rxjs';
import { RouterExtensions } from 'nativescript-angular/router';

@Component({
  selector: 'ns-player-details',
  moduleId: module.id,
  templateUrl: './player-detail.component.html',
})
export class PlayerDetailComponent implements OnInit {
  player: DataItem;
  subscription: Subscription;
  
  constructor(
    private data: DataService,
    private router: RouterExtensions,
    private route: ActivatedRoute
  ) { }
  
  ngOnInit(): void {
    this.subscription = this.route.params.subscribe(params => {
      const id = +params['id'];
      this.player = this.data.getPlayer(id);
    })
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
  navigatePrev() {
    if (this.player.id > 1) {

      this.router.navigate(
        ['../', this.player.id - 1],
        { relativeTo: this.route }
      );

    }
  }
  navigateNext() {
    if (this.player.id < 6) {

      this.router.navigate([{
        outlets: {
          playerTab: ['player', this.player.id + 1]
        }
      }]);
      
    }
  }
  
  navigateToPlayer(id: number) {
    this.router.navigate(['../', id], { relativeTo: this.route });
  }
  
  navigateToPlayers() {
    this.router.navigate(['../../players'], { relativeTo: this.route, clearHistory: true });
  }
}
