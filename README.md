sgreen2_react
=============
This is the React built front end for the sgreen website. It uses ECMAScript 6 so make sure you are using a supported
browser (https://caniuse.com/#search=es6). I used IntelliJ with this project.

Dependencies
------------
nodejs >= 8.11.0
npm >= 5.6.0

Getting started
---------------
### Installation
```
git clone https://github.com/thekuom/sgreen2_react
cd sgreen2_react
npm install
```
You'll need to edit .env.production and .env.development with the rest api endpoint.
### Running the development server
```
npm start
```
### Building the project to a static website
```
npm run build
```
The build folder is now a static website. You can now copy paste the contents in Apache or S3 like I did.

File Tree
---------
```
build/                                  : this is generated by npm run build and holds the static website
config/                                 : this holds config files for Webpack, etc. (do not edit unless you know what you're doing)
    webpack.config.dev.js               : edited this file to use CSS modules and enable SASS in dev environment (npm start)
    webpack.config.prod.js              : edited this file to use CSS modules and enable SASS in prod environment (npm run build)
node_modules/                           : the node modules (track this file and you're in for a bad time), populated by npm install
public/
    favicon.ico                         : that little icon that appears on the web browser tab
    index.html                          : you probably won't need to edit this unless you want to change the default website title
    manifest.json                       : some configuration (generated by React)
scripts/                                : holds scripts for npm (don't touch unless you know what you're doing)
src/                                    : the meat of the program
    assets/                             : assets for global stuff
        _master.scss                    : holds global SASS variables (keeps our code DRY)
    components/                         : the react components
        Actuators/                      : the Actuators component (the section of the website that says Actuators)
            Actuator/                   : the Actuator component (a single actuator i.e. fan1 [switch])
                Actuator.js             : the JS file defining the Actuator class
                Actuator.module.scss    : the css module for the Actuator component
            Actuators.js                : the JS file defining the Actuators class
            Actuators.module.scss       : the css module for the Actuators component
        App/                            : the App component (main component)
            App.js                      : defines the App class
            App.module.scss             : the css module for the App component
        DataReadings/                   : the DataReadings component (the section of the website that says Data Readings)
            Graph/                      : a Graph component for keeping our code DRY, uses react-vis
                Graph.js                : the Graph class
            DataReadings.js             : the DataReadings class
            DataReadings.module.scss    : the css module for the DataReadings component
        Section/                        : a Section component (used by our sections Actuators, DataReadings, Settings)
            Section.js                  : the Section class (enables the collapse/expand behavior other common behavior amongst sections)
            Section.module.scss         : the css module for the Section component
        Settings/                       : the Settings component (the section of the website that says Settings)
            Settings.js                 : the Settings class
            Settings.module.scss        : the css module for the Settings component
    utils/                              : utility files
        sgreen-api.js                   : a friendlier JS interface for interacting with the REST API
    index.js                            : generated by React
    index.scss                          : global SASS/CSS
    registerServiceWorker.js            : generated by React
.gitignore                              : the git ignore
package.json                            : defines node_mdules to be installed when running npm install
package-lock.json                       : https://docs.npmjs.com/files/package-lock.json
postcss.config.js                       : here to remediate an error (see SASS/CSS modules reference below)
README.md                               : this file
```


References
----------
These references are not comprehensive on the techniques I am using. I provide these links as starting points
and explanations for some questions you may have if you are new to React like me.

### SASS and CSS modules
Why am I using SASS and CSS modules (it's better!)

https://medium.com/@kswanie21/css-modules-sass-in-create-react-app-37c3152de9

### File structure
Why did I organize the files by component instead of having a giant CSS folder?

https://hackernoon.com/the-100-correct-way-to-structure-a-react-app-or-why-theres-no-such-thing-3ede534ef1ed

### React component life cycle
What is `componentDidMount()` and when is it called?

https://reactjs.org/docs/react-component.html

### Integrating the REST API
How did I know how to integrate the REST API?

https://www.andreasreiterer.at/web-development/connect-react-app-rest-api/

### Binding component functions
What is the deal with `bind(this)`? (See #4 in the link)

https://medium.freecodecamp.org/react-binding-patterns-5-approaches-for-handling-this-92c651b5af56

### React-vis
What did I use to graph?

https://uber.github.io/react-vis/

Known Bugs
----------
1. **The actuator buttons do not work on Safari.**
I suspect that this is some sort of CORS issue. The website was developed using Firefox as the main browser, so for now,
just stick to that.

2. **When first opening the page, there is no data.**
I have no idea what is causing this issue, but if I see that the settings form is blank, a quick page refresh usually
fixes it. This could be related to how S3 handles static web pages and maybe that is clashing with axios, since I have
not encountered this issue in development mode.

3. **Clicking one of the actuator buttons but it immediately reverses.**
You got unlucky. Every 15 seconds, the actuator states are updated to indicate if they are on or off. If you happen to
click during the time it is updating, which is a very short window, you'll experience this. There is an easy fix, which
is to just not update it, if Manual Mode is on, but I decided it would be better to update it in both manual mode and
automated mode.

4. **The website looks really bad.**
Hey, back off. I think it looks like Neapolitan ice cream, which is yummy.

Future Development
------------------
1. Add authentication
