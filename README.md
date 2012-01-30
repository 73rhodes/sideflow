==================================
Name: Flow Control
Version: 1.0.4
Requirements: Selenium IDE v1.0.5
==================================

NOTE:
This is a plugin for Selenium IDE incorporating the flow control extension 
available at http://wiki.openqa.org/display/SEL/flowControl and 
http://51elliot.blogspot.com/2008/02/selenium-ide-goto.html

Update 2011/11/15:
Darren DeRidder now calls the script sideflow.js and publishes it here:
https://github.com/darrenderidder/sideflow

Hasan Bramwell forked it, added ForEach looping and tested it under FireFox 8.0
His fork of sideflow.js is here:
https://github.com/martinhbramwell/sideflow

DOCUMENTATION:
Have a look here:
https://github.com/martinhbramwell/sideflow

INSTALLATION:
1. Run build.bat (or build.sh on Linux).
2. Open flowcontrol.xpi in Firefox.

REQUIREMENTS:
To build on Windows you will need 7-Zip and Robocopy
* 7-Zip - http://www.7-zip.org/
* Robocopy - http://en.wikipedia.org/wiki/Robocopy

CREDITS:
* Andrey Yegorov - Created the original flow control extension
* Darren DeRidder - Modified the original extension for Selenium IDE
* Adam Goucher - Author of the Selenium IDE plugin API 
* Dave Hunt - All I did was turn the extension into a plugin
* Martin "Hasan" Bramwell - Added For/Each looping (as seen in Java)


===
===
===


Selenium IDE Flow Control Extension
===

Let's you do goto and while loops in the Selenium IDE Firefox add-on.

<img src="http://4.bp.blogspot.com/_Vi1folaOZAs/R7N1_L5KjDI/AAAAAAAAAGQ/PyozuVCHBC4/s400/flow_control_ide.png"></img>

Install
---
- Get Selenium IDE for Firefox from http://seleniumhq.org
- Launch Selenium IDE from Firefox and open the options menu
- Add the sideflow.js file to the "Selenium Core extensions (user-extensions.js)" field

Authors
---
- Andrey Yegorov
- Darren DeRidder

Resources
---

- Install and usage information [Blog](http://51elliot.blogspot.com/2008/02/selenium-ide-goto.html)
- Selenium HQ [SeleniumHQ](http://seleniumhq.org/)


ForEach loop enhancement
===

With this enhancement you can now perform For Each loops on a previously stored collection.

<img src="https://github.com/martinhbramwell/SeleniumForOpenERP/raw/master/scrapheap/SeleniumForEach.png"></img>


Instructions
---
You should have no difficulty adapting to your needs the example in ./demos/testForEach.html

The steps are :
<pre>
|addCollection   |  aSuitableCollectionName           |                                  |
|addToCollection |  aSuitableCollectionName           |  aValue                          |
|addToCollection |  aSuitableCollectionName           |  aDifferentValue                 |
|addToCollection |  aSuitableCollectionName           |  anotherValue                    |
|storeFor        |  aSuitableCollectionName           |  aSuitableTemporaryVariableName  |
|echo            |  ${aSuitableTemporaryVariableName} |                                  |
|endFor          |                                    |                                  |
</pre>

* addCollection - instantiate a collection
* addToCollection - adds a value to the indicated collection (JSON objects are ok)
* storeFor - retrieves the next available value from your collection and stuffs it into the indicated temporary variable. If there's no value available it jumps to the endFor.
* endFor - marks the end of the execution block

Authors
---
- Martin "Hasan" Bramwell |  http://openerp24hrs.blogspot.com/  |

