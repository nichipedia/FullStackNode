"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var app_component_1 = require("./app.component");
var sign_in_component_1 = require("./sign_in/sign-in.component");
var sign_up_component_1 = require("./sign_up/sign-up.component");
var router_1 = require("@angular/router");
var page_not_found_component_1 = require("./page_not_found/page-not-found.component");
var home_component_1 = require("./home/home.component");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule,
            router_1.RouterModule.forRoot([{ path: 'home', component: home_component_1.HomeComponent },
                { path: 'sign-in', component: sign_in_component_1.SignInComponent },
                { path: 'sign-up', component: sign_up_component_1.SignUpComponent },
                { path: '', redirectTo: 'home', pathMatch: 'full' },
                { path: '**', component: page_not_found_component_1.PageNotFoundComponent }], { useHash: true })
        ],
        declarations: [app_component_1.AppComponent, sign_up_component_1.SignUpComponent, sign_in_component_1.SignInComponent, page_not_found_component_1.PageNotFoundComponent, home_component_1.HomeComponent],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map