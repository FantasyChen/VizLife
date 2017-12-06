Vue.use(VueOnsen);

const API_URL = "https://vizlife.herokuapp.com/";
const MAX_METRICS = 3;

const settingsPage = {
  template: '#settings',
  methods: {
    pushLoginPage(){
          localStorage.setItem("loggedIn", false)
          vm.loggedIn = false;
          this.$emit('push-page', loginPage);
    },
  }
};

const dailyReportPage = {
  template: '#dailyReportPage'
}

const goalCreationPage = {
  key: 'goalCreationPage',
  template: '#goalCreationPage'
};

const goalListPage = {
  key: 'goalListPage',
  template: '#goalListPage',
  methods: {
    push() {
      this.$emit('push-page', goalCreationPage);
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
            localStorage.setItem("loggedIn", true)
            vm.loggedIn = true;
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
      localStorage.setItem("loggedIn", false)
      vm.loggedIn = false;
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

const goalsDashboard = {
  template: '#goalsDashboard',
  methods: {
    pushGoalListPage(){
      this.$emit('push-page',
      {
        extends: goalCreationPage,
        data() {
          return {
            goalname: 'sample goal',
            goaldescription: 'This is some goal description',
            labels : ["labels", "go", "here"],
            metrics: []
          }
        },
        methods: {
          addMetric() {
            this.metrics.push({
              selectedItem : "choose a label",
              scoreSlider: 50
            })
          },
          createGoal() {
            var goal = {
              name: this.goalName,
              description: this.goaldescription,
              metrics: this.metrics
            }
            console.log(goal)

            // TODO send goal and pop page
          }
        },
        computed: {
          maxMetrics() {
            return (this.metrics.length == MAX_METRICS)
          },
          hasMetrics() {
            return (this.metrics.length > 0)
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
      loggedIn: JSON.parse(localStorage.getItem("loggedIn")),
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
  watch: {
    loggedIn: function(val) {
      if (val) {
        app.checkPermission((hasPermission)=>{
          vm.permission = hasPermission;
          if (hasPermission) {
            readLabels((files) => {console.log(files.length)})
          }
        });
      }
    }
  }
});

function success() {

}

function fail(err) {

}

var predictionsArray;
var preds = [];

function uploadFiles(files) {

  if (files.length == 0) {
    console.log("no extrasensory files")
    return;
  }

  var labels = {};
  var num_to_finish = files.length;

  for (let i = 0; i < files.length; i++) {
    let fileName = files[i].name;
    //console.log(fileName);
    let timestamp = fileName.substring(0, fileName.indexOf('.'));
    readFile(files[i], function(result) {
      let pred = JSON.parse(result);
      preds.push(pred);
      if (!pred.label_names || pred.label_names.length == 0) {
        num_to_finish--;
        if (num_to_finish == 0) {
          finishedReading(labels, files);
        }
        return;
      }
      let date = moment(parseInt(timestamp)*1000).tz('America/Los_Angeles').format("YYYY-MM-DD");
      if (!labels[date]) {
        labels[date] = new Labels(date);
      }
      labels[date].addProbabilities(pred.label_probs);

      num_to_finish--;
      if (num_to_finish == 0) {
        finishedReading(labels, files);
      }
    })
  }
}

function finishedReading(labels, files) {
  //console.log(labels)
  ajax("POST", "es", {labels: labels}, function() {
    for (let i = 0; i < files.length; i++) {
      /* delete the contents of the directory */

      // files[i].remove(function() {
      //   vm.unsynced_files--;
      // }, function(error) {
      //   console.log("error deleting file: " + files[i].name)
      // });
    }
  })
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
  console.log(method)
  if (method == "GET") {
    console.log("inside get")
    xhr.open("GET", url += "?sid="+localStorage.getItem("sid"), true);
    xhr.send();
  } else if (method == "POST") {
    console.log("inside post")
    xhr.open("POST", url += "?sid="+localStorage.getItem("sid"), true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(payload));
  }
}
