import numpy as np
import json

# TODO:: Function to get data from all the server prediction files and make them into one json



# Takes data from predictions.json file and loads it
def readPredictions():
	pred_url = "../data/pred/pred.json"
	file = open(pred_url, "rw")
	pred = json.load(file)
	return pred

# Taking prediction values 
predictions = readPredictions()
#print predictions
labels = predictions['p1']['label_names']
val = []

for i in range(1, 5):
	val.insert(i, (predictions['p'+str(i)]['location_lat_long'],zip(labels,predictions['p'+str(i)]['label_probs'])))



return_list = []
i = 0
for lat_long, prob in val:
	i+=1
	return_dict = {}
	viz_list = []
	for label, p in prob:
		value = p
		axis = label
		viz = {}
		viz['value'] = value
		viz['prediction'] = axis
		viz['location'] = str(lat_long)
		viz_list.append(viz)
	return_dict['key'] = i
	return_dict['values'] = viz_list
	return_list.append(return_dict)

ret_json = json.dumps(return_list)
with open('data.json', 'w') as outfile:
    json.dump(return_list, outfile)

