import { HttpClient, HttpRequest } from '@angular/common/http';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

import { Injectable, OnInit } from '@angular/core';

declare var ConvioApiClient: any;

@Injectable()
export class DataService implements OnInit {
  /* ============  Global Variables Below ============*/
  Api = new ConvioApiClient('cfrca', 'api_client', 'json');
  // Event ID
  eventID: any = '1761';

  // [2021] Event ID
  // currently using TEST 2020 as a test, change to 2021 TR id when available
  nextEventID: any = '1781';

  // 2020 Toronto OCI 
  surveyID: any = '85575';

  // 2020 Toronto Virtual RTCC OCI Survey
  // surveyIDB: any = '85575';

  // MyProfile Survey ID
  surveyID2: any = '83916';

  // Needed to populate
  emailAddress: any = '';

  // Profile Question ID(s) - Retrieving information from profile
  // profile2 = '87885'; // Vegetarian
  // profile3 = '87886'; // Cancer

  // Survey Question ID(s) - below insert the Survey Question IDs
  question1 = '90357'; // How many years have you ridden with The Ride?
  question2 = '90367'; // Jersey size
  question3 = '90389'; // T-Shirt Size
  question4 = '90388'; // Vest Size
  question5 = '90369'; // Please confirm your route for the 2020 event
  question6 = '90393'; // Virtual Zwift Meetup
  question7 = '90385'; // I will participate my own way (please share with ...
  question8 = '90366'; // Hidden Safety Video Watched
  question9 = '90358'; // Waiver and Release Full Name
  question10 = '90359'; // 18 Years Check Box
  question11 = '90422'; // Guardian Waiver
  question12 = '90390'; // Swag Item
  question13 = '90421'; // Phone Number
  question14 = '90423' // Guardian Name
  question15 = '90419' // Select your Rewards pick-up point and pick-up tim...
  question16 = '90424' // 18 Years Check Box Waiver Under 18 Name
  question17 = '90425' // 18 Years Check Box Waiver Parent Guardian
  question18 = '90429' // 18 Years Check Box Waiver Under 18

  // question12 = '89174'; // Hidden Upsell Value
  // question13 = '89175'; // Hidden Safety Video Watched

  // question14 = '89194'; // Shuttle Question 1
  // question15 = '89195'; // Shuttle Question 2
  // question16 = '89196'; // Shuttle Question 3
  // question17 = '89197'; // Shuttle Question 4
  // question18 = '89198'; // Shuttle Question 5
  // question19 = '89185'; // Packet Pickup

  // question20 = '89039'; // Hammer
  // multiple choice test questions
  // question21 = '88982';

  // question22 = '90298'; // gender selection
  // // question23 = '90390'; // Jersey Type ( New for Deferral )

  // question24 = '90369'; // Please confirm your route for the 2020 event
  // question25 = '90393'; // Virtual Zwift Meetup
  // question26 = '90385'; // I will participate my own way (please share with ...
  // question27 = '90419'; // Select your Rewards pick-up point and pick-up tim...
  // question28 = '90421'; // Phone Number
  // question29 = '90422'; // Guardian Waiver

  // Upsell IDs
  hiddenUpsellID = '1441'; // Upsell ID #1 copied from Teamraiser - $15.00
  hiddenUpsellID2 = '1442'; // Upsell ID #2 copied from Teamraiser - $250.00
  hiddenUpsellID3 = '1443'; // Upsell ID #3 copied from Teamraiser - $165.00

  // Safety Video
  safetyVidURL = 'assets/videos/2020_RCTO_SAFETY_VIDEO_V3.mp4';
  safetyVidWebmURL = 'assets/videos/2020_RCTO_SAFETY_VIDEO_V4.webm';

  // Login Information
  username: string;
  password: string;

  loginErr: boolean;

  // API Call Information
  convioURL = 'https://secure.conquercancer.ca/site/';
  loginMethod: string;
  method: string;

  // Setting logged in state (must be false initially)
  isloggedIn: any = false;

  // Used to check if visitor logged in manually or had their session carried over from a prior login on the LO platform (must be true initially)
  isManualLogin: any = true;

  // App has checked whether there is a prior login (must be false initially)
  hasCheckedPriorLogin: any = false;

  // Registration Variables
  regResponse: any = {};
  checkInStatus: string;

  // Setting flow step state
  flowStepResults: any = {};
  flowStep: any;
  getFlowStepNumber: string;

  // Results from API Call
  loginRes: any = {};
  // Login Test
  loginTestRes: any = {};

  // Results from getSurveyRes
  surveyResults: any = {};

  // Sign-on Token
  ssoToken: any = localStorage.getItem('token');
  storageToken: string = localStorage.getItem('token');
  tokenExpired: boolean;

  // Constituent Information
  consID: any;
  storageConsID: any;
  getConsInfo: any;

  consUserName: string;
  firstName: string;
  lastName: string;
  primaryAddress1: string;
  primaryAddress2: string;
  primaryCity: string;
  primaryState: string;
  primaryZip: string;
  gender: string;
  defer: string;

  emergencyName: string;
  emergencyPhone: string;

  // Participation Type
  participationID: string;
  storageParticipationID: string;
  participationRes: any;
  participationType: string;

  // Team
  getTeamRes: any = {};
  teamName: string;
  teamExist = false;

  show = true;

  // Tentmate Status Variable
  tentStatus: string;
  // tentResults: string;

  participantTypeID = '2056';
  testTypeID = '2053';
  registerDoc: any;
  xmlDoc: any;
  xmlDocB: any;
  xmlDocC: any;
  xmlDocD: any;
  memberID: any;
  process_registration_request: any;

  constructor(
    public http: HttpClient,
    private router: Router,
    public snackBar: MatSnackBar
  ) {
    if (localStorage.getItem('token') !== undefined || null) {
      this.tokenExpired = false;
    }
    // If user's logged in state returns true set login state, and add constiuent ID from the the local storage into a global variable
    if (this.isLoggedIn() === true) {
      this.isloggedIn = true;
      this.storageConsID = localStorage.getItem('consID');
      this.storageParticipationID = localStorage.getItem('participationID');
    }
  }

  ngOnInit() {
    console.log('run ngOnInit from data.service.ts');
    this.getCheckInStatus();
  }

  // Log out, clear out the local storage, forcing user to log in again
  logOut() {
    localStorage.clear();
    this.router.navigate(['/step-01']);
    this.show = true;

    this.convioURL = 'https://secure.conquercancer.ca/site/';
    this.method =
      'CRConsAPI?method=logout&api_key=cfrca&v=1.0&response_format=json';
    this.http.post(this.convioURL + this.method, null).subscribe(
      data => {
        this.snackBar.open(
          'You have been successfully logged out. We look forward to seeing you at the 2020 Ride!',
          'Close',
          {
            duration: 3500,
            panelClass: ['error-info']
          }
        );
      },
      error => {
        console.log(error);
      }
    );
  }

  // Check logged in state by a token retrieved by loggin into the app
  isLoggedIn() {
    if (
      localStorage.getItem('token') === null &&
      this.hasCheckedPriorLogin === false
    ) {
      console.log('first login check');
      this.hasCheckedPriorLogin = true;
      this.loginTest();
    } else {
      // console.log('is logged in');
      return localStorage.getItem('token') !== null;
    }
  }

  // Log into the OCI Web App
  logMeIn() {
    this.loginMethod =
      'CRConsAPI?method=login&api_key=cfrca&v=1.0&user_name=' +
      this.username +
      '&password=' +
      this.password +
      '&remember_me=true&response_format=json';
    this.http.post(this.convioURL + this.loginMethod, null).subscribe(
      res => {
        console.log(res);
        this.isManualLogin = true;
        this.loginRes = res;
        this.ssoToken = this.loginRes.loginResponse.token;
        this.consID = this.loginRes.loginResponse.cons_id;
        localStorage.setItem('consID', this.consID);

        this.storageConsID = localStorage.getItem('consID');

        localStorage.setItem('token', this.ssoToken);
        this.tokenExpired = false;

        this.storageToken = localStorage.getItem('token');

        const nonce = this.loginRes.loginResponse.nonce;
        localStorage.setItem('nonce', nonce);

        const jsession = this.loginRes.loginResponse.JSESSIONID;
        localStorage.setItem('jsession', jsession);

        // Get flow step
        this.getFlowStepLogin();
      },
      err => {
        // console.log(err);
        this.loginErr = true;

        this.snackBar.open('Error with username or password.', 'Close', {
          duration: 3500,
          panelClass: ['error-info']
        });
      }
    );
  }
  // Testing user's logged in state
  loginTest() {
    this.loginMethod =
      'CRConsAPI?method=loginTest&api_key=cfrca&v=1.0&response_format=json';
    this.http.get(this.convioURL + this.loginMethod).subscribe(
      res => {
        this.loginTestRes = res;
        // console.log('running loginTest: ', this.loginTestRes);
        localStorage.setItem('consID', this.loginTestRes.loginResponse.cons_id);
        this.storageConsID = localStorage.getItem('consID');
        if (this.storageConsID) {
          // only call getLoginUrl IF consID exists, which indicates a valid user session exists
          this.getLoginUrl();
        } else {
          return false;
        }
      },
      error => {
        return false;
      }
    );
  }
  getLoginUrl() {
    this.loginMethod =
      'CRConsAPI?method=getLoginUrl&api_key=cfrca&v=1.0&response_format=json';
    this.http.get(this.convioURL + this.loginMethod).subscribe(
      res => {
        this.isManualLogin = false;
        this.loginTestRes = res;
        console.log('getLoginUrl success: ', this.loginTestRes);
        localStorage.setItem(
          'token',
          this.loginTestRes.getLoginUrlResponse.token
        );
        localStorage.setItem(
          'jsession',
          this.loginTestRes.getLoginUrlResponse.JSESSIONID
        );
        this.ssoToken = this.loginTestRes.getLoginUrlResponse.token;
        this.tokenExpired = false;
        this.storageToken = localStorage.getItem('token');
        this.isloggedIn = true;
        this.getFlowStepLogin();
        return true;
      },
      error => {
        // console.log('getLoginUrl error: ', error);
        return false;
      }
    );
  }
  // Get user's checkin status, this function will be ran on EVERY step
  getCheckInStatus() {
    console.log('calling getCheckInStatus');
    this.method =
      'CRTeamraiserAPI?method=getRegistration&api_key=cfrca&v=1.0&response_format=json&fr_id=' +
      this.eventID +
      (this.isManualLogin === true ? '&sso_auth_token=' : '&auth=') +
      this.storageToken;
    this.http.post(this.convioURL + this.method, null).subscribe(
      res => {
        this.regResponse = res;
        this.checkInStatus = this.regResponse.getRegistrationResponse.registration.checkinStatus;
      },
      error => {}
    );
  }

  // Get the current Flowstep and Send them to the route
  getFlowStepLogin() {
    const token = localStorage.getItem('token');
    this.method =
      'CRTeamraiserAPI?method=getFlowStep&api_key=cfrca&v=1.0&response_format=json&fr_id=' +
      this.eventID +
      (this.isManualLogin === true ? '&sso_auth_token=' : '&auth=') +
      this.ssoToken;
    this.http.post(this.convioURL + this.method, null).subscribe(
      res => {
        this.flowStepResults = res;
        this.flowStep = this.flowStepResults.getFlowStepResponse.flowStep;

        // Check the Flowstep, if matched, send them to the proper route
        if (this.flowStep === '0' || this.flowStep === '1') {
          this.router.navigate(['/step-02']);
        }
        if (this.flowStep === '2') {
          this.router.navigate(['/step-03']);
        }
        if (this.flowStep === '3') {
          this.router.navigate(['/step-04']);
        }
        if (this.flowStep === '4') {
          this.router.navigate(['/step-05']);
        }
        if (this.flowStep === '5') {
          this.router.navigate(['/step-06']);
        }
        if (this.flowStep === '6') {
          this.router.navigate(['/step-07']);
        }
        if (this.flowStep === '7') {
          this.router.navigate(['/step-08']);
        }
        // if (this.flowStep === '8') {
        //   this.router.navigate(['/step-09']);
        // }
      },
      err => {
        // console.log(err);

        // If user tries to login with credentials from a different event display error message
        if (err.error.errorResponse.code === '2603') {
          localStorage.removeItem('token');
          this.snackBar.open(
            'The username / password combination is incorrect for this event.',
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

  // Gather Registration Information
  getRegInfo() {
    this.storageToken = localStorage.getItem('token');
    this.method =
      'CRTeamraiserAPI?method=getRegistration&api_key=cfrca&v=1.0&response_format=json&fr_id=' +
      this.eventID +
      (this.isManualLogin === true ? '&sso_auth_token=' : '&auth=') +
      this.storageToken;
    this.http.post(this.convioURL + this.method, null).subscribe(
      res => {
        // Results from the API Call
        this.regResponse = res;
        this.participationID = this.regResponse.getRegistrationResponse.registration.participationTypeId;
        localStorage.setItem('participationID', this.participationID);
        this.storageParticipationID = localStorage.getItem('participationID');
        this.checkInStatus = this.regResponse.getRegistrationResponse.registration.checkinStatus;
        this.emergencyName = this.regResponse.getRegistrationResponse.registration.emergencyName;
        this.emergencyPhone = this.regResponse.getRegistrationResponse.registration.emergencyPhone;

        if (
          this.regResponse.getRegistrationResponse.registration
            .tentmateStatus === '1'
        ) {
          this.tentStatus = 'Eligible';
        } else if (
          this.regResponse.getRegistrationResponse.registration
            .tentmateStatus === '2'
        ) {
          this.tentStatus = 'Declined';
        } else if (
          this.regResponse.getRegistrationResponse.registration
            .tentmateStatus === '3'
        ) {
          this.tentStatus = 'Random';
        } else if (
          this.regResponse.getRegistrationResponse.registration
            .tentmateStatus === '0'
        ) {
          this.tentStatus = 'None';
        } else if (
          this.regResponse.getRegistrationResponse.registration
            .tentmateStatus === '4'
        ) {
          this.tentStatus = 'Sent Invite';
        } else if (
          this.regResponse.getRegistrationResponse.registration
            .tentmateStatus === '6'
        ) {
          this.tentStatus = 'Request Pending';
        }
        this.getParticipationType();
      },
      err => {
        this.tokenExpired = true;
        this.router.navigate(['/step-01']);
      }
    );
  }

  // Gather Constituent Information
  getUserInfo() {
    this.storageToken = localStorage.getItem('token');
    this.method =
      'CRConsAPI?method=getUser&api_key=cfrca&v=1.0&response_format=json&cons_id=' +
      this.storageConsID +
      (this.isManualLogin === true ? '&sso_auth_token=' : '&auth=') +
      this.storageToken;
    this.http.post(this.convioURL + this.method, null).subscribe(
      res => {
        console.log(res);
        this.getConsInfo = res;
        this.firstName = this.getConsInfo.getConsResponse.name.first;
        this.lastName = this.getConsInfo.getConsResponse.name.last;
        this.primaryAddress1 = this.getConsInfo.getConsResponse.primary_address.street1;
        this.primaryAddress2 = this.getConsInfo.getConsResponse.primary_address.street2;
        this.primaryCity = this.getConsInfo.getConsResponse.primary_address.city;
        this.primaryState = this.getConsInfo.getConsResponse.primary_address.state;
        this.primaryZip = this.getConsInfo.getConsResponse.primary_address.zip;
        this.emailAddress = this.getConsInfo.getConsResponse.email.primary_address;
        this.consUserName = this.getConsInfo.getConsResponse.user_name;
        this.gender = this.getConsInfo.getConsResponse.gender;
        this.defer = this.getConsInfo.getConsResponse.custom.number.content;
      },
      err => {
        console.log(err);
      }
    );
  }

  // Gather Participation Type
  getParticipationType() {
    this.method =
      'CRTeamraiserAPI?method=getParticipationType&api_key=cfrca&v=1.0&response_format=json&fr_id=' +
      this.eventID +
      '&participation_type_id=' +
      this.storageParticipationID;

    this.http.post(this.convioURL + this.method, null).subscribe(
      res => {
        this.participationRes = res;
        this.participationType = this.participationRes.getParticipationTypeResponse.participationType.name;
      },
      err => {
        console.log(err);
      }
    );
  }

  // Get Team Information
  getTeam() {
    this.method =
      'CRTeamraiserAPI?method=getTeam&api_key=cfrca&v=1.0&response_format=json&fr_id=' +
      this.eventID +
      (this.isManualLogin === true ? '&sso_auth_token=' : '&auth=') +
      this.storageToken;
    this.http.post(this.convioURL + this.method, null).subscribe(
      res => {
        this.getTeamRes = res;
        this.teamName = this.getTeamRes.getTeamResponse.team.name;
        this.teamExist = true;
      },
      err => {
        console.log(err);
        this.teamExist = false;
      }
    );
  }

  getRegDocument() {
    this.method =
      'CRTeamraiserAPI?method=getRegistrationDocument&api_key=cfrca&v=1.0&fr_id=' +
      this.eventID +
      '&participation_id=' +
      this.participantTypeID +
      '&response_format=json';
    this.http
      .post(this.convioURL + this.method, { responseType: 'json' })
      .subscribe(res => {
        this.registerDoc = res;

        this.consID = localStorage.getItem('consID');

        // log the register doc to console to test
        console.log('getting....');

        this.xmlDoc = this.OBJtoXML(this.registerDoc);

        this.xmlDocB = this.xmlDoc.replace(
          '<processRegistrationRequest>',
          '<processRegistrationRequest xmlns="http://convio.com/crm/v1.0" ' +
            'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
            'xsi:schemaLocation="http://convio.com/crm/v1.0 http://service.convio.net/xmlschema/crm.public.v1.xsd">'
        );

        this.xmlDocC = this.xmlDocB.replace(
          '<consId></consId>',
          '<consId>' + this.consID + '</consId>'
        );

        this.xmlDocD = this.parseXml(this.xmlDocC);
      });
  }

  parseXml(xmlStr) {
    var parser = new DOMParser();
    return parser.parseFromString(xmlStr, 'text/xml');
  }

  OBJtoXML(obj) {
    var xml = '';
    for (var prop in obj) {
      xml += obj[prop] instanceof Array ? '' : '<' + prop + '>';
      if (obj[prop] instanceof Array) {
        for (var array in obj[prop]) {
          xml += '<' + prop + '>';
          xml += this.OBJtoXML(new Object(obj[prop][array]));
          xml += '</' + prop + '>';
        }
      } else if (typeof obj[prop] == 'object') {
        xml += this.OBJtoXML(new Object(obj[prop]));
      } else {
        xml += obj[prop];
      }
      xml += obj[prop] instanceof Array ? '' : '</' + prop + '>';
    }

    return xml;
  }

  beginGroup(group) {
    console.log('<' + group + '>');
    this.process_registration_request += '<' + group + '>';
  }

  addNode(node, val) {
    if (val == null || val == '') {
      console.log('<' + node + ' xsi:nil="true" />');
      this.process_registration_request += '<' + node + ' xsi:nil="true" />';
    } else {
      console.log('<' + node + '>' + val + '</' + node + '>');
      this.process_registration_request +=
        '<' + node + '>' + val + '</' + node + '>';
    }
  }

  endGroup(group) {
    console.log('</' + group + '>');
    this.process_registration_request += '</' + group + '>';
  }

  processRegistration() {
    this.process_registration_request =
      '<processRegistrationRequest xsi:schemaLocation="http://convio.com/crm/v1.0' +
      ' http://service.convio.net/xmlschema/crm.public.v1.xsd" xmlns="http://convio.com/crm/v1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">';

    this.beginGroup('primaryRegistration');
    this.addNode('partTypeId', '2053');

    this.addNode('consId', localStorage.getItem('consID'));
    this.addNode('email', this.emailAddress);
    this.addNode('firstName', 'potatosenpai');
    this.addNode('lastName', this.lastName);

    this.endGroup('primaryRegistration');
    this.endGroup('processRegistrationRequest');

    this.method =
      'CRTeamraiserAPI?method=processRegistration&api_key=cfrca&v=1.0&' +
      'registration_document=' +
      this.process_registration_request +
      '&update_constituent_profile=true';
    this.http.post(this.convioURL + this.method, '').subscribe(
      res => {
        console.log(res);
      },
      error => {
        console.log(error);
      }
    );
  }
}
