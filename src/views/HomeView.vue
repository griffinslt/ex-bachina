<template>
    <h1>Home</h1>
    <hr>
    <p><i>Welcome to the Bachinator, a teaching tool taking an algorithmic approach to harmony.</i></p>
    <br>
    <h2>How does it work?</h2>
    <div class="border rounded bg-light p-2 my-1">
        <p>Given a melody (a tune) from a type of Lutheran hymn called a Chorale, this application takes you
            step-by-step through the process of how this chorale can be harmonised in the style of J.S. Bach. Whilst
            explaining the process, the application is generating the harmony in real time, hopefully making the steps
            as clear as possible. This should also result in each time you run it getting a slightly different output
            (within the limit of what is possible). </p>
    </div>

    <br>
    <h2>How can knowledge of computational thinking help in understanding music theory?</h2>
    <div class="border rounded bg-light p-2 my-1">
        <p>Computational thinking has four main elements, and each lends itself to the harmonisation process.</p>
        <ul>
            <li><strong>Decomposition:</strong> This is demonstrated through the breaking down of the process into small
                steps.</li>
            <li><strong>Abstraction:</strong> This is utilised through the details that are not considered when
                harmonising,
                such as lyrics, dynamics or even sound</li>
            <li><strong>Pattern Recognition:</strong> Hopefully, through practice in using the tools, users will be able
                to
                spot the patterns that the rules are made from. </li>
            <li><strong>Algorithms:</strong> This is an algorithmic approach to solving the harmony, thus by following
                the
                instructions, a Bachian style harmony is formed. Further, the use of a dynamic flow diagram reveals the
                selection and loops involved in the process.</li>
        </ul>
    </div>


    <br>
    <div class="text-center">
        <RouterLink to="/walkthrough" class="btn btn-primary btn-lg text-white">Let's Get Started</RouterLink>
    </div>


</template>

<script>
export default {
    setup() {

    }
}
</script>