const steps =
    [
        {
            title: "Introduction",
            content: ["Welcome to the walkthrough.",
                "Navigate with the buttons above to learn the process of harmonising a chorale.",
                "Feel free to press the above play button to hear the music play back, though that is not necessary to understand the process.",
                "It may also be worth glancing at the flow diagram to get an overview of the whole process. This demonstrates the decision-making process, especially make note of the selection nodes and the loops in the diagram.",
            
            ]
        },
        {
            title: "Calculate Key",
            content: [
                "We can calculate the key by finding the number of sharps (#) or flats (b) in the key signature and seeing if any accidentals (sharps or flats not in the key signature) are used to signify whether they are major or minor.",
                "If the key is major, 0 sharps means the key is C, and if it is minor, it is A.",
                "If the key is major, sharps numbering from 1-6 means the key would be G, D, A, E, B or F#",
                "If the key is major, flat numbering from 1-6 means the key would be F, Bb, Eb, Ab, Eb, Ab, Db or Gb",
                "If the key is minor, sharps numbering from 1-6 means the key would be E, B, F#, C#, G# or D#",
                "If the key is minor, flat numbering from 1-6 means the key would be D, G, C, F, Bb or Eb",

            ]
        },
        {
            title: "Find Cadence Locations",
            content: [
                "Simply find the notes underneath the fermatae. (𝄐)"
            ]
        },
        {
            title: "Choose Cadence Chords",
            content: [
                "For each of the cadence locations, look at the pattern in the melody line e.g. if the key is G major and the notes leading up to the cadence are B, A and G, the pattern is 3-2-1",
                "If the pattern is 3-2-1 the possible chord progressions are Ic-V-I or Ib-V-I.",
                "If the pattern is 2-2-1 or 2-2-3 the possible chord progressions are ii7b-V-I or V-I.",
                "If the pattern is 8-7-8 or 1-7-1 (the same thing) the possible chord progressions are V-I, ii7b-V-I or Ic-V-I.",
                "If the pattern is 6-7-8 the possible chord progressions are IV-V-I, ii7b-V-I or Ic-V-I.",
                "If the pattern is 3-3-2 the possible chord progression is Ib-V-I.",
                "If the pattern is 4-3-2 the possible chord progressions are viib-Ib-V or IVb-I-V.",
                "If the pattern is 1-2-1 the possible chord progressions are Ib-V-I or Ib-ii7b-I.",
                "If the pattern is 1-1-7 the possible chord progression is Ib-V-I.",
                "If the pattern is 1-1-1 the possible chord progression is Ic-I-I.",
                "If the pattern is 6-5 the possible chord progressions are iv-V or IV-I.",
                "If the pattern is 1-2 the possible chord progressions are I-V or IV-I.",
                
            ]
        },
        {
            title: "Selecting other chords",
            content: [
                "Follow the flow diagram of chords filling and choose a sequence that fits both the diagram and the notes in the melody."
            ]
        },
        {
            title: "Select bass notes",
            content: [
                "Bass notes are easy to select they are just the bottom note from the chord selected in the previous step.",
                "Passing notes, which are notes between chord progressions, can be added to the bass here when there are 2 steps between one bass note and another.",
                "Auxiliary notes can be added when the next note is the same as the current note. They are a step below the note and they go between the two identical notes."
            ]
        },
        {
            title: "Select alto and tenor notes",
            content: [
                "The alto and tenor notes are selected together.",
                "The simplest and most important rule you need to follow here is that you want to complete the chord e.g. if you have G Major chord (GBD) and the bass part has a D and the soprano part has a G either the tenor or alto part should have a B. That leaves you free to pick the other part with what would work best.",
                "How do you know what works best - general rules to follow are moving in step is best (so whichever notes would cause the smallest jump) and you also want to avoid parallel movement (that is when parts move in the same direction with the same steps at different pitches).",
                "Again, do not forget to add the passing and auxiliary notes for intrigue."

            ]
        },
        {
            title: "End",
            content: [
                "The chorale is now harmonised, feel free to listen back to hear the changes."
            ]
        },

    ]



export default { steps }