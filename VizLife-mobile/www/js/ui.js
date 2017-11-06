var ui = new Vue({
  data: {
    loading: false,
    permission: false,
    predictions: {
    	"label_names": [],
    	"label_probs": [],
    	"location_lat_long": [],
      "time": ''
    }
  },
  el: "#ui",
  methods: {
    reload: function() {
      readLabels();
    }
  }
})
