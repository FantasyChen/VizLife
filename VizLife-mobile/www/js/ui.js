Vue.use(VueOnsen);

const API_URL = "https://vizlife.herokuapp.com/";
// const API_URL = "http://localhost:5000/";   // Test backend
const MAX_METRICS = 3;

const settingsPage = {
  template: '#settings',
  methods: {
    pushLoginPage(){
          localStorage.setItem("loggedIn", "false")
          vm.loggedIn = "false";
          this.$emit('push-page', loginPage);
    },
  },
  data() {
    return {
      notification: true,
      location: true,

    }
  }
};

const dailyReportPage = {
  template: '#dailyReportPage'
}


const goalEditPage = {
  key: 'goalEditPage',
  template: '#goalEditPage',
  //props: ['metrics']
};

const goalListPage = {
  key: 'goalListPage',
  template: '#goalListPage',
  methods: {
    push() {
      this.$emit('push-page', goalEditPage);
    }
  }
};

const reflectionDashboard = {
  template: '#reflectionDashboard',
  methods: {
    pushReflectionPage(){
      this.$emit('push-page', {template: '#reflectionPage'})
    }
  },
  data() {
    return {
      spdVisible: true,
      spdOpen: true,
      shareItems: {
        'Twitter': 'md-twitter',
        'Google+': 'md-google-plus',
        'Facebook': 'md-facebook'
      }
    }

  }
};

const loginPage = {
  template: '#loginPage',
  data() {
    return {
      email: '',
      password: '',
      confirm: '',
      authMessage: "Login",
      authType: 0,
    }
  },
  methods: {
    submit() {
      //check signup or login then post
      var url = API_URL;
      if (this.authType == 0) { // login
        url += "login";
        // check validation TODO
      } else if (this.authType == 1) { // signup
        url += "signup";
        // check validation TODO
      }

      var xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);

      //Send the proper header information along with the request
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onreadystatechange = function() {//Call a function when the state changes.
        if(xhr.readyState == XMLHttpRequest.DONE) {
          // Request finished. Do processing here.
          if (xhr.status != 200) {
            alert(xhr.responseText);
          } else {
            localStorage.setItem("sid", xhr.responseText)
            localStorage.setItem("loggedIn", "true")
            vm.loggedIn = "true";
            // get profile information from server TODO
            vm.pageStack.pop();
          }
        }
      }

      var payload = {
        email: this.email,
        password: this.password,
        confirm: this.confirm
      }

      this.email = '';
      this.password = '';
      this.confirm = '';

      // xhr.withCredentials = true;
      xhr.send(JSON.stringify(payload));
    },
    signout() {
      localStorage.setItem("loggedIn", "false")
      vm.loggedIn = "false";
    },
  }
};

const tabsDashboard = {
  template: '#tabsTemplate',
  methods: {
    push(page) {
      this.$emit('push-page', page);
    },
    md() {
      return this.$ons.platform.isAndroid();
    }
  },
  data() {
    return {
      activeIndex: 2,
      tabs: [
        {
          icon: this.md() ? null : 'ion-ios-paper-outline',
          label: 'Goals',
          page: goalsDashboard
        },
        {
          icon: this.md() ? null : 'ion-pie-graph',
          label: 'Reflection',
          page: reflectionDashboard
        },
        {
          icon: this.md() ? null : 'ion-home',
          label: 'Home',
          page: dailyDashboard
        },
        {
          icon: this.md() ? null : 'ion-ios-settings',
          label: 'Settings',
          page: settingsPage
        }
      ]
    }
  }
};

const sharedData = {
  activitySetList: [
    {
      "activitySetName": "Physical State",
      "activitySet": ["Walking","Running", "Bicycling"],
      "comparisonSet": ["Lying down","Sitting"],
    },
    {
      "activitySetName": "Work-life balance",
      "activitySet": ["Working", "Watching TV"],
      "comparisonSet": ["At school"],
    }
  ],

  goalList: [
    {
      "goalName" : "My Creative Goal",
      "activitySetName" : "Physical State",
      "activitySet": ["Walking", "Running"],
      "comparisonSet": ["Sitting", "Sleep"],
      "value": 100
    }
  ]
}

const goalDetailPage = {
  key: 'goalDetailPage',
  template: '#goalDetailPage',
}

const goalCreatePage = {
  key: 'goalCreatePage',
  template: '#goalCreatePage',
  data() {
    return {
      activitySetList: sharedData.activitySetList,
      goalList: sharedData.goalList
    }
  },
  methods: {
    pushGoalDetailPage(category, event) {
      console.log("add a new goal detail: " + category);
      this.$emit('push-page',{
        extends: goalDetailPage,
        data(){
          return {
            goalName: null,
            goalCategory : category,
            activitySetList: sharedData.activitySetList,
            // "comparisonSet": ["Sitting", "Sleep"],
            selectedSet: null,
            goalValue: 100
          }

        },
        methods: {
          getBack() {
            console.log("goalName: "+ this.goalName);
            vm.pageStack.pop();
          },
          editAndCreateGoal(){

          }
        },

        computed: {
          activitySet() {
            console.log("goalCategory: "+ this.goalCategory);
            for(var i = 0; i < this.activitySetList.length; i ++) {
              if(this.activitySetList[i].activitySetName == this.goalCategory){
                return this.activitySetList[i].activitySet;
              }
            }
          }
        }
      });
    }
  }
};

const goalsDashboard = {
  template: '#goalsDashboard',
  data() {
    return {
      activitySetList: sharedData.activitySetList,
      goalList: sharedData.goalList
    }
  },

  methods: {
    deleteGoal(name, event){
      console.log("delete successful");
    },
    pushAddGoalPage() {
      console.log("add a new goal");
      this.$emit('push-page', goalCreatePage);
    },
    pushEditGoalPage(name, setName, event){
      console.log("edit the goal " + name + " " + setName);
      this.$emit('push-page',
      {
        extends: goalEditPage,
        data() {
          return {
            goalName: name,
            activitySetName: setName,
            activitySetList: sharedData.activitySetList,
            goalList: sharedData.goalList,
            /*
            metrics: sharedData.metrics,
            selectedMetrics: sharedData.selectedMetrics
            */
          }
        },
        methods: {
          getBack() {
            console.log("goalName: "+ this.goalName);
            vm.pageStack.pop();
          },
          createGoal() {
            console.log("the number of activities: " + this.goal.activitySet.length);
            console.log("activities: " + this.goal.activitySet);
            console.log("value: " + this.goal.value);
            // TODO send the goal to the server

          }
        },
        computed: {
          goal() {
            console.log("goalName: "+ this.goalName);
            for(var i = 0; i < this.goalList.length; i ++) {
              if(this.goalList[i].goalName == this.goalName){
                return this.goalList[i];
              }
            }
          },
          activitySet() {
            console.log("goalList: "+ this.goalList);
            for(var i = 0; i < this.activitySetList.length; i ++) {
              if(this.activitySetList[i].activitySetName == this.activitySetName){
                return this.activitySetList[i].activitySet;
              }
            }
          },
          hasActivity() {
            console.log("size: " + this.activitySet.length);
            return (this.activitySet.length > 0);
          }
        }
      })
    }
  }
};

const dailyDashboard = {
  template: '#dailyDashboard',
  methods: {
    pushDailyReportPage(){
      this.$emit('push-page', dailyReportPage);
    }
  }
};

var vm = new Vue({
  el: '#app',
  template: '#main',
  data() {
    return {
      unsynced_files: 0,
      permission: false,
      loggedIn: localStorage.getItem("loggedIn"),
      notification: true,
      location: true,
      pageStack: localStorage.getItem("loggedIn") == "true" ? [tabsDashboard] : [tabsDashboard, loginPage]
    };
  },
  methods: {
    profile() {
      ajax("GET", "profile", null, function(res) {
        console.log(res)
      });
    },
    sync() {
      if (this.permission) {
        readLabels(uploadFiles);
      } else {
        app.checkPermission((success) => {
          if (success) {
            readLabels(uploadFiles);
          } else {
            console.log("no read permission granted");
          }
        });
      }

    }
  },
  computed: {
  }
});

function success() {

}

function fail(err) {

}

function uploadFiles(files) {

  if (!files) {
    return;
  }

  vm.unsynced_files = files.length;

  if (files.length == 0) {
    console.log("no extrasensory files")
    return;
  }

  for (let i = 0; i < 5/*files.length*/; i++) {
    let fileName = files[i].name;
    //console.log(fileName);
    let timestamp = fileName.substring(0, fileName.indexOf('.'));
    readFile(files[i], function(result) {
      let pred = JSON.parse(result);
      if (!pred.label_names || pred.label_names.length == 0) {
        //console.log("i="+i+" null json detected. deleting " + files[i].name);
        files[i].remove(function() {
          //console.log("i="+i+" deleted file: " + fileName)
          vm.unsynced_files--;
        }, function(error) {
          //console.log("i="+i+" error deleting file: " + fileName)
        });
        return;
      }
      pred.time = timestamp;
      ajax("POST", "es", pred, function() {
        files[i].remove(function() {
          //console.log("i="+i+" deleted file: " + fileName)
          vm.unsynced_files--;
        }, function(error) {
          //console.log("i="+i+" error deleting file: " + fileName)
        });
      })
      //vm.predictions.time = moment(timestamp).format("dddd, MMMM Do YYYY, h:mm:ss a");
    })
  }

}

function ajax(method, endpoint, payload, callback) {
  var xhr = new XMLHttpRequest();
  var url = API_URL+endpoint;
  console.log(url);
  xhr.onreadystatechange = function() {//Call a function when the state changes.
    if(xhr.readyState == XMLHttpRequest.DONE) {
      // Request finished. Do processing here.
      if (xhr.status != 200) {
        console.log(xhr.responseText);
      } else { // only invoke callback when 200 statuscode
        callback(xhr.responseText);
      }
    }
  }
  if (method == 'GET') {
    xhr.open("GET", url += "?sid="+localStorage.getItem("sid"), true);
    xhr.send();
  } else if (method == 'POST') {
    xhr.open("POST", url += "?sid="+localStorage.getItem("sid"), true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(payload));
  }
}
