import { Component, OnInit } from '@angular/core';
import { DataService, DataItem } from '../data.service';
import { RouterExtensions } from 'nativescript-angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ns-players',
  moduleId: module.id,
  templateUrl: './players.component.html',
})
export class PlayerComponent implements OnInit {
  items: DataItem[];
  
  constructor(
    private itemService: DataService,
    private router: RouterExtensions,
    private route: ActivatedRoute
  ) { }
  
  ngOnInit(): void {
    this.items = this.itemService.getPlayers();
  }
  
  navigateToPlayer(id: number) {
    this.router.navigate(['../player', id], { relativeTo: this.route });
  }
  
  navigatePlayerOne() {
    this.router.navigate(
      ['../player', 1],
      {
        relativeTo: this.route,
        transition: { name: 'flip', duration: 1200 }
      }
    );
  }
  
  navigateWithOutlet() {
    this.router.navigate([{
      outlets: {
        playerTab: ['player', 2]
      }
    }]);
  }
  
  navigateTeamOutlet(id: number) {
    this.router.navigate([{
      outlets: {
        teamTab: ['team', id] 
      }
    }]);
  }

  navigateTeamUrl(id: number) {
    this.router.navigateByUrl(`/(playerTab:players//teamTab:team/${id})`);
  }
  
  navigateOutlets(playerId: number, teamId: number) {
    this.router.navigate([{
      outlets: { 
        playerTab: ['player', playerId],
        teamTab: ['team', teamId],
      }
    }]);
  }
}
