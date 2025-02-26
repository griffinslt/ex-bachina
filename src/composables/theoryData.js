const steps =
    [
        {
            title: "Introduction",
            content: ["Welcome to the walkthough.",
                "Navigate with the below buttons to learn the process of harmonising a chorale.",
                "Feel free to press the above play button to hear the music play back, though that is not necessary to understand the process.",
                "It may also be worth to glance at the flow diagram to get an overview of the whole process."
            
            ]
        },
        {
            title: "Calculate Key",
            content: [
                "We can calculate the key by finding the number of sharps or flats and seeing if any accidentals are used to signify whether they are major or minor.",
                "If the key is major, 0 sharps means the key is C and if it is minor it is A.",
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
                "For each of the cadence locations look at the pattern in the melody line e.g. if the key is G major and the notes leading up to the cadence are B, A and G the pattern is 3-2-1",
                "If the pattern is 3-2-1 the possible chords are ..."
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
                "Passing notes, which are notes between chord progressions can be added to the bass here when there is one 2 steps between one bass note and another."
            ]
        },
        {
            title: "Select alto and tenor notes",
            content: []
        },

    ]



export default { steps }