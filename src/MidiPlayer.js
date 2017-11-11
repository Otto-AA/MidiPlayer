import MidiParser from './MidiParser';

/** MIDIPlayer
 * @description midiPlayer loads a file.mid and provides callbacks for several events
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


export default MidiPlayer;
