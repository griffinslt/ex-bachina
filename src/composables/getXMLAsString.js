import { ref } from 'vue'

const getXMLAsString = (path) => {
    const string = ref("")
    const error = ref(null)
    const load = async () => {
        try {
            let data = await fetch(path)
            if (!data.ok) {
                throw Error("File does not exist")
            }
            string.value = await data.text()
        } catch (err) {
            error.value = error.message
            console.log(error.value)
        }
    }
    return { string, error, load }
}

export default getXMLAsString