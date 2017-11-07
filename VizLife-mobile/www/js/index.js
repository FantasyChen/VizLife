/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
      this.receivedEvent('deviceready');
      var permissions = cordova.plugins.permissions;

      permissions.checkPermission(permissions.READ_EXTERNAL_STORAGE, (success) => {
        if (success.hasPermission) {
          ui.permission = true;
          readLabels();
        }
        else {
          ui.permission = false;
          permissions.requestPermission(permissions.READ_EXTERNAL_STORAGE, (success) => {
            ui.permission = true;
            readLabels();
          }, () => {
            ui.permission = false;
          })
        }
      }, () => {
        ui.permission = false;
        console.log("error checking permission")
       }
      );
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');
        //
        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');
        console.log('Received Event: ' + id);
    }
};

function readLabels() {
  var path = cordova.file.externalRootDirectory + "Android/data/edu.ucsd.calab.extrasensory/files/documents/";
  getEntry(path, (entries) => {
    if (entries.length == 0)
      return;

    console.log(entries[0].name);
    path += entries[0].name;
    getEntry(path, (files) => {
      if (files.length == 0)
        return;
      var fileName = files[files.length-1].name;
      console.log(fileName);
      var timestamp = fileName.substring(0, fileName.indexOf('.'));
      var timestamp = parseInt(timestamp + "000");
      ui.loading = true;
      readFile(files[files.length-1], function(result) {
        ui.predictions = JSON.parse(result);
        ui.predictions.time = moment(timestamp).format("dddd, MMMM Do YYYY, h:mm:ss a"); 
        ui.loading = false;
      })
    });
  });
}

function getEntry(path, cb) {
  window.resolveLocalFileSystemURL(path, function (entry) {
      console.log(entry);
      // check here if fileEntry is null or if there was an errorHandler
      if (entry.isDirectory) {
        var reader = entry.createReader();
        reader.readEntries(function(entries) {
          // for (var i = 0; i < entries.length; i++) {
          //     console.log(entries[i].name);
          // }
          cb(entries);
        }, function (error) {
          console.log("Failed to list directory contents: " + error.code);
        })
      }

  }, errorHandler.bind(null, path));
}

function readFile(fileEntry, cb) {
    var fileEntry = fileEntry.file(function (file) {
        var reader = new FileReader();

        reader.onloadend = function() {
            //console.log("Successful file read: " + this.result);
            cb(this.result);
            //displayFileData(fileEntry.fullPath + ": " + this.result);
        };

        reader.readAsText(file);

    }, errorHandler);
}

var errorHandler = function (fileName, e) {
    var msg = '';

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'Storage quota exceeded';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'File not found';
            break;
        case FileError.SECURITY_ERR:
            msg = 'Security error';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'Invalid modification';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'Invalid state';
            break;
        default:
            msg = 'Unknown error';
            break;
    };

    console.log('Error (' + fileName + '): ' + msg);
}

app.initialize();
