import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  AfterViewInit
} from '@angular/core';

/* FormGroup and Validators */
import {
  FormGroup,
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators
} from '@angular/forms';

/* Router */
import { Router } from '@angular/router';

/* HTTP Client */
import {
  HttpClient,
  HttpRequest,
  HttpEvent,
  HttpEventType
} from '@angular/common/http';

/* Angular Material Compnents */
import { MatRadioChange } from '@angular/material/radio';
import { ErrorStateMatcher } from '@angular/material/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

/* Data Service */
import { DataService } from '../data.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-step-02-dialog',
  templateUrl: './step-02-dialog.html',
  styleUrls: ['./step-02.component.scss']
})
export class Step02DialogComponent {
  firstName: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<Step02DialogComponent>,
    public dataService: DataService
  ) {
    dataService.getUserInfo();
    this.firstName = dataService.firstName;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-step-02-hammerdialog',
  templateUrl: './step-02-hammerdialog.html',
  styleUrls: ['./step-02.component.scss']
})
export class Step02HammerDialogComponent {
  firstName: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<Step02HammerDialogComponent>,
    public dataService: DataService
  ) {
    dataService.getUserInfo();
    this.firstName = dataService.firstName;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-step-02',
  templateUrl: './step-02.component.html',
  styleUrls: ['./step-02.component.scss']
})
export class Step02Component implements OnInit, OnDestroy, AfterViewInit {
  step02Form: FormGroup;

  matcher = new MyErrorStateMatcher();

  // Variables
  updateRegRes: any = {};
  flowStep = '1';
  method: string;
  checkInStatus = 'started';
  remember = false;
  firstName: string;
  lastName: string;
  primaryAddress1: string;
  primaryAddress2: string;
  primaryCity: string;
  primaryState: string;
  primaryZip: string;
  primaryPhone: string;
  gender: string;
  hammerRes = 'No';
  hasPhoto = false;
  firstNameError = false;
  lastNameError = false;
  streetError = false;
  cityError = false;
  provinceError = false;
  zipError = false;
  genderError = false;
  flowStepResults: any = {};
  getFlowStepNumber: string;
  genderSelecter = [
    {
      value: '',
      viewValue: 'Prefer not to say'
    },
    {
      value: 'MALE',
      viewValue: 'Male'
    },
    {
      value: 'FEMALE',
      viewValue: 'Female'
    }
  ];
  surveyResults: any = {};
  genderRes: string;
  consData: any = {};
  updateUserResults: any = {};
  timeOut: any;
  timeOut2: any;
  invalidOnLoad = false;
  personalPhotoInfo: any = {};
  personalPhotoUrl: string;

  constructor(
    public dataService: DataService,
    private router: Router,
    private http: HttpClient,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    if (this.primaryAddress2 === null) {
      this.primaryAddress2 = '';
    }
  }

  ngOnInit() {
    window.scrollTo(0, 0);

    this.dataService.flowStep = this.flowStep;

    this.timeOut = setTimeout(() => {
      this.snackBar.open(
        `Need more time? For your security, you've been logged out of your check-in session.` +
          `To continue your online check-in, simply return to the login screen.`,
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

    if (
      this.dataService.isLoggedIn() === true &&
      this.dataService.tokenExpired === false
    ) {
      this.getFlowStep();
      this.getRegInfo();
      this.getUserInfo();
      this.getPhone();
      this.getPersonalPhoto();
      if (this.router.url === '/step-02') {
        setTimeout(() => this.openDialog());
      }
      this.getCheckInStatus();
    } else if (this.dataService.storageToken === undefined) {
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

    if (this.consData.getConsResponse) {
      if (this.firstName === undefined || null) {
        this.firstName = this.consData.getConsResponse.name.first;
      }
      if (this.lastName === undefined || null) {
        this.lastName = this.consData.getConsResponse.name.last;
      }
      if (this.primaryAddress1 === undefined || null) {
        this.primaryAddress1 = this.consData.getConsResponse.primary_address.street1;
      }
      if (this.primaryAddress2 === undefined || null) {
        this.primaryAddress2 = this.consData.getConsResponse.primary_address.street2;
      }
      if (this.primaryAddress2 === undefined || null) {
        this.primaryAddress2 = this.consData.getConsResponse.primary_address.street2;
      }

    }

    this.step02Form = new FormGroup({
      firstName: new FormControl(this.firstName, Validators.required),
      lastName: new FormControl(this.lastName, Validators.required),
      liveAddress1: new FormControl(this.primaryAddress1, Validators.required),
      liveAddress2: new FormControl(this.primaryAddress2),
      liveCity: new FormControl(this.primaryCity, Validators.required),
      liveState: new FormControl(this.primaryState, Validators.required),
      liveZip: new FormControl(this.primaryZip, Validators.required),
      livePhone: new FormControl(this.primaryPhone),
      // genderSelect: new FormControl(this.gender)
    });

    if (this.step02Form.controls.firstName.invalid) {
      this.invalidOnLoad = true;
    }
  }

  // Clear the timeout function upon entering a new route
  ngOnDestroy() {
    clearTimeout(this.timeOut);
  }

  ngAfterViewInit() {}

  // Update the checkInStatus from Registration
  updateCheckInStatus() {
    this.method =
      'CRTeamraiserAPI?method=updateRegistration&api_key=cfrca&v=1.0' +
      '&fr_id=' +
      this.dataService.eventID +
      (this.dataService.isManualLogin === true
        ? '&sso_auth_token='
        : '&auth=') +
      this.dataService.ssoToken +
      '&checkin_status=' +
      this.checkInStatus +
      '&response_format=json';
    this.http
      .post(this.dataService.convioURL + this.method, null)
      .subscribe(res => {
        this.updateRegRes = res;
      });
  }

  // Gather Registration Information
  getRegInfo() {
    this.dataService.storageToken = localStorage.getItem('token');
    this.method =
      'CRTeamraiserAPI?method=getRegistration&api_key=cfrca&v=1.0&response_format=json&fr_id=' +
      this.dataService.eventID +
      (this.dataService.isManualLogin === true
        ? '&sso_auth_token='
        : '&auth=') +
      this.dataService.storageToken;
    this.http.post(this.dataService.convioURL + this.method, null).subscribe(
      res => {
        this.dataService.regResponse = res;
        this.dataService.participationID = this.dataService.regResponse.getRegistrationResponse.registration.participationTypeId;
        localStorage.setItem(
          'participationID',
          this.dataService.participationID
        );
        this.dataService.storageParticipationID = localStorage.getItem(
          'participationID'
        );
        this.dataService.emergencyName = this.dataService.regResponse.getRegistrationResponse.registration.emergencyName;
        this.dataService.emergencyPhone = this.dataService.regResponse.getRegistrationResponse.registration.emergencyPhone;
        this.dataService.getParticipationType();

        if (
          this.dataService.regResponse.getRegistrationResponse.registration
            .teamId > 0
        ) {
          this.dataService.getTeam();
        }
      },
      err => {
        console.log(err);
        this.dataService.tokenExpired = true;
        localStorage.clear();
        this.router.navigate(['/step-01']);
      }
    );
  }

  // Gather Constituent Information
  getUserInfo() {
    this.dataService.storageToken = localStorage.getItem('token');
    this.method =
      'CRConsAPI?method=getUser&api_key=cfrca&v=1.0&response_format=json&cons_id=' +
      this.dataService.storageConsID +
      (this.dataService.isManualLogin === true
        ? '&sso_auth_token='
        : '&auth=') +
      this.dataService.storageToken;
    this.http.post(this.dataService.convioURL + this.method, null).subscribe(
      res => {
        this.consData = res;
        console.log(this.consData);
        this.firstName = this.consData.getConsResponse.name.first;
        this.lastName = this.consData.getConsResponse.name.last;
        this.primaryAddress1 = this.consData.getConsResponse.primary_address.street1;
        this.primaryAddress2 = this.consData.getConsResponse.primary_address.street2;
        this.primaryCity = this.consData.getConsResponse.primary_address.city;
        this.primaryState = this.consData.getConsResponse.primary_address.state;
        this.primaryZip = this.consData.getConsResponse.primary_address.zip;
        this.dataService.consUserName = this.consData.getConsResponse.user_name;
        // this.gender = this.consData.getConsResponse.gender;
        // this.gender =
        //   this.consData.getConsResponse.gender === null
        //     ? this.genderSelecter[0].value
        //     : this.consData.getConsResponse.gender;
        // console.log(this.gender);
      },
      err => {
        console.log(err);
      }
    );
  }

  // Toggle Hammer
  // toggle() {
  //   if(this.hammerRes = 'Yes') {
  //     this.hammerRes = 'No';
  //     console.log(this.hammerRes);
  //   } else {
  //     this.hammerRes = 'Yes';
  //     console.log(this.hammerRes);
  //   }
  // }

  // Update Hammer
  // updateHammer() {
  //   const question_hammer =
  //     '&question_' + this.dataService.question20 + '=' + this.hammerRes;
  //   const updateSurveyResponsesUrl =
  //     'https://secure.conquercancer.ca/site/CRTeamraiserAPI?method=updateSurveyResponses&api_key=cfrca&v=1.0&response_format=json&fr_id=' +
  //     this.dataService.eventID +
  //     '&survey_id=' +
  //     this.dataService.surveyID;

  //   this.http
  //     .post(
  //       updateSurveyResponsesUrl +
  //         question_hammer +
  //         (this.dataService.isManualLogin === true
  //           ? '&sso_auth_token='
  //           : '&auth=') +
  //         this.dataService.ssoToken,
  //       null
  //     )
  //     .subscribe(
  //       res => {
  //         console.log(this.hammerRes);
  //         console.log(res);
  //       },
  //       error => {
  //         console.log(this.hammerRes);
  //         console.log(error);
  //       }
  //     );
  // }

  // Update Constituent Information
  updateUser() {
    if (this.primaryAddress2 === null) {
      this.primaryAddress2 = '';
    }

    const consUrl = '&cons_id=' + this.dataService.storageConsID;
    const ssoUrl =
      (this.dataService.isManualLogin === true
        ? '&sso_auth_token='
        : '&auth=') + this.dataService.storageToken;
    const firstNameUrl = '&name.first=' + this.firstName;
    const lastNameUrl = '&name.last=' + this.lastName;
    const address1Url = '&primary_address.street1=' + this.primaryAddress1;
    const address2Url = '&primary_address.street2=' + this.primaryAddress2;
    const cityUrl = '&primary_address.city=' + this.primaryCity;
    const stateUrl = '&primary_address.state=' + this.primaryState;
    const zipUrl = '&primary_address.zip=' + this.primaryZip;
    // const genderUrl = '&gender=' + this.gender;

    this.method =
      'CRConsAPI?method=update&api_key=cfrca&v=1.0&response_format=json' +
      consUrl +
      ssoUrl +
      firstNameUrl +
      lastNameUrl +
      // genderUrl +
      address1Url +
      address2Url +
      cityUrl +
      stateUrl +
      zipUrl;
    this.http.post(this.dataService.convioURL + this.method, null).subscribe(
      res => {
        this.updateUserResults = res;
        this.updateFlowStepNext();
        // this.router.navigate(['/step-03']);
      },
      err => {
        console.log(err);
      }
    );
  }

  getPhone() {
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
          // How many years have you ridden with The Ride?
          if (res.questionId === this.dataService.question13) {

            console.log(res.responseValue)

            if (this.primaryPhone === undefined) {
              this.primaryPhone = '';
            }
            if (res.responseValue !== undefined || res.responseValue !== null) {
              this.primaryPhone = res.responseValue;
            }
            if (Object.keys(res.responseValue).length === 0) {
              this.primaryPhone = '';
            }
          }

        }
      });
  }

  // Update the Survey Responses
  updatePhone() {
    for (const resp of this.surveyResults.getSurveyResponsesResponse
      .responses) {
      
      // Update Phone
      if (resp.questionId === this.dataService.question13) {
        if (this.primaryPhone === undefined || this.primaryPhone === null) {
          this.primaryPhone = resp.responseValue;
        }
      }
    }

    const updateSurveyResponsesUrl =
      'https://secure.conquercancer.ca/site/CRTeamraiserAPI?method=updateSurveyResponses&api_key=cfrca&v=1.0&response_format=json&fr_id=' +
      this.dataService.eventID +
      '&survey_id=' +
      this.dataService.surveyID;

    const question_phone =
      '&question_' + this.dataService.question13 + '=' + this.primaryPhone;

    this.http
      .post(
        updateSurveyResponsesUrl +
          question_phone +
          (this.dataService.isManualLogin === true
            ? '&sso_auth_token='
            : '&auth=') +
          this.dataService.ssoToken,
        null
      )
      .subscribe(
        res => {
          // console.log(res);
        },
        error => {
          console.log(error);
        }
      );
  }

  // Save Phone Answers (save for later)
  updatePhoneLater() {
    const updateSurveyResponsesUrl =
      'https://secure.conquercancer.ca/site/CRTeamraiserAPI?method=updateSurveyResponses&api_key=cfrca&v=1.0&response_format=json&fr_id=' +
      this.dataService.eventID +
      '&survey_id=' +
      this.dataService.surveyID;

    const question_phone =
      '&question_' + this.dataService.question9 + '=' + this.primaryPhone;

    this.http
      .post(
        updateSurveyResponsesUrl +
          question_phone +
          (this.dataService.isManualLogin === true
            ? '&sso_auth_token='
            : '&auth=') +
          this.dataService.ssoToken,
        null
      )
      .subscribe(
        res => {
          
        },
        error => {
          console.log(error);
        }
      );
  }

  // updateGender(event: MatRadioChange) {
  //   console.log(event.value);

  //   if (event.source.name === 'genderSelect') {
  //     const updateSurveyResponsesUrl =
  //       'https://secure.conquercancer.ca/site/CRTeamraiserAPI?method=updateSurveyResponses&api_key=cfrca&v=1.0&response_format=json&fr_id=' +
  //       this.dataService.eventID +
  //       '&survey_id=' +
  //       this.dataService.surveyID;

  //     const question_gender =
  //       '&question_' + this.dataService.question22 + '=' + event.value;

  //     this.http
  //       .post(
  //         updateSurveyResponsesUrl +
  //           question_gender +
  //           (this.dataService.isManualLogin === true
  //             ? '&sso_auth_token='
  //             : '&auth=') +
  //           this.dataService.ssoToken,
  //         null
  //       )
  //       .subscribe(
  //         res => {
  //           console.log('gender has been updated!');
  //         },
  //         error => {
  //           console.log(error);
  //           this.snackBar.open(
  //             'There was an error while trying to save. Please check the form.',
  //             'Close',
  //             {
  //               duration: 3500,
  //               panelClass: ['error-info']
  //             }
  //           );
  //         }
  //       );
  //   }
  // }

  hammerModal() {
    if (this.hammerRes === 'Yes') {
      this.hammerRes = 'No';
    } else if (this.hammerRes === 'No') {
      this.hammerRes = 'Yes';
    }
    console.log(this.hammerRes);

    if (this.remember === false) {
      this.openHammerDialog();
      this.remember = true;
      // this.toggle();      /
    }
  }

  validating() {
    if (this.step02Form.invalid) {
      if (this.firstName.length === 0) {
        this.firstNameError = true;
      }
      if (this.lastName.length === 0) {
        this.lastNameError = true;
      }
      if (this.primaryAddress1.length === 0) {
        this.streetError = true;
      }
      if (this.primaryCity.length === 0) {
        this.cityError = true;
      }
      if (this.primaryState.length === 0) {
        this.provinceError = true;
      }
      if (this.primaryZip.length === 0) {
        this.zipError = true;
      }
      // if (this.gender === undefined || this.gender === null) {
      //   this.genderError = true;
      // }
    } else if (this.step02Form.valid) {
      this.updateUser();
      this.updatePhone();
      // this.updateHammer();
    }
  }

  getPersonalPhoto() {
    const consId = '&cons_id=' + this.dataService.storageConsID;

    this.method =
      'CRTeamraiserAPI?method=getPersonalPhotos&api_key=cfrca&v=1.0&response_format=json' +
      consId +
      '&fr_id=' +
      this.dataService.eventID;
    this.http.post(this.dataService.convioURL + this.method, null).subscribe(
      res => {
        this.personalPhotoInfo = res;
        console.log(this.personalPhotoInfo);

        if (
          (this.personalPhotoInfo.getPersonalPhotosResponse.photoItem[0].customUrl =
            '../images/friendraiser_uploads/1895368406.custom.jpg')
        ) {
          this.hasPhoto = false;
        } else {
          this.hasPhoto = true;
          this.personalPhotoUrl = this.personalPhotoInfo.getPersonalPhotosResponse.photoItem[0].customUrl.replace(
            '..',
            'https://secure.conquercancer.ca'
          );
        }
      },
      err => {
        console.log('There was an error getting the photo:');
        console.log(err);
      }
    );
  }

  // Save Constituent Information
  updateUserSave() {
    if (this.primaryAddress2 === null) {
      this.primaryAddress2 = '';
    }

    const consUrl = '&cons_id=' + this.dataService.storageConsID;
    const ssoUrl =
      (this.dataService.isManualLogin === true
        ? '&sso_auth_token='
        : '&auth=') + this.dataService.storageToken;
    const firstNameUrl = '&name.first=' + this.firstName;
    const lastNameUrl = '&name.last=' + this.lastName;
    const address1Url = '&primary_address.street1=' + this.primaryAddress1;
    const address2Url = '&primary_address.street2=' + this.primaryAddress2;
    const cityUrl = '&primary_address.city=' + this.primaryCity;
    const stateUrl = '&primary_address.state=' + this.primaryState;
    const zipUrl = '&primary_address.zip=' + this.primaryZip;
    // const genderUrl = '&gender=' + this.gender;

    this.method =
      'CRConsAPI?method=update&api_key=cfrca&v=1.0&response_format=json' +
      consUrl +
      ssoUrl +
      firstNameUrl +
      lastNameUrl +
      // genderUrl +
      address1Url +
      address2Url +
      cityUrl +
      stateUrl +
      zipUrl;
    this.http.post(this.dataService.convioURL + this.method, null).subscribe(
      res => {
        this.updatePhoneLater();
        this.updateUserResults = res;
        this.snackBar.open('Your information has been saved!', 'Close', {
          duration: 3500,
          panelClass: ['saved-info']
        });
      },
      err => {
        if (err) {
          this.snackBar.open(
            'There was an error while trying to save. Please check the form.',
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

  // Check Logged In State
  isLoggedIn() {
    return this.dataService.isLoggedIn();
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
        if (this.getFlowStepNumber !== this.flowStep) {
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
          if (this.getFlowStepNumber === '4') {
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
        if (err) {
          this.snackBar.open(
            'There was an error, please login again.',
            'Close',
            {
              duration: 3500,
              panelClass: ['error-info']
            }
          );
        }

        this.dataService.logOut();
      }
    );
  }

  // Get user's checkin status
  getCheckInStatus() {
    this.method =
      'CRTeamraiserAPI?method=getRegistration&api_key=cfrca&v=1.0&response_format=json&fr_id=' +
      this.dataService.eventID +
      (this.dataService.isManualLogin === true
        ? '&sso_auth_token='
        : '&auth=') +
      this.dataService.storageToken;
    this.http.post(this.dataService.convioURL + this.method, null).subscribe(
      res => {
        // Results from the API Call
        this.dataService.regResponse = res;
        this.dataService.checkInStatus = this.dataService.regResponse.getRegistrationResponse.registration.checkinStatus;
        this.updateFlowStep();
      },
      error => {}
    );
  }

  // Update the Flow Step
  updateFlowStep() {
    if (this.dataService.getCheckInStatus) {
    }

    const paidStatus = this.dataService.checkInStatus === 'paid';
    const completeStatus = this.dataService.checkInStatus === 'complete';
    const committedStatus = this.dataService.checkInStatus === 'committed';

    if (paidStatus || completeStatus || committedStatus) {
      this.dataService.method =
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
      this.dataService.method =
        'CRTeamraiserAPI?method=updateRegistration&api_key=cfrca&v=1.0' +
        '&fr_id=' +
        this.dataService.eventID +
        (this.dataService.isManualLogin === true
          ? '&sso_auth_token='
          : '&auth=') +
        this.dataService.storageToken +
        '&checkin_status=started' +
        '&flow_step=' +
        this.flowStep +
        '&response_format=json';
    }

    this.http
      .post(this.dataService.convioURL + this.dataService.method, null)
      .subscribe(res => {
        this.updateRegRes = res;
      });
  }

  updateFlowStepNext() {
    const paidStatus = this.dataService.checkInStatus === 'paid';
    const completeStatus = this.dataService.checkInStatus === 'complete';
    const committedStatus = this.dataService.checkInStatus === 'committed';

    if (paidStatus || completeStatus || committedStatus) {
      this.dataService.method =
        'CRTeamraiserAPI?method=updateRegistration&api_key=cfrca&v=1.0' +
        '&fr_id=' +
        this.dataService.eventID +
        (this.dataService.isManualLogin === true
          ? '&sso_auth_token='
          : '&auth=') +
        this.dataService.storageToken +
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
        this.dataService.storageToken +
        '&checkin_status=started' +
        '&flow_step=2' +
        '&response_format=json';
    }

    this.http
      .post(this.dataService.convioURL + this.dataService.method, null)
      .subscribe(
        res => {
          this.updateRegRes = res;
          this.router.navigate(['/step-03']);
        },
        err => {
          if (err) {
            this.snackBar.open(
              'There was an error, please login again.',
              'Close',
              {
                duration: 3500,
                panelClass: ['error-info']
              }
            );
            this.dataService.logOut();
          }
        }
      );
  }

  openDialog() {
    this.dialog.open(Step02DialogComponent, {
      width: '600px'
    });
  }
  openHammerDialog() {
    this.dialog.open(Step02HammerDialogComponent, {
      width: '400px'
    });
  }
}
