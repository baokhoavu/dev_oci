import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators
} from '@angular/forms';
import {
  HttpClient,
  HttpRequest,
  HttpEvent,
  HttpEventType
} from '@angular/common/http';
import { ErrorStateMatcher } from '@angular/material/core';

import { DataService } from '../data.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-step-04',
  templateUrl: './step-04.component.html',
  styleUrls: ['./step-04.component.scss']
})
export class Step04Component implements OnInit, OnDestroy, AfterViewInit {
  step03Form: FormGroup;
  step04Form: FormGroup;
  matcher = new MyErrorStateMatcher();
  buttonStatus: boolean = true;
  remember: boolean = false;
  getInfo: any = {};

  // Flowstep
  flowStep = '3';
  flowStepResults: any = {};
  getFlowStepNumber: string;

  // Results from HTTP calls set as Objects for OOP
  surveyResults: any = {};
  regRes: any = {};

  // DOM Element Responses from Profile
  pCancerRes: string;
  pVegRes: string;
  pJerseyRes: string;

  // DOM Element Responses
  cancerRes: string;
  packetRes: string;
  vegRes: string;
  bikeRes1: string;
  bikeRes2: string;
  bikeRes3: string;
  jerseyRes: string;
  attendanceRes: string;
  routeRes: string;
  rewardRes: string;
  experiencedRiderRes: string;
  glutenRes: string;
  safetyRes: string;

  routeError: boolean = false;
  zwiftError: boolean = false;
  ownError: boolean = false;
  rewardError: boolean = false;

  // new survey questions
  pickupDepot1: string;
  pickupDepot2: string;
  pickupDepot3: string;
  pickupDepot4: string;
  pickupDepot5: string;
  sharedRoute: string;
  zwiftMeeting: string;
  selfParticipation: string;

  // Variable to hide elements
  hideMe: boolean = true;

  // Select Options for Yes/No
  matSelect = [
    {
      value: 'Yes',
      viewValue: 'Yes'
    },
    {
      value: 'No',
      viewValue: 'No'
    }
  ];

  Rewards = [
    // {
    //   value: 'Friday August 21, 12:00 PM to 4:00 PM Scarborough',
    //   viewValue: 'Friday August 21, 12:00 PM to 4:00 PM'
    // },
    // {
    //   value: 'Saturday August 22, 12:00 PM to 4:00 PM North York',
    //   viewValue: 'Saturday August 22, 12:00 PM to 4:00 PM'
    // },
    // {
    //   value: 'Monday August 24, 4:00 PM to 6:00 PM Midtown Toronto',
    //   viewValue: 'Monday August 24, 4:00 PM to 6:00 PM'
    // },
    // {
    //   value: 'Wednesday August 26, 5:30 PM to 8:30 PM Midtown Toronto',
    //   viewValue: 'Wednesday August 26, 5:30 PM to 8:30 PM'
    // },
    {
      value: 'Friday August 28, 4:00 PM to 7:00 PM Midtown Toronto',
      viewValue: 'Friday August 28, 4:00 PM to 7:00 PM'
    },
    // {
    //   value: 'Tuesday August 25, 3:00 PM to 7:00 PM Mississauga',
    //   viewValue: 'Tuesday August 25, 3:00 PM to 7:00 PM'
    // },
    {
      value: 'Thursday August 27, 3:00 PM to 7:00 PM Mississauga',
      viewValue: 'Thursday August 27, 3:00 PM to 7:00 PM'
    },
    {
      value: 'Friday August 28, 4:00 PM to 7:00 PM Mississauga',
      viewValue: 'Friday August 28, 4:00 PM to 7:00 PM'
    },
    // {
    //   value: 'Wednesday August 26, 4:00 PM to 7:00 PM Oshawa',
    //   viewValue: 'Wednesday August 26, 4:00 PM to 7:00 PM'
    // },
    // {
    //   value: 'Wednesday August 26, 4:00 PM to 7:00 PM Hamilton',
    //   viewValue: 'Wednesday August 26, 4:00 PM to 7:00 PM'
    // },
    {
      value: 'Thursday August 27, 2:00 PM to 7:00 PM Niagara Falls',
      viewValue: 'Thursday August 27, 2:00 PM to 7:00 PM'
    }
  ]

  // shared route options
  sharedRouteSelector = [
    {
      value: 'Classic Route Toronto to Hamilton 105',
      viewValue: 'Classic Route – from Toronto to Hamilton – 105.98km'
    },
    {
      value: 'Classic Route Hamilton to Niagara 115',
      viewValue: 'Classic Route – from Hamilton to Niagara Falls – 115.73km'
    },
    {
      value: 'Hammer Route Toronto to Hamilton 159',
      viewValue: 'Hammer Route – from Toronto to Hamilton – 159.63km'
    },
    {
      value: 'Mississauga out and back 73',
      viewValue: 'Mississauga out and back – 73.07km'
    },
    {
      value: 'Mississauga out and back 25',
      viewValue: 'Mississauga out and back – 25.36km'
    },
    {
      value: 'Niagara out and back 76',
      viewValue: 'Niagara out and back – 76.40km'
    },
    {
      value: 'Hamilton 50 out and back 78',
      viewValue: 'Hamilton 50 out and back – 78.81km'
    },
    {
      value: 'Hamilton Sydney out and back 22',
      viewValue: 'Hamilton Sydenham out and back – 22.31km'
    },
    {
      value: 'Toronto River Trail 98',
      viewValue: 'Toronto River Trail System – 98.19km'
    },
    {
      value: 'The Don and Lakefront Trail 58',
      viewValue: 'The Don and Lakefront Trail Route – 58.11km'
    },
    {
      value: 'One of the other shared routes found in our Strava club',
      viewValue: 'One of the other shared routes found in our Strava club'
    },
    {
      value: 'I will be riding my own route',
      viewValue: 'I will be riding my own route'
    }
  ];
  // Zwift meeting
  zwiftMeetingSelector = [
    {
      value: '9:00AM',
      viewValue: '9:00 AM'
    },
    {
      value: '12:00PM',
      viewValue: '12:00 PM'
    },
    {
      value: '3:00PM',
      viewValue: '3:00 PM'
    },
    {
      value: 'Not Selected',
      viewValue: 'Not Selected'
    }
  ];

  // Specifying API Method Variable
  method: string;

  // Variable for Timeout
  timeOut: any;
  timeOut2: any;

  constructor(
    public dataService: DataService,
    public route: Router,
    public http: HttpClient,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);

    this.dataService.flowStep = this.flowStep;

    // Setting a timeout function to log inactive users out (for privacy protection)
    this.timeOut = setTimeout(() => {
      this.snackBar.open(
        "Need more time? For your security, you've been logged out of your check-in session. To continue your online check-in, simply return to the login screen.",
        'Close',
        {
          duration: 15000,
          panelClass: ['error-info']
        }
      );

      this.timeOut2 = setTimeout(() => {
        this.dataService.logOut();
      }, 240000);
    }, 858000);

    this.step04Form = new FormGroup({
      // rewardsPick: new FormControl(this.rewardRes),
      sharedRoutes: new FormControl(this.sharedRoute),
      // zwiftMeetings: new FormControl(this.zwiftMeeting),
      ownRoute: new FormControl(this.selfParticipation)
    });

    // Checking logged in state, if they are logged in run regInfo() and getUserInfo() functions from the global dataService.
    if (
      this.dataService.isLoggedIn() === true &&
      this.dataService.tokenExpired === false
    ) {
      this.getFlowStep();
      this.dataService.getParticipationType();
    } else if (this.dataService.storageToken === undefined) {
      this.snackBar.open(
        'Login session expired, please login again.',
        'Close',
        {
          duration: 3500,
          panelClass: ['error-info']
        }
      );
      this.route.navigate(['/step-01']);
    } else {
      // if not logged in, go back to step 1 (login page)
      this.snackBar.open('You are not logged in, please login.', 'Close', {
        duration: 3500,
        panelClass: ['error-info']
      });
      this.route.navigate(['/step-01']);
    }
  }

  // Clear the timeout function upon entering a new route
  ngOnDestroy() {
    clearTimeout(this.timeOut);
  }

  ngAfterViewInit() {
    
  }

  getSurveyRes() {
    // Get the Survey Responses
    this.method =
      'CRTeamraiserAPI?method=getSurveyResponses&api_key=cfrca&v=1.0&fr_id=' +
      this.dataService.eventID +
      (this.dataService.isManualLogin === true
        ? '&sso_auth_token='
        : '&auth=') +
      this.dataService.ssoToken +
      '&survey_id=' +
      this.dataService.surveyID +
      '&response_format=json';
    this.http
      .post(this.dataService.convioURL + this.method, null)
      .subscribe(res => {
        console.log(res);
        this.surveyResults = res;

        // For Loop to get Survey Data and set it to the correct variables (to prevent data being saved as undefined or null)
        for (let res of this.surveyResults.getSurveyResponsesResponse
          .responses) {

          if (res.questionId === this.dataService.question5) {

            // console.log(res.responseValue)

            if (this.sharedRoute === undefined) {
              this.sharedRoute = '';
            }
            if (res.responseValue !== undefined || res.responseValue !== null) {
              this.sharedRoute = res.responseValue;
            }
            if (Object.keys(res.responseValue).length === 0) {
              this.sharedRoute = '';
            }
          }

          // if (res.questionId === this.dataService.question6) {
          //   if (this.zwiftMeeting === undefined) {
          //     this.zwiftMeeting = '';
          //   }
          //   if (res.responseValue !== undefined || res.responseValue !== null) {
          //     this.zwiftMeeting = res.responseValue;
          //   }
          //   if (Object.keys(res.responseValue).length === 0) {
          //     this.zwiftMeeting = '';
          //   }
          // }

          if (res.questionId === this.dataService.question7) {
            if (this.selfParticipation === undefined) {
              this.selfParticipation = '';
            }
            if (res.responseValue !== undefined || res.responseValue !== null) {
              this.selfParticipation = res.responseValue;
            }
            if (Object.keys(res.responseValue).length === 0) {
              this.selfParticipation = '';
            }
          }

          // if (res.questionId === this.dataService.question15) {
          //   if (this.rewardRes === undefined) {
          //     this.rewardRes = '';
          //   }
          //   if (res.responseValue !== undefined || res.responseValue !== null) {
          //     this.rewardRes = res.responseValue;
          //   }
          //   if (Object.keys(res.responseValue).length === 0) {
          //     this.rewardRes = '';
          //   }
          // }
          
        }
      });
  }

  validating() {    

    // if (
    //   this.rewardRes === 'User Provided No Response' ||
    //   this.rewardRes === undefined ||
    //   this.rewardRes === 'undefined' ||
    //   this.rewardRes === '[object Object]' ||
    //   this.rewardRes.length === 0
    // ) {
    //   this.rewardError = true;
    // } else {
    //   this.rewardError = false;
    // }

    if (
      this.sharedRoute === 'User Provided No Response' ||
      this.sharedRoute === undefined ||
      this.sharedRoute === 'undefined' ||
      this.sharedRoute === '[object Object]' ||
      this.sharedRoute.length === 0
    ) {
      this.routeError = true;
    } else {
      this.routeError = false;
    }
    // if (
    //   this.zwiftMeeting === 'User Provided No Response' ||
    //   this.zwiftMeeting === undefined ||
    //   this.zwiftMeeting === 'undefined' ||
    //   this.zwiftMeeting === '[object Object]' ||
    //   this.zwiftMeeting.length === 0
    // ) {
    //   this.zwiftError = true;
    // } else {
    //   this.zwiftError = false;
    // }
    // if (
    //   this.selfParticipation === 'User Provided No Response' ||
    //   this.selfParticipation === undefined ||
    //   this.selfParticipation === 'undefined' ||
    //   this.selfParticipation === '[object Object]' ||
    //   this.selfParticipation.length === 0
    // ) {
    //   this.ownError = true;
    // } else {
    //   this.ownError = false;
    // }

    if (
      // this.rewardError ||
      this.routeError
      // this.zwiftError ||
      // this.ownError
    ) {
      console.log('Error spotted');
    } else {
      this.updateSurveyRes();
      
    }
  }

  // Update the Survey Responses
  updateSurveyRes() {

    const updateSurveyResponsesUrl =
      'https://secure.conquercancer.ca/site/CRTeamraiserAPI?method=updateSurveyResponses&api_key=cfrca&v=1.0&response_format=json&fr_id=' +
      this.dataService.eventID +
      '&survey_id=' +
      this.dataService.surveyID;

    // const question_reward =
    //   '&question_' + this.dataService.question15 + '=' + this.rewardRes;
    const question_route =
      '&question_' + this.dataService.question5 + '=' + this.sharedRoute;
    // const question_zwift =
    //   '&question_' + this.dataService.question6 + '=' + this.zwiftMeeting;
    const question_part =
      '&question_' + this.dataService.question7 + '=' + this.selfParticipation;

    this.http
      .post(
        updateSurveyResponsesUrl +
          // question_reward +
          question_route +
          // question_zwift +
          question_part +
          (this.dataService.isManualLogin === true
            ? '&sso_auth_token='
            : '&auth=') +
          this.dataService.ssoToken,
        null
      )
      .subscribe(
        res => {
          // console.log(res);
          this.updateReg();
          this.route.navigate(['/step-05']);
        },
        error => {
          console.log(error);
          this.route.navigate(['/step-01']);
        }
      );
  }

  // Save Current Survey Answers (save for later)
  saveSurveyRes() {
    const updateSurveyResponsesUrl =
      'https://secure.conquercancer.ca/site/CRTeamraiserAPI?method=updateSurveyResponses&api_key=cfrca&v=1.0&response_format=json&fr_id=' +
      this.dataService.eventID +
      '&survey_id=' +
      this.dataService.surveyID;

    // const question_reward =
    //   '&question_' + this.dataService.question15 + '=' + this.rewardRes;
    const question_route =
      '&question_' + this.dataService.question5 + '=' + this.sharedRoute;
    // const question_zwift =
    //   '&question_' + this.dataService.question6 + '=' + this.zwiftMeeting;
    const question_part =
      '&question_' + this.dataService.question7 + '=' + this.selfParticipation;

    this.http
      .post(
        updateSurveyResponsesUrl +
          // question_reward +
          question_route +
          // question_zwift +
          question_part +
          (this.dataService.isManualLogin === true
            ? '&sso_auth_token='
            : '&auth=') +
          this.dataService.ssoToken,
        null
      )
      .subscribe(
        res => {
          this.saveUpdateReg();
        },
        error => {
          console.log(error);
          this.snackBar.open(
            'There was an error while trying to save. Please check the form.',
            'Close',
            {
              duration: 3500,
              panelClass: ['error-info']
            }
          );
          this.route.navigate(['/step-01']);
        }
      );
  }

  // Update the Registration Information
  updateReg() {
    this.flowStep = '4';

    const paidStatus = this.dataService.checkInStatus === 'Paid';
    const completeStatus = this.dataService.checkInStatus === 'Complete';
    const committedStatus = this.dataService.checkInStatus === 'Committed';

    if (paidStatus || completeStatus || committedStatus) {
      this.method =
        'CRTeamraiserAPI?method=updateRegistration&api_key=cfrca&v=1.0' +
        '&fr_id=' +
        this.dataService.eventID +
        (this.dataService.isManualLogin === true
          ? '&sso_auth_token='
          : '&auth=') +
        this.dataService.ssoToken +
        '&checkin_status=' +
        this.dataService.checkInStatus +
        '&flow_step=' +
        this.flowStep +
        '&response_format=json';
    } else {
      this.method =
        'CRTeamraiserAPI?method=updateRegistration&api_key=cfrca&v=1.0' +
        '&fr_id=' +
        this.dataService.eventID +
        (this.dataService.isManualLogin === true
          ? '&sso_auth_token='
          : '&auth=') +
        this.dataService.ssoToken +
        '&flow_step=' +
        this.flowStep +
        '&response_format=json';
    }

    this.http.post(this.dataService.convioURL + this.method, null).subscribe(
      res => {
        this.snackBar.open('Your information has been saved!', 'Close', {
          duration: 3500,
          panelClass: ['saved-info']
        });
      },
      error => {
        if (error) {
          this.snackBar.open(
            'Sorry, there was an error, please try again.',
            'Close',
            {
              duration: 3500,
              panelClass: ['error-info']
            }
          );
        }
      }
    );
  }

  // Update the Registration Information
  saveUpdateReg() {
    this.flowStep = '4';

    const paidStatus = this.dataService.checkInStatus === 'Paid';
    const completeStatus = this.dataService.checkInStatus === 'Complete';
    const committedStatus = this.dataService.checkInStatus === 'Committed';

    if (paidStatus || completeStatus || committedStatus) {
      this.method =
        'CRTeamraiserAPI?method=updateRegistration&api_key=cfrca&v=1.0' +
        '&fr_id=' +
        this.dataService.eventID +
        (this.dataService.isManualLogin === true
          ? '&sso_auth_token='
          : '&auth=') +
        this.dataService.storageToken +
        '&checkin_status=' +
        this.dataService.checkInStatus +
        '&flow_step=' +
        this.flowStep +
        '&response_format=json';
    } else {
      this.method =
        'CRTeamraiserAPI?method=updateRegistration&api_key=cfrca&v=1.0' +
        '&fr_id=' +
        this.dataService.eventID +
        (this.dataService.isManualLogin === true
          ? '&sso_auth_token='
          : '&auth=') +
        this.dataService.storageToken +
        '&flow_step=' +
        this.flowStep +
        '&response_format=json';
    }

    this.http.post(this.dataService.convioURL + this.method, null).subscribe(
      res => {
        this.snackBar.open('Your information has been saved!', 'Close', {
          duration: 3500,
          panelClass: ['saved-info']
        });
      },
      error => {
        if (error) {
          this.snackBar.open(
            'Sorry, there was an error, please try again.',
            'Close',
            {
              duration: 3500,
              panelClass: ['error-info']
            }
          );
        }
      }
    );
  }

  // Get the current Flowstep
  getFlowStep() {
    const token = localStorage.getItem('token');
    this.method =
      'CRTeamraiserAPI?method=getFlowStep&api_key=cfrca&v=1.0&response_format=json&fr_id=' +
      this.dataService.eventID +
      (this.dataService.isManualLogin === true
        ? '&sso_auth_token='
        : '&auth=') +
      token;
    this.http.post(this.dataService.convioURL + this.method, null).subscribe(
      res => {
        this.flowStepResults = res;
        this.getFlowStepNumber = this.flowStepResults.getFlowStepResponse.flowStep;

        // Checking the participants flow step to prevent user from skipping a flowstep
        if (this.getFlowStepNumber === this.flowStep) {
          // If the flow step matches to where they are supposed to be, then run the functions for the page below

          // this.dataService.getRegInfo();
          this.getSurveyRes();

          // If flowstep does not match, show error message and send them back to the previous page/flowstep.
        } else {
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
            this.route.navigate(['/step-02']);
          }
          if (this.getFlowStepNumber === '1') {
            this.route.navigate(['/step-02']);
          }
          if (this.getFlowStepNumber === '2') {
            this.route.navigate(['/step-03']);
          }
          if (this.getFlowStepNumber === '3') {
            this.route.navigate(['/step-04']);
          }
          if (this.getFlowStepNumber === '4') {
            this.route.navigate(['/step-05']);
          }
          if (this.getFlowStepNumber === '5') {
            this.route.navigate(['/step-06']);
          }
          if (this.getFlowStepNumber === '6') {
            this.route.navigate(['/step-07']);
          }
          if (this.getFlowStepNumber === '7') {
            this.route.navigate(['/step-08']);
          }
          // if (this.getFlowStepNumber === '8') {
          //   this.route.navigate(['/step-09']);
          // }
        }
      },
      err => {
        this.snackBar.open('There was an error, please login again.', 'Close', {
          duration: 3500,
          panelClass: ['error-info']
        });
        this.dataService.logOut();
      }
    );
  }

  // Update the current Flowstep
  previousFlowStep() {
    const paidStatus = this.dataService.checkInStatus === 'Paid';
    const completeStatus = this.dataService.checkInStatus === 'Complete';
    const committedStatus = this.dataService.checkInStatus === 'Committed';

    if (paidStatus || completeStatus || committedStatus) {
      this.dataService.method =
        'CRTeamraiserAPI?method=updateRegistration&api_key=cfrca&v=1.0' +
        '&fr_id=' +
        this.dataService.eventID +
        (this.dataService.isManualLogin === true
          ? '&sso_auth_token='
          : '&auth=') +
        this.dataService.ssoToken +
        '&checkin_status=' +
        this.dataService.checkInStatus +
        '&flow_step=2' +
        '&response_format=json';
    } else {
      this.dataService.method =
        'CRTeamraiserAPI?method=updateRegistration&api_key=cfrca&v=1.0' +
        '&fr_id=' +
        this.dataService.eventID +
        (this.dataService.isManualLogin === true
          ? '&sso_auth_token='
          : '&auth=') +
        this.dataService.ssoToken +
        '&flow_step=2' +
        '&response_format=json';
    }

    this.http
      .post(this.dataService.convioURL + this.dataService.method, null)
      .subscribe(
        res => {
          this.route.navigate(['/step-03']);
        },
        err => {
          if (err) {
            this.snackBar.open('There was an unknown error.', 'Close', {
              duration: 3500,
              panelClass: ['error-info']
            });
            this.dataService.logOut();
          }
        }
      );
  }
}
