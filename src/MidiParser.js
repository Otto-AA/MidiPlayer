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

/** MidiParser
 * parses a midi to an array of formatted events
 * 
 * @function parseDataUrl(b64Midi)
 * @function parseUint8(uint8Midi)
 * 
 * @returns {noteEvent[]}
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

export default MidiParser;

/* Note: The following code is an abstracted and slightly adapted version of MIDI.js
 * Github link:         https://github.com/mudcube/MIDI.js
 */

/** Stream
 * Wrapper for accessing strings through sequential reads
 */
class Stream {
    constructor(str) {
        this.str = str;
        this.position = 0;
    }
    read(length) {
        const result = this.str.substr(this.position, length);
        this.position += length;
        return result;
    }
    readInt32() {
        const result = (
            (this.str.charCodeAt(this.position) << 24) + (this.str.charCodeAt(this.position + 1) << 16) + (this.str.charCodeAt(this.position + 2) << 8) + this.str.charCodeAt(this.position + 3));
        this.position += 4;
        return result;
    }
    readInt16() {
        const result = (
            (this.str.charCodeAt(this.position) << 8) + this.str.charCodeAt(this.position + 1));
        this.position += 2;
        return result;
    }
    readInt8(signed) {
        let result = this.str.charCodeAt(this.position);
        if (signed && result > 127) result -= 256;
        this.position += 1;
        return result;
    }
    eof() {
        return this.position >= this.str.length;
    }    
    /*  read a MIDI-style letiable-length integer
        (big-endian value in groups of 7 bits,
        with top bit set to signify that another byte follows)
    */
    readletInt() {
        let result = 0;
        while (true) {
            const b = this.readInt8();
            if (b & 0x80) {
                result += (b & 0x7f);
                result <<= 7;
            } else {
                /* b is the last byte */
                return result + b;
            }
        }
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

    let stream = new Stream(data);
    let headerChunk = readChunk(stream);
    if (headerChunk.id != 'MThd' || headerChunk.length != 6) {
        throw "Bad .mid file - header not found";
    }
    const headerStream = new Stream(headerChunk.data);
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
        let trackStream = new Stream(trackChunk.data);
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
