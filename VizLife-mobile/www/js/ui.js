Vue.use(VueOnsen);

const API_URL = "https://vizlife.herokuapp.com/";

const goalsNavigator = {
  template: '#navigatorTemplate',
  props: {
    // myProp : String,
    pageStack : Array
  }
};

const reflectionNavigator = {
  template: '#navigatorTemplate',
  props: {
    // myProp : String,
    pageStack : Array
  }
};

const homeNavigator = {
  template: '#navigatorTemplate',
  props: {
    // myProp : String,
    pageStack : Array
  }
};

const settingsPage = {
  template: '#settings'
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

const goalsDashboard = {
  template: '#goalsDashboard',
  methods: {
    pushGoalListPage(){
      this.$emit('push-page', goalListPage)
    }
  }
};

const dailyDashboard = {
  template: '#dailyDashboard',
  methods: {
    pushDailyReportPage(){
      this.$emit('push-page', dailyReportPage)
    }
  }
};

var vm = new Vue({
  el: '#app',
  template: '#main',
  data() {
    return {
      loggedIn: localStorage.getItem("loggedIn"),
      email: '',
      password: '',
      confirm: '',
      authMessage: "Login",
      authType: 0,
      activeIndex: 2,

      notification: true,
      location: true,

      tabs: [
        {
          icon: this.md() ? null : 'ion-ios-paper-outline',
          label: 'Goals',
          page: goalsNavigator,
          props: {
            pageStack: [goalsDashboard]
          },
          key: "goalsPage"
        },
        {
          icon: this.md() ? null : 'ion-pie-graph',
          label: 'Reflection',
          page: reflectionNavigator,
          props: {
            pageStack: [reflectionDashboard]
          },
          key: "reflectionNavigator"
        },
        {
          icon: this.md() ? null : 'ion-home',
          label: 'Home',
          page: homeNavigator,
          props: {
            pageStack: [dailyDashboard]
          },
          key: "homeNavigator"
        },
        {
          icon: this.md() ? null : 'ion-ios-settings',
          label: 'Settings',
          page: settingsPage,
          key: "settingsPage"
        }
      ]
    };
  },
  methods: {
    md() {
      return this.$ons.platform.isAndroid();
    },
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
    profile() {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", API_URL+"profile?sid="+localStorage.getItem("sid"), true);

      xhr.onreadystatechange = function() {//Call a function when the state changes.
        if(xhr.readyState == XMLHttpRequest.DONE) {
          // Request finished. Do processing here.
          console.log(xhr.responseText)
        }
      }

      xhr.send();
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

// var ui = new Vue({
//   data: {
//     loading: false,
//     permission: false,
//     predictions: {
//     	"label_names": [],
//     	"label_probs": [],
//     	"location_lat_long": [],
//       "time": ''
//     }
//   },
//   el: "#ui",
//   methods: {
//     reload: function() {
//       readLabels();
//     }
//   }
// })


var titleImage = new Vue({
  data: {
    template: ""
  }
})
