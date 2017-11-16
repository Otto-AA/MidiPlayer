import MidiParser from './MidiParser';
var Promise = require('es6-promise').Promise;

/**
 * noteEvent
 * @typedef noteEvent
 * @property {int} channel
 * @property {int} note
 * @property {float|undefined} length
 * @property {float} timestamp
 * @property {int} track
 * @property {string} type
 * @property {int|undefined} velocity
 */

/** MIDIPlayer
 * @description MidiPlayer loads a file.mid and provides callbacks for several events
 */
class MidiPlayer {
  constructor() {
    this._numTracks = 0;
    this._events = [];
    this._playedEvents = [];
    this._currentTime = 0;
    this._speed = 1;
    this._duration = 0;
    this._callbacks = {
      play: [],
      finish: [],
      pause: [],
      stop: [],
      noteOn: [],
      noteOff: [],
    };
  }
  
  /** loadFromDataUrl
   * @param {string}  midi          - b64 encoded midi file
   * @param {int}     [noteShift=0] - changes the note value of each element by n. (e.g. for a piano this should be -21)
   * @returns {Promise<noteEvent>}             - resolving with an array containing the formatted event
   */
  async loadFromDataUrl(midi, noteShift) {
    return new Promise((resolve, reject) => {
      const midiParser = new MidiParser();
      const parsedMidi = midiParser.parseDataUrl(midi);
      this.loadParsedMidi(parsedMidi, noteShift);
      resolve(this.getMidiEvents());
    });
  }
  /** loadFromUint8Array
   * @param {Uint8Array}  midi      - uint8 array representing midi file
   * @param {int}     [noteShift=0] - changes the note value of each element by n. (e.g. for a piano this should be -21)
   * @returns {Promise<noteEvent>}             - resolving with an array containing the formatted event
   */
  async loadFromUint8Array(midi, noteShift) {
    return new Promise((resolve, reject) => {
      const midiParser = new MidiParser();
      const parsedMidi = midiParser.parseUint8(midi);
      this.loadParsedMidi(parsedMidi, noteShift);
      resolve(this.getMidiEvents());
    });
  }
  /** loadParsedMidi
   * @param {noteEvent[]}   events    - array containing all formatted events
   * @param {int}     [noteShift=0]   - changes the note value of each element by n. (e.g. for a piano this should be -21)
   * @returns {noteEvent[]}
   */
  loadParsedMidi(events, noteShift) {
    this.reset();

    this._events = events;
    if (noteShift) {
      this._events = this._events.map(event => {
        event.note += noteShift;
        return event;
      });
    }
    this._updateDuration();

    return this.getMidiEvents();
  }
  
  /** addCallback
   * Add an event listener
   * @param {string}  eventName   - specifies the trigger event name. Possible events are: start, finish, noteOn, noteOff
   */
  addCallback(event, callback) {
    this._callbacks[event].push(callback);
  }
  
  /** play
   * @description start playing the parsed midi from the current time
   */
  async play() {
    this._startingTime = (new Date()).getTime() - this.getCurrentTime() / this.getCurrentSpeed();
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
   * @description pauses the playing at the current time
   */
  pause() {
    if (this.isPlaying()) {
      this._playing = false;
      this.triggerCallbacks('pause');
    }
  }

  /** stop
   * @description pauses the playing and sets the current time to zero
   */
  stop() {
    this.pause();
    this.setTime(0);
    this.triggerCallbacks('stop');
  }

  /** reset
   * @description stops the player and removes all events
   */
  reset() {
    this.stop();
    this.removeEvents({});
  }
  
  /** setTime
   * @param {int} miliseconds
   */
  setTime(miliseconds) {
    // Move events from this.events to this.playedEvents or the other way round
    while (this._events.length && miliseconds > this._events[0].timestamp) {
      this._playedEvents.push(this._events.shift());
    }
    while (this._playedEvents.length && miliseconds <= this._playedEvents[this._playedEvents.length - 1].timestamp) {
      this._events.unshift(this._playedEvents.pop());
    }
    // Set the current time    
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

  /** setSpeed
   * @param {int} speed   - relative speed (1 is normal, 2 is double, 0.5 is half)
   */
  setSpeed(speed) {
    if (isNaN(speed) || speed <= 0) {
      throw new Error('speed must be a positive number', speed);
    }
    this._speed = speed;
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

  /** getDuration
   * @returns {float} - duration of the midi in miliseconds
   */
  getDuration() {
    return this._duration;
  }

  /** getMidiEvents
   * @returns {noteEvent[]}   - (all loaded events)
   */
  getMidiEvents() {
    return [...this._playedEvents, ...this._events];
  }

  /** getNextEventsByTime
   * @param {int} miliseconds   - specifies the end of the time range
   * @returns {noteEvent[]}         - containing all events which are in the range [currentTime <-> currentTime + miliseconds]
   */
  getNextEventsByTime(miliseconds) {
    return this.getEventsByTimeRange(this._currentTime, this._currentTime + miliseconds);
  }

  /** getPreviousEventsByTime
   * @param {int} miliseconds   - specifies the start of the time range
   * @returns {noteEvent[]}         - containing all events which are in the range [currentTime - miliseconds <-> currentTime]
   */
  getPreviousEventsByTime(miliseconds) {
    return this.getEventsByTimeRange(this._currentTime - miliseconds, this._currentTime);
  }

  /** getEventsByTimeRange
   * @param {int} startTime   - start of the time range in miliseconds
   * @param {int} endTime     - end of the time range in miliseconds
   * @returns {noteEvent[]}   - containing all events which are in the time range
   */
  getEventsByTimeRange(startTime, endTime) {
    // Return all elements which are in this time span
    return [...this._playedEvents, ...this._events].filter(event => startTime <= event.timestamp && event.timestamp <= endTime);
  }
  
  /** triggerCallbacks
   * @param {string}  event   - the eventname which will be triggered
   * @param {any}     data    - data passed to the callbacks
   */
  triggerCallbacks(event, data) {
    this._callbacks[event].forEach(callback => callback(data));
  }

  /** removeCallbacks  */
  removeCallbacks() {
    for (const key in this._callbacks) {
      this._callbacks[key] = [];
    }
  }

  /** addEvent
   * @param {noteEvent} event - must contain: timestamp, note, type [, optional properties]
   */
  addEvent(newEvent) {
    // Check if required properties are given
    if (!newEvent.hasOwnProperty('timestamp')
     || !newEvent.hasOwnProperty('note')
     || !newEvent.hasOwnProperty('type')) {
      throw new Error('Couldn\'t add event because not all neccessary properties where specifed');
    }

    const eventArray = (newEvent.timestamp > this.getCurrentTime()) ? this._events : this._playedEvents;
    const location = locationOf(newEvent, eventArray, (a, b) => a.timestamp - b.timestamp);
    if (newEvent.timestamp > this.getCurrentTime()) {
      this._events.splice(location, 0, newEvent);
    } else {
      this._playedEvents.splice(location, 0, newEvent);
    }
    this._updateDuration();
  }
  
  /** removeEvents
   * @description removes all events with have the same keys and properties as the search
   * @param {object}  search - e.g. {note: 40, type: 'noteOff'} or {timestamp: 500}
   */
  removeEvents(search) {
    // objContainsObj
    // checks if the original object has all keys of the comparison object and if the values are the same
    const objContainsObj = function (original, comparison) {
      const originalKeys = Object.keys(original);
      const comparisonKeys = Object.keys(comparison);

      // Check if original has all keys of the comparison object
      if (!comparisonKeys.every(key => originalKeys.includes(key))) {
        return false;
      }

      // Check if values are the same
      for (const key of comparisonKeys) {
        if (original[key] !== comparison[key]) {
          return false;
        }
      }
      return true;
    };

    this._playedEvents = this._playedEvents.filter(event => !objContainsObj(event, search));
    this._events = this._events.filter(event => !objContainsObj(event, search));
  }

  /** reverseMidiData
   * reverses the order of the events and change the timestamps
   * playing afterwards will play the song backwards, but the currentTime will still start from zero (and not from the end)
   */
  reverseMidiData() {
    const duration = this.getDuration();
    const events = this.getMidiEvents();

    // Reverse events and change timestamp
    events.reverse();
    events.forEach(event => event.timestamp = duration - event.timestamp);

    // noteOff events are now before noteOn events. To fix this mirror noteOff events around corresponding noteOn event
    events.forEach((event, index) => {
      if (event.type === 'noteOff') {
        // Find corresponding noteOn event
        for (let i = index + 1; i < events.length; i++) {
          if (events[i].type === 'noteOn' && events[i].note === event.note) {
            // Mirror noteOff event around noteOn event  (e.g. noteOff - noteOn -> new noteOff: 10 - 15 -> 20)
            const timeDiff = events[i].timestamp - event.timestamp;
            event.timestamp += 2 * timeDiff;
            break;
          }
        }
      }
    });

    events.sort((a, b) => a.timestamp - b.timestamp);

    // Change timestamps so the first event starts with timestamp=0
    const timeOffset = events[0].timestamp;
    events.forEach(event => event.timestamp -= timeOffset);

    this.loadParsedMidi(events);
  }

  /** _updateCurrentTime */
  _updateCurrentTime() {
    this._currentTime = ((new Date()).getTime() - this._startingTime) * this.getCurrentSpeed();
  }

  /** updateDuration */
  _updateDuration() {
    let duration = 0;
    if (this._events.length) {
      duration = this._events[this._events.length - 1].timestamp;
    } else if (this._playedEvents.length) {
      duration = this._playedEvents[this._playedEvents.length - 1].timestamp;
    }
    this._duration = duration;
  }
  
  /** _waitForEvent
   * Waits until event.timestamp and currentTime are equal
   * @param {noteEvent}  event
   * @returns {Promise}
   */
  _waitForEvent(event) {
    this._currentTime = this.getCurrentTime();
    const deltaTime = event.timestamp - this._currentTime;
    const timeToWait = deltaTime / this.getCurrentSpeed();
    
    return new Promise(resolve => setTimeout(resolve, timeToWait));
  }

  /** _handleEvent
   * @param {noteEvent} event
   */
  _handleEvent(event) {
    this.triggerCallbacks(event.type, event);
  }
}

// locationOf
//
// returns the location where an element should be in a sorted array
//
const locationOf = function(element, array, comparer, start, end) {
  if (array.length === 0) {
      return -1;
  }
  start = start || 0;
  end = end || array.length;

  const middle = (start + end) >> 1;  // should be faster than Math.floor(array.length / 2);

  let comparisonResult = comparer(element, array[middle]);
  comparisonResult = (comparisonResult > 0) ? 1 : (comparisonResult < 0) ? -1 : 0;

  if ((end - start) <= 1) {
    return (comparisonResult === -1) ? middle : middle + 1;
  }

  switch (comparisonResult) {
      case -1: return locationOf(element, array, comparer, start, middle);
      case 0: return middle;
      case 1: return locationOf(element, array, comparer, middle, end);
  };
};

export default MidiPlayer;
