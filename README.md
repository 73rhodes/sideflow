sideflow - a flow control extention for Selenium IDE
===

Let's you do goto and while loops in the Selenium IDE Firefox add-on. This is a Selenium
IDE compatible port of the flow control extension from http://wiki.openqa.org/display/SEL/flowControl.

<img src="http://4.bp.blogspot.com/_Vi1folaOZAs/R7N1_L5KjDI/AAAAAAAAAGQ/PyozuVCHBC4/s400/flow_control_ide.png"></img>

Requirements
---
Selenium IDE v1.0.5 +

Install
---
- Get Selenium IDE for Firefox from http://seleniumhq.org
- Launch Selenium IDE from Firefox and open the options menu
- Add the sideflow.js file to the "Selenium Core extensions (user-extensions.js)" field

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

- Install and usage information [Blog](http://51elliot.blogspot.com/2008/02/selenium-ide-goto.html)
- Selenium HQ [SeleniumHQ](http://seleniumhq.org/)

Authors
---
- Andrey Yegorov - original flow control extension
- Darren DeRidder - Selenium IDE port
