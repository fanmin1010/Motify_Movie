import { NgModule } from '@angular/core';

import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TrendComponent } from './trend/trend.component';
import { SearchComponent } from './search/search.component';
import { SharedModule } from './shared';
import { LoginComponent } from  './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { User } from './shared/user/user';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { InitRecommComponent } from './initRecomm/initRecomm.component';
import { Recommendation } from './shared/recommendation/recommendation.component';
import { HomeRecommDetailComponent } from './homeRecommDetail/homeRecommDetail';
import { MovieDetailPage } from "./shared/moviedetailpage/moviedetailpage";

@NgModule({
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    SharedModule,
    NativeScriptHttpModule,
    NativeScriptFormsModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    TrendComponent,
    SearchComponent,
    LoginComponent,
      LogoutComponent,
      InitRecommComponent,
      HomeRecommDetailComponent
  ],
  bootstrap: [AppComponent],
    providers: [User, Recommendation,MovieDetailPage]
    // bootstrap: [LoginComponent]
})
export class AppModule {

}
