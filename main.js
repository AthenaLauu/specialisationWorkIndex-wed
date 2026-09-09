// browser loads html > browser loads js > open the dialog >
// user closes dialog > audio system loads > user clicks sound button


// ==========================
// Find HTML elements
// ==========================

// find our dialog
const introDialog = document.getElementById("intro-dialog");

// find the close button
const introDialogCloseButton = document.getElementById("intro-dialog-close");

// find our test button
const testButton = document.getElementById("test-button");

// find my key button for testing
const key = document.getElementById("key-test");


// ==========================
// Tone.js Synth
// ==========================

// init our synth
// changed this to poly synth
// connect directly to Tone Destination
const synth = new Tone.PolySynth().toDestination();


// ==========================
// Mouse State
// ==========================

// is the user currently holding down the mouse button
let mouseButtonHeld = false;

// if user holds down mouse button, set to true
window.addEventListener("mousedown", function () {
    mouseButtonHeld = true;
});

// if user lets go, set to false
window.addEventListener("mouseup", function () {
    mouseButtonHeld = false;
});


// ==========================
// Intro Dialog
// ==========================

// show dialog on page load
introDialog.showModal();

// close dialog when user clicks
introDialogCloseButton.addEventListener("click", function closeIntroDialog() {
    introDialog.close();
});

// whenever dialog closes, initialise / unlock the audio system
introDialog.addEventListener("close", toneInit);


// ==========================
// Tone
// ==========================

// run to setup / unlock our audio system
async function toneInit() {
    await Tone.start();
    console.log("Tone.js audio started");
}


// ==========================
// Test Note
// ==========================

// function that plays a note
function playNote() {

    // play a note for a duration
    synth.triggerAttackRelease("C4", "8n");
}


// play note based on data-note inside HTML
function playDataNote(e) {

    console.log(e);

    // find which button was clicked
    let buttonClicked = e.target;

    // get the note from data-note
    let note = buttonClicked.dataset.note;

    // play the note
    synth.triggerAttackRelease(note, "8n");
}


// ==========================
// Key Button
// ==========================

// start note when mouse is held down
function startNote(e) {

    // find key that was pressed
    let keyPressed = e.target;

    // find the note associated with the key
    let note = keyPressed.dataset.note;

    // start playing the note
    synth.triggerAttack(note);
}


// stop note
function endNote(e) {

    let keyPressed = e.target;

    let note = keyPressed.dataset.note;

    synth.triggerRelease(note);
}


// start note when mouse presses key
key.addEventListener("mousedown", startNote);

// stop note when mouse is released
key.addEventListener("mouseup", endNote);

// stop note when mouse leaves the key
key.addEventListener("mouseleave", endNote);


// if user is holding mouse button down when entering the key,
// play the note
key.addEventListener("mouseenter", function (e) {

    if (mouseButtonHeld === true) {
        startNote(e);
    }

});


// ==========================
// Audio File Controls
// ==========================

// when I click the button I want to play audio file

const playButton = document.getElementById("play-button");

const randomButton = document.getElementById("random-time");

const audioTrack = document.getElementById("audio-track");


// play or pause audio
function playPauseAudio() {

    // if audio is paused, play it
    if (audioTrack.paused === true) {

        audioTrack.play();

    } else {

        // otherwise pause it
        audioTrack.pause();

    }

}


// choose a random position in the audio track
function randomTime() {

    let trackLength = audioTrack.duration;

    audioTrack.currentTime =
        trackLength * Math.random();

}


// listen for random button click
randomButton.addEventListener("click", randomTime);

// listen for play button click
playButton.addEventListener("click", playPauseAudio);


// ==========================
// Oscillator Slider
// ==========================

// set slider to change oscillator
const oscSlider = document.getElementById("osc-range");


// change oscillator depending on slider value
function changeOsc(e) {

    console.log(e.target.value);

    if (e.target.value > 50) {

        synth.set({
            oscillator: {
                type: "square"
            }
        });

    }

}


// listen for slider change
oscSlider.addEventListener("change", changeOsc);


// ==========================
// Spatial Control Section
// ==========================

// find flower painting
const flowerPainting = document.getElementById("flower-painting");


// play note when mouse enters image
flowerPainting.addEventListener("mouseenter", startNote);

// stop note when mouse leaves image
flowerPainting.addEventListener("mouseleave", endNote);


// change pitch depending on mouse X position
function pitchBend(e) {

    console.log(e.layerX);

    synth.set({
        detune: e.layerX
    });

}


// listen for mouse movement over image
flowerPainting.addEventListener("mousemove", pitchBend);


// ==========================
// Date + Time Section
// ==========================

// what is the current instant
let currentInstant = Temporal.Now.instant();


// find our time zone
let timeZone = Temporal.Now.timeZoneId();

console.log(timeZone);


// convert to local time
let currentTime =
    currentInstant.toZonedDateTimeISO(timeZone);

console.log(currentTime);


// convert to plain time
let plainTime =
    Temporal.PlainTime.from(currentTime);

console.log(plainTime.minute);


// if the current minute is above 52,
// slow down the audio track
if (plainTime.minute > 52) {

    audioTrack.playbackRate = 0.5;

}