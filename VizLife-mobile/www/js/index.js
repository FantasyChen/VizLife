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
      this.checkPermission((hasPermission)=>{
        if (hasPermission) {
          readLabels((files) => {
            if (files) {
              vm.unsynced_files = files.length;
            }
          })
        }
      });
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
      console.log('Received Event: ' + id);
    },

    // check external storage read permission
    checkPermission: function(cb) {
      var permissions = cordova.plugins.permissions;

      permissions.checkPermission(permissions.READ_EXTERNAL_STORAGE, (success) => {
        if (success.hasPermission) {
          vm.permission = true;
          cb(true);
        }
        else {
          vm.permission = false;
          permissions.requestPermission(permissions.READ_EXTERNAL_STORAGE, (success) => {
            vm.permission = true;
            cb(true);
          }, () => {
            vm.permission = false;
            cb(false);
          })
        }
      }, () => {
        vm.permission = false;
        cb(false)
        console.log("error checking permission")
       }
      );
    }
};

function readLabels(cb) {
  var path = cordova.file.externalRootDirectory + "Android/data/edu.ucsd.calab.extrasensory/files/documents/";
  getEntry(path, (entries) => {
    if (entries.length == 0)
      return cb(null);

    console.log(entries[0].name);
    path += entries[0].name;
    getEntry(path, (files) => {
      return cb(files);
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
