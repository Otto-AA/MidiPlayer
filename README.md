# MidiPlayer
Providing a simple interface to read and visualize midi files with javascript. It is based on [jasmid](https://github.com/gasman/jasmid) by [gasman](https://github.com/gasman). 

Other resources you might want to use in combination with this MidiPlayer are listed [here](#additional-resources). If you feel like some functionality is missing, you can create a feature request in the [issues section](https://github.com/Otto-AA/MidiPlayer/issues) and I will try to answer as soon as possible.

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

## Core functions
Here is a manually created documentation of the core functions of MidiPlayer.js. This will give you an overview of the functions neccessary to read midi files and listen to events.


### loadFromDataUrl
Loads a midi file from a base64 data url so it can be played afterwards.

**Parameters**

-   `midi` **string** b64 encoded midi file
-   `noteShift` **int** changes the note value of each element by n. (e.g. for a piano this should be -21)

Example: 
```javascript
// Load file via Input
var fileReader = new FileReader();  // consider using a polyfill
var midiFileInput = document.getElementById('midiFileInput');
midiFileInput.addEventListener('change', function(inputEvent) {
    fileReader.readAsDataURL(inputEvent.target.files[0]);
    fileReader.onload = function(file) {
        player.loadFromDataUrl(file, 0)
            .then(/* player.play()... */)
            .catch(/* handle error... */);
    };
});
```

### addCallback
Add a callback to listen for specific events.

Possible events are:
-   play / pause / stop / finish
-   noteOn / noteOff          (noteEvent will be passed to callback)

Example:
```javascript
player.addCallback('noteOn', function(event) { console.log(event); });
player.loadFromDataUrl(dataUrl)
    .then(player.play);
```

### Controls
You can use following functions to modify the playing status/style:
-   play
-   pause
-   stop
-   setTime
-   setSpeed

### Get information about midi / playing status
There are several functions to get the playing status:
-   isPlaying
-   getMidiEvents
-   getCurrentTime
-   getDuration
-   getEventsByTimeRange

### Manually change midi data
**addEvent**
-   `newEvent` **object** - must contain: type, timestamp

Add the event to the midi data and automatically sort it by the timestamp. You can give it arbitrary properties which you can retrieve later when listening for events.

**removeEvents**
-   `search`  **object**
Removes all events which contain all keys of the search and have the same values.

Example:
```javascript
player.addEvent({timestamp: 100, note: 12, type: 'noteOn', length: 100});
player.addEvent({timestamp: 200, note: 12, type: 'noteOff'});
player.addEvent({timestamp: 200, note: 14, type: 'noteOn', length: 50});
player.addEvent({timestamp: 250, note: 14, type: 'noteOff'});

player.removeEvents({note: 12});                    // Would remove first and second event
player.removeEvents({timestamp: 200, length: 50});  // Would remove third event
player.removeEvents({});                            // Would remove all events
```

## Automatically generated documentation
<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [MidiPlayer](#midiplayer)
    -   [loadFromDataUrl](#loadfromdataurl)
    -   [loadFromUint8Array](#loadfromuint8array)
    -   [loadFromRelativeUrl](#loadfromrelativeurl)
    -   [loadParsedMidi](#loadparsedmidi)
    -   [addCallback](#addcallback)
    -   [addCustomCallback](#addcustomcallback)
    -   [play](#play)
    -   [pause](#pause)
    -   [stop](#stop)
    -   [reset](#reset)
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
    -   [removeCallbacks](#removecallbacks)
    -   [addEvent](#addevent)
    -   [removeEvents](#removeevents)
    -   [reverseMidiData](#reversemididata)
    
## MidiPlayer
### typedef noteEvent
**Properties**

-   `channel` **int** 
-   `note` **int** 
-   `length` **(float | [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined))** 
-   `timestamp` **float** 
-   `track` **int** 
-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `velocity` **(int | [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined))** 

### loadFromDataUrl

**Parameters**

-   `midi` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** b64 encoded midi file
-   `noteShift` **int** changes the note value of each element by n. (e.g. for a piano this should be -21) (optional, default `0`)

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;noteEvent>>** resolving with an array containing the formatted event

### loadFromUint8Array

**Parameters**

-   `midi` **[Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)** uint8 array representing midi file
-   `noteShift` **int** changes the note value of each element by n. (e.g. for a piano this should be -21) (optional, default `0`)

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;noteEvent>>** resolving with an array containing the formatted events

### loadFromRelativeUrl

**Parameters**

-   `url` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** a relative url to the .mid file (e.g. ./data/test.mid)
-   `noteShift` **int** changes the note value of each element by n. (e.g. for a piano this should be -21) (optional, default `0`)

**Examples**

_Example for loading piano midi data_

```javascript
player.loadFromRelativeUrl('./data/test.mid', -21)
 .then(function(midiData) { console.log(midiData); })
 .catch(function(error) { console.log(error); });
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;noteEvent>>** resolving with an array containing the formatted events

### loadParsedMidi

**Parameters**

-   `events` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;noteEvent>** array containing all formatted events
-   `noteShift` **int** changes the note value of each element by n. (e.g. for a piano this should be -21) (optional, default `0`)

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;noteEvent>** 

### addCallback

Add an event listener

**Parameters**

-   `eventName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** specifies the trigger event name. Possible events are: start, finish, noteOn, noteOff
-   `callback` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** 

**Examples**

_Example showing how to listen to noteOn events_

```javascript
player.addCallback('noteOn', function(event) { console.log(event); });
```

### addCustomCallback

Add an event listener to a specific event

**Parameters**

-   `targetEvent` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `callback` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** 

**Examples**

_Example showing how to listen to noteOn events with the note 40_

```javascript
player.addCustomCallback({
  type: 'noteOn',
  note: 40
}, function(event) { console.log(event); });
```

### play

start playing the parsed midi from the current time

### pause

pauses the playing at the current time

### stop

pauses the playing and sets the current time to zero

### reset

stops the player and removes all events

### setTime

**Parameters**

-   `miliseconds` **int** 

### getCurrentTime

Returns **int** current time in miliseconds

### setSpeed

**Parameters**

-   `speed` **int** relative speed (1 is normal, 2 is double, 0.5 is half)

### getCurrentSpeed

Returns **int** current relative speed

### isPlaying

Returns **bool** 

### getDuration

Returns **float** duration of the midi in miliseconds

### getMidiEvents

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;noteEvent>** (all loaded events)

### getNextEventsByTime

get all events which are in the range [currentTime <= event.timestamp <= currentTime + miliseconds]

**Parameters**

-   `miliseconds` **int** specifies the end of the time range

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;noteEvent>** 

### getPreviousEventsByTime

get all events which are in the range [currentTime - miliseconds <= event.timestamp <= currentTime]

**Parameters**

-   `miliseconds` **int** specifies the start of the time range

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;noteEvent>** containing all events which are in the range [currentTime - miliseconds <-> currentTime]

### getEventsByTimeRange

get all events which are in the range [startTime <= event.timestamp <= endTime]

**Parameters**

-   `startTime` **int** start of the time range in miliseconds
-   `endTime` **int** end of the time range in miliseconds

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;noteEvent>** containing all events which are in the time range

### triggerCallbacks

**Parameters**

-   `event` **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object))** string -> type which will be triggered | object -> event which will be triggered

**Examples**

_Example showing how to trigger play_

```javascript
player.triggerCallbacks('play');   // Same as player.triggerCallbacks({type: 'play'});
```

_Example showing how to trigger a specific noteEvent_

```javascript
player.triggerCallbacks({type: 'noteOn', note: 40, timestamp: 500, length: 50});
```

### removeCallbacks

Remove all callbacks attached to the player

### addEvent

**Parameters**

-   `newEvent` **noteEvent** must contain: timestamp, type [, optional properties]

**Examples**

```javascript
player.addEvent({timestamp: 5000, note: 40, type: 'noteOn', length: 75, customPropOne: 'abc', customPropTwo: 'de'});
```

### removeEvents

removes all events which have the same keys and properties as the search

**Parameters**

-   `search` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** e.g. {note: 40, type: 'noteOff'} or {timestamp: 500}

**Examples**

_Example showing how to delete all noteOff events with the note 40_

```javascript
player.removeEvents({note: 40, type: 'noteOff'});
```

_Example showing how to delete all events_

```javascript
player.removeEvents({});
```

### reverseMidiData

Reverse midi data so that playing afterwards will play the song backwards, but currentTime will still start from zero (and not from the end). (Not the same as reversing the order)