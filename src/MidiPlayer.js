import MidiParser from './MidiParser';

/** typedef noteEvent
 * @typedef noteEvent
 * @property {int} channel
 * @property {int} note
 * @property {float|undefined} length
 * @property {float} timestamp
 * @property {int} track
 * @property {string} type
 * @property {int|undefined} velocity
 */

/**
 * @description MidiPlayer loads a midi file and provides callbacks for several events
 */
class MidiPlayer {
  constructor() {
    this._events = [];
    this._playedEvents = [];
    this._currentTime = 0;
    this._speed = 1;
    this._duration = 0;
    this._callbacks = [];
    this._highestCallbackId = -1;
  }
  
  /**
   * @param {string}  midi            - b64 encoded midi file
   * @param {int}     [noteShift=0]   - changes the note value of each element by n. (e.g. for a piano this should be -21)
   * @returns {Promise<noteEvent[]>}  - resolving with an array containing the formatted event
   */
  loadFromDataUrl(midi, noteShift) {
    return new Promise((resolve, reject) => {
      const midiParser = new MidiParser();
      const parsedMidi = midiParser.parseDataUrl(midi);
      this.loadParsedMidi(parsedMidi, noteShift);
      resolve(this.getMidiEvents());
    });
  }
  /**
   * @param {Uint8Array}  midi        - uint8 array representing midi file
   * @param {int}     [noteShift=0]   - changes the note value of each element by n. (e.g. for a piano this should be -21)
   * @returns {Promise<noteEvent[]>}  - resolving with an array containing the formatted events
   */
  loadFromUint8Array(midi, noteShift) {
    return new Promise((resolve, reject) => {
      const midiParser = new MidiParser();
      const parsedMidi = midiParser.parseUint8(midi);
      this.loadParsedMidi(parsedMidi, noteShift);
      resolve(this.getMidiEvents());
    });
  }
  /**
   * @param {string}  url             - a relative url to the .mid file (e.g. ./data/test.mid)
   * @param {int}     [noteShift=0]   - changes the note value of each element by n. (e.g. for a piano this should be -21)
   * @returns {Promise<noteEvent[]>}  - resolving with an array containing the formatted events
   * @example <caption>Example for loading piano midi data</caption>
   * player.loadFromRelativeUrl('./data/test.mid', -21)
   *  .then(function(midiData) { console.log(midiData); })
   *  .catch(function(error) { console.log(error); });
   */
  loadFromRelativeUrl(url, noteShift) {
    console.warn('loadFromRelativeUrl is not fully implemented and testet yet');
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest;
      xhr.open('GET', url, true);
      xhr.overrideMimeType('text/plain; charset=x-user-defined');
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          const buffer = [];
          for (let i = 0; i < xhr.responseText.length; i++) {
            buffer[i] = String.fromCharCode(xhr.responseText.charCodeAt(i) & 255);
          }
          const data = buffer.join('');
          const midiParser = new MidiParser();
          const parsed = midiParser.parseText(data);
          resolve(this.loadParsedMidi(parsed, noteShift));
        }
      };
      xhr.send();
    });
  }

  /**
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
  
  /**
   * @description Add an event listener
   * @param {string}   eventName   - specifies the trigger event name. Possible events are: start, finish, noteOn, noteOff
   * @param {function} callback
   * @example <caption>Example showing how to listen to noteOn events</caption>
   * player.addCallback('noteOn', function(event) { console.log(event); });
   */
  addCallback(eventName, callback) {
    const targetEvent = { type: eventName };
    return this.addCustomCallback(targetEvent, callback);
  }

  /**
  * @description Add an event listener to a specific event
  * @param {object}   targetEvent
  * @param {function} callback
  * @returns {any}  id for removal of the callback
  * @example <caption>Example showing how to listen to noteOn events with the note 40</caption>
  * player.addCustomCallback({
  *   type: 'noteOn',
  *   note: 40
  * }, function(event) { console.log(event); });
  */
  addCustomCallback(targetEvent, callback) {
    const id = this._highestCallbackId + 1;
    this._highestCallbackId = id;
    this._callbacks.push({
      targetEvent,
      callback,
      id,
    });
    return id;
  }

  /**
   * @description Remove a callback
   * @param {any} id
   * @returns {bool}  callback has been found and removed
   * @example <caption>Example showing how to store a callback id and delete the callback with it</caption>
   * const playCallback = player.addCallback('play', function() { console.log('play'); });
   * player.removeCallback(playCallback);
   */
  removeCallback(id) {
    const numCallbacks = this._callbacks.length;
    this._callbacks = this._callbacks.filter(callback => callback.id !== id);
    return numCallbacks > this._callbacks.length;
  }
  
  /** 
   * @description Remove all callbacks attached to the player
   */
  removeAllCallbacks() {
    this._callbacks = [];
  }
  
  /**
   * @param {string|object}  event   - string -> type which will be triggered | object -> event which will be triggered
   * @example <caption>Example showing how to trigger play</caption>
   * player.triggerCallbacks('play');   // Same as player.triggerCallbacks({type: 'play'});
   * @example <caption>Example showing how to trigger a specific noteEvent</caption>
   * player.triggerCallbacks({type: 'noteOn', note: 40, timestamp: 500, length: 50});
   */
  triggerCallbacks(event) {
    if (typeof event === 'string') {
      event = { type: event };
    }
    this._callbacks.forEach(customCallback => {
      if (objContainsObj(event, customCallback.targetEvent)) {
        customCallback.callback(event);
      }
    });
  }
  
  /**
   * @description start playing the parsed midi from the current time
   */
  async play() {
    this._startingTime = (new Date()).getTime() - this.getCurrentTime() / this.getCurrentSpeed();
    this._playing = true;
    
    this.triggerCallbacks('play');
    
    while (this._playing && this._events.length > 0) {
      const nextEvent = this._events[0];
      await this._waitForEvent(nextEvent);
      if (!this._playing)  // Check another time because we maybe waited a few seconds for the next event
        break;

      this._handleEvent(nextEvent);
      this._events.shift(); // Remove event after waiting, so the event does not "disappear" from the lists for this time. Useful for modifying/getting events while playing
      this._playedEvents.push(nextEvent);
    }
    
    this.pause();
    if (!this._events.length) {
      this.triggerCallbacks('finish');
    }
  }
  
  /**
   * @description pauses the playing at the current time
   */
  pause() {
    if (this.isPlaying()) {
      this._playing = false;
      this.triggerCallbacks('pause');
    }
  }

  /**
   * @description pauses the playing and sets the current time to zero
   */
  stop() {
    this.pause();
    this.setTime(0);
    this.triggerCallbacks('stop');
  }

  /**
   * @description stops the player and removes all events
   */
  reset() {
    this.stop();
    this.removeEvents({});
  }
  
  /**
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
  
  /**
   * @returns {int}   - current time in miliseconds
   */
  getCurrentTime() {
    if (this._playing) {
      this._updateCurrentTime();
    }

    return this._currentTime;
  }

  /**
   * @param {int} speed   - relative speed (1 is normal, 2 is double, 0.5 is half)
   */
  setSpeed(speed) {
    if (isNaN(speed) || speed <= 0) {
      throw new Error('speed must be a positive number', speed);
    }
    this._speed = speed;
  }

  /**
   * @returns {int}   - current relative speed
   */
  getCurrentSpeed() {
    return this._speed;
  }

  /**
   * @returns {bool}
   */
  isPlaying() {
    return this._playing;
  }

  /**
   * @returns {float} - duration of the midi in miliseconds
   */
  getDuration() {
    return this._duration;
  }

  /**
   * @returns {noteEvent[]} - (all loaded events)
   */
  getMidiEvents() {
    return [...this._playedEvents, ...this._events];
  }

  /**
   * @description get all events which are in the range [currentTime <= event.timestamp <= currentTime + miliseconds]
   * @param {int} miliseconds   - specifies the end of the time range
   * @returns {noteEvent[]}
   */
  getNextEventsByTime(miliseconds) {
    return this.getEventsByTimeRange(this._currentTime, this._currentTime + miliseconds);
  }

  /**
   * @description get all events which are in the range [currentTime - miliseconds <= event.timestamp <= currentTime]
   * @param {int} miliseconds   - specifies the start of the time range
   * @returns {noteEvent[]}         - containing all events which are in the range [currentTime - miliseconds <-> currentTime]
   */
  getPreviousEventsByTime(miliseconds) {
    return this.getEventsByTimeRange(this._currentTime - miliseconds, this._currentTime);
  }

  /** 
   * @description get all events which are in the range [startTime <= event.timestamp <= endTime]
   * @param {int} startTime   - start of the time range in miliseconds
   * @param {int} endTime     - end of the time range in miliseconds
   * @returns {noteEvent[]}   - containing all events which are in the time range
   */
  getEventsByTimeRange(startTime, endTime) {
    // TODO: Use more efficient method. e.g. binary search for identifying the start and end events.
    // Return all elements which are in this time span
    return [...this._playedEvents, ...this._events].filter(event => startTime <= event.timestamp && event.timestamp <= endTime);
  }

  /**
   * @param {noteEvent} newEvent - must contain: timestamp, type [, optional properties]
   * @example
   * player.addEvent({timestamp: 5000, note: 40, type: 'noteOn', length: 75, customPropOne: 'abc', customPropTwo: 'de'});
   */
  addEvent(newEvent) {
    // TODO: add possibilty to add lots of events in an efficient way (e.g. sorting events to add, and then add them in ascending order)
    // Check if required properties are given
    if (!newEvent.hasOwnProperty('timestamp')
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
  
  /**
   * @description removes all events which have the same keys and properties as the search
   * @param {object}  search - e.g. {note: 40, type: 'noteOff'} or {timestamp: 500}
   * @example <caption>Example showing how to delete all noteOff events with the note 40</caption>
   * player.removeEvents({note: 40, type: 'noteOff'});
   * @example <caption>Example showing how to delete all events</caption>
   * player.removeEvents({});
   */
  removeEvents(search) {
    this._playedEvents = this._playedEvents.filter(event => !objContainsObj(event, search));
    this._events = this._events.filter(event => !objContainsObj(event, search));
  }

  /**
   * @description Reverse midi data so that playing afterwards will play the song backwards, but currentTime will still start from zero (and not from the end). (Not the same as reversing the order)
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

  /** 
   * @description Update currentTime based on _startingTime, _speed and the date time
   */
  _updateCurrentTime() {
    this._currentTime = ((new Date()).getTime() - this._startingTime) * this.getCurrentSpeed();
  }

  /** 
   * @description Update duration of the piece according to the midi data
   */
  _updateDuration() {
    let duration = 0;
    if (this._events.length) {
      duration = this._events[this._events.length - 1].timestamp;
    } else if (this._playedEvents.length) {
      duration = this._playedEvents[this._playedEvents.length - 1].timestamp;
    }
    this._duration = duration;
  }
  
  /**
   * @description Wait until event.timestamp and currentTime are equal
   * @param {noteEvent}  event
   * @returns {Promise<void>}
   */
  _waitForEvent(event) {
    this._currentTime = this.getCurrentTime();
    const deltaTime = event.timestamp - this._currentTime;
    const timeToWait = deltaTime / this.getCurrentSpeed();
    
    return new Promise(resolve => setTimeout(resolve, timeToWait));
  }

  /**
   * @param {noteEvent} event
   */
  _handleEvent(event) {
    this.triggerCallbacks(event);
  }
}

  // objContainsObj
  //
  // checks if the original object has all keys of the comparison object and if the values are the same
  //
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
