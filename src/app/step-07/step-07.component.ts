import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { Router } from '@angular/router';

/* HTTP Client to retrieve data */
import {
  HttpClient,
  HttpRequest,
  HttpEvent,
  HttpEventType
} from '@angular/common/http';

/* Angular Material */
import { MatSnackBar } from '@angular/material/snack-bar';

/* Data Service */
import { DataService } from '../data.service';

@Component({
  selector: 'app-step-07',
  templateUrl: './step-07.component.html',
  styleUrls: ['./step-07.component.scss']
})
export class Step07Component implements OnInit, OnDestroy, AfterViewInit {
  // Setting the FlowStep
  flowStep = '6';
  flowStepResults: any = {};
  getFlowStepNumber: string;

  // Method for API
  method: string;

  // getSurvey Results Data
  surveyResults: any = {};
  upsellResponse: string;
  hiddenUpsellID: string;

  // Fundraising Results Data
  fundResponse: any = {};
  minimumGoal: string;
  amountRaised: string;
  personalGoal: string;
  fundsMet = true;
  fundraisingMetGoal = false;

  // Get Team Results Data
  getTeamRes: any = {};
  teamName: any = {};

  // Team Fundraising Variables
  teamFundResponse: any = {};
  teamExcessFunds = 0;
  partMin: any;
  teamTotalMin: number;
  totalMinRequired = 0;
  allTeamRaised = 0;
  teamFundsNeeded: number;
  totalFundsDeci: any;
  totalFundsNeeded: number;
  totalCompleted: number;
  fundsNeededPlusUpsell: any;
  raisedPlusUpsell: any;
  raisedMinusUpsell: any;
  buttonFundsNeeded = false;

  // Get Participants Results Data
  getParticipantRes: any = {};

  // Consituent ID
  consID: string;

  // Registration Response Data
  regResponse: any = {};
  updateRegRes: any = {};
  checkinStatus: string;
  checkInCommitted = true;

  // Get DSP/ISP ID Results
  linksResult: any = {};
  linksResultDSP: any = {};

  // ISP & DSP Variables
  ispID: string = '2984';
  ispURL: string;
  ispTail: string;
  ispTailB: string;
  dspID: string = '2983';
  dspURL: string;
  dspTail: string;
  dspTailB: string;
  hideDSP = true;
  hideISP = true;
  dspSelected: boolean;
  ispSelected: boolean;

  // Team boolean
  inTeam: boolean;
  raised: boolean;
  more: boolean;
  done: boolean;

  // Variable for timeout function
  timeOut: any;
  timeOut2: any;

  // Upsell Data / Response
  upsellInfo: any = {};
  upsellPriceNumber: number;
  upsellPrice: any;
  upsellVisual: any;

  // fundGoalZero: number = 0;
  fundGoal: number = 2500000;

  constructor(
    private data: DataService,
    private http: HttpClient,
    private router: Router,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // this.data.getRegDocument();
    // this.data.processRegistration();

    window.scrollTo(0, 0);

    // Checking logged in state, and running correct functions
    if (this.data.isLoggedIn() === true && this.data.tokenExpired === false) {
      // If logged in state is correct, run functions
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

      this.router.navigate(['/step-01']);
    } else {
      // if not logged in, go back to step 1 (login page)
      this.snackBar.open('You are not logged in, please login.', 'Close', {
        duration: 3500,
        panelClass: ['error-info']
      });

      this.router.navigate(['/step-01']);
    }

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
  }

  ngAfterViewInit() {
    // Adding upsell addon IDs
    // if (
    //   this.upsellPrice != 0
    // ) {
    // }
    // if (isNaN(this.fundsNeededPlusUpsell)) {
    //   const tempNum =
    //     parseInt(this.minimumGoal, 0) + parseInt(this.upsellPrice, 0);
    //   const tempDigits = tempNum / 100;
    //   this.fundsNeededPlusUpsell = tempDigits.toFixed(2);
    // }
  }

  // Clear the timeout function upon entering a new route
  ngOnDestroy() {
    clearTimeout(this.timeOut);
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
          this.getSurvey();
          this.data.getUserInfo();
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
        console.log(err);

        // If flowstep has error, log out the user (to prevent API errors)
        this.data.logOut();
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

        console.log(this.checkinStatus);

        if (
          this.checkinStatus === 'committed' ||
          this.checkinStatus === 'paid'
        ) {
          this.checkInCommitted = false;
          this.hideDSP = false;
          this.hideISP = false;
          this.fundsMet = false;
        }

        // if (this.regResponse.getRegistrationResponse.registration.teamId > 0) {
        //   this.inTeam = true;
        // }

        this.getFundraising();
        this.getIspDspID();
        this.updateFlowStep();
      },
      err => {
        console.log(err);
        this.data.tokenExpired = true;
        this.router.navigate(['/step-01']);
      }
    );
  }

  // Gather Fundraising Results
  getFundraising() {
    this.method =
      'CRTeamraiserAPI?method=getFundraisingResults&api_key=cfrca&v=1.0&response_format=json&cons_id=' +
      this.consID +
      '&fr_id=' +
      this.data.eventID;
    this.http.get(this.data.convioURL + this.method).subscribe(
      data => {
        this.fundResponse = data;
        // console.log(this.fundResponse);

        this.personalGoal = this.fundResponse.getFundraisingResponse.fundraisingRecord.personalGoal;
        // console.log(this.personalGoal)
        // this.updateFundraisingGoal(this.fundGoal);

        // Setting Amount Raised and Minimum required
        const numberMin = parseInt(
          this.fundResponse.getFundraisingResponse.fundraisingRecord.minimumGoal
        );
        const numberRaised = parseInt(
          this.fundResponse.getFundraisingResponse.fundraisingRecord
            .amountRaised
        );

        const numberMinplusA = ((numberMin + this.upsellPrice) / 100).toFixed(
          2
        );

        const addDeciMin = (numberMin / 100).toFixed(2);
        const addDeciRaised = (numberRaised / 100).toFixed(2);

        const newMin = addDeciMin.toString();
        const newRaised = addDeciRaised.toString();

        this.amountRaised = newRaised;
        this.minimumGoal = newMin;

        this.fundsNeededPlusUpsell = numberMinplusA;
        this.raisedPlusUpsell = (
          (this.upsellPrice - numberRaised) /
          100
        ).toFixed(2);
        this.raisedMinusUpsell = (
          (numberRaised - this.upsellPrice) /
          100
        ).toFixed(2);

        // console.log(this.raisedPlusUpsell);
        // console.log(this.raisedMinusUpsell);

        console.log(numberRaised);
        console.log(this.upsellPrice);

        if ( numberRaised >= this.upsellPrice ) {
          this.hideISP = false;
          this.hideDSP = false;
          this.fundsMet = false;
          this.raised = true;
        } else {
          this.hideISP = true;
          this.hideDSP = true;
          this.fundsMet = true;
          this.raised = false;
        }

        // if ()

        console.log(this.done)
        console.log(this.raised)
        console.log(this.more)


        // if (this.upsellPrice > numberRaised) {
        //   this.raised = false;
        //   // console.log(this.raised);
        // } else {
        //   this.raised = true;
        //   // this.more = true;
        // }

        // if (this.amountRaised > 0) {
        //   this.raised = true;
        // }

        // console.log(this.raisedMinusUpsell * 100)

        if ( this.more === true ) {
          this.ispTail = '&set.DonationLevel=7710&set.Value=' + (this.raisedMinusUpsell * 100); 
        } else {
          this.ispTail = '&set.DonationLevel=7710&set.Value=' + (this.raisedPlusUpsell * 100); 
        }

        // if (this.more = true) {
        //   this.ispTail = '&set.DonationLevel=7710&set.Value=' + (this.raisedMinusUpsell * 100);
        // } else {
        //   this.ispTail = '&set.DonationLevel=7710&set.Value=' + (this.raisedMinusUpsell * 100);

        // }

        // (this.raised === true ? this.raisedPlusUpsell : this.upsellPrice);
        // this.ispTail = '&set.DonationLevel=7710&set.Value=' + (this.raisedPlusUpsell * 100);
        this.ispTailB = '&set.DonationLevel=7710&set.Value=' + this.upsellPrice;

        this.dspTail = '&set.DonationLevel=7710&set.Value=' +
        (this.raised === true ? this.raisedPlusUpsell : this.upsellPrice);

        this.dspTailB = '&set.DonationLevel=7710&set.Value=' + this.upsellPrice;

        // if (this.raisedPlusUpsell < this.raisedMinusUpsell) {
        //   this.raised = true;
        // } else {
        //   this.raised = false;
        // }

        if (this.raisedPlusUpsell > 0) {
          if (
            this.checkinStatus === 'committed' ||
            this.checkinStatus === 'paid'
          ) {
            this.hideISP = false;
            this.hideDSP = false;
            this.fundsMet = false;
          } else {
            this.fundsMet = true;
          }
        }

        // this.checkinStatus === 'committed' ||
        //   this.checkinStatus === 'paid'

        // if (this.raisedPlusUpsell > 0 && this.checkinStatus) {
        //   this.fundsMet = true;
        // } else if (this.raisedPlusUpsell) {
        //   this.hideISP = false;
        //   this.hideDSP = false;
        //   this.fundsMet = false;
        // }

        // console.log(this.raisedPlusUpsell)

        // if (this.raisedPlusUpsell <= 0) {
        //   this.hideISP = false;
        //   this.hideDSP = false;
        //   this.fundsMet = false;
        // }

        // Total Funds needed math
        this.totalFundsNeeded = numberMin - numberRaised;

        this.totalFundsDeci = (this.totalFundsNeeded / 100).toFixed(2);

      },
      error => {
        if (error) {
          console.log(error);
        }
      }
    );
  }

  // updateFundraisingGoal(goal) {
  //   // console.log(goal)
  //   this.data.method =
  //     'CRTeamraiserAPI?method=updateRegistration&api_key=cfrca&v=1.0' +
  //     '&fr_id=' +
  //     this.data.eventID +
  //     (this.data.isManualLogin === true ? '&sso_auth_token=' : '&auth=') +
  //     this.data.ssoToken +
  //     '&goal=' +
  //     goal +
  //     '&response_format=json';
  //   this.http.post(this.data.convioURL + this.data.method, null).subscribe(
  //     res => {
  //       // console.log(res)
  //     },
  //     err => {
  //       if (err) {
  //         this.snackBar.open('There was an unknown error.', 'Close', {
  //           duration: 3500,
  //           panelClass: ['error-info']
  //         });

  //         this.data.logOut();
  //       }
  //     }
  //   );
  // }

  // Get the DSP and ISP IDs (used for DSP/ISP addon links)
  getIspDspID() {
    
    this.ispURL =
      'https://secure.conquercancer.ca/site/Donation2?df_id=' +
      this.ispID +
      '&' +
      this.ispID +
      // '.donation=form1&mfc_pref=T&FILL_AMOUNT=TR_REMAINDER' +
      '.donation=form1&mfc_pref=T' +
      '&' +
      'PROXY_ID=' +
      this.consID +
      '&' +
      'PROXY_TYPE=20&FR_ID=' +
      this.data.eventID;
    // '&set.DonationLevel=7710' +
      // '&set.Value=' + 
      // (this.raised === true ? this.raisedPlusUpsell : this.upsellPrice);
    // '&DESIGNATED_ADDON_ID=1441';
    this.dspURL =
      'https://secure.conquercancer.ca/site/Donation2?df_id=' +
      this.dspID +
      '&' +
      this.dspID +
      '.donation=form1&mfc_pref=T&FILL_AMOUNT=TR_REMAINDER' +
      // '.donation=form1&mfc_pref=T' +
      '&' +
      'PROXY_ID=' +
      this.consID +
      '&' +
      'PROXY_TYPE=20&FR_ID=' +
      this.data.eventID;
      // '&set.Value=' + 
      // (this.raised === true ? this.raisedPlusUpsell : this.upsellPrice);
    // '&set.Value=' + '5' + '00';

    // console.log(this.ispURL)
    // console.log(this.dspURL)
  }

  // shows dsp form & get data for it
  dspOnSelect() {
    // when dsp button is clicked
    this.dspSelected = true;
    this.data.method =
      'CRDonationAPI?method=getDonationFormInfo&form_id=2733&api_key=cfrca&v=1.0&response_format=json&include_custom_elements=true';
    this.http
      .get(this.data.convioURL + this.data.method)
      .subscribe(res => console.log(res));
  }
  // Gather Survery Results
  getSurvey() {
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
        // For loop to loop through the responded data from API call
        for (const data of this.surveyResults.getSurveyResponsesResponse
          .responses) {
          // Upsell response (yes or no)
          // if (data.questionId === this.data.question12) {
          //   this.upsellResponse = data.responseValue;
          // }
          // Hidden upsell value
          // if (data.questionId === this.data.question12) {
          //   this.hiddenUpsellID = data.responseValue;
          // }

          if (data.questionId === this.data.question12) {
            console.log(data);
            this.upsellResponse = 'Yes';
            // console.log(this.minimumGoal)
            // console.log(this.fundsNeededPlusUpsell)

            if (data.responseValue === '350') {
              this.upsellPrice = 35000;
              this.upsellVisual = (this.upsellPrice / 100).toFixed(2);
            } else if (data.responseValue === '750') {
              this.upsellPrice = 75000;
              this.upsellVisual = (this.upsellPrice / 100).toFixed(2);
            } else if (data.responseValue === '1000') {
              this.upsellPrice = 100000;
              this.upsellVisual = (this.upsellPrice / 100).toFixed(2);
            } else if (data.responseValue === '1500') {
              this.upsellPrice = 150000;
              this.upsellVisual = (this.upsellPrice / 100).toFixed(2);
            } else if (data.responseValue === '2500') {
              this.upsellPrice = 250000;
              this.upsellVisual = (this.upsellPrice / 100).toFixed(2);
            } else if (data.responseValue === '250001') {
              this.upsellPrice = 250000;
              this.upsellVisual = (this.upsellPrice / 100).toFixed(2);
            } else if (data.responseValue === '1') {
              this.upsellPrice = 0;
              this.upsellVisual = 0;
            } else {
              this.upsellPrice = 0;
            }
          }
        }
        // this.getUpsell();
        this.getRegInfo();
      },
      err => {
        if (err.status === 403) {
          this.data.logOut();
          this.snackBar.open(
            'Login session expired, please login again.',
            'Close',
            {
              duration: 3500,
              panelClass: ['error-info']
            }
          );
          this.router.navigate(['/step-01']);
        }
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
      this.data.ssoToken +
      '&checkin_status=' +
      this.checkinStatus +
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
    this.flowStep = '7';
    this.data.method =
      'CRTeamraiserAPI?method=updateRegistration&api_key=cfrca&v=1.0' +
      '&fr_id=' +
      this.data.eventID +
      (this.data.isManualLogin === true ? '&sso_auth_token=' : '&auth=') +
      this.data.ssoToken +
      '&checkin_status=' +
      this.checkinStatus +
      '&flow_step=' +
      this.flowStep +
      '&response_format=json';
    this.http.post(this.data.convioURL + this.data.method, null).subscribe(
      res => {
        // this.updateFundraisingGoal(this.personalGoal);
        // Update the flowStep to the next flowstep once everything checks out properly
        this.router.navigate(['/step-08']);
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
    this.flowStep = '5';
    this.data.method =
      'CRTeamraiserAPI?method=updateRegistration&api_key=cfrca&v=1.0' +
      '&fr_id=' +
      this.data.eventID +
      (this.data.isManualLogin === true ? '&sso_auth_token=' : '&auth=') +
      this.data.ssoToken +
      '&checkin_status=' +
      this.checkinStatus +
      '&flow_step=' +
      this.flowStep +
      '&response_format=json';
    this.http.post(this.data.convioURL + this.data.method, null).subscribe(
      res => {
        // this.updateFundraisingGoal(this.personalGoal);
        // Route user to previous flow step
        this.router.navigate(['/step-06']);
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

  reload() {
    window.location.reload();
  }

  getUpsell() {
    this.data.method =
      'CRTeamraiserAPI?method=getUpsell&api_key=cfrca&v=1.0' +
      '&fr_id=' +
      this.data.eventID +
      '&upsell_id=' +
      this.hiddenUpsellID +
      '&response_format=json';
    this.http.post(this.data.convioURL + this.data.method, null).subscribe(
      res => {
        this.upsellInfo = res;
        console.log(this.upsellInfo);
        this.upsellPriceNumber = parseInt(
          this.upsellInfo.getUpsellResponse.upsell.price,
          0
        );
        const newUpsellAmt = this.upsellPriceNumber / 100;
        const upsellFinalAmt = newUpsellAmt.toFixed(2);

        this.upsellPrice = upsellFinalAmt;
        console.log(this.upsellInfo);
      },
      error => {
        console.log(error);
      }
    );
  }
}
