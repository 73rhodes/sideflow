sideflow - a flow control extension for Selenium IDE
===
Lets you do goto and while loops in the Selenium IDE Firefox add-on as well as via the _selenese_ goal in the
Maven Selenium Plugin. This is a Selenium IDE compatible port of the flow control extension from
[http://wiki.openqa.org/display/SEL/flowControl](http://wiki.openqa.org/display/SEL/flowControl) which is the older
outdated version of [https://addons.mozilla.org/en-us/firefox/addon/flow-control/](https://addons.mozilla.org/en-us/firefox/addon/flow-control/).

![picture](http://4.bp.blogspot.com/_Vi1folaOZAs/R7N1_L5KjDI/AAAAAAAAAGQ/PyozuVCHBC4/s400/flow_control_ide.png")

Requirements
---
Selenium IDE v1.0.5 +
Selenium Maven Plugin v2.3 +

Install
---
__Firefox Selenium IDE__

 * Get Selenium IDE for Firefox from [http://www.SeleniumHQ.org/projects/ide/](http://www.SeleniumHQ.org/projects/ide/)
 * Launch Selenium IDE from Firefox and open the _Options_ menu
 * Add the sideflow.js file to the "Selenium Core extensions (user-extensions.js)" field
 
__Selenium Maven Plugin ( _selenese_ )__

 * Install and configure your Selenium Maven Plugin in your POM
 * Configure the plugin _userExtensions_ property
 * Configure your execution to use the _selenese_ goal

Commands
---
- label | mylabel - creates a label called "mylabel" (a goto target)
- goto | mylabel - goto "mylabel"
- gotoLabel | mylabel - synonym for goto
- gotoIf | expression - jump to specified label if expression is true
- while | expression - loop while expression is true
- endWhile - indicate the end of a while loop
- push | value | arrayName - push value onto an array, creating array if necessary

Resources
---
- [Full Documentation](http://51elliot.blogspot.com/2008/02/selenium-ide-goto.html)
- Selenium HQ [SeleniumHQ](http://seleniumhq.org/)

Authors
---
- Andrey Yegorov - original flow control extension
- Darren DeRidder - Selenium IDE port
- Paul Bors - Selenium Maven Plugin port

License
---
- See the attached License document.
