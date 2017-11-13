const assert = require('assert');
const MidiPlayer = require('../build/MidiPlayer');
const MidiParser = require('../build/MidiParser');
const MidiPlayerTestData = require('./data/MidiPlayerTestData');

describe('MidiPlayer', function() {
    const midiPlayer = new MidiPlayer();

    describe('loadingFunctions', function() {
        it('parsed dataUrl and provided test data should be equal', function(done) {
            const dataUrl = MidiPlayerTestData.dataUrl;
            midiPlayer.loadFromDataUrl(dataUrl, 5)
                .then(parsedData => {
                    assert.deepEqual(parsedData, MidiPlayerTestData.loadedWithNoteShiftFive);
                    done();
                })
                .catch(done);
        });
        it('parsed uint8Array and provided test data should be equal', function(done) {
            const uint8 = MidiPlayerTestData.uint8;
            midiPlayer.loadFromUint8Array(uint8, 5)
                .then(parsedData => {
                    assert.deepEqual(parsedData, MidiPlayerTestData.loadedWithNoteShiftFive);
                    done();
                })
                .catch(done);
        });
        it('parsed events and provided test data should be equal', function() {
            const midiParser = new MidiParser();
            const dataUrl = MidiPlayerTestData.dataUrl;
            const parsed = midiParser.parseDataUrl(dataUrl);
            const loadedData = midiPlayer.loadParsedMidi(parsed, 5);
            assert.deepEqual(loadedData, MidiPlayerTestData.loadedWithNoteShiftFive);
        });
    });
});