import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  HostListener,
  Renderer2,
  ElementRef
} from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

/* Angular Material */
import { MatSnackBar } from '@angular/material/snack-bar';

/* Data Service */
import { DataService } from '../data.service';

@Component({
  selector: 'app-step-05',
  templateUrl: './step-05.component.html',
  styleUrls: ['./step-05.component.scss']
})
export class Step05Component implements OnInit, OnDestroy {
  // Flowstep
  flowStep = '4';
  flowStepResults: any = {};
  getFlowStepNumber: string;

  // ViewChild to connect DOM Element to Typescript
  @ViewChild('videoPlayer') videoplayer: any;
  // @ViewChild('waiverTxt') waiverText: any;

  // Defining the formgroup
  waiverForm: FormGroup;
  waiverError = false;

  // Variables for DOM Manipulation
  fullName: string;
  ufullName: string;
  gfullName: string;
  ageResponse: boolean;
  ageResponseVal: string;
  underAgeResponseVal: string;
  guardianRes: boolean;
  guardianResVal: string;
  guardianReq = false;
  guardianNameRes: string;
  guardianNameR: boolean;
  videoResponse: string;
  videoWatched = false;
  scrolledBottom = false;
  either: false;
  guardianNameReq = false;
  guardianNameResError = false;
  underAge: boolean;
  underAgeVal: string;
  ufName: string;
  ulName: string;
  ufirstName: string;
  ulastName: string;

  firstName: string;
  lastName: string;
  gfirstName: string;
  glastName: string;

  overAgeReq = false;
  underAgeReq = false;
  guardReq = false;

  overAgeError = false;
  underAgeError = false;
  guardianError = false;

  errorA = false;
  errorB = false;
  errorC = false;
  errorD = false;
  errorE = false;
  errorF = false;

  // Survey results
  surveyResults: any = {};

  // Admin panel data
  adminResults: any = {};

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

    // this.adminAPI();

    // Checking logged in state, and running correct functions
    if (this.data.isLoggedIn() === true && this.data.tokenExpired === false) {
      // console.log('You are logged in!');

      // Run getRegInfo function from the dataService to make sure you capture the user's checkin status to be used for other calls (such as updateflowStep and previousFlowstep, etc)..
      this.data.getRegInfo();
      this.getFlowStep();

      // this.dataService.getParticipationType();
    } else if (this.data.storageToken === undefined) {
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

    // Defining the FormGroup with the DOM Elements and Validators
    this.waiverForm = new FormGroup({
      fullName: new FormControl('', [
        Validators.required,
        Validators.max(40),
        Validators.min(5)
      ]),
      ageResponse: new FormControl('', Validators.required),
      // guardianRes: new FormControl('', Validators.required),
      underAge: new FormControl(this.underAge, Validators.required),
      ufName: new FormControl(this.ufName, Validators.required),
      ulName: new FormControl(this.ulName, Validators.required),
      guardianRes: new FormControl(this.guardianRes, Validators.required),
      guardianName: new FormControl(this.guardianNameRes),
      fName: new FormControl(this.firstName, Validators.required),
      lName: new FormControl(this.lastName, Validators.required),
      gfName: new FormControl(this.gfirstName, Validators.required),
      glName: new FormControl(this.glastName, Validators.required),
    });
  }

  // Clear the timeout function upon entering a new route
  ngOnDestroy() {
    clearTimeout(this.timeOut);
    clearTimeout(this.timeOut2);
  }

  // Admin Panel API call
  adminAPI() {
    this.http
      .get(
        'http://www.conquercancer.ca/site/PageServer?pagename=to18_oci_api&pgwrap=n'
      )
      .subscribe(
        res => {
          // console.log(res);
        },
        error => {
          console.log('there was an error');
          console.log(error);
        }
      );
  }

  // Checking the Waiver Scroll position and setting scrolledBottom boolean to true if scrolled more than or equal to 950
  // waiverScroll() {
  // 	if (this.waiverText.nativeElement.scrollY >= 950) {
  // 		this.scrolledBottom = true;
  // 	}
  // }

  // Function to prevent user from seeking the video
  seekingVideo(event) {
    const currentTime = 0;

    if (currentTime < event.target.currentTime) {
      event.target.currentTime = currentTime;
    }
  }

  vidEnded() {
    this.videoResponse = 'Yes';
    this.videoWatched = true;
  }

  playVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }

  pauseVideo(event: any) {
    this.videoplayer.nativeElement.pause();
  }

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
        for (const data of this.surveyResults.getSurveyResponsesResponse
          .responses) {
          // If questionId is same as waiver question ID in Survey then check if fullName variable is undefined or null, if so set it as the response value else if it's length is equil to 0 or no reponseValue, then set it to a blank string

          // Hidden Safety Video Watched
          if (data.questionId === this.data.question8) {
            if (this.videoResponse === undefined || null) {
              this.videoResponse = data.responseValue;
            }
            if (Object.keys(data.responseValue).length === 0) {
              this.videoResponse = 'No';
            }
            if (data.responseValue === 'Yes') {
              this.videoWatched = true;
            }
          }

          // Waiver and Release Full Name
          if (data.questionId === this.data.question9) {

            console.log(data.responseValue)
            if (data.responseValue === 'undefined undefined' || data.responseValue === 'undefined' || data.responseValue === undefined ) {
              
              console.log('test')

              this.fullName = '';
              this.firstName = '';
              this.lastName = '';
            } 

            if (data.responseValue.length > 0) {
              this.fullName = data.responseValue;

              this.firstName = data.responseValue.split(' ')[0];
              this.lastName = data.responseValue.split(' ')[1];

            } else {
              this.fullName = '';
              this.firstName = '';
              this.lastName = '';
            }
            
            if (Object.keys(data.responseValue).length === 0) {
              this.fullName = '';
            }

            if (this.firstName == undefined) {
              this.firstName = '';
            }

            if (this.lastName == undefined) {
              this.lastName = '';
            }

          }

          // 18 Years Check Box
          if (data.questionId === this.data.question10) {
            if (this.ageResponseVal === undefined || null) {
              this.ageResponseVal = data.responseValue;
            }
            if (Object.keys(data.responseValue).length === 0) {
              this.ageResponseVal = '';
            }

            // If response value is Yes, set the checkBox to be true (checkboxes only accept true or false values, the value returned from and sent to the call are a string)
            if (data.responseValue === 'Yes') {
              this.ageResponse = true;
              this.scrolledBottom = true;
            }
            if (data.responseValue === 'No') {
              this.ageResponse = false;
            }
          }

          // Guardian Waiver
          if (data.questionId === this.data.question11) {

            // Check to remove Guardian
            if ( this.ageResponse === true ) {
              this.guardianRes = false;
            } else {
              if (this.guardianRes === undefined || null) {
                this.guardianRes = data.responseValue;
              }
              

              // If response value is Yes, set the checkBox to be true (checkboxes only accept true or false values, the value returned from and sent to the call are a string)
              if (data.responseValue === 'Yes') {
                this.guardianRes = true;
                this.scrolledBottom = true;
              }
              if (data.responseValue === 'No') {
                this.guardianRes = false;
              }
            }

          }

          // Guardian Name
          if (data.questionId === this.data.question17) {
            if (this.gfullName === undefined || null) {

              // console.log(data.responseValue)
              
              if (data.responseValue === 'undefined undefined') {
                this.gfirstName = '';
                this.glastName = '';
              } else {
                this.gfullName = data.responseValue;
                
                this.gfirstName = data.responseValue.split(' ')[0];
                this.glastName = data.responseValue.split(' ')[1];
              }
              
            }
            if (Object.keys(data.responseValue).length === 0) {
              this.gfullName = '';
            }
          }

          // Under 18 Full Name
          if (data.questionId === this.data.question16) {
            if (this.ufullName === undefined || null) {
              // console.log(data.responseValue)

              if (data.responseValue === 'undefined undefined') {
                this.ufirstName = '';
                this.ulastName = '';
              } else {
                this.ufullName = data.responseValue;

                this.ufirstName = data.responseValue.split(' ')[0];
                this.ulastName = data.responseValue.split(' ')[1];
              }

            }
            if (Object.keys(data.responseValue).length === 0) {
              this.ufullName = '';
            }
          }

          // 18 Years Check Box Waiver Under 18
          if (data.questionId === this.data.question18) {
            if (this.underAgeVal === undefined || null) {
              this.underAgeVal = data.responseValue;
            }
            if (Object.keys(data.responseValue).length === 0) {
              this.underAgeVal = '';
            }

            // If response value is Yes, set the checkBox to be true (checkboxes only accept true or false values, the value returned from and sent to the call are a string)
            if (data.responseValue === 'Yes') {
              this.underAge = true;
              this.scrolledBottom = true;
            }
            if (data.responseValue === 'No') {
              this.underAge = false;
            }
          }
          
        }
      },
      err => {
        console.log('There was an error!');
        if (err.status === 403) {
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

    // console.log(this.guardianNameRes)
    // console.log(this.errorB)
    // console.log(this.ulastName)
    // console.log(this.ufirstName)
    

    if ( this.underAge === true || this.ageResponse === true ) {
      this.underAgeError = false;
      this.overAgeError = false;

      if ( this.ageResponse === true ) {
        if ( this.firstName == undefined ) {
          this.errorA = true;
        } else {
          this.errorA = false;
        }

        if ( this.lastName == undefined ) {
          this.errorB = true;
        } else {
          this.errorB = false;
        }

      }

      if ( this.underAge === true ) {

        this.guardianReq = true;

        if ( this.ufirstName == undefined ) {
          this.errorC = true;
        } else {
          this.errorC = false;
        }

        if ( this.ulastName == undefined ) {
          this.errorD = true;
        } else {
          this.errorD = false;
        }

      } else {
        this.guardianReq = false;
      }

      if ( this.guardianReq = true ) {


        if ( this.guardianRes === false && this.underAge === true ) {
          this.guardianError = true;
        }

        if ( this.guardianRes === true ) {
          this.guardianError = false;

          if ( this.gfirstName == undefined || this.gfirstName.length === 0 ) {
            this.errorE = true;
          } else {
            this.errorE = false;
          }

          if ( this.glastName == undefined || this.glastName.length === 0 ) {
            this.errorF = true;
          } else {
            this.errorF = false;
          }
        }
        
      } 

    } else {
      this.underAgeError = true;
      this.overAgeError = true;
    }

    this.fullName = this.firstName + ' ' + this.lastName;
    this.ufullName = this.ufirstName + ' ' + this.ulastName;
    this.gfullName = this.gfirstName + ' ' + this.glastName;
    
    

    if (
      this.underAgeError ||
      this.overAgeError ||
      this.errorA ||
      this.errorB ||
      this.errorC ||
      this.errorD ||
      this.errorE ||
      this.errorF || 
      this.guardianError
    ) {
      console.log('Error spotted');
    } else {
      this.updateSurveyRes();
    }
  }

  updateSurveyRes() {
    const question_video =
      '&question_' + this.data.question8 + '=' + this.videoResponse;
    const question_age =
      '&question_' + this.data.question10 + '=' + this.ageResponseVal;
    const question_uage =
      '&question_' + this.data.question18 + '=' + this.underAgeVal;  
    const question_guard =
      '&question_' + this.data.question11 + '=' + this.guardianResVal;
    const question_guard_name =
      '&question_' + this.data.question17 + '=' + this.gfullName;
    const question_name =
      '&question_' + this.data.question9 + '=' + this.fullName;
    const question_uname =
      '&question_' + this.data.question16 + '=' + this.ufullName;
    // const question_over_age =
    //   '&question_' + this.data.question14 + '=' + this.guardianNameRes;
    // const question_waiver =
    //   '&question_' + this.data.question9 + '=' + this.fullName;

    const updateSurveyResponsesUrl =
      'https://secure.conquercancer.ca/site/CRTeamraiserAPI?method=updateSurveyResponses&api_key=cfrca&v=1.0&response_format=json&fr_id=' +
      this.data.eventID;

    this.http
      .post(
        updateSurveyResponsesUrl +
          question_video +
          question_age +
          question_uage + 
          question_uname + 
          question_guard +
          question_guard_name +
          question_name +
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

          // Once the updateSurveyRes() function is successful, update the flowStep to the next flowStep
          this.nextFlowStep();
        },
        error => {
          console.log('There was an error');
        }
      );
  }

  updateSurveyResSave() {
    const question_video =
      '&question_' + this.data.question8 + '=' + this.videoResponse;
    const question_age =
      '&question_' + this.data.question10 + '=' + this.ageResponseVal;
    const question_uage =
      '&question_' + this.data.question18 + '=' + this.underAgeVal;  
    const question_guard =
      '&question_' + this.data.question11 + '=' + this.guardianResVal;
    const question_guard_name =
      '&question_' + this.data.question17 + '=' + this.gfullName;
    const question_name =
      '&question_' + this.data.question9 + '=' + this.fullName;
    const question_uname =
      '&question_' + this.data.question16 + '=' + this.ufullName;
    // const question_over_age =
    //   '&question_' + this.data.question14 + '=' + this.guardianNameRes;
    // const question_waiver =
    //   '&question_' + this.data.question9 + '=' + this.fullName;

    const updateSurveyResponsesUrl =
      'https://secure.conquercancer.ca/site/CRTeamraiserAPI?method=updateSurveyResponses&api_key=cfrca&v=1.0&response_format=json&fr_id=' +
      this.data.eventID;

    this.http
      .post(
        updateSurveyResponsesUrl +
          question_video +
          question_age +
          question_uage + 
          question_uname + 
          question_guard +
          question_guard_name +
          question_name +
          '&survey_id=' +
          this.data.surveyID +
          (this.data.isManualLogin === true ? '&sso_auth_token=' : '&auth=') +
          this.data.ssoToken,
        null
      )
      .subscribe(
        res => {
          this.surveyResults = res;

          console.log(res)

          this.snackBar.open('Your information has been saved!', 'Close', {
            duration: 3500,
            panelClass: ['saved-info']
          });
        },
        error => {
          // console.log('There was an error');
        }
      );
  }

  checkRes() {

    this.underAge = false;
    // this.guardianNameRes = false;
    this.guardianRes = false;
    this.guardianResVal = "No";

    
    this.ufirstName = '';
    this.ulastName = '';
    this.gfirstName = '';
    this.glastName = '';

    if (this.ageResponse === true) {
      this.ageResponseVal = 'Yes';
    }
    if (this.ageResponse === false) {
      this.ageResponseVal = 'No';
    }
    if (this.underAge) {
      this.underAgeVal = 'Yes';
    }
    if (this.underAge === false) {
      this.underAgeVal = 'No';
    }

    // Sign means you gotta fill name
    this.overAgeReq = true;

  }

  checkResB() {

    this.ageResponse = false;
    this.guardianResVal = "Yes";
    
    this.firstName = '';
    this.lastName = '';

    if (this.ageResponse) {
      this.ageResponseVal = 'Yes';
    }
    if (this.ageResponse === false) {
      this.ageResponseVal = 'No';
    }
    if (this.underAge) {
      this.underAgeVal = 'Yes';
    }
    if (this.underAge === false) {
      this.underAgeVal = 'No';
    }

    this.underAgeReq = true;
  }

  // Update the current Flowstep
  updateFlowStep() {
    this.data.method =
      'CRTeamraiserAPI?method=updateRegistration&api_key=cfrca&v=1.0' +
      '&fr_id=' +
      this.data.eventID +
      (this.data.isManualLogin === true ? '&sso_auth_token=' : '&auth=') +
      this.data.ssoToken +
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
    this.flowStep = '5';
    this.data.method =
      'CRTeamraiserAPI?method=updateRegistration&api_key=cfrca&v=1.0' +
      '&fr_id=' +
      this.data.eventID +
      (this.data.isManualLogin === true ? '&sso_auth_token=' : '&auth=') +
      this.data.ssoToken +
      '&checkin_status=' +
      this.data.checkInStatus +
      '&flow_step=' +
      this.flowStep +
      '&response_format=json';
    this.http.post(this.data.convioURL + this.data.method, null).subscribe(
      res => {
        // Update the flowStep to the next flowstep once everything checks out properly
        this.route.navigate(['/step-06']);
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

  // Update the current Flowstep
  previousFlowStep() {
    this.flowStep = '3';
    this.data.method =
      'CRTeamraiserAPI?method=updateRegistration&api_key=cfrca&v=1.0' +
      '&fr_id=' +
      this.data.eventID +
      (this.data.isManualLogin === true ? '&sso_auth_token=' : '&auth=') +
      this.data.ssoToken +
      '&checkin_status=' +
      this.data.checkInStatus +
      '&flow_step=' +
      this.flowStep +
      '&response_format=json';
    this.http.post(this.data.convioURL + this.data.method, null).subscribe(
      res => {
        // Route user to previous flow step
        this.route.navigate(['/step-04']);
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
          // If the flow step matches to where they are supposed to be, then run the functions for the page below
          this.getSurveyRes();
          this.updateFlowStep();
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
        // this.data.logOut();
      }
    );
  }
}
