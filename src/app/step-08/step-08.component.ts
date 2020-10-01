import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2
} from '@angular/core';
import { Router } from '@angular/router';

/* HTTP Client to retrieve data */
import {
  HttpClient,
  HttpRequest,
  HttpEvent,
  HttpEventType
} from '@angular/common/http';

/* Data Service */
import { DataService } from '../data.service';

/* Angular Material */
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-step-08',
  templateUrl: './step-08.component.html',
  styleUrls: ['./step-08.component.scss']
})
export class Step08Component implements OnInit, OnDestroy, AfterViewInit {
  // Setting the FlowStep
  flowStep = '7';
  flowStepResults: any = {};
  getFlowStepNumber: string;

  // Survey Data and Variables
  surveyResults: any = {};
  preReg: string;
  pickup: string;
  pickupb: string;
  years: string;
  jersey: string;
  vest: string;
  shirt: string;
  virtual: string;
  virtualT: string;
  virtualP : string;
  timeslot: string;

  // Registration Data
  regData: any = {};

  // Check-in Status Data
  updateRegRes: any = {};

  // Variable for Timeout Function
  timeOut: any;
  timeOut2: any;

  constructor(
    public data: DataService,
    private http: HttpClient,
    private router: Router,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getSurveyRes();
    // this.checkTenting();
    window.scrollTo(0, 0);

    // Setting a timeout function to log inactive users out (for privacy protection)
    this.timeOut = setTimeout(() => {
      this.snackBar.open(
        `Need more time? For your security, you've been logged out of your check-in session. To continue your online check-in, simply return to the login screen.`,
        'Close',
        {
          duration: 15000,
          panelClass: ['error-info']
        }
      );
      this.timeOut2 = setTimeout(() => {
        this.data.logOut();
      }, 240000);
    }, 858000);

    // Checking logged in state, and running correct functions
    if (this.data.isLoggedIn() === true && this.data.tokenExpired === false) {
      // If user is logged in, then get the current flowStep (to prevent people from skipping pages)
      this.getFlowStep();
    } else if (this.data.storageToken === undefined) {
      this.snackBar.open(
        'Login session expired, please login again.',
        'Close',
        {
          duration: 3500,
          panelClass: ['error-info']
        }
      );
      this.router.navigate(['/step-01']);
    } else {
      // if not logged in, go back to step 1 (login page)
      this.snackBar.open('You are not logged in, please login.', 'Close', {
        duration: 3500,
        panelClass: ['error-info']
      });
      this.router.navigate(['/step-01']);
    }
  }

  ngAfterViewInit() {}

  // Clear the timeout function upon entering a new route
  ngOnDestroy() {
    clearTimeout(this.timeOut);
  }

  // Get the Survey Responses
  getSurveyRes() {
    this.data.method =
      'CRTeamraiserAPI?method=getSurveyResponses&api_key=cfrca&v=1.0&fr_id=' +
      this.data.eventID +
      (this.data.isManualLogin === true ? '&sso_auth_token=' : '&auth=') +
      this.data.ssoToken +
      '&survey_id=' +
      this.data.surveyID +
      '&response_format=json';
    this.http.post(this.data.convioURL + this.data.method, null).subscribe(
      res => {
        this.surveyResults = res;
        // Accepted Upsell Offer (for Pre-register question)
        for (const result of this.surveyResults.getSurveyResponsesResponse
          .responses) {
          
          if (result.questionId === this.data.question1) {
            this.years = result.responseValue;
          }
          
          if (result.questionId === this.data.question2) {
            this.jersey = result.responseValue;
          }

          if (result.questionId === this.data.question3) {
            this.shirt = result.responseValue;
          }

          if (result.questionId === this.data.question4) {
            this.vest = result.responseValue;
          }

          // if (result.questionId === this.data.question5) {
            
            // if ( result.responseValue === 'Classic Route Toronto to Hamilton 105' ) {
            //   this.pickup = 'Classic Route – from Toronto to Hamilton – 105.98km'
            // } else if ( result.responseValue === 'Classic Route Hamilton to Niagara 115' ) {
            //   this.pickup = 'Classic Route – from Hamilton to Niagara Falls – 115.73km'
            // } else if ( result.responseValue === 'Hammer Route Toronto to Hamilton 159' ) {
            //   this.pickup = 'Hammer Route – from Toronto to Hamilton – 159.63km'
            // } else if ( result.responseValue === 'Mississauga out and back 73' ) {
            //   this.pickup = 'Mississauga out and back – 73.07km'
            // } else if ( result.responseValue === 'Mississauga out and back 25' ) {
            //   this.pickup = 'Mississauga out and back – 25.36km'
            // } else if ( result.responseValue === 'Niagara out and back 76' ) {
            //   this.pickup = 'Niagara out and back – 76.40km'
            // } else if ( result.responseValue === 'Hamilton 50 out and back 78' ) {
            //   this.pickup = 'Hamilton 50 out and back – 78.81km'
            // } else if ( result.responseValue === 'Hamilton Sydney out and back 22' ) {
            //   this.pickup = 'Hamilton Sydenham out and back – 22.31km'
            // } else if ( result.responseValue === 'Toronto River Trail 98' ) {
            //   this.pickup = 'Toronto River Trail System – 98.19km'
            // } else if ( result.responseValue === 'The Don and Lakefront Trail 58' ) {
            //   this.pickup = 'The Don and Lakefront Trail Route – 58.11km'
            // } else if ( result.responseValue === 'One of the other shared routes found in our Strava club' ) {
            //   this.pickup = result.responseValue;
            // } else if ( result.responseValue === 'I will be riding my own route' ) {
            //   this.pickup = result.responseValue;
            // } 
          // }

          if (result.questionId === this.data.question15) {

            if ( 
              result.responseValue === 'Friday August 21, 12:00 PM to 4:00 PM' || 
              result.responseValue === 'Friday August 21, 12:00 PM to 4:00 PM Scarborough' 
            ) {
              this.pickup = 'Scarborough – Lawrence Ave E and Warden Ave – Drive and Park Location';
            } else if ( 
              result.responseValue === 'Saturday August 22, 12:00 PM to 4:00 PM' || 
              result.responseValue === 'Saturday August 22, 12:00 PM to 4:00 PM North York'
            ) {
              this.pickup = 'North York – Yonge and 401 - Walk Thru Location';
            } else if ( 
              result.responseValue === 'Monday August 24, 4:00 PM to 6:00 PM' ||
              result.responseValue === 'Monday August 24, 4:00 PM to 6:00 PM Midtown Toronto'
            ) {
              this.pickup = 'Midtown Toronto - Yonge and Eglinton – Walk Thru Location';
            } else if ( 
              result.responseValue === 'Wednesday August 26, 5:30 PM to 8:30 PM' ||
              result.responseValue === 'Wednesday August 26, 5:30 PM to 8:30 PM Midtown Toronto'
            ) {
              this.pickup = 'Midtown Toronto - Yonge and Eglinton – Walk Thru Location';
            } else if ( 
              result.responseValue === 'Friday August 28, 4:00 PM to 7:00 PM' ||
              result.responseValue === 'Friday August 28, 4:00 PM to 7:00 PM Midtown Toronto'
            ) {
              this.pickup = 'Midtown Toronto - Yonge and Eglinton – Walk Thru Location';
            } else if ( 
              result.responseValue === 'Tuesday August 25, 3:00 PM to 7:00 PM' ||
              result.responseValue === 'Tuesday August 25, 3:00 PM to 7:00 PM Mississauga'
            ) {
              this.pickup = 'Mississauga – Dundas St E and Dixie Rd – Drive Thru Location';
            } else if ( 
              result.responseValue === 'Thursday August 27, 3:00 PM to 7:00 PM' ||
              result.responseValue === 'Thursday August 27, 3:00 PM to 7:00 PM Mississauga'
            ) {
              this.pickup = 'Mississauga – Dundas St E and Dixie Rd – Drive Thru Location';
            } else if ( 
              result.responseValue === 'Friday August 28, 4:00 PM to 7:00 PM' ||
              result.responseValue === 'Friday August 28, 4:00 PM to 7:00 PM Mississauga'
            ) {
              this.pickup = 'Mississauga – Dundas St E and Dixie Rd – Drive Thru Location';
            } else if ( 
              result.responseValue === 'Wednesday August 26, 4:00 PM to 7:00 PM' ||
              result.responseValue === 'Wednesday August 26, 4:00 PM to 7:00 PM Oshawa'
            ) {
              this.pickup = 'Oshawa – Taunton Rd E and Wilson Rd N Oshawa';
            } else if ( 
              result.responseValue === 'Wednesday, August 26, 4:00 PM to 7:00 PM' ||
              result.responseValue === 'Wednesday, August 26, 4:00 PM to 7:00 PM Hamilton'
            ) {
              this.pickup = 'Hamilton (TBD)';
            } else if ( 
              result.responseValue === 'Thursday August 27, 2:00 PM to 7:00 PM' ||
              result.responseValue === 'Thursday August 27, 2:00 PM to 7:00 PM Niagara Falls'
            ) {
              this.pickup = 'Niagara Falls';
            } else if ( result.responseValue === 'Friday August 28, 4:00 PM to 7:00' ) {
              this.pickup = '';
            } else if ( result.responseValue === 'Wednesday August 26, 4:00 PM to 7:00 PM' ) {
              this.pickup = '';
            } 
            
            this.timeslot = result.responseValue;
          }

          // if (result.questionId === this.data.question6) {
          //   if (result.responseValue.length > 0) {
          //     console.log(result.responseValue)
          //     this.virtualT = result.responseValue;
          //   } else {
          //     this.virtualT = '';
          //   }
          // }

          if (result.questionId === this.data.question5) {
            if (result.responseValue === '[object Object]') {
              // this.virtualP = '';
              this.virtual = '';
            } else {
              this.virtual = result.responseValue;
              // this.virtualP = result.responseValue;
            }
          }

          // if (this.virtualT === '') {
          //   this.virtual = this.virtualP;
          // } else {
          //   this.virtual = this.virtualP + ' - ' + this.virtualT;
          // }

          
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  // Update the current Flowstep
  updateFlowStep() {
    this.data.method =
      'CRTeamraiserAPI?method=updateRegistration&api_key=cfrca&v=1.0&fr_id=' +
      this.data.eventID +
      (this.data.isManualLogin === true ? '&sso_auth_token=' : '&auth=') +
      this.data.ssoToken +
      '&flow_step=' +
      this.flowStep +
      '&response_format=json';
    this.http.post(this.data.convioURL + this.data.method, null).subscribe(
      res => {},
      err => {
        if (err) {
          console.log(err);
        }
      }
    );
  }

  // Set checkInStatus as Complete
  updateCheckInStatusComplete() {
    this.data.method =
      'CRTeamraiserAPI?method=updateRegistration&api_key=cfrca&v=1.0' +
      '&fr_id=' +
      this.data.eventID +
      (this.data.isManualLogin === true ? '&sso_auth_token=' : '&auth=') +
      this.data.ssoToken +
      '&checkin_status=complete' +
      '&response_format=json';
    this.http
      .post(this.data.convioURL + this.data.method, null)
      .subscribe(res => {
        this.updateRegRes = res;
      });
  }

  // Get the current Flowstep
  getFlowStep() {
    const token = localStorage.getItem('token');
    this.data.method =
      'CRTeamraiserAPI?method=getFlowStep&api_key=cfrca&v=1.0&response_format=json&fr_id=' +
      this.data.eventID +
      (this.data.isManualLogin === true ? '&sso_auth_token=' : '&auth=') +
      token;
    this.http.post(this.data.convioURL + this.data.method, null).subscribe(
      res => {
        this.flowStepResults = res;
        this.getFlowStepNumber = this.flowStepResults.getFlowStepResponse.flowStep;

        // Checking the participants flow step to prevent user from skipping a flowstep
        if (this.getFlowStepNumber === this.flowStep) {
          // If the flow step matches to where they are supposed to be, then run the functions for the current route below
          this.updateFlowStep();
          this.updateCheckInStatusComplete();
          this.getSurveyRes();
          this.data.getUserInfo();
          this.data.getRegInfo();
          this.data.getTeam();
        } else {
          // If flowstep does not match, show error message and send them back to the previous page/flowstep.
          this.snackBar.open(
            'You have been redirected to your previously saved location.',
            'Close',
            {
              duration: 3500,
              panelClass: ['routing-info']
            }
          );

          // Check the Flowstep, if matched, send them to the proper route
          if (this.getFlowStepNumber === '0') {
            this.router.navigate(['/step-02']);
          }
          if (this.getFlowStepNumber === '1') {
            this.router.navigate(['/step-02']);
          }
          if (this.getFlowStepNumber === '2') {
            this.router.navigate(['/step-03']);
          }
          if (this.getFlowStepNumber === '3') {
            this.router.navigate(['/step-04']);
          }
          if (this.getFlowStepNumber === '4') {
            this.router.navigate(['/step-05']);
          }
          if (this.getFlowStepNumber === '5') {
            this.router.navigate(['/step-06']);
          }
          if (this.getFlowStepNumber === '6') {
            this.router.navigate(['/step-07']);
          }
          if (this.getFlowStepNumber === '7') {
            this.router.navigate(['/step-08']);
          }
          // if (this.getFlowStepNumber === '8') {
          //   this.router.navigate(['/step-09']);
          // }
        }
      },
      err => {
        // console.log(err);

        // If flowstep has error, log out the user (to prevent API errors)
        this.data.logOut();
      }
    );
  }

  // Print Method
  print() {
    window.print();
  }
}
