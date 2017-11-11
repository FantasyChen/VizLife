Vue.use(VueOnsen);

const homePage = {
  template: '#home',
  props: {
    myProp : String,
    pageStack : Array
  }
};

const settingsPage = {
  template: '#settings'
};

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

const dashBoardPage = {
  template: '#dashBoardPage',
  methods: {
    pushGoalListPage(){
      this.$emit('push-page', goalListPage)
    },
    pushDailyVisualPage(){
      
    }
  }
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
      activeIndex: 0,
      tabs: [
        {
          icon: this.md() ? null : 'ion-home',
          label: 'Home',
          page: homePage,
          props: {
            myProp: 'This is a page prop!',
            pageStack: [dashBoardPage]
          },
          key: "homePage"
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
