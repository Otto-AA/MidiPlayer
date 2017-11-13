const assert = require('assert');
const MidiParser = require('../build/MidiParser');
const MidiParserTestData = require('./data/MidiParserTestData');

describe('MidiParser', function() {
    const midiParser = new MidiParser();
    describe('dataUrl', function() {
        it('parsed dataUrl and provided test data should be equal', function() {
            const dataUrl = MidiParserTestData.dataUrl;
            const parsedData = midiParser.parseDataUrl(dataUrl);
            assert.deepEqual(parsedData, MidiParserTestData.parsed);
        });
    });
    describe('parseUint8', function() {
        it('parsed uint8Array and provided test data should be equal', function() {
            const uint8 = MidiParserTestData.uint8;
            const parsedData = midiParser.parseUint8(uint8);
            assert.deepEqual(parsedData, MidiParserTestData.parsed);
        });
    });
});