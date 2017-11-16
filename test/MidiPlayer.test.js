const assert = require('assert');
const MidiPlayer = require('../build/MidiPlayer');
const MidiParser = require('../build/MidiParser');
const testData = require('./data/MidiPlayerTestData');

describe('MidiPlayer', function() {
    const midiPlayer = new MidiPlayer();

    describe('loadingFunctions', function() {
        it('parsed dataUrl and provided test data should be equal', function(done) {
            const dataUrl = testData.dataUrl;
            midiPlayer.loadFromDataUrl(dataUrl, 5)
                .then(parsedData => {
                    assert.deepEqual(parsedData, testData.loadedWithNoteShiftFive);
                    done();
                })
                .catch(done);
        });
        it('parsed uint8Array and provided test data should be equal', function(done) {
            const uint8 = testData.uint8;
            midiPlayer.loadFromUint8Array(uint8, 5)
                .then(parsedData => {
                    assert.deepEqual(parsedData, testData.loadedWithNoteShiftFive);
                    done();
                })
                .catch(done);
        });
        it('parsed events and provided test data should be equal', function() {
            const midiParser = new MidiParser();
            const dataUrl = testData.dataUrl;
            const parsed = midiParser.parseDataUrl(dataUrl);
            const loadedData = midiPlayer.loadParsedMidi(parsed, 5);
            assert.deepEqual(loadedData, testData.loadedWithNoteShiftFive);
        });
        it('getDuration', function() {
            assert.equal(midiPlayer.getDuration(), testData.duration);
        });
    });

    describe('getEvents', function() {
        before('load player data', function(done) {
            midiPlayer.loadFromDataUrl(testData.dataUrl)
                .then(() => done())
                .catch(done);
        });

        it('getMidiEvents should equal provided test events', function() {
            assert.deepEqual(midiPlayer.getMidiEvents(), testData.events);
        });
        it('getNextEventsByTime should equal filtered data', function() {
            const time = 2000;
            const start = midiPlayer.getCurrentTime();
            const end = start + time;
            const expected = testData.events.filter(event => start <= event.timestamp && event.timestamp <= end);
            assert.deepEqual(midiPlayer.getNextEventsByTime(time), expected);
        });
        it('getPreviousEventsByTime should equal filtered data', function() {
            const time = 2000;
            const end = midiPlayer.getCurrentTime();
            const start = end - time;
            const expected = testData.events.filter(event => start <= event.timestamp && event.timestamp <= end);
            assert.deepEqual(midiPlayer.getPreviousEventsByTime(time), expected);
        });
        it('getPreviousEventsByTime should equal filtered data', function() {
            const start = 0;
            const end = midiPlayer.getDuration();
            assert.deepEqual(midiPlayer.getEventsByTimeRange(start, end), testData.events);
        });
    });

    describe('callbacks', function() {
        beforeEach('reset player', function() {
            midiPlayer.removeCallbacks();
            midiPlayer.reset();
            midiPlayer.addEvent({timestamp: 10, note: 40, type: 'noteOn', length: 40});
            midiPlayer.addEvent({timestamp: 20, note: 1, type: 'noteOn', length: 40});
            midiPlayer.addEvent({timestamp: 50, note: 40, type: 'noteOff'});
            midiPlayer.addEvent({timestamp: 60, note: 1, type: 'noteOff'});
        });
        after(function () {
            midiPlayer.removeCallbacks();
        });

        const oneTimeTrigger = function(callback) {
            return () => {
                callback();
                callback = () => {};
            };
        };

        it('should trigger play on play', function(done) {
            midiPlayer.addCallback('play', () => done());
            midiPlayer.play();
        });
        it('should trigger noteOff within the first few seconds', function(done) {
            const doneTriggerOnce = oneTimeTrigger(done);
            midiPlayer.addCallback('noteOff', () => doneTriggerOnce());
            midiPlayer.play();
        });
        it('should trigger noteOn within the first few seconds', function(done) {
            const doneTriggerOnce = oneTimeTrigger(done);
            midiPlayer.addCallback('noteOn', () => doneTriggerOnce());
            midiPlayer.play();
        });
        it('should trigger pause on pause', function(done) {
            midiPlayer.addCallback('pause', () => done());
            midiPlayer.play();
            midiPlayer.pause();
        });
        it('should trigger pause on stop', function(done) {
            midiPlayer.addCallback('pause', () => done());
            midiPlayer.play();
            midiPlayer.stop();
        });
        it('should trigger stop on stop', function(done) {
            midiPlayer.addCallback('stop', () => done());
            midiPlayer.play();
            midiPlayer.stop();
        });
        it('should trigger finish at the end', function(done) {
            midiPlayer.addCallback('finish', () => done());
            midiPlayer.play();
        });
    });

    describe('modify events', function() {
        beforeEach(function() {
            midiPlayer.reset();
        });

        describe('addEvent', function() {
            it('should insert events in the right order based on the timestamp', function() {
                midiPlayer.addEvent({timestamp: 2, note: 0, type: 'noteOn'});
                midiPlayer.addEvent({timestamp: 3, note: 0, type: 'noteOn'});
                midiPlayer.addEvent({timestamp: 1, note: 0, type: 'noteOn'});
                midiPlayer.addEvent({timestamp: 5, note: 0, type: 'noteOn'});
                midiPlayer.addEvent({timestamp: 4, note: 0, type: 'noteOn'});
                assert.deepEqual(midiPlayer.getMidiEvents(), midiPlayer.getMidiEvents().sort((a, b) => a.timestamp - b.timestamp));
            });
            it('should check if the required properties are given', function() {
                try {
                    midiPlayer.addEvent({});
                    throw false;
                } catch (e) {if (!e) throw new Error('no error thrown with no properties given');}
                try {
                    midiPlayer.addEvent({timestamp: 0});
                    throw false;
                } catch (e) {if (!e) throw new Error('no error thrown with no properties given');}
                try {
                    midiPlayer.addEvent({timestamp: 0, type: 'noteOn'});
                    throw false;
                } catch (e) {if (!e) throw new Error('no error thrown with no properties given');}
                try {
                    midiPlayer.addEvent({timestamp: 0, type: 'noteOn', note: 0});
                } catch(e) {
                    throw new Error('error thrown with timestamp, type and note given');
                }
            });
            it('should play added events', function(done) {
                midiPlayer.addEvent({timestamp: 5, note: 0, type: 'noteOn', testMsg: 'test'});
                midiPlayer.addCallback('noteOn', event => {
                    if (event.testMsg === 'test') {
                        done()
                    } else {
                        throw new Error('testMsg got omitted');
                    }
                });
                midiPlayer.play();
            });
        });
        describe('removeEvents', function() {
            it('should remove with the same properties and values as the search', function() {
                midiPlayer.addEvent({timestamp: 2, note: 20, type: 'noteOn'});
                midiPlayer.addEvent({timestamp: 3, note: 30, type: 'noteOn'});
                midiPlayer.addEvent({timestamp: 1, note: 10, type: 'noteOn'});
                midiPlayer.addEvent({timestamp: 5, note: 50, type: 'noteOff', subtype: 'test'});
                midiPlayer.addEvent({timestamp: 4, note: 40, type: 'noteOff', subtype: 'test_2'});
                assert.equal(midiPlayer.getMidiEvents().length, 5);
                midiPlayer.removeEvents({subtype: 'test_2'});
                assert.equal(midiPlayer.getMidiEvents().length, 4);
                midiPlayer.removeEvents({type: 'noteOff', subtype: 'test'});
                assert.equal(midiPlayer.getMidiEvents().length, 3);
                midiPlayer.removeEvents({type: 'noteOn'});
                assert.equal(midiPlayer.getMidiEvents().length, 0);
            });
        });
        describe('reverseMidiData', function() {
            it('should reverse the data so it can be played backwards', function() {
                midiPlayer.addEvent({timestamp: 0, note: 20, type: 'noteOn', length: 250});
                midiPlayer.addEvent({timestamp: 250, note: 20, type: 'noteOff'});
                midiPlayer.addEvent({timestamp: 1000, note: 50, type: 'noteOn', length: 100});
                midiPlayer.addEvent({timestamp: 1100, note: 50, type: 'noteOff'});
                midiPlayer.reverseMidiData();
                
                const expectedResult = [
                    {timestamp: 0, note: 50, type: 'noteOn', length: 100},
                    {timestamp: 100, note: 50, type: 'noteOff'},
                    {timestamp: 1000, note: 20, type: 'noteOn', length: 250},
                    {timestamp: 1250, note: 20, type: 'noteOff'}
                ];
                assert.deepEqual(midiPlayer.getMidiEvents(), expectedResult);
            });
            it('double reverse should equal original', function() {
                midiPlayer.addEvent({timestamp: 0, note: 20, type: 'noteOn', length: 250});
                midiPlayer.addEvent({timestamp: 250, note: 20, type: 'noteOff'});
                midiPlayer.addEvent({timestamp: 1000, note: 50, type: 'noteOn', length: 100});
                midiPlayer.addEvent({timestamp: 1100, note: 50, type: 'noteOff'});
                const originalMidiData = midiPlayer.getMidiEvents();
                midiPlayer.reverseMidiData();
                midiPlayer.reverseMidiData();
                assert.deepEqual(midiPlayer.getMidiEvents(), originalMidiData);
            });
        });
    });
});