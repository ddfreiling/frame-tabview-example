# frame-tabview-example

In order to implement TabView Navigation, we need multiple `Named Page Router Outlets`, this feature is not part of `nativescript-angular: 5.3`, which is the latest official version of this npm module at the time of writing this article. 
This is going to be officially available in `nativescript-angular: 6.0`, so for now we are going to use `nativescript-angular@next`.

## Named Page Router Outlet

Named Page Router Outlet is simply a `page-router-outlet` with a `name` property, like this:

```
<page-router-outlet name="myTab"></page-router-outlet>
```

The name allows us to link each Page Router Outlet to an `outlet` in our `Routes configuration`. (See the `app.routing.ts` section for more details)


## app.component.html

So, for example if envisioned an app to work with two tabs:

 * `playerTab`
 * `teamTab`

Then we would need to add a TabView to `app.component.html` with two named `page-router-outlet` components.

```
<TabView androidTabsPosition="bottom">
  <page-router-outlet 
    *tabItem="{title: 'Players'}" 
    name="playerTab">
  </page-router-outlet>

  <page-router-outlet
    *tabItem="{title: 'Teams'}" 
    name="teamTab">
  </page-router-outlet>
</TabView>
```

## app.routing.ts

Now we need to configure our routes. This is very similar to a regular `routes configuration`.


Here are our paths without `multiple` page-router-outlets:

```
const routes: Routes = [
  { path: '', redirectTo: '/players', pathMatch: 'full' },
  
  { path: 'players', component: PlayerComponent },
  { path: 'player/:id', component: PlayerDetailComponent },
  
  { path: 'teams', component: TeamsComponent},
  { path: 'team/:id', component: TeamDetailComponent },
];
```

First we need to add the `outlet` property to each path, to assign it to a specific router outlet. For example, for the `players` path, we need to assign it to `playerTab`, like this:

```
{ path: 'players', component: PlayerComponent, outlet: 'playerTab' },
```

Then we need to update the default (`redirectTo`) path. Like this:

```
{ path: '', redirectTo: '/(playerTab:players//teamTab:teams)', pathMatch: 'full' },
```

Note, that:

 * first we navigate to '/', which is for AppComponent,
 * then in `( )`, we define:
 	* each outlet default using syntax of: `tabname:path`
 	* each outlet default is separated with `//`


Here is the full configuration, for our example:

```
const routes: Routes = [
  { path: '', redirectTo: '/(playerTab:players//teamTab:teams)', pathMatch: 'full' },
  
  { path: 'players', component: PlayerComponent, outlet: 'playerTab'  },
  { path: 'player/:id', component: PlayerDetailComponent, outlet: 'playerTab'  },
  
  { path: 'teams', component: TeamsComponent, outlet: 'teamTab' },
  { path: 'team/:id', component: TeamDetailComponent, outlet: 'teamTab' },
];
```

Now, we just need to create all 4 components and we should be ready to go.

### app.routing.ts - (other example)

If we had an app with a `Login Page`, and a `Tabs Page`, then our configuration would look something like this:

```
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  //{ path: '', redirectTo: '/tabs/(playerTab:players//teamTab:teams)', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'tabs', component: TabsComponent, children: [
    { path: 'players', component: PlayerComponent, outlet: 'playerTab'  },
    { path: 'player/:id', component: PlayerDetailComponent, outlet: 'playerTab'  },
  
    { path: 'teams', component: TeamsComponent, outlet: 'teamTab' },
    { path: 'team/:id', component: TeamDetailComponent, outlet: 'teamTab' },
  ]}
];
```

## Navigation - from Component Class

The final piece of the puzzle is navigation.

To navigate from component class we need to inject `RouterExtensions` and `ActivateRoute`,

```
import { RouterExtensions } from 'nativescript-angular/router';
import { ActivatedRoute } from '@angular/router';
...
export class PlayerComponent {
...
  constructor(
    private router: RouterExtensions,
    private route: ActivatedRoute
  ) { }
...
}
```

 * navigate - using relative path - from `players` to `player/:id`:

When we navigate, we can provide `{ relativeTo: this.route }`, this gives the router the context to know which `page-router-outlet` it should be navigating. As a result we can simply navigate by calling this:


```
navigateToPlayer(id: number) {
  this.router.navigate(['../player', id], { relativeTo: this.route });
}
```

> Note: `../<sibling>` is a way to reference a sibling path. This is how you can navigate from `home/a` to `home/b`, by providing the `../b` path.

 * navigate - clear history - from `player/x` to `players`:

Each time you navigate, the `navigation stack` gets updated. As a result iOS gives you a back button in ActionBar, and Android allows you to go back with the System Back Button.

This is not useful when you are just navigating back to the home or default page. Luckily, you can avoid that by adding the `clearHistory: true` property. 
```
navigateToPlayers() {
  this.router.navigate(['../../players'], { relativeTo: this.route, clearHistory: true });
}
```

> Note #1: `clearHistory` will only clear the history for the `page-router-outlets` that are navigated. So when you navigate in the `playersTab outlet`, `teamsTab outlet` remains unchanged. 

<!---->

> Note #2: when you try to navigate from `pageA/param` to `../pageB` will take you to `pageA/pageB` and fail. Since we have a parameter in our current path, we need to also escape it by navigating to `../../pageB`.

 * navigate - using absolute path:

We can also navigate using absolute path. This is done with the `outlets` property, and the name of the outlet we need, together with the path we want it to navigate to, like this:

```
this.router.navigate([{
  outlets: {
    outletName: ['path']
  }
}]);
```

 * navigate - using absolute path - from `players` to `player/x`:

```
navigatePlayerOutlet(id: number) {
  this.router.navigate([{
    outlets: {
      playerTab: ['player', id] 
    }
  }]);
}
```

> Note: each param of the route have to provided separately:
> 
> Good: `playerTab: ['player', id]`
> 
> Bad: `playerTab: ['player/id'] `

 * navigate - using absolute path - in another tab - from `players` to `team/x`:

You can also navigate in another outlet, like this:

```
navigateTeamOutlet(id: number) {
  this.router.navigate([{
    outlets: {
      teamTab: ['team', id] 
    }
  }]);
}
```

> Note: this is not going to switch the tab to the `Team Tab`, however after you navigate there, the `Team Tab` will be showing `team/id`.

 * navigate - using absolute path - multiple outlets: from `players` to `player/x` and `team/x`

```
navigateOutlets(playerId: number, teamId: number) {
  this.router.navigate([{
    outlets: { 
      playerTab: ['player', playerId],
      teamTab: ['team', teamId],
    }
  }]);
}
```

 * navigate with Url - from `players` to `team/x`

This approach is usually used when we are going to update all outlets. The syntax is the same the one we used for `redirectTo` in `app.routing.ts`.

In this case it allows us to navigate in the teamTab to `team/id`, while keeping the playerTab at `players`.

```
navigateTeamUrl(id: number) {
  this.router.navigateByUrl(`/(playerTab:players//teamTab:team/${id})`);
}
```

 * navigate - using relative path - to the same path, but with a different param - from `player/x` to `player/y`

To do that, we just need to go back one step `../`, which will take us to `/player`, and then provide the new id. Like this:

```
navigateToPlayer(id: number) {
  this.router.navigate(['../', id], { relativeTo: this.route });
}
```

 * navigate - using absolute path - to the same path, but with a different param - from `player/x` to `player/x+1`

When navigating using absolute path, there is no way for us to tell the router to stay at the same path. Therefore we have to provide the full path each time.

```
navigateNext() {
  this.router.navigate([{
    outlets: {
      playerTab: ['player', this.player.id + 1]
    }
  }]);
}
```


## Navigation - from Component Template

We can also navigate directly from html. This is done with the support of the `nsRouterLink` property.

> Note: nsRouterLink can be used on any component: Button, Label or even StackLayout.

 * navigate - using fixed relative path - from `teams` to `team/1`:

When we use relative path, the router will automatically assume that you want to navigate in the same `page-router-outlet`.

Here is how we navigate from `teams` to `team/1`. First we need `../` to move one step back, and then add `team/1`, like this: 

```
<Button
  text="Open Team One"
  nsRouterLink="../team/1">
</Button>
```

* navigate - with pageTransition - from `teams` to `team/2`

```
<Button
  text="Open Team Two with Animation"
  nsRouterLink="../team/2"
  pageTransition="flip"
  pageTransitionDuration="3000">
</Button>
```

 * navigate - using relative path - with a param - from `teams` to `team/x`:

When you want to add a param, that should be extracted from a variable, we need to use `[ ]` around the `nsRouterLink`, and then provide the navigation as an array of items.

To navigate from `teams` to `team/id`, first we need `['../team'` path to the team, and then the param value `team.id]`, like this: 

```
<ListView [items]="items" class="list-group">
  <ng-template let-team="item">
    <Label
      [text]="team.name"
      [nsRouterLink]="['../team', team.id]">
    </Label>
  </ng-template>
</ListView>
```

 * navigate - using absolute path - from `teams` to `team/5`:

To navigate using relative paths, we need to provide an array with:

   1. path to where the component with our tabview is: `'/'`
   2. an object with `outlets` configuration, with the outlet name that we need to navigate

```
<Button
  text="Navigate using Outlet"
  [nsRouterLink]="['/', { outlets: { teamTab: ['team', 5] } }]">
</Button>
```

 * navigate - using absolute path - in another outlet - from `teams` to `player/5`:

This also works, when we want to navigate in `page-router-outlet` that is in another tab, like this:

```
<Button
  text="Navigate in Players Tab"
  [nsRouterLink]="['/', { outlets: { playerTab: ['player', 5] } }]">
</Button>
```

> Note: that this will change the content of the `playerTab`, but it won't change the current tab to the `Players Tab`.

 * navigate - using absolute path - with multiple outlets - from `teams` to `team/6` and `player/6`:

To make it better, you can even navigate multiple outlets in one go. Like this:

```
<Button
  text="Navigate in Two Outlets"
  [nsRouterLink]="['/', { outlets: { teamTab: ['team', 6], playerTab: ['player', 6] } }]">
</Button>
```

 * navigate - using relative path - to the same path, but with a different param - from `team/x` to `team/x+1`

When you need to re-navigate to the same page, but with a different param, you just need to go back one step with `../` and then provide the new param. Like this:

```
<Button
  text="prev"
  [nsRouterLink]="['../', team.id - 1]">
</Button>
```

 * navigate - using absolute path - to the same path, but with a different param - from `team/x` to `team/x+1`

When you need to re-navigate to the same page, using absolute path, you need to provide the full path each time. Like this:

```
<Button
  text="next"
  [nsRouterLink]="['/', { outlets: { teamTab: ['team', team.id + 1] } }]">
</Button>
```

 * navigate - back home - clear history - from `team/x` to `teams`

Finally, when you need to navigate back to the home component, you also might want to clear the navigation stack, so that iOS will remove the back button. This is done by adding `clearHistory="true", like this:

```
<Button
  text="Back to Teams"
  [nsRouterLink]="['../../teams']"
  clearHistory="true">
</Button>
```