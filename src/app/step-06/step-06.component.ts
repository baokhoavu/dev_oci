import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

/* Routing */
import { Router } from '@angular/router';

/* FormControl, FormGroup and Validators */
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators
} from '@angular/forms';

/* HTTP Client */
import {
  HttpClient,
  HttpRequest,
  HttpEvent,
  HttpEventType,
  HttpHeaders
} from '@angular/common/http';

/* Angular Material */
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorStateMatcher } from '@angular/material/core';

/* Data Service */
import { DataService } from '../data.service';

/* Convio API Client */
declare var ConvioApiClient: any;

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
  selector: 'app-step-06',
  templateUrl: './step-06.component.html',
  styleUrls: ['./step-06.component.scss']
})
export class Step06Component implements OnInit, OnDestroy {
  Api = new ConvioApiClient('cfrca', 'api_client', 'json');
  // Setting the FlowStep
  flowStep = '5';
  flowStepResults: any = {};
  getFlowStepNumber: string;

  // Error state matcher for the form validation
  matcher = new MyErrorStateMatcher();

  // Register for 2021 params
  registerDoc = '';
  registerForm: FormGroup;
  registerResults: string;

  registerOptions = [
    {
      value: '1',
      viewValue: 'Yes, please register me for The Ride 2021!'
    },
    { value: '0', viewValue: 'No thanks, not ready to register yet.' }
  ];

  // temp participation ID
  participantTypeID = '2082';

  // Defining variables tied with the DOM
  roadResults: string;
  upsellResults: string;
  upsellHiddenResult: string;
  hiddenUpsellValue: string;

  roadError = false;

  // Defining the formgroup
  upsellForm: FormGroup;
  roadForm: FormGroup;

  // Radio Button Options
  roadSelections = [
    {
      value: '350',
      viewValue: 'raise at least $350 and earn the Commemorative Ride T-shirt'
    },
    {
      value: '750',
      viewValue: 'raise at least $750 and earn the Legendary Ride Baseball Cap'
    },
    {
      value: '1000',
      viewValue:
        'raise at least $1,000 and earn the 2020 Official Enbridge® Ride to Conquer Cancer® Jersey'
    },
    {
      value: '1500',
      viewValue:
        'raise at least $1,500 AND commit to ride 100 miles* on the virtual Ride weekend and earn the Carpenters & Allied Workers Union Hammer Vest'
    },
    {
      value: '2500',
      viewValue:
        'raise at least $2,500 and earn the coveted RBC Ambassador Jersey'
    },
    {
      value: '250001',
      viewValue:
        'raise $2,500 AND commit to ride 100 miles* on the virtual Ride weekend and earn the Carpenters & Allied Workers Union Technical Hammer cycling vest, t-shirt, ball cap and Ride Ambassador jersey*'
    },
    {
      value: '1',
      viewValue:
        'No thanks'
    }
  ];

  // roadSelections = [
  //   {
  //     value: 'Ride T-Shirt',
  //     viewValue: 'raise at least $350 and earn the Commemorative Ride T-shirt'
  //   },
  //   {
  //     value: 'Ride Hat',
  //     viewValue: 'raise at least $750 and earn the Legendary Ride Baseball Cap'
  //   },
  //   {
  //     value: 'Ride Jersey',
  //     viewValue:
  //       'raise at least $1,000 and earn the 2020 Official Enbridge® Ride to Conquer Cancer® Jersey'
  //   },
  //   {
  //     value: 'Hammer Vest',
  //     viewValue:
  //       'raise at least $1,500 AND commit to ride 100 miles on the virtual Ride weekend and earn the Carpenters & Allied Workers Union Hammer Vest'
  //   },
  //   {
  //     value: 'Ambassador Jersey',
  //     viewValue:
  //       'raise at least $2,500 and earn the coveted RBC Ambassador Jersey'
  //   },
  //   {
  //     value: 'Ambassador Jersey and Hammer Vest',
  //     viewValue:
  //       'Raise $2,500 and commit to ride 100 miles on the virtual Ride weekend and earn the Carpenters & Allied Workers Union Technical Hammer cycling vest, t-shirt, ball cap and Ride Ambassador jersey*'
  //   }
  // ];

  roadSurveyID = '85557';
  fundResponse: any = {};
  amountRaised: string;

  regResponse: any = {};
  checkinStatus: string;
  // Consituent ID
  consID: string;

  // Results from getSurvey
  surveyResults: any = {};

  // Token from the Storage
  storageToken: string = localStorage.getItem('token');

  // Variable for Timeout
  timeOut: any;
  timeOut2: any;

  constructor(
    public data: DataService,
    private http: HttpClient,
    private route: Router,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // this.getRegDocument();
    window.scrollTo(0, 0);

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
        this.data.logOut();
      }, 240000);
    }, 858000);

    // Checking logged in state, and running correct functions
    if (this.data.isLoggedIn() === true && this.data.tokenExpired === false) {
      // console.log('You are logged in!');
      this.data.getRegInfo();
      this.data.getUserInfo();
      this.getFlowStep();
      // this.dataService.getParticipationType();
    } else if (this.data.storageToken === undefined) {
      this.data.logOut();
      this.snackBar.open(
        'Login session expired, please login again.',
        'Close',
        {
          duration: 3500,
          panelClass: ['error-info']
        }
      );
    } else {
      // if not logged in, go back to step 1 (login page)
      this.snackBar.open('You are not logged in, please login.', 'Close', {
        duration: 3500,
        panelClass: ['error-info']
      });
      this.route.navigate(['/step-01']);
    }
    // Defining Upsell FormGroup

    this.upsellForm = new FormGroup({
      upsellSelect: new FormControl(this.upsellResults, Validators.required)
    });
    this.registerForm = new FormGroup({
      registerSelect: new FormControl(this.registerResults, Validators.required)
    });
    this.roadForm = new FormGroup({
      roadSelect: new FormControl(this.roadResults, Validators.required)
    });
    //console.log(this.upsellForm);
    // console.log(this.data.consID);
  }

  // Clear the timeout function upon entering a new route
  ngOnDestroy() {
    clearTimeout(this.timeOut);
    clearTimeout(this.timeOut2);
  }

  // registration APIs start
  getRegDocument() {
    this.data.method =
      'CRTeamraiserAPI?method=getRegistrationDocument&api_key=cfrca&v=1.0&fr_id=' +
      this.data.eventID +
      '&participation_id=' +
      this.participantTypeID +
      '&response_format=xml';
    this.http
      .get(this.data.convioURL + this.data.method, { responseType: 'text' })
      .subscribe(res => {
        this.registerDoc = res;

        // add information to reg doc
        console.log(this.registerDoc.search('<consId xsi:nil="true"/>'));
        this.registerDoc = this.registerDoc.replace(
          '<consId xsi:nil="true"/>',
          '<consId>' + this.data.consID + '</consId>'
        );
        // log the register doc to console to test
        console.log(this.registerDoc);
      });
  }

  getParticipantTypes() {}

  processRegistration() {
    const params = {
      registration_document: this.registerDoc
    };

    // call API through convio api client
    // this.Api.callTeamraiserAPI(
    //   'processRegistration',
    //   function(response, status) {
    //     console.log('processRegistration: ' + status);
    //     console.log(response);
    //     if (status === '200') {
    //       console.log('TeamRaiser API called successfully, response below:');
    //       console.log(response);
    //     } else {
    //       console.log(response.errorResponse.message);
    //     }
    //   },
    //   params
    // );

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/xml' // SEND XML
    //   })
    // };
    this.data.method =
      'CRTeamraiserAPI?method=processRegistration&api_key=cfrca&v=1.0&response_format=json';
    this.http.post(this.data.convioURL + this.data.method, params).subscribe(
      res => {
        console.log(res);
      },
      error => {
        console.log(error);
      }
    );
  }

  getFundraising() {
    this.data.method =
      'CRTeamraiserAPI?method=getFundraisingResults&api_key=cfrca&v=1.0&response_format=json&cons_id=' +
      this.consID +
      '&fr_id=' +
      this.data.eventID;
    this.http.get(this.data.convioURL + this.data.method).subscribe(
      results => {
        this.fundResponse = results;
        const numberRaised = parseInt(
          this.fundResponse.getFundraisingResponse.fundraisingRecord
            .amountRaised
        );

        const addDeciRaised = (numberRaised / 100).toFixed(2);
        const newRaised = addDeciRaised.toString();

        this.amountRaised = newRaised;
      },
      error => {
        if (error) {
          console.log(error);
        }
      }
    );
  }

  // Gather Registration Information
  getRegInfo() {
    this.data.storageToken = localStorage.getItem('token');
    this.data.method =
      'CRTeamraiserAPI?method=getRegistration&api_key=cfrca&v=1.0&response_format=json&fr_id=' +
      this.data.eventID +
      (this.data.isManualLogin === true ? '&sso_auth_token=' : '&auth=') +
      this.data.storageToken;
    this.http.post(this.data.convioURL + this.data.method, null).subscribe(
      res => {
        this.regResponse = res;

        // console.log(this.regResponse);

        this.consID = this.regResponse.getRegistrationResponse.registration.consId;
        this.checkinStatus = this.regResponse.getRegistrationResponse.registration.checkinStatus;

        // console.log(this.checkinStatus);

        // if (this.regResponse.getRegistrationResponse.registration.teamId > 0) {
        //   this.inTeam = true;
        // }

        this.getFundraising();
        this.updateFlowStep();
      },
      err => {
        console.log(err);
        this.data.tokenExpired = true;
        this.route.navigate(['/step-01']);
      }
    );
  }

  // registration APIs end

  getSurveyRes() {
    this.data.method =
      'CRTeamraiserAPI?method=getSurveyResponses&api_key=cfrca&v=1.0&fr_id=' +
      this.data.eventID +
      '&survey_id=' +
      this.data.surveyID +
      (this.data.isManualLogin === true ? '&sso_auth_token=' : '&auth=') +
      this.data.ssoToken +
      '&response_format=json';
    this.http.post(this.data.convioURL + this.data.method, null).subscribe(
      res => {
        this.surveyResults = res;

        console.log(this.surveyResults);

        // For loop to loop through the responded data from API call
        for (let data of this.surveyResults.getSurveyResponsesResponse.responses) {
          // If questionId is same as waiver question ID in Survey then check if fullName variable is undefined or null, if so set it as the response value else if it's length is equil to 0 or no reponseValue, then set it to a blank string

          if (data.questionId === this.data.question12) {

            // console.log(res.responseValue)

            if (data.responseValue === '350') {
              this.roadResults = '350';
            } else if (data.responseValue === '750') {
              this.roadResults = '750';
            } else if (data.responseValue === '1000') {
              this.roadResults = '1000';
            } else if (data.responseValue === '1500') {
              this.roadResults = '1500';
            } else if (data.responseValue === '2500') {
              this.roadResults = '2500';
            } else if ( data.responseValue === '250001') {
              this.roadResults = '250001';
            } else {
              this.roadResults = data.responseValue;
            }
          }
        }
      },
      err => {
        if (err.status === 403) {
          // console.log(err);
          this.data.logOut();
          this.snackBar.open(
            'Login session expired, please login again.',
            'Close',
            {
              duration: 3500,
              panelClass: ['error-info']
            }
          );

          this.route.navigate(['/step-01']);
        }
      }
    );
  }

  validating() {

    // console.log(this.roadResults)

    if (
      this.roadResults === undefined ||
      this.roadResults === null ||
      this.roadResults === '' ||
      typeof this.roadResults === 'object' ||
      this.roadResults.length === 0 ||
      this.roadResults === '[object Object]'
    ) {
      this.roadError = true;
    } else {
      this.roadError = false;
    }

    if (
      this.roadError
    ) {
      console.log('Error spotted');
    } else {
      this.updateSurveyRes();
    }
  }

  updateSurveyRes() {
    // Constant variable for the upsell question response and ID to send to API end-point
    const question_swag =
      '&question_' + this.data.question12 + '=' + this.roadResults;

    const updateSurveyResponsesUrl =
      'https://secure.conquercancer.ca/site/CRTeamraiserAPI?method=updateSurveyResponses&api_key=cfrca&v=1.0&response_format=json&fr_id=' +
      this.data.eventID;

    this.http
      .post(
        updateSurveyResponsesUrl +
          question_swag +
          '&survey_id=' +
          this.data.surveyID +
          (this.data.isManualLogin === true ? '&sso_auth_token=' : '&auth=') +
          this.data.ssoToken,
        null
      )
      .subscribe(
        res => {
          this.surveyResults = res;

          this.snackBar.open('Your information has been saved!', 'Close', {
            duration: 3500,
            panelClass: ['saved-info']
          });

          // Route user to next route once http post is successful
          this.nextFlowStep();
        },
        error => {
          this.data.logOut();
          console.log(error);
        }
      );
  }

  // Save the current Survey Responses
  saveSurveyResponses() {

    // Constant variable for the upsell question response and ID
    const question_swag =
      '&question_' + this.data.question12 + '=' + this.roadResults;

    const updateSurveyResponsesUrl =
      'https://secure.conquercancer.ca/site/CRTeamraiserAPI?method=updateSurveyResponses&api_key=cfrca&v=1.0&response_format=json&fr_id=' +
      this.data.eventID;

    this.http
      .post(
        updateSurveyResponsesUrl +
          question_swag +
          '&survey_id=' +
          this.data.surveyID +
          (this.data.isManualLogin === true ? '&sso_auth_token=' : '&auth=') +
          this.data.ssoToken,
        null
      )
      .subscribe(
        res => {
          this.surveyResults = res;

          this.snackBar.open('Your information has been saved!', 'Close', {
            duration: 3500,
            panelClass: ['saved-info']
          });

          window.location.reload();
        },
        error => {
          console.log('There was an error');
        }
      );
  }

  // Update the current Flowstep
  updateFlowStep() {
    this.data.method =
      'CRTeamraiserAPI?method=updateRegistration&api_key=cfrca&v=1.0' +
      '&fr_id=' +
      this.data.eventID +
      (this.data.isManualLogin === true ? '&sso_auth_token=' : '&auth=') +
      this.storageToken +
      '&checkin_status=' +
      this.data.checkInStatus +
      '&flow_step=' +
      this.flowStep +
      '&response_format=json';
    this.http.post(this.data.convioURL + this.data.method, null).subscribe(
      res => {
        // console.log('Flow step updated.')
      },
      err => {
        if (err) {
          // console.log(err);
          this.snackBar.open('There was an unknown error.', 'Close', {
            duration: 3500,
            panelClass: ['error-info']
          });

          this.data.logOut();
        }
      }
    );
  }

  // Update the flowStep to the next flowStep once everything checks out
  nextFlowStep() {
    this.flowStep = '6';
    this.data.method =
      'CRTeamraiserAPI?method=updateRegistration&api_key=cfrca&v=1.0' +
      '&fr_id=' +
      this.data.eventID +
      (this.data.isManualLogin === true ? '&sso_auth_token=' : '&auth=') +
      this.storageToken +
      '&checkin_status=' +
      this.data.checkInStatus +
      '&flow_step=' +
      this.flowStep +
      '&response_format=json';
    this.http.post(this.data.convioURL + this.data.method, null).subscribe(
      res => {
        // Update the flowStep to the next flowstep once everything checks out properly
        this.route.navigate(['/step-07']);
      },
      err => {
        if (err) {
          this.snackBar.open('There was an unknown error.', 'Close', {
            duration: 3500,
            panelClass: ['error-info']
          });

          this.data.logOut();
        }
      }
    );
  }

  // Update to the previous Flowstep
  previousFlowStep() {
    this.flowStep = '4';
    this.data.method =
      'CRTeamraiserAPI?method=updateRegistration&api_key=cfrca&v=1.0' +
      '&fr_id=' +
      this.data.eventID +
      (this.data.isManualLogin === true ? '&sso_auth_token=' : '&auth=') +
      this.storageToken +
      '&checkin_status=' +
      this.data.checkInStatus +
      '&flow_step=' +
      this.flowStep +
      '&response_format=json';
    this.http.post(this.data.convioURL + this.data.method, null).subscribe(
      res => {
        // Route user to previous flow step
        this.route.navigate(['/step-05']);
      },
      err => {
        if (err) {
          this.snackBar.open('There was an unknown error.', 'Close', {
            duration: 3500,
            panelClass: ['error-info']
          });

          this.data.logOut();
        }
      }
    );
  }

  // Get the current Flowstep
  getFlowStep() {
    this.data.method =
      'CRTeamraiserAPI?method=getFlowStep&api_key=cfrca&v=1.0&response_format=json&fr_id=' +
      this.data.eventID +
      (this.data.isManualLogin === true ? '&sso_auth_token=' : '&auth=') +
      this.storageToken;
    this.http.post(this.data.convioURL + this.data.method, null).subscribe(
      res => {
        this.flowStepResults = res;
        this.getFlowStepNumber = this.flowStepResults.getFlowStepResponse.flowStep;

        // Checking the participants flow step to prevent user from skipping a flowstep
        if (this.getFlowStepNumber === this.flowStep) {
          // If the flow step matches to where they are supposed to be, then run the functions for the page below
          this.getSurveyRes();
          this.getRegInfo();
          //this.updateFlowStep();
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
        console.log(err);

        // If flowstep has error, log out the user (to prevent API errors)
        this.data.logOut();
      }
    );
  }
}
