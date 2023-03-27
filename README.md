# WeatherApp

**WeatherApp** is a React Native App that allows you to check weather and forecasts of your favourite cities.

## Installation

##### First:

Run `yarn` to install all needed node modules.

##### Then, to develop:

Run `yarn android` to run the App in an Android emulator (Android SDK and Android Studio needed) or on a real debug device (turn on developer settings and USB debug).<br/>
Run `yarn ios` to run the App in an iOS simulator (Apple computer with XCode needed).<br/>

Note: when dev build runs on an Android test device from a Linux machine you may get `Error: adb: insufficient permissions for device`. In this case just run `sudo adb kill-server` and `sudo adb start-server`. Then you can succesfully start a dev build again with `yarn android`.

## Technical details:

This App comes with some cool features

<ul>
<li>Using latest React Native framework</li>
<li>Written in TypeScript</li>
<li>Redux for context and storage</li>
<li>TailwindCSS for styling/theming</li>
<li>I18n for ui language change and translation system</li>
<li>Lottie for Lottie json animation playback</li>
<li>UI animations by React-Native included Animated library</li>
<li>And... well commented code!</li>
</ul>
