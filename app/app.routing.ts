import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';

import { LoginComponent } from '~/login.component';
import { PlayerDetailComponent } from '~/player/player-detail.component';
import { PlayerComponent } from '~/player/players.component';
import { TabsComponent } from '~/tabs.component';
import { TeamDetailComponent } from '~/team/team-detail.component';
import { TeamsComponent } from '~/team/teams.component';

export const COMPONENTS = [PlayerComponent, PlayerDetailComponent, TeamsComponent, TeamDetailComponent, LoginComponent, TabsComponent];

const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  { path: 'tabs', component: TabsComponent, children: [
    { path: '', redirectTo: '/tabs/(playerTab:/tabs/players//teamTab:/tabs/teams)', pathMatch: 'full' },

    { path: 'players', component: PlayerComponent, outlet: 'playerTab'  },
    { path: 'player/:id', component: PlayerDetailComponent, outlet: 'playerTab'  },

    { path: 'teams', component: TeamsComponent, outlet: 'teamTab' },
    { path: 'team/:id', component: TeamDetailComponent, outlet: 'teamTab' },
  ] },
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
