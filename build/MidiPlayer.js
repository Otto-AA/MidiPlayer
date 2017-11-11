/** MidiParser
 * parses a midi to an array of formatted events
 * 
 * @function parseDataUrl(b64Midi)
 * @function parseUint8(uint8Midi)
 * 
 * @returns {array}
 * 
 * Event format {
 * 		channel: {int},
 * 		noteNumber: {int}
 * 		subtype: {string}
 * 		timestamp: {int}
 * 		track: {int}
 * 		velocity: {int}
 * }
 */

class MidiParser {
    parseDataUrl(dataUrl) {
        const data = window.atob(dataUrl.split(',')[1]);
        try {
            const midiFile = MidiFile(data);
            const replayer = new Replayer(midiFile);
            const replayerData = replayer.getData();
            const formattedData = this._formatReplayerData(replayerData);
            return formattedData;
        } catch (event) {
            throw new Error(event);
        }
    }
    parseUint8(midi) {
        const b64encoded = 'data:audio/mid;base64,' + btoa(String.fromCharCode.apply(null, midi));
        return this.parseDataUrl(b64encoded);
    }
    _formatReplayerData(midiData) {
        const data = midiData;
        const formattedData = [];
    
        // Change event format and drop unneccessary events
        for (let i = 0; i < data.length; i++) {
            const event = data[i];
            switch(event.subtype) {
                case 'noteOn':
                case 'noteOff':
                    const formattedEvent = {
                        channel: event.channel,
                        note: event.noteNumber,
                        timestamp: event.timestamp,
                        track: event.track,
                        type: event.subtype,
                        velocity: event.velocity,
                    };
                    formattedData.push(formattedEvent);
            }
        }

        // Add length property to noteOn events
        for (let i = 0; i < formattedData.length; i++) {
            if (formattedData[i].type === 'noteOn') {
                const noteOnEvent = formattedData[i];
                const noteOnKeyId = noteOnEvent.note;

                // Search for following noteOff event
                for (let n = i + 1; n < formattedData.length; n++) {
                    const noteOffEvent = formattedData[n];
                    if (noteOffEvent.type === 'noteOff'
                    && noteOnKeyId === formattedData[n].note) {
                        noteOnEvent.length = noteOffEvent.timestamp - noteOnEvent.timestamp;
                        break;
                    }
                }
            }
        }
    
        return formattedData;
    }
    
}

/** Note: The following code is an abstracted and slightly adapted version of MIDI.js
 * Github link:         https://github.com/mudcube/MIDI.js
 */

/** Stream
 * Wrapper for accessing strings through sequential reads
 */
function Stream(str) {
    let position = 0;

    function read(length) {
        let result = str.substr(position, length);
        position += length;
        return result;
    }

    /* read a big-endian 32-bit integer */
    function readInt32() {
        let result = (
            (str.charCodeAt(position) << 24) + (str.charCodeAt(position + 1) << 16) + (str.charCodeAt(position + 2) << 8) + str.charCodeAt(position + 3));
        position += 4;
        return result;
    }

    /* read a big-endian 16-bit integer */
    function readInt16() {
        let result = (
            (str.charCodeAt(position) << 8) + str.charCodeAt(position + 1));
        position += 2;
        return result;
    }

    /* read an 8-bit integer */
    function readInt8(signed) {
        let result = str.charCodeAt(position);
        if (signed && result > 127) result -= 256;
        position += 1;
        return result;
    }

    function eof() {
        return position >= str.length;
    }

    /* read a MIDI-style letiable-length integer
    	(big-endian value in groups of 7 bits,
    	with top bit set to signify that another byte follows)
    */
    function readletInt() {
        let result = 0;
        while (true) {
            let b = readInt8();
            if (b & 0x80) {
                result += (b & 0x7f);
                result <<= 7;
            } else {
                /* b is the last byte */
                return result + b;
            }
        }
    }

    return {
        'eof': eof,
        'read': read,
        'readInt32': readInt32,
        'readInt16': readInt16,
        'readInt8': readInt8,
        'readletInt': readletInt
    }
}
/** MidiFile
class to parse the .mid file format
(depends on stream.js)
*/
function MidiFile(data) {
    function readChunk(stream) {
        let id = stream.read(4);
        let length = stream.readInt32();
        return {
            'id': id,
            'length': length,
            'data': stream.read(length)
        };
    }

    let lastEventTypeByte;

    function readEvent(stream) {
        let event = {};
        event.deltaTime = stream.readletInt();
        let eventTypeByte = stream.readInt8();
        if ((eventTypeByte & 0xf0) == 0xf0) {
            /* system / meta event */
            if (eventTypeByte == 0xff) {
                /* meta event */
                event.type = 'meta';
                let subtypeByte = stream.readInt8();
                let length = stream.readletInt();
                switch (subtypeByte) {
                    case 0x00:
                        event.subtype = 'sequenceNumber';
                        if (length != 2) throw "Expected length for sequenceNumber event is 2, got " + length;
                        event.number = stream.readInt16();
                        return event;
                    case 0x01:
                        event.subtype = 'text';
                        event.text = stream.read(length);
                        return event;
                    case 0x02:
                        event.subtype = 'copyrightNotice';
                        event.text = stream.read(length);
                        return event;
                    case 0x03:
                        event.subtype = 'trackName';
                        event.text = stream.read(length);
                        return event;
                    case 0x04:
                        event.subtype = 'instrumentName';
                        event.text = stream.read(length);
                        return event;
                    case 0x05:
                        event.subtype = 'lyrics';
                        event.text = stream.read(length);
                        return event;
                    case 0x06:
                        event.subtype = 'marker';
                        event.text = stream.read(length);
                        return event;
                    case 0x07:
                        event.subtype = 'cuePoint';
                        event.text = stream.read(length);
                        return event;
                    case 0x20:
                        event.subtype = 'midiChannelPrefix';
                        if (length != 1) throw "Expected length for midiChannelPrefix event is 1, got " + length;
                        event.channel = stream.readInt8();
                        return event;
                    case 0x2f:
                        event.subtype = 'endOfTrack';
                        if (length != 0) throw "Expected length for endOfTrack event is 0, got " + length;
                        return event;
                    case 0x51:
                        event.subtype = 'setTempo';
                        if (length != 3) throw "Expected length for setTempo event is 3, got " + length;
                        event.microsecondsPerBeat = (
                            (stream.readInt8() << 16) + (stream.readInt8() << 8) + stream.readInt8()
                        )
                        return event;
                    case 0x54:
                        event.subtype = 'smpteOffset';
                        if (length != 5) throw "Expected length for smpteOffset event is 5, got " + length;
                        let hourByte = stream.readInt8();
                        event.frameRate = {
                            0x00: 24,
                            0x20: 25,
                            0x40: 29,
                            0x60: 30
                        }[hourByte & 0x60];
                        event.hour = hourByte & 0x1f;
                        event.min = stream.readInt8();
                        event.sec = stream.readInt8();
                        event.frame = stream.readInt8();
                        event.subframe = stream.readInt8();
                        return event;
                    case 0x58:
                        event.subtype = 'timeSignature';
                        if (length != 4) throw "Expected length for timeSignature event is 4, got " + length;
                        event.numerator = stream.readInt8();
                        event.denominator = Math.pow(2, stream.readInt8());
                        event.metronome = stream.readInt8();
                        event.thirtyseconds = stream.readInt8();
                        return event;
                    case 0x59:
                        event.subtype = 'keySignature';
                        if (length != 2) throw "Expected length for keySignature event is 2, got " + length;
                        event.key = stream.readInt8(true);
                        event.scale = stream.readInt8();
                        return event;
                    case 0x7f:
                        event.subtype = 'sequencerSpecific';
                        event.data = stream.read(length);
                        return event;
                    default:
                        // console.log("Unrecognised meta event subtype: " + subtypeByte);
                        event.subtype = 'unknown'
                        event.data = stream.read(length);
                        return event;
                }
                event.data = stream.read(length);
                return event;
            } else if (eventTypeByte == 0xf0) {
                event.type = 'sysEx';
                let length = stream.readletInt();
                event.data = stream.read(length);
                return event;
            } else if (eventTypeByte == 0xf7) {
                event.type = 'dividedSysEx';
                let length = stream.readletInt();
                event.data = stream.read(length);
                return event;
            } else {
                throw "Unrecognised MIDI event type byte: " + eventTypeByte;
            }
        } else {
            /* channel event */
            let param1;
            if ((eventTypeByte & 0x80) == 0) {
                /* running status - reuse lastEventTypeByte as the event type.
                	eventTypeByte is actually the first parameter
                */
                param1 = eventTypeByte;
                eventTypeByte = lastEventTypeByte;
            } else {
                param1 = stream.readInt8();
                lastEventTypeByte = eventTypeByte;
            }
            let eventType = eventTypeByte >> 4;
            event.channel = eventTypeByte & 0x0f;
            event.type = 'channel';
            switch (eventType) {
                case 0x08:
                    event.subtype = 'noteOff';
                    event.noteNumber = param1;
                    event.velocity = stream.readInt8();
                    return event;
                case 0x09:
                    event.noteNumber = param1;
                    event.velocity = stream.readInt8();
                    if (event.velocity == 0) {
                        event.subtype = 'noteOff';
                    } else {
                        event.subtype = 'noteOn';
                    }
                    return event;
                case 0x0a:
                    event.subtype = 'noteAftertouch';
                    event.noteNumber = param1;
                    event.amount = stream.readInt8();
                    return event;
                case 0x0b:
                    event.subtype = 'controller';
                    event.controllerType = param1;
                    event.value = stream.readInt8();
                    return event;
                case 0x0c:
                    event.subtype = 'programChange';
                    event.programNumber = param1;
                    return event;
                case 0x0d:
                    event.subtype = 'channelAftertouch';
                    event.amount = param1;
                    return event;
                case 0x0e:
                    event.subtype = 'pitchBend';
                    event.value = param1 + (stream.readInt8() << 7);
                    return event;
                default:
                    throw "Unrecognised MIDI event type: " + eventType
                    /* 
                    console.log("Unrecognised MIDI event type: " + eventType);
                    stream.readInt8();
                    event.subtype = 'unknown';
                    return event;
                    */
            }
        }
    }

    let stream = Stream(data);
    let headerChunk = readChunk(stream);
    if (headerChunk.id != 'MThd' || headerChunk.length != 6) {
        throw "Bad .mid file - header not found";
    }
    const headerStream = Stream(headerChunk.data);
    const formatType = headerStream.readInt16();
    const trackCount = headerStream.readInt16();
    const timeDivision = headerStream.readInt16();

    if (timeDivision & 0x8000) {
        throw "Expressing time division in SMTPE frames is not supported yet"
    }
    const ticksPerBeat = timeDivision;

    const header = {
        'formatType': formatType,
        'trackCount': trackCount,
        'ticksPerBeat': ticksPerBeat
    }
    const tracks = [];
    for (let i = 0; i < header.trackCount; i++) {
        tracks[i] = [];
        let trackChunk = readChunk(stream);
        if (trackChunk.id != 'MTrk') {
            throw "Unexpected chunk - expected MTrk, got " + trackChunk.id;
        }
        let trackStream = Stream(trackChunk.data);
        while (!trackStream.eof()) {
            let event = readEvent(trackStream);
            tracks[i].push(event);
            //console.log(event);
        }
    }

    return {
        'header': header,
        'tracks': tracks
    }
}
function Replayer(midiFile) {
    const trackStates = [];
    const ticksPerBeat = midiFile.header.ticksPerBeat;

    let beatsPerMinute = 120;


    for (let i = 0; i < midiFile.tracks.length; i++) {
        trackStates.push({
            'nextEventIndex': 0,
            'ticksToNextEvent': (
                midiFile.tracks[i].length ?
                midiFile.tracks[i][0].deltaTime :
                null
            )
        });
    }

    function getNextEvent() {
        let ticksToNextEvent = null;
        let nextEventTrack = null;
        let nextEventIndex = null;

        for (let i = 0; i < trackStates.length; i++) {
            if (
                trackStates[i].ticksToNextEvent != null && (ticksToNextEvent == null || trackStates[i].ticksToNextEvent < ticksToNextEvent)
            ) {
                ticksToNextEvent = trackStates[i].ticksToNextEvent;
                nextEventTrack = i;
                nextEventIndex = trackStates[i].nextEventIndex;
            }
        }
        if (nextEventTrack != null) {
            /* consume event from that track */
            let nextEvent = midiFile.tracks[nextEventTrack][nextEventIndex];
            if (midiFile.tracks[nextEventTrack][nextEventIndex + 1]) {
                trackStates[nextEventTrack].ticksToNextEvent += midiFile.tracks[nextEventTrack][nextEventIndex + 1].deltaTime;
            } else {
                trackStates[nextEventTrack].ticksToNextEvent = null;
            }
            trackStates[nextEventTrack].nextEventIndex += 1;
            /* advance timings on all tracks by ticksToNextEvent */
            for (let i = 0; i < trackStates.length; i++) {
                if (trackStates[i].ticksToNextEvent != null) {
                    trackStates[i].ticksToNextEvent -= ticksToNextEvent
                }
            }
            return {
                ...nextEvent,
                "ticksToEvent": ticksToNextEvent,
                "track": nextEventTrack
            }
        } else {
            return null;
        }
    };
    //
    const temporal = [];

    let midiEvent = null;
    let currentTime = 0;
    while (midiEvent = getNextEvent()) {
        if (midiEvent.type == "meta" && midiEvent.subtype == "setTempo") {
            // tempo change events can occur anywhere in the middle and affect events that follow
            beatsPerMinute = 60000000 / midiEvent.microsecondsPerBeat;
        }
        
        let secondsToGenerate = 0;
        if (midiEvent.ticksToEvent > 0) {
            const beatsToGenerate = midiEvent.ticksToEvent / ticksPerBeat;
            secondsToGenerate = beatsToGenerate / (beatsPerMinute / 60);
        }
        
        const deltaTime = (secondsToGenerate * 1000) || 0;
        currentTime += deltaTime;

        midiEvent.timestamp = currentTime;
        temporal.push(midiEvent);
    }
    return {
        "getData": function () {
            return [...temporal];
        }
    };
};

/** MIDIPlayer
 * midiPlayer loads a file.mid and provides callbacks for several events
 * supports multiple channels
 *
 * loadParsedMidi(midi)
 * play()
 * pause()
 * stop()
 * reset()
 * setTime(miliseconds)
 * setSpeed(relativeSpeed)          // 0.5 -> half speed; 1 -> normal speed; ...
 * addCallback(event, callback)     // Event can be: start/finish/pause/stop/noteOn/noteOff
 * triggerCallbacks(event)
 * getNextEventsByTime(miliseconds)
 * getCurrentTime()
 * getCurrentSpeed()
 * getMidiEvents()
 
 ** midiEvent
 * returned as: {
    channel: int,
    type: string,
    timestamp: number,
    note: int,
    velocity: int(0-127),
    length: int
 }
 */ 

class MidiPlayer {
  constructor() {
    this._numTracks = 0;
    this._events = [];
    this._playedEvents = [];
    this._currentTime = 0;
    this._speed = 1;
    this._callbacks = {
      play: [],
      finish: [],
      pause: [],
      stop: [],
      noteOn: [],
      noteOff: [],
    };
  }
  
  /** loadParsedMidi
   * load a midi object parsed with MidiParser.js
   * 
   * @param {object}  midi      - midi object parsed with MidiParser.js
   * @param {int}     noteShift - changes the note value of each element by n. (e.g. for a piano this should be -21)
   * @return {Promise}          - resolves with an array containing the formatted events
   */
  /** loadFromDataUrl
   * @param {string}  midi      - b64 encoded midi file
   * @param {int}     noteShift - changes the note value of each element by n. (e.g. for a piano this should be -21)
   * @returns {Promise}         - resolves with an array containing the formatted events
   */
  async loadFromDataUrl(midi, noteShift) {
    return new Promise((resolve, reject) => {
      const midiParser = new MidiParser();
      const parsedMidi = midiParser.parseDataUrl(midi);
      this.loadParsedMidi(parsedMidi, noteShift);
      resolve();
    });
  }
  /** loadFromUint8Array
   * @param {Uint8Array}  midi  - uint8 array representing midi file
   * @param {int}     noteShift - changes the note value of each element by n. (e.g. for a piano this should be -21)
   * @returns {Promise}         - resolves with an array containing the formatted events
   */
  async loadFromUint8Array(midi, noteShift) {
    return new Promise((resolve, reject) => {
      const midiParser = new MidiParser();
      const parsedMidi = midiParser.parseUint8(midi);
      this.loadParsedMidi(parsedMidi, noteShift);
      resolve();
    });
  }
  /** loadParsedMidi
   * @param {array}   events    - array containing all formatted events
   * @param {int}     noteShift - changes the note value of each element by n. (e.g. for a piano this should be -21)
   * @returns {array}           - returns array containing the formatted events
   */
  loadParsedMidi(events, noteShift) {
    this._events = events;
    if (noteShift) {
      this._events = this._events.map(event => {
        event.note += noteShift;
        return event;
      });
    }
    return this.getMidiEvents();
  }
  
  /** getMidiEvents
   * @returns {array}   - array containing all loaded events
   */
  getMidiEvents() {
    return [...this._playedEvents, ...this._events];
  }

  /** getNextEventsByTime
   * @param {int} miliseconds   - specifies the end of the time range
   * @returns {array}           - array containing all events which are in the range [currentTime <-> currentTime + miliseconds]
   */
  getNextEventsByTime(miliseconds) {
    return this.getEventsByTimeRange(this._currentTime, this._currentTime + miliseconds);
  }

  /** getPreviousEventsByTime
   * @param {int} miliseconds   - specifies the start of the time range
   * @returns {array}           - array containing all events which are in the range [currentTime - miliseconds <-> currentTime]
   */
  getPreviousEventsByTime(miliseconds) {
    return this.getEventsByTimeRange(this._currentTime - miliseconds, this._currentTime);
  }

  /** getEventsByTimeRange
   * @param {int} start   - start of the time range in miliseconds
   * @param {int} end     - end of the time range in miliseconds
   * @returns {array}     - array containing all events which are in the range
   */
  getEventsByTimeRange(start, end) {
    const previousEvents = [];
    const nextEvents = [];
    const rangeStartTime = start;
    const rangeEndTime = end;
    
    for (let i = this._playedEvents.length - 1; i >= 0; i--) {
      const event = this._playedEvents[i];
      if (event.timestamp > rangeStartTime) {
        previousEvents.unshift(event);
      } else {
        break;
      }
    }
    for (const event of this._events) {
      if (event.timestamp < rangeEndTime) {
        nextEvents.push(event);
      } else {
        break;
      }
    }
    return [...previousEvents, ...nextEvents];
  }
  
  /** Play
   * start playing the parsed midi from the current time
   */
  async play() {
    this._startingTime = (new Date()).getTime() - this._currentTime;
    this._playing = true;
    
    this.triggerCallbacks('play');
    
    while (this._playing && this._events.length > 0) {
      const nextEvent = this._events.shift();
      await this._waitForEvent(nextEvent);
      if (!this._playing)  // Check another time because we maybe waited a few seconds for the next event
        break;
      this._handleEvent(nextEvent);
      this._playedEvents.push(nextEvent);
    }
    
    this.pause();
    if (!this._events.length) {
      this.triggerCallbacks('finish');
    }
  }
  
  /** pause
   * pauses the playing at the current time
   */
  pause() {
    this._playing = false;
    this.triggerCallbacks('pause');
  }

  /** stop
   * pauses the playing and sets the current time to zero
   */
  stop() {
    this.pause();
    this.setTime(0);
    this.triggerCallbacks('stop');
  }

  /** setTime
   * @param {int} miliseconds   - sets the current play time
   */
  setTime(miliseconds) {
    // Set the current time
    
    // Move events from this.events to this.playedEvents or the other way round
    while (this._events.length && miliseconds > this._events[0].timestamp) {
      this._playedEvents.push(this._events.shift());
    }
    while (this._playedEvents.length && miliseconds < this._playedEvents[this._playedEvents.length - 1].timestamp) {
      this._events.unshift(this._playedEvents.pop());
    }
    this._startingTime += miliseconds - this._currentTime;
    this._currentTime = miliseconds;
  }
  
  /** getCurrentTime
   * @returns {int}   - current time in miliseconds
   */
  getCurrentTime() {
    if (this._playing) {
      this._updateCurrentTime();
    }

    return this._currentTime;
  }

  /** getCurrentSpeed
   * @returns {int}   - current relative speed
   */
  getCurrentSpeed() {
    return this._speed;
  }

  /** isPlaying
   * @returns {bool}
   */
  isPlaying() {
    return this._playing;
  }

  /** _updateCurrentTime */
  _updateCurrentTime() {
    this._currentTime = ((new Date()).getTime() - this._startingTime) * this._speed;
  }

  /** setSpeed
   * @param {int} speed   - relative speed (1 is normal, 2 is double, 0.5 is half)
   */
  setSpeed(speed) {
    this._speed = speed;
  }
  
  /** addCallback
   * Add an event listener
   * @param {string}  event   - specifies the trigger event name. Possible events are: start, finish, noteOn, noteOff
   */
  addCallback(event, callback) {
    this._callbacks[event].push(callback);
  }
  
  /** triggerCallbacks
   * @param {string}  event   - the eventname which will be triggered
   * @param {any}     data    - data passed to the callbacks
   */
  triggerCallbacks(event, data) {
    this._callbacks[event].forEach(callback => callback(data));
  }
  
  /** _waitForEvent
   * Waits until event.timestamp and currentTime are equal
   * @param {obj}  event
   * @returns {Promise}
   */
  _waitForEvent(event) {
    this._currentTime = this.getCurrentTime();
    const deltaTime = event.timestamp - this._currentTime;
    const timeToWait = deltaTime / this._speed;
    
    return new Promise(resolve => setTimeout(resolve, timeToWait));
  }

  /** _handleEvent */
  _handleEvent(event) {
    this.triggerCallbacks(event.type, event);
  }
}