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
  selector: 'app-step-03',
  templateUrl: './step-03.component.html',
  styleUrls: ['./step-03.component.scss']
})
export class Step03Component implements OnInit, OnDestroy, AfterViewInit {
  step03Form: FormGroup;
  matcher = new MyErrorStateMatcher();
  buttonStatus: boolean = true;
  remember: boolean = false;
  getInfo: any = {};

  // Flowstep
  flowStep = '2';
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
  shirtRes: string;
  vestRes: string;
  jerseyRes: string;
  attendanceRes: string;
  routeRes: string;
  experiencedRiderRes: string;
  glutenRes: string;
  safetyRes: string;

  nameError: boolean = false;
  numError: boolean = false;
  yearError: boolean = false;
  cancerError: boolean = false;
  vegError: boolean = false;
  shirtError: boolean = false;
  vestError: boolean = false;
  jerseyError: boolean = false;
  packetError: boolean = false;
  routeError: boolean = false;
  safetyError: boolean = false;

  // Variable to hide elements
  hideMe: boolean = true;

  // Select Options for Jesey Sizes
  jerseySelect = [
    // {
    //   value: 'Mens_XXS',
    //   viewValue: 'Mens_XXS'
    // },
    {
      value: 'Mens_XS',
      viewValue: 'Mens_XS'
    },
    {
      value: 'Mens_SM',
      viewValue: 'Mens_SM'
    },
    {
      value: 'Mens_MD',
      viewValue: 'Mens_MD'
    },
    {
      value: 'Mens_LG',
      viewValue: 'Mens_LG'
    },
    {
      value: 'Mens_XL',
      viewValue: 'Mens_XL'
    },
    {
      value: 'Mens_2XL',
      viewValue: 'Mens_2XL'
    },
    {
      value: 'Mens_3XL',
      viewValue: 'Mens_3XL'
    },
    // {
    //   value: 'Womens_XXS',
    //   viewValue: 'Womens_XXS'
    // },
    {
      value: 'Womens_XS',
      viewValue: 'Womens_XS'
    },
    {
      value: 'Womens_SM',
      viewValue: 'Womens_SM'
    },
    {
      value: 'Womens_MD',
      viewValue: 'Womens_MD'
    },
    {
      value: 'Womens_LG',
      viewValue: 'Womens_LG'
    },
    {
      value: 'Womens_XL',
      viewValue: 'Womens_XL'
    },
    {
      value: 'Womens_2XL',
      viewValue: 'Womens_2XL'
    },
    {
      value: 'Womens_3XL',
      viewValue: 'Womens_3XL'
    }
  ];

  // Select Options for Jesey Sizes
  shirtSelect = [
    {
      value: 'SM',
      viewValue: 'SM'
    },
    {
      value: 'MD',
      viewValue: 'MD'
    },
    {
      value: 'LG',
      viewValue: 'LG'
    },
    {
      value: 'XL',
      viewValue: 'XL'
    },
    {
      value: '2XL',
      viewValue: '2XL'
    },
    {
      value: '3XL',
      viewValue: '3XL'
    }
  ];

// Select Options for Jesey Sizes
  vestSelect = [
    {
      value: 'Mens_XXS',
      viewValue: 'Mens_XXS'
    },
    {
      value: 'Mens_XS',
      viewValue: 'Mens_XS'
    },
    {
      value: 'Mens_SM',
      viewValue: 'Mens_SM'
    },
    {
      value: 'Mens_MD',
      viewValue: 'Mens_MD'
    },
    {
      value: 'Mens_LG',
      viewValue: 'Mens_LG'
    },
    {
      value: 'Mens_XL',
      viewValue: 'Mens_XL'
    },
    {
      value: 'Mens_2XL',
      viewValue: 'Mens_2XL'
    },
    {
      value: 'Mens_3XL',
      viewValue: 'Mens_3XL'
    },
    {
      value: 'Womens_XXS',
      viewValue: 'Womens_XXS'
    },
    {
      value: 'Womens_XS',
      viewValue: 'Womens_XS'
    },
    {
      value: 'Womens_SM',
      viewValue: 'Womens_SM'
    },
    {
      value: 'Womens_MD',
      viewValue: 'Womens_MD'
    },
    {
      value: 'Womens_LG',
      viewValue: 'Womens_LG'
    },
    {
      value: 'Womens_XL',
      viewValue: 'Womens_XL'
    },
    {
      value: 'Womens_2XL',
      viewValue: 'Womens_2XL'
    },
    {
      value: 'Womens_3XL',
      viewValue: 'Womens_3XL'
    }
  ];


  // Years attended Options
  years = [
    {
      value: '1',
      viewValue: '1'
    },
    {
      value: '2',
      viewValue: '2'
    },
    {
      value: '3',
      viewValue: '3'
    },
    {
      value: '4',
      viewValue: '4'
    },
    {
      value: '5',
      viewValue: '5'
    },
    {
      value: '6',
      viewValue: '6'
    },
    {
      value: '7',
      viewValue: '7'
    },
    {
      value: '8',
      viewValue: '8'
    },
    {
      value: '9',
      viewValue: '9'
    },
    {
      value: '10',
      viewValue: '10'
    },
    {
      value: '11',
      viewValue: '11'
    },
    {
      value: '12',
      viewValue: '12'
    },
    {
      value: '13',
      viewValue: '13'
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

    this.step03Form = new FormGroup({
      yearsAttended: new FormControl(this.attendanceRes, Validators.required),
      shirtSizes: new FormControl(this.shirtRes, Validators.required),
      vestSizes: new FormControl(this.vestRes, Validators.required),
      jerseySizes: new FormControl(this.jerseyRes, Validators.required)
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
        // console.log(res);
        this.surveyResults = res;

        // For Loop to get Survey Data and set it to the correct variables (to prevent data being saved as undefined or null)
        for (let res of this.surveyResults.getSurveyResponsesResponse
          .responses) {
          // How many years have you ridden with The Ride?
          if (res.questionId === this.dataService.question1) {
            if (this.attendanceRes === undefined) {
              this.attendanceRes = '';
            }
            if (res.responseValue !== undefined || res.responseValue !== null) {
              this.attendanceRes = res.responseValue;
            }
            if (Object.keys(res.responseValue).length === 0) {
              this.attendanceRes = '';
            }
          }

          // Jersey Selection
          if (res.questionId === this.dataService.question2) {
            if (this.jerseyRes === '[object Object]') {
              this.jerseyRes = '';
            }
            if (this.jerseyRes === undefined) {
              this.jerseyRes = '';
            }
            if (res.responseValue !== undefined || res.responseValue !== null) {
              this.jerseyRes = res.responseValue;
            }
            if (Object.keys(res.responseValue).length === 0) {
              this.jerseyRes = '';
            }
          }

          // Shirt Selection
          if (res.questionId === this.dataService.question3) {
            if (this.shirtRes === '[object Object]') {
              this.shirtRes = '';
            }
            if (this.shirtRes === undefined) {
              this.shirtRes = '';
            }
            if (res.responseValue !== undefined || res.responseValue !== null) {
              this.shirtRes = res.responseValue;
            }
            if (Object.keys(res.responseValue).length === 0) {
              this.shirtRes = '';
            }
          }

          // Vest Selection
          if (res.questionId === this.dataService.question4) {
            if (this.vestRes === '[object Object]') {
              this.vestRes = '';
            }
            if (this.vestRes === undefined) {
              this.vestRes = '';
            }
            if (res.responseValue !== undefined || res.responseValue !== null) {
              this.vestRes = res.responseValue;
            }
            if (Object.keys(res.responseValue).length === 0) {
              this.vestRes = '';
            }
          }
        }
      });
  }

  validating() {

    // console.log(this.attendanceRes)
    // console.log(this.shirtRes.length)
    // console.log(this.vestRes.length)
    // console.log(this.jerseyRes)

    if (
      this.attendanceRes === 'User Provided No Response' ||
      this.attendanceRes === undefined ||
      this.attendanceRes === 'undefined' ||
      this.attendanceRes === '[object Object]' ||
      this.attendanceRes.length === 0
    ) {
      this.yearError = true;
    } else {
      this.yearError = false;
    }
    if (
      this.shirtRes === 'User Provided No Response' ||
      this.shirtRes === undefined ||
      this.shirtRes === 'undefined' ||
      this.shirtRes === '[object Object]' ||
      this.shirtRes.length === 0
    ) {
      this.shirtError = true;
    } else {
      this.shirtError = false;
    }
    if (
      this.vestRes === 'User Provided No Response' ||
      this.vestRes === undefined ||
      this.vestRes === 'undefined' ||
      this.vestRes === '[object Object]' ||
      this.vestRes.length === 0
    ) {
      this.vestError = true;
    } else {
      this.vestError = false;
    }
    if (
      this.jerseyRes === 'User Provided No Response' ||
      this.jerseyRes === undefined ||
      this.jerseyRes === 'undefined' ||
      this.jerseyRes === '[object Object]' ||
      this.jerseyRes.length === 0
    ) {
      this.jerseyError = true;
    } else {
      this.jerseyError = false;
    }
    if (this.yearError || this.shirtError || this.vestError || this.jerseyError) {
      console.log('Error spotted');
    } else {
      this.updateSurveyRes();
    }
  }

  // Update the Survey Responses
  updateSurveyRes() {
    for (const resp of this.surveyResults.getSurveyResponsesResponse
      .responses) {
      // How many years have you ridden with The Ride?
      if (resp.questionId === this.dataService.question1) {
        if (this.attendanceRes === undefined || this.attendanceRes === null) {
          this.attendanceRes = resp.responseValue;
        }
      }
      // Jersey Selection
      if (resp.questionId === this.dataService.question2) {
        if (this.jerseyRes === undefined || this.jerseyRes === null) {
          this.jerseyRes = resp.responseValue;
        }
      }
      // Shirt Selection
      if (resp.questionId === this.dataService.question3) {
        if (this.shirtRes === undefined || this.shirtRes === null) {
          this.shirtRes = resp.responseValue;
        }
      }
      // Vest Selection
      if (resp.questionId === this.dataService.question4) {
        if (this.vestRes === undefined || this.vestRes === null) {
          this.vestRes = resp.responseValue;
        }
      }
    }

    const updateSurveyResponsesUrl =
      'https://secure.conquercancer.ca/site/CRTeamraiserAPI?method=updateSurveyResponses&api_key=cfrca&v=1.0&response_format=json&fr_id=' +
      this.dataService.eventID +
      '&survey_id=' +
      this.dataService.surveyID;

    const question_attendance =
      '&question_' + this.dataService.question1 + '=' + this.attendanceRes;
    const question_jersey =
      '&question_' + this.dataService.question2 + '=' + this.jerseyRes;
    const question_shirt =
      '&question_' + this.dataService.question3 + '=' + this.shirtRes;
    const question_vest =
      '&question_' + this.dataService.question4 + '=' + this.vestRes;

    this.http
      .post(
        updateSurveyResponsesUrl +
          question_attendance +
          question_shirt +
          question_vest +
          question_jersey +
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
          this.route.navigate(['/step-04']);
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

    const question_attendance =
      '&question_' + this.dataService.question1 + '=' + this.attendanceRes;
    const question_jersey =
      '&question_' + this.dataService.question2 + '=' + this.jerseyRes;
    const question_shirt =
      '&question_' + this.dataService.question3 + '=' + this.shirtRes;
    const question_vest =
      '&question_' + this.dataService.question4 + '=' + this.vestRes;

    this.http
      .post(
        updateSurveyResponsesUrl +
          question_attendance +
          question_shirt +
          question_vest +
          question_jersey +
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
    this.flowStep = '3';

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
    this.flowStep = '3';

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

          this.dataService.getRegInfo();
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
        '&flow_step=1' +
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
        '&flow_step=1' +
        '&response_format=json';
    }

    this.http
      .post(this.dataService.convioURL + this.dataService.method, null)
      .subscribe(
        res => {
          this.route.navigate(['/step-02']);
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
