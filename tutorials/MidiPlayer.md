# Tutorial
A quick tutorial on how to read midi files and listen to events with MidiPlayer.js

## Contents
-   [Loading the Library](#loading-the-library)
    -   [Using ES6 `import`](#using-es6--import)
    -   [Using &lt;script&gt;](#using-script)
-   [Quick Start](#quick-start)
-   [Load midi file](#load-midi-file)
    -   [From Url](#from-url)
    -   [Via &lt;input type="file"&gt;](#via-input-typefile)
-   [Listen for events](#listen-for-events)
    -   [addCallback](#addcallback)
    -   [addCustomCallback](#addcustomcallback)
    -   [removeCallback](#removecallback)
    -   [triggerCallbacks](#triggercallbacks)
-   [Controls](#controls)
-   [Modifying midi data](#modifying-midi-data)
    -   [Add Events](#add-events)
    -   [Remove Events](#remove-events)
    -   [Reverse Events](#reverse-events)
    -   [Custom modifications to events](#custom-modifications-to-events)

## Loading the Library
To use MidiPlayer in your script you can choose one of the following methods. The first one is using ES6 which (currently) needs to be compiled into older versions of javascript before publishing it. The second one uses an already compiled version combined with the good old `<script>` tag, so it can be used without compiling.

### Using ES6  `import`

Download the files in [src](../src) and import the MidiPlayer as follows:

```javascript
import MidiPlayer from './path/to/src/MidiPlayer';
const player = new MidiPlayer();
// player.loadFromDataUrl...
```

### Using `<script>`
Download [MidiPlayer.js](../build/MidiPlayer.js) from [build](../build).

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

## Quick Start
Here is an example covering the core functions of the midi player. You can also look into the [examples folder](../examples) for more.
```javascript
var player = new MidiPlayer();

var url = './test.mid';
player.loadFromRelativeUrl(url, -21)    // Use noteshift -21 for piano
    .then(function(midiData) {
        console.log(midiData);
        var handleEvent = function(event) {
            document.body.innerHTML += '<pre>' + JSON.stringify(event, null, 2) + '</pre>';
        }
        player.addCallback('play', handleEvent);
        player.addCallback('pause', handleEvent);
        player.addCallback('stop', handleEvent);
        player.addCallback('finish', handleEvent);
        player.addCallback('noteOn', handleEvent);
        player.addCallback('noteOff', handleEvent);
        player.addCustomCallback({note: 40}, function(event) {
            console.log('event with note 40 was played.');
        });
        
        // Loop
        player.addCallback('finish', function() {
            player.setTime(0);
            player.play();
        });

        // Start playing
        player.play();
    })
    .catch(function(error) {
        console.log('error while loading midi file', url);
        console.log(error);
    });

```

## Load midi file
### From Url
To load a midi file from a relative url we will use `player.loadFromRelativeUrl(url, noteShift)`. noteShift is a number which specifies how much the note value of each event should be changed while loading. You can look [here](http://www.electronics.dit.ie/staff/tscarff/Music_technology/midi/midi_note_numbers_for_octaves.htm) for a table of midi note values and the musical notes they represent.

```javascript
// Loading a piano midi file
var url = './test.mid';
player.loadFromRelativeUrl(url, -21)    // Use -21 because the first piano note has midi-note-value of 21
    .then(function(midiData) {
        console.log(midiData);
        player.play();
    })
    .catch(function(error) {
        console.log('error while loading midi file', url);
        console.log(error);
    });
```

### Via &lt;input type="file"&gt;
To let the user upload the midi file we will need an &lt;input&gt; combined with the FileReader API and the function `player.loadFromDataUrl(dataUrl, noteShift)`

```javascript
// Load file via Input
var midiFileInput = document.getElementById('midiFileInput');
midiFileInput.addEventListener('change', function(inputEvent) {
    // Check if the user selected a file
    if (inputEvent.target.files.length === 0) {
        return;
    }
    // Read file as data url
    var fileReader = new FileReader();  // consider using a polyfill
    fileReader.readAsDataURL(inputEvent.target.files[0]);
    fileReader.onload = function(file) {
        // Load the MidiPlayer with the data url
        var dataUrl = file.target.result;
        player.loadFromDataUrl(dataUrl, 0)
            .then(function(midiData) {
                console.log(midiData);
                player.play();
            })
            .catch(function(error) {
                console.log('error while loading midi file');
                console.log(error);
            });
    };
});
```

## Listen for events
In this section we will look how to listen to various midi events. To do that, we will use the functions `addCallback(name, callback)` and `addCustomCallback(event, callback)`.

### addCallback
With this function you are able to listen to following events:
-   play / pause / stop / finish
-   noteOn / noteOff          (noteEvent will be passed to callback)
```javascript
// Printing out all played noteOn events
player.addCallback('noteOn', function(event) { console.log(event); });
player.play();
```

### addCustomCallback
This function lets you define a custom triggerer. So for example you can listen to all noteOn events with the note 20. Combined with `player.addEvent` you could add an event with custom properties and then listen to those.
```javascript
// Printing out all played noteOn events with the note 20
player.addCustomCallback({type: 'noteOn', note: 20}, function(event) { console.log(event); });

// In combination with manually added events
player.addEvent({type: 'someType', timestamp: 1000, someProp: 'someVal'});
player.addCustomCallback({type: 'someType'}, function(event) { console.log(event.someProp); });

// Start playing
player.play();
```

### removeCallback
As the name suggests you can remove previously attached callbacks with this function. For that you will need to store the callback id and then delete it with `player.removeCallback(id)`. You can also remove all callbacks with `player.removeAllCallbacks()`.
```javascript
// Add and remove custom callback.
var myCallback = player.addCustomCallback({type: 'noteOn', note: 20, someProp: ':)'}, function(event) { console.log(event); });
player.removeCallback(myCallback);
```

### triggerCallbacks
With `player.triggerCallbacks(event)` you have the possibility to manually trigger the callbacks.
```javascript
// Manually trigger noteOn event
player.triggerCallbacks({type: 'noteOn', note: 50, length: 40, velocity: 22});
```

## Controls
To modify the playing status/settings we can use following functions:
```javascript
player.play();
player.pause();
player.stop();
player.setTime(miliseconds);
player.setSpeed(tempo); // positive number. If you want to play it backwards, you can use player.reverseMidiData
```
To get information about these there are also several functions available:
```javascript
player.isPlaying();         // returns true/false
player.getMidiEvents();     // returns [event, event, ...]
player.getCurrentTime();    // returns current time in miliseconds
player.getDuration();       // returns duration of the midi in miliseconds
player.getEventsByTimeRange(2000, 4000);    // returns all events which are in the specified time range. Similar functions are player.getNextEventsByTime(ms) and player.getPreviousEventsByTime(ms)
```

## Modifying midi data
MidiPlayer provides several methods to modify the loaded midi data. Currently it is possible to add and remove custom events, as well as reversing the midi data so it can be played backwards. If this doesn't cover your needs, you can use `player.getMidiEvents()` combined with `player.loadParsedMidi([events,...])` to use custom modifications.

### Add Events
To add an event simply use `player.addEvent(event)`. The only aspect you should take care of is, that the event must have the properties *type* and *timestamp*. Except of that you are free to choose properties and values.
```javascript
// Add noteOn and noteOff pair
player.addEvent({type: 'noteOn', timestamp: 500, note: 40, length: 250, velocity: 50});
player.addEvent({type: 'noteOff', timestamp: 750, note: 40});

// Add custom event
player.addEvent({type: 'myType', timestamp: 1000, myProp: 'myVal', myPropTwo: 'myValTwo'});
```

### Remove Events
Removing events is done with the `player.removeEvents(search)` method, whereas the *search* object specifies the targeted events. The function will iterate over all events and if the event contains all properties of the search and the values are the same it will get removed. 

In other words: All events which are equal to or an extension of the search will be removed.

```javascript
// Adding events
player.addEvent({timestamp: 100, note: 12, type: 'noteOn', length: 100});
player.addEvent({timestamp: 200, note: 12, type: 'noteOff'});
player.addEvent({timestamp: 200, note: 14, type: 'noteOn', length: 50});
player.addEvent({timestamp: 250, note: 14, type: 'noteOff'});

// Removing events
player.removeEvents({note: 12});                    // Would remove first and second event
player.removeEvents({timestamp: 200, length: 50});  // Would remove third event
player.removeEvents({});                            // Would remove all events
```

### Reverse Events
If you want to play the midi backwards, you can use `player.reverseMidiData()` and then play as normal. Note that it does not play it backwards, but changes the timestamps to achieve a similar result. Therefore the currentTime will still start at zero.

```javascript
midiPlayer.addEvent({timestamp: 0, note: 20, type: 'noteOn', length: 250});
midiPlayer.addEvent({timestamp: 250, note: 20, type: 'noteOff'});
midiPlayer.addEvent({timestamp: 1000, note: 50, type: 'noteOn', length: 100});
midiPlayer.addEvent({timestamp: 1100, note: 50, type: 'noteOff'});
midiPlayer.reverseMidiData();

/* player.getCurrentEvents() will be
  [ {timestamp: 0, note: 50, type: 'noteOn', length: 100},
    {timestamp: 100, note: 50, type: 'noteOff'},
    {timestamp: 1000, note: 20, type: 'noteOn', length: 250},
    {timestamp: 1250, note: 20, type: 'noteOff'} ]
*/

midiPlayer.play();
```

### Custom modifications to events
If the provided methods to modify the events don't satisfy your requirements you can do custom modifications as follows:
```javascript
// Load your midi data with your preferred method
player.loadFromDataUrl(dataUrl, 0)
    .then(function(events) {
        /*  events is an array of the formatted events
            if you'd want to do this not directly after loading
            you could get them with player.getMidiEvents() */

        // Modify events as you wish
        // (we will add an index to each event in our example)
        events.forEach(function(event, index) {
            event.index = index;
        });

        // Reload the player with modified events
        player.loadParsedMidi(events)
            .then(function() {
                player.addCallback('noteOn', function(event) { console.log(event.index); });
                player.play();
            })
            .catch(/* error */);
    })
    .catch(/* error */);
```