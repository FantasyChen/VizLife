Vue.use(VueOnsen);

const API_URL = "https://vizlife.herokuapp.com/";
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
    }
  },
  watch: {
    authType: function (type) {
      if (type == 0) {
        this.authMessage = "Login";
      } else if (type == 1) {
        this.authMessage = "Sign up";
      }
    }
  },
  computed: {
  }
});



var titleImage = new Vue({
  data: {
    template: ""
  }
})

function ajax(method, endpoint, payload, callback) {
  var xhr = new XMLHttpRequest();
  var url = API_URL+endpoint;

  xhr.onreadystatechange = function() {//Call a function when the state changes.
    if(xhr.readyState == XMLHttpRequest.DONE) {
      // Request finished. Do processing here.
      if (xhr.status != 200) {
        alert(xhr.responseText);
      } else {
        callback(xhr.responseText);
      }
    }
  }

  if (method == 'GET') {
    xhr.open("GET", url += "?sid="+localStorage.getItem("sid"), true);
    xhr.send();
  } else if (method == 'POST') {
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(payload));
  }
}
