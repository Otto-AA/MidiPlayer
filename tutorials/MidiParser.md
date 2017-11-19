# Tutorial for MidiParser.js
## Loading the Library
To use MidiParser.js you can choose one of the following methods. The first one is using ES6 which (currently) needs to be compiled into older versions of javascript before publishing it. The second one uses the good old `<script>` tag, so it can be used without compiling.

### Using ES6  `import`:

Download the files in [src](../src) and import the MidiParser as follows:

```javascript
import MidiParser from './path/to/src/MidiParser';
const parser = new MidiParser();
// player.parseDataUrl...
```

### Using `<script>`
Download [MidiParser.js](../build/MidiParser.js) from [build](../build).

In your html:
```html
<script type="application/javascript" src="./path/to/midiparser/MidiParser.js"></script>
<script type="application/javascript" src="yourScript.js"></script>
```
In your script:
```javascript
const parser = new MidiParser();
// player.parseDataUrl...
```

## Load midi from url
To load a midi file from a relative url you will need to fetch the file in *text/plain* format and then use `parser.parseText(fetchedMidi)`.
```javascript
// Make HttpRequest
var xhr = new XMLHttpRequest();
xhr.open('GET', './test.mid', true);
xhr.overrideMimeType('text/plain; charset=x-user-defined');
xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        // Format response so MidiParser can parse it
        var buffer = [];
        for (let i = 0; i < this.responseText.length; i++) {
            buffer[i] = String.fromCharCode(this.responseText.charCodeAt(i) & 255);
        }
        var data = buffer.join('');

        // Parse data
        var midiParser = new MidiParser();
        var parsedMidi = midiParser.parseText(data);
        console.log(parsedMidi);
    }
};
xhr.send();
```

## Load midi via &lt;input type="file"&gt;
To let the user upload the midi file you will need to use *&lt;input&gt;* combined with the FileReader API and parseDataUrl.

```javascript
var fileReader = new FileReader();  // consider using a polyfill if you want to support older browsers
var midiFileInput = document.getElementById('midiFileInput');

midiFileInput.addEventListener('change', function(inputEvent) {
    // Read file as data url when the input changes
    fileReader.readAsDataURL(inputEvent.target.files[0]);
    fileReader.onload = function(file) {
        var midiParser = new MidiParser();
        var parsedMidi = midiParser.parseDataUrl(file.target.result);
        console.log(parsedMidi);
    };
});
```

## Using the data
The parse functions return an array of formatted events. Events look like this:
- **channel**    {int} 
- **note**       {int} 
- **timestamp**  {float} 
- **track**      {int} 
- **type**       {string} (either 'noteOn' or 'noteOff')   
- **length**     {float|undefined} 
- **velocity**   {int|undefined} 

An example output would be:
```javascript
[
  {
    "channel": 0,
    "note": 40,
    "timestamp": 120,
    "track": 0,
    "type": "noteOn",
    "velocity": 29,
    "length": 266.6
  },
  {
    "channel": 0,
    "note": 40,
    "timestamp": 266.6,
    "track": 0,
    "type": "noteOff"
  }, ...
]
```