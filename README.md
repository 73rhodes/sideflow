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

