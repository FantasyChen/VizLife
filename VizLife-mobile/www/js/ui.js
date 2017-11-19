Vue.use(VueOnsen);

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
    // pushGoalListPage(){
    //   this.$emit('push-page', goalListPage)
    // },
    pushDailyReportPage(){
      this.$emit('push-page', dailyReportPage)
    },
    // pushReflectionPage(){
    //   this.$emit('push-page', reflectionPage)
    // }
  }
};

const loginPage = {
  template: '#loginPage'
};


// var login = new Vue({
//   el: '#login',
//   data: {
//     email: '',
//     password: '',
//     title: 'Login'
//   },
//   methods: {
//     login() {
//
//     }
//   }
// })

var vm = new Vue({
  el: '#app',
  template: '#main',
  data() {
    return {
      loggedIn: false,
      activeIndex: 2,
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
    }
  },
  computed: {
    // title() {
    //   return this.tabs[this.activeIndex].label;
    // },
    // pageStack() {
    //   return this.tabs[0].props["pageStack"]
    // }
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
