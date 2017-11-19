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

# Tutorial & Documentation
There are tutorials and documentations for both, MidiPlayer.js and MidiParser.js, available:
- [Tutorials](./tutorials)
- [Documentations](./docs)
- [Examples](./examples)


# Browser Support

|![Chrome](https://github.com/alrra/browser-logos/raw/master/src/chrome/chrome_48x48.png) | ![Firefox](https://github.com/alrra/browser-logos/raw/master/src/firefox/firefox_48x48.png) | ![Edge](https://github.com/alrra/browser-logos/raw/master/src/edge/edge_48x48.png) | ![Opera](https://github.com/alrra/browser-logos/raw/master/src/opera/opera_48x48.png) | ![Safari](https://github.com/alrra/browser-logos/raw/master/src/safari/safari_48x48.png) |
|---------|-----------|----------|--------------|--------------|
|Latest ✔ | Latest ✔ | Latest ✔ | *Not Tested* | *Not Tested* |

Feel free to contribute to this list, especially if you can provide info about older versions of the browsers :)