import { ref } from 'vue'
import { vertaal } from 'xml2abc'

const xmlToAbc = (xmlString) => {
    const error = ref(null)
    const text = ref("")
    var options = {
        u: 0, b: 0, n: 0,  // unfold repeats (1), bars per line, chars per line
        c: 0, v: 0, d: 0,  // credit text filter level (0-6), no volta on higher voice numbers (1), denominator unit length (L:)
        m: 0, x: 0, t: 0,  // no midi, minimal midi, all midi output (0,1,2), no line breaks (1), perc, tab staff -> voicemap (1)
        v1: 0, noped: 0,  // all directions to first voice of staff (1), no pedal directions (1)
        stm: 0,          // translate stem elements (stem direction)
        p: 'f', s: 0
    };   // page format: scale (1.0), width, left- and right margin in cm, shift note heads in tablature (1)

    const convert = () => {
        var xmldata = $.parseXML(xmlString);
        var result = vertaal(xmldata, options);
        var abcText = result[0];               // the translation (string)
        text.value = abcText
        var errorTxt = result[1];

        if (errorTxt.length > 0) {
            error.value = errorTxt
        }
    }
    return { text, error, convert }

}

export default xmlToAbc