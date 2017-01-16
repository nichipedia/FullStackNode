import { Component } from '@angular/core';

@Component({
    selector: 'pm-app',
    templateUrl: `./app/app.component.html`
})
export class AppComponent { 
    company: string = '2016 Moran Studios';
    projectName: string = 'Full Stack Javascript';
}
