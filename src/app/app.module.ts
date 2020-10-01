import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkTableModule } from '@angular/cdk/table';

// HTTP Methods and Modules
import {
  HttpClientModule,
  HttpClient,
  HttpRequest
} from '@angular/common/http';

// Routing Modules
import { AppRoutingModule } from './app-routing.module';

// Data Service
import { DataService } from './data.service';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { StepperComponent } from './stepper/stepper.component';
import { Step01Component } from './step-01/step-01.component';
import {
  Step02Component,
  Step02DialogComponent,
  Step02HammerDialogComponent
} from './step-02/step-02.component';
import { Step03Component } from './step-03/step-03.component';
import { Step04Component } from './step-04/step-04.component';
import { Step05Component } from './step-05/step-05.component';
import { Step06Component } from './step-06/step-06.component';
import { Step07Component } from './step-07/step-07.component';
import { Step08Component } from './step-08/step-08.component';
import { ApiComponent } from './api/api.component';
// import { Step08Component, Step08DialogComponent } from './step-08/step-08.component';
// import { Step09Component } from './step-09/step-09.component';

@NgModule({
  exports: [
    CdkTableModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    BrowserModule
  ],
  declarations: []
})
export class ngMaterialModule {}

@NgModule({
  declarations: [
    AppComponent,
    Step01Component,
    Step02Component,
    Step02DialogComponent,
    Step02HammerDialogComponent,
    Step03Component,
    Step04Component,
    Step05Component,
    Step06Component,
    Step07Component,
    Step08Component,
    // Step08DialogComponent,
    // Step09Component,
    HeaderComponent,
    StepperComponent,
    ApiComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ngMaterialModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  entryComponents: [
    Step02DialogComponent,
    Step02HammerDialogComponent
    // Step08DialogComponent
  ],
  providers: [DataService, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule {}
