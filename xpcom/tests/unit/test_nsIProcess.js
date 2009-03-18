/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is XPCOM unit tests.
 *
 * The Initial Developer of the Original Code is
 * James Boston <mozilla@jamesboston.ca>.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
// nsIProcess unit test

// get the path to {objdir}/dist/bin
var bindir = Components.classes["@mozilla.org/file/directory_service;1"]
.getService(Components.interfaces.nsIProperties)
.get("CurProcD", Components.interfaces.nsIFile);

// the the os
var isWindows = ("@mozilla.org/windows-registry-key;1" in Components.classes);

var filePrefix = "";
var fileSuffix = "";

if (isWindows) {
  filePrefix = bindir.path + "\\";
  fileSuffix = ".exe";
} else {
  filePrefix = bindir.path + "/";
}


// test if a process can be started, polled for its running status
// and then killed
function test_kill()
{
  var testapp = filePrefix + "TestBlockingProcess" +fileSuffix;
  print(testapp);
 
  var file = Components.classes["@mozilla.org/file/local;1"]
                       .createInstance(Components.interfaces.nsILocalFile);
  file.initWithPath(testapp);
 
  var process = Components.classes["@mozilla.org/process/util;1"]
                          .createInstance(Components.interfaces.nsIProcess);
  process.init(file);
  
  do_check_false(process.isRunning);

  try {
    process.kill();
    do_throw("Attempting to kill a not-running process should throw");
  }
  catch (e) { }

  process.run(false, [], 0);

  do_check_true(process.isRunning);

  process.kill();

  do_check_false(process.isRunning);

  try {
    process.kill();
    do_throw("Attempting to kill a not-running process should throw");
  }
  catch (e) { }
}

// test if we can get an exit value from an application that is
// guaranteed to return an exit value of 42
function test_quick()
{
  var testapp = filePrefix + "TestQuickReturn" + fileSuffix;
  
  var file = Components.classes["@mozilla.org/file/local;1"]
                       .createInstance(Components.interfaces.nsILocalFile);
  file.initWithPath(testapp);
  
  var process = Components.classes["@mozilla.org/process/util;1"]
                          .createInstance(Components.interfaces.nsIProcess);
  process.init(file);
  
  // to get an exit value it must be a blocking process
  process.run(true, [], 0);

  do_check_eq(process.exitValue, 42);
}

// test if an argument can be successfully passed to an application
// that will return -1 if "mozilla" is not the first argument
function test_arguments()
{
  var testapp = filePrefix + "TestArguments" + fileSuffix;
  
  var file = Components.classes["@mozilla.org/file/local;1"]
                       .createInstance(Components.interfaces.nsILocalFile);
  file.initWithPath(testapp);
  
  var process = Components.classes["@mozilla.org/process/util;1"]
                          .createInstance(Components.interfaces.nsIProcess);
  process.init(file);
  
  var args= ["mozilla"];
  
  process.run(true, args, args.length);
  
  // exit codes actually seem to be unsigned bytes...
  do_check_neq(process.exitValue, 255);
}

var gProcess;

// test if we can get an exit value from an application that is
// run non-blocking
function test_nonblocking()
{
  var testapp = filePrefix + "TestQuickReturn" + fileSuffix;
  
  var file = Components.classes["@mozilla.org/file/local;1"]
                       .createInstance(Components.interfaces.nsILocalFile);
  file.initWithPath(testapp);
  
  gProcess = Components.classes["@mozilla.org/process/util;1"]
                       .createInstance(Components.interfaces.nsIProcess);
  gProcess.init(file);

  gProcess.run(false, [], 0);

  do_test_pending();
  do_timeout(100, "check_nonblocking()");
}

function check_nonblocking()
{
  if (gProcess.isRunning) {
    do_timeout(100, "check_nonblocking()");
    return;
  }

  do_check_eq(gProcess.exitValue, 42);
  do_test_finished();
}

function run_test() {
  test_kill();
  test_quick();
  test_arguments();
  if (isWindows)
    test_nonblocking();
}
