Vue.use(VueOnsen);

const API_URL = "https://vizlife.herokuapp.com/";
// const API_URL = "http://localhost:5000/"

const MAX_METRICS = 3;

const settingsPage = {
  template: '#settings',
  methods: {
    pushLoginPage(){
          localStorage.clear();
          vm.loggedIn = false;
          //this.$emit('push-page', loginPage);
    },
  },
  data() {
    return {
      notification: true,
      location: true
    }
  }
};

const dailyReportPage = {
  template: '#dailyReportPage'
}


const goalEditPage = {
  key: 'goalEditPage',
  template: '#goalEditPage'
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
    }
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
    },
    changeTab(event) {
      //console.log(this)
      // if (event.activeIndex == 1) { // changed to reflection page
      //   dashboard1.render(inputDataAct, inputDataComp);
      //   dashboard2.render(inputDataGoal, inputDataAct);
      // }
      //console.log(event);
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
          id: 'reflectionTab',
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
  /*
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
  ], */
  goalList: [],
  goalCategories: []
}

const goalDetailPage = {
  key: 'goalDetailPage',
  template: '#goalDetailPage',
}

const goalCreatePage = {
  key: 'goalCreatePage',
  template: '#goalCreatePage',
  created() {
    this.getData();
  },
  methods: {
    getData(){
      var thisWindow = this;
      if(this.activitySetList.length == 0){
        getGoalCategories(function(res){
          thisWindow.activitySetList = JSON.parse(res);
        });
      }
    },
    pushGoalDetailPage(activitySet, goalList, event) {
      this.$emit('push-page',{
        extends: goalDetailPage,
        data(){
          return {
            goalList: goalList,
            goalName: null,
            activities: activitySet.act,
            comparedAct: activitySet.comp_act,
            goalCategory : activitySet.category_name,
            // selectedSet: Array,
            // compared: Array,
            goalValue: 100
          }
        },
        methods: {
          getBack() {
            vm.pageStack.pop();
          },
          createGoal(goalName, categoryName, selectedSet, desiredValue, compared, event){
            var selectedAct = [];
            for(var i = 0; i < this.activities.length; i ++) {
              if(selectedSet[i]) {
                selectedAct.push(this.activities[i]);
              }
            };
            var comparedSet = [];
            for(var i = 0; i < this.comparedAct.length; i ++) {
              if(compared[i]) {
                comparedSet.push(this.comparedAct[i]);
              }
            };
            addGoal(goalName, categoryName, selectedAct, desiredValue,
              function(){
                // goalsDashboard.getData();
              }, compareAct= comparedSet);
              var newGoal = {
                goal_name: goalName,
                category_name: categoryName,
                act: selectedAct,
                desired_value: desiredValue,
                comp_act: comparedSet
              };
              this.goalList.push(newGoal);
              vm.pageStack.pop();
              vm.pageStack.pop();
          }
        },

        computed: {
          selectedSet(){
            var array = [];
            for(var i = 0; i < this.activities.length; i ++) {
              array.push(false);
            };
            return array;
          },
          compared(){
            var array = [];
            for(var i = 0; i < this.comparedAct.length; i ++){
              array.push(true);
            };
            return array;
          }
        }
      });
    }
  },
};

// var inputDataAct = {
//                          "Physical State": {
//                            "walking": 200,
//                            "running": 500,
//                            "bicycling": 800
//                          },
//                          "work-life balance": {
//                             "lab work": 200,
//                             "at school": 500,
//                             "at work": 800,
//                             "in class": 700,
//                             "in meeting": 300,
//                          },
//                          "phone active usage": {
//                              "phone in hand": 500,
//                              "phone on table": 1000
//                           }
//                           };
// var inputDataComp = {
//                      "Physical State": {
//                         "lying down": 100,
//                         "sitting" : 200,
//                         "sleeping":900
//                      },
//                      "work-life balance": {
//                         "at home": 200,
//                         "at restaurants": 50,
//                         "with friends":300
//                      },
//                      "phone active usage": {
//                         "phone in bag":200,
//                         "phone in pocket": 50
//                      }
//                      };
//
// var inputDataActual = {
//                          "working out": {
//                            "running": 200,
//                            "sitting": 500,
//                            "sleeping": 800,
//                            "reading": 240
//                          },
//                          "dining habit": {
//                             "green tea": 200,
//                             "brown rice": 500,
//                             "fruit": 800,
//                             "whole weat bread": 700,
//                             "beef": 300,
//                             "chicken": 500,
//                             "sea food": 430
//                          },
//                          "whatever": {
//                              "showing": 10,
//                              "drink": 20
//                           }
//  };
//  var inputDataGoal = {
//                               "working out": {
//                                 "running": 100,
//                                 "sitting": 600,
//                                 "sleeping": 1000,
//                                 "reading": 500
//                               },
//                               "dining habit": {
//                                  "green tea": 300,
//                                  "brown rice": 300,
//                                  "fruit": 200,
//                                  "whole weat bread": 200,
//                                  "beef": 400,
//                                  "chicken": 600,
//                                  "sea food": 630
//                               },
//                               "whatever": {
//                                   "showing": 120,
//                                   "drink": 220
//                                }
//       };

var goalName;
const goalsDashboard = {
  template: '#goalsDashboard',
  data() {
    return {
      goalCategories: sharedData.goalCategories,
      goalList: sharedData.goalList,
      dataLoaded: false
      // activitySetList: sharedData.activitySetList,
      // goalList: sharedData.goalList
    }
  },
  created: function(){
		this.init();
    this.updateVisualization();
	},

  methods: {
    init(){
      this.getData();
    },
    getData(){
      var thisWindow = this;
      this.dataLoaded = false;
      getGoal(function(res){
        thisWindow.goalList = JSON.parse(res);
        thisWindow.dataLoaded = true;
        if(thisWindow.goalCategories.length == 0){
          getGoalCategories(function(res){
            thisWindow.goalCategories = JSON.parse(res);
          });
        }
      });
    },
    updateVisualization(){
      getGoal(function(res){
        var resDataList = [];
          var goalList = JSON.parse(res);
          for(var i = 0; i < goalList.length; i++){
            var goalData = goalList[i];
            var activities = goalData.act.concat(goalData.comp_act);
            getDataByDateAndActivities('2017-12-05', activities, function(data){
              var data = JSON.parse(data);
              var resData = {};
              var dataSum = 0.0;
              for(var j = 0; j< data.length; j++){
                var dataItem = data[j];
                dataSum += dataItem.val;
              }

              for(var j = 0; j < data.length; j++){
                var dataItem = data[j];
                resData[dataItem.label] = dataItem.val * 1.0 / dataSum;
              }

              resDataList.push(resData);
              if(resDataList.length == goalList.length){
                var actList = [];
                var compActList = [];
                var inputGoalList = [];
                for(var j=0; j < resDataList.length; j++){
                  var curData = resDataList[j];
                  var curAct = {};
                  var curCompAct = {};
                  var curGoalAct = {};
                  for(var k in curData){
                    if(goalList[j].act.includes(k)){
                      curAct[k] = curData[k];
                      curGoalAct[k] = goalList[j].desired_value * 1.0 / 100 / goalList[j].act.length;
                    }
                    else{
                      curCompAct[k] = curData[k];
                    }
                  }
                  curAct.name = goalList[j].category_name + ": " + goalList[j].goal_name;
                  actList.push(curAct);
                  compActList.push(curCompAct);
                  inputGoalList.push(curGoalAct);
                }

                document.getElementById('tab1').onclick = function() {
                          setTimeout(function() {
                            dashboard1.render(actList, compActList);
                          }, 0);
                };

                document.getElementById('click').onclick = function() {
                          setTimeout(function() {
                            dashboard2.render(inputGoalList, actList);
                     }, 0);
                };
                $('.tabular.menu .item').tab();
                dashboard1.render(actList, compActList);
                dashboard2.render(inputGoalList, actList)
             }
          });
        }
      });
    },

    pushGoal(newGoal){
      goalsDashboard.goalList.push(newGoal);
    },

    deleteGoal(goalName, index, response, event){
      if(response == 1){
        removeGoal(goalName);
        Vue.delete(this.goalList, index);
      }
    },

    clearGoals(){
      for(var i = 0; i < this.goalList.length; i ++) {
        removeGoal(this.goalList[i].goal_name);
        // Vue.delete(this.goalList, i);
      }
      this.goalList = [];
    },

    pushAddGoalPage(goalList) {
      this.$emit('push-page', {
        extends: goalCreatePage,
        data() {
          return {
          goalList: goalList,
          activitySetList: sharedData.goalCategories,
          dataLoaded: false
          }
        }
      });
    },
    pushEditGoalPage(goal, goalCategories, event){
      this.$emit('push-page',
      {
        extends: goalEditPage,
        data() {
          return {
            goal: goal,
            goalCategories: goalCategories,
            compared: []
          }
        },
        methods: {
          getBack() {
            vm.pageStack.pop();
          },
          editGoal(goalName, categoryName, activitiesAndSelected,  desiredValue, comparisonAndSelected,event) {
            selectedAct = [];
            for(var i = 0; i < activitiesAndSelected.selectedSet.length; i ++) {
              if(activitiesAndSelected.selectedSet[i]) {
                selectedAct.push(activitiesAndSelected.activities[i]);
              }
            };
            comparedSet = [];
            for(var i = 0; i < comparisonAndSelected.selectedSet.length; i ++) {
              if(comparisonAndSelected.selectedSet[i]) {
                comparedSet.push(comparisonAndSelected.activities[i]);
              }
            };
            updateGoal(goalName, categoryName, selectedAct, desiredValue, function(){
              // pass
            }, compareAct= comparedSet);
            goal.act = selectedAct;
            goal.comp_act = comparedSet;
            vm.pageStack.pop();
          }
        },

        computed:{
          activitiesAndSelected() {
            var result = {};
            var activities = [];
            for(var i = 0; i < this.goalCategories.length; i ++) {
              if(this.goalCategories[i].category_name == goal.category_name) {
                activities = this.goalCategories[i].act;
                result.activities = this.goalCategories[i].act;
              }
            }
            var selected = [];
            for(var i = 0; i < activities.length; i ++) {
              for(var j = 0; j < this.goal.act.length; j ++){
                if(activities[i] == this.goal.act[j]){
                  selected[i] = true;
                }
              }
            }
            result.selectedSet = selected;
            return result;
          },

          comparisonAndSelected(){
            var result = {};
            var activities = [];
            for(var i = 0; i < this.goalCategories.length; i ++) {
              if(this.goalCategories[i].category_name == goal.category_name) {
                activities = this.goalCategories[i].comp_act;
                result.activities = this.goalCategories[i].comp_act;
              }
            }
            var selected = [];
            for(var i = 0; i < activities.length; i ++) {
              for(var j = 0; j < this.goal.comp_act.length; j ++){
                if(activities[i] == this.goal.comp_act[j]){
                  selected[i] = true;
                }
              }
            }
            result.selectedSet = selected;
            return result;
          }

          /*
          hasActivity() {
            console.log("size: " + this.activitySet.length);
            return (this.activitySet.length > 0);
          }
          */
        }
      })
    }
  },
  /*
  computed: {
    activitySetList(){
      return getGoalCategories();
    },
    goalList(){
      return getGoal();
    },
  }
  */
};

const dailyDashboard = {
  template: '#dailyDashboard',
  data() {
    return {
      state: 'initial',
      items: [
        {
          date: "2017-12-06",
          goals: [
            {
              finished: true,
              goalName: "Exercising",
              category: "Physical State"
            },
            {
              finished: false,
              goalName: "Sleep 8 hours",
              category: "Physical State"
            },
            {
              finished: true,
              goalName: "Spend most of my day away from home",
              category: "Work-life balance"
            }
          ]
        },
        {
          date: "2017-12-05",
          goals: [
            {
              finished: true,
              goalName: "Exercising",
              category: "Physical State"
            },
            {
              finished: true,
              goalName: "Sleep 8 hours",
              category: "Physical State"
            }
          ]
        },
        {
          date: "2017-12-04",
          goals: [
            {
              finished: true,
              goalName: "Exercising",
              category: "Physical State"
            },
            {
              finished: false,
              goalName: "Sleep 8 hours",
              category: "Physical State"
            }
          ]
        },
        {
          date: "2017-12-03",
          goals: [
            {
              finished: false,
              goalName: "Sleep 8 hours",
              category: "Physical State"
            }
          ]
        },
        {
          date: "2017-12-02",
          goals: [
            {
              finished: true,
              goalName: "Sleep 8 hours",
              category: "Physical State"
            }
          ]
        }
      ]
    };
  },
  methods: {
    loadItem(done) {
      var thisComponent = this;
      $('.ui.accordion > .active').accordion('close');
      $('.ui.accordion > .title.visible').transition({
        animation: 'scale',
        duration  : 100,
        interval  : 50,
        onComplete : function(e) {
          if (this == $('.ui.accordion > .title')[0]) {
            setTimeout(() => {
              //thisComponent.items = [...thisComponent.items, thisComponent.items.length + 1];
              thisComponent.$nextTick(() => {
                $('.ui.accordion').accordion('refresh');
                $('.ui.accordion > .title.hidden').transition({
                  animation: 'slide left',
                  duration  : 300,
                  interval  : 100
                });
                $('.ui.rating').rating('disable');
              })
              done();
            }, 600);
          }
        }
      });
    },
    pushDailyReportPage(){
      this.$emit('push-page', dailyReportPage);
    },
    randomStarValue: function() {
      return Math.floor(Math.random() * 6);
    }
  },
  watch: {
    // items: function(val) {
    //   console.log(val)
    // }
  },
  created() {
    var thisComponent = this;
    $(document).ready(function() {
      thisComponent.$nextTick(() => {
        $('.ui.accordion').accordion('refresh');
        $('.ui.accordion > .title.hidden').transition({
          animation: 'slide left',
          duration  : 300,
          interval  : 100
        });
        $('.ui.rating').rating('disable');
      });
    })
  },
  computed: {
    computedItems: function() {
      var items = [];
      for (let i = 0; i < this.items.length; i++) {
        let numFinished = 0;

        for (let j = 0; j < this.items[i].goals.length; j++) {
          if (this.items[i].goals[j].finished == true) {
            numFinished++;
          }
        }
        items.push({
          date: this.items[i].date,
          numFinished: numFinished,
          goals: this.items[i].goals
        });
      }
      return items;
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
      loggedIn: JSON.parse(localStorage.getItem("loggedIn")) || false,
      notification: true,
      location: true,
      pageStack: []
    };
  },
  created() {
    if (this.loggedIn == false) {
      this.pageStack.push(loginPage);
    } else {
      this.pageStack.push(tabsDashboard);
    }
  },
  methods: {
    profile() {
      ajax("GET", "profile", null, function(res) {
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
        console.log("loggedIn: ", val)
        this.pageStack.push(tabsDashboard);
        app.checkPermission((hasPermission)=>{
          vm.permission = hasPermission;
          if (hasPermission) {
            readLabels((files) => {console.log(files.length)})
          }
        });
      } else {
        this.pageStack = [];
        this.pageStack.push(loginPage);
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
    console.log("done syncing")
  })
}

function ajax(method, endpoint, payload, callback) {
  var xhr = new XMLHttpRequest();
  var url = API_URL+endpoint;
  //console.log(url);
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
  //console.log(method)
  if (method == "GET") {
    xhr.open("GET", url += "?sid="+localStorage.getItem("sid"), true);
    xhr.send();
  } else if (method == "POST") {
    xhr.open("POST", url += "?sid="+localStorage.getItem("sid"), true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(payload));
  }
}


// goals ajax
function addGoal(goalName, categoryName, selectedAct, desiredValue, callback, compareAct=[]) {
  var payload = {
    name: goalName,
    act: selectedAct,
    compareAct: compareAct,
    categoryName: categoryName,
    value: desiredValue,
    action: "add"
  };
  ajax("POST", "updateGoal", payload, callback);
}

function updateGoal(goalName, categoryName, selectedAct, desiredValue, callback, compareAct=[]) {
  var payload = {
    name: goalName,
    act: selectedAct,
    compareAct: compareAct,
    categoryName: categoryName,
    value: desiredValue,
    action: "update"
  };
  ajax("POST", "updateGoal", payload, callback);
}

function removeGoal(goalName) {
  var payload = {
    name: goalName,
    act: [],
    compareAct: [],
    catagoryName: "",
    action: "remove",
    value: 0
  };
  ajax("POST", "updateGoal", payload, function() {
  });
}

function getGoalCategories(callback){
  ajax("POST", "getGoalCategories", {}, callback);
}

function getGoal(callback) {
  ajax("POST", "getGoal", {}, callback);
}

function getDataByDateAndActivities(date, activities, callback){
  var payload = {
    date: date,  // "2017-12-05"
    targets: activities   // ["Running", "Exercising"]
  };
  ajax("POST", "fetchStats", payload, callback);
}
