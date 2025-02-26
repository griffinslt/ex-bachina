<template>
<h5>Chord Table</h5>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">I</th>
            <th scope="col">ii</th>
            <th scope="col">iii</th>
            <th scope="col">IV</th>
            <th scope="col">V</th>
            <th scope="col">vi</th>
            <th scope="col">vii</th>
          </tr>
        </thead>
        <tbody>

          <tr>
            <td v-for="(triad, index) in triads" :key="index">{{ triad[2] }}</td>
          </tr>
          <tr>
            <td v-for="(triad, index) in triads" :key="index">{{ triad[1] }}</td>
          </tr>
          <tr>
            <td v-for="(triad, index) in triads" :key="index">{{ triad[0] }}</td>
          </tr>
          
         
        </tbody>
      </table>
</template>

<script>
import { Chord, Key } from "tonal";

export default {
    props: ['choraleKey'],
    setup(props){
        const key = props.choraleKey;
        var currentKey = null;
        if (key.mode == "major") {
            currentKey = Key.majorKey(key.tonic);
        } else {
            currentKey = Key.minorKey(key.tonic);
        }
        var triads = []
        for (var i = 0; i < 7; i++){
            var triad = Chord.get(currentKey.triads[i]).notes
            triads.push(triad)
        }


        return { triads}
    }
}
</script>