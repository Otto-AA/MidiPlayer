# MidiPlayer
Providing a simple interface to read and visualize midi files with javascript. It is based on [MIDI.js](https://github.com/mudcube/MIDI.js) by [mudcube](https://github.com/mudcube). 

Other resources you might want to use in combination with this MidiPlayer are listed [here](#additional-resources). If you feel like something is missing, you can create a feature request in the [issues section](https://github.com/Otto-AA/MidiPlayer/issues) and I will try to answer as soon as possible.

# Basic Example
This example demonstrates the basic usage of MidiPlayer. You can also view a [complete example](./examples/basic.html) and its [live demo](https://htmlpreview.github.io/?https://github.com/Otto-AA/MidiPlayer/blob/master/examples/basic.html)
```javascript
var player = new MidiPlayer();
player.addCallback('noteOn', function (event) {/* handle noteOn event */});
player.addCallback('noteOff', function (event) {/* handle noteOff event */});
player.loadFromUint8Array(uint8Midi)
    .then(function() { player.play(); });
```

# Usage
#### Using ES6  `import`:

Download the files in [src](./src) and import the MidiPlayer as follows:

```javascript
import MidiPlayer from './path/to/src/MidiPlayer';
const player = new MidiPlayer();
// player.loadFromDataUrl...
```

#### Using `<script>`
Download [MidiPlayer.js](./build/MidiPlayer.js) from [build](./build).

In your html:
```html
<script type="application/javascript" src="./path/to/midiplayer/MidiPlayer.js"></script>
<script type="application/javascript" src="myScript.js"></script>
```
In *myScript.js*:
```javascript
var player = new MidiPlayer();
// player.loadFromDataUrl...
```


# Browser Support

|![Chrome](https://github.com/alrra/browser-logos/raw/master/src/chrome/chrome_48x48.png) | ![Firefox](https://github.com/alrra/browser-logos/raw/master/src/firefox/firefox_48x48.png) | ![Edge](https://github.com/alrra/browser-logos/raw/master/src/edge/edge_48x48.png) | ![Opera](https://github.com/alrra/browser-logos/raw/master/src/opera/opera_48x48.png) | ![Safari](https://github.com/alrra/browser-logos/raw/master/src/safari/safari_48x48.png) |
|---------|-----------|----------|--------------|--------------|
|Latest ✔ | Latest ✔ | Latest ✔ | *Not Tested* | *Not Tested* |

Feel free to contribute to this list, especially if you can provide info about older versions of the browsers :)

# Additional Resources
A list of resources you might be interested in:
 - [sample-player](https://github.com/danigb/sample-player) - *"A web audio audio sample player"*
 - [MIDI.js](https://github.com/mudcube/MIDI.js) - *"Making life easy to create a MIDI-app on the web."* (Reading midi files, playing sounds and more, but sadly not maintained since 2+ years)

# Documentation
<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [MidiPlayer](#midiplayer)
    -   [loadFromDataUrl](#loadfromdataurl)
    -   [loadFromUint8Array](#loadfromuint8array)
    -   [loadParsedMidi](#loadparsedmidi)
    -   [addCallback](#addcallback)
    -   [play](#play)
    -   [pause](#pause)
    -   [stop](#stop)
    -   [setTime](#settime)
    -   [getCurrentTime](#getcurrenttime)
    -   [setSpeed](#setspeed)
    -   [getCurrentSpeed](#getcurrentspeed)
    -   [isPlaying](#isplaying)
    -   [getDuration](#getduration)
    -   [getMidiEvents](#getmidievents)
    -   [getNextEventsByTime](#getnexteventsbytime)
    -   [getPreviousEventsByTime](#getpreviouseventsbytime)
    -   [getEventsByTimeRange](#geteventsbytimerange)
    -   [triggerCallbacks](#triggercallbacks)

## MidiPlayer

noteEvent

**Properties**

-   `channel` **int** 
-   `note` **int** 
-   `length` **(float | [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined))** 
-   `timestamp` **float** 
-   `track` **int** 
-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `velocity` **(int | [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined))** 

### loadFromDataUrl

loadFromDataUrl

**Parameters**

-   `midi` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** b64 encoded midi file
-   `noteShift` **int** changes the note value of each element by n. (e.g. for a piano this should be -21) (optional, default `0`)

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;noteEvent>** resolving with an array containing the formatted event

### loadFromUint8Array

loadFromUint8Array

**Parameters**

-   `midi` **[Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)** uint8 array representing midi file
-   `noteShift` **int** changes the note value of each element by n. (e.g. for a piano this should be -21) (optional, default `0`)

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;noteEvent>** resolving with an array containing the formatted event

### loadParsedMidi

loadParsedMidi

**Parameters**

-   `events` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;noteEvent>** array containing all formatted events
-   `noteShift` **int** changes the note value of each element by n. (e.g. for a piano this should be -21) (optional, default `0`)

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;noteEvent>** 

### addCallback

addCallback
Add an event listener

**Parameters**

-   `event`  
-   `callback`  
-   `eventName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** specifies the trigger event name. Possible events are: start, finish, noteOn, noteOff

### play

start playing the parsed midi from the current time

### pause

pauses the playing at the current time

### stop

pauses the playing and sets the current time to zero

### setTime

setTime

**Parameters**

-   `miliseconds` **int** 

### getCurrentTime

getCurrentTime

Returns **int** current time in miliseconds

### setSpeed

setSpeed

**Parameters**

-   `speed` **int** relative speed (1 is normal, 2 is double, 0.5 is half)

### getCurrentSpeed

getCurrentSpeed

Returns **int** current relative speed

### isPlaying

isPlaying

Returns **bool** 

### getDuration

getDuration

Returns **float** duration of the midi in miliseconds

### getMidiEvents

getMidiEvents

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;noteEvent>** (all loaded events)

### getNextEventsByTime

getNextEventsByTime

**Parameters**

-   `miliseconds` **int** specifies the end of the time range

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;noteEvent>** containing all events which are in the range [currentTime <-> currentTime + miliseconds]

### getPreviousEventsByTime

getPreviousEventsByTime

**Parameters**

-   `miliseconds` **int** specifies the start of the time range

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;noteEvent>** containing all events which are in the range [currentTime - miliseconds <-> currentTime]

### getEventsByTimeRange

getEventsByTimeRange

**Parameters**

-   `start` **int** start of the time range in miliseconds
-   `end` **int** end of the time range in miliseconds

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;noteEvent>** containing all events which are in the time range

### triggerCallbacks

triggerCallbacks

**Parameters**

-   `event` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the eventname which will be triggered
-   `data` **any** data passed to the callbacks