const express = require('express')
const cors = require('cors') 
const app = express()
const port = 3005


const contractList = []

app.use(express.json())
app.use(cors())

app.get('/contract/all', (req, res) => {
    console.log('/contract/all - Requesting list of contract')
	  const contracts = JSON.stringify({contracts: contractList})
    res.status(200).send(contracts)
})

app.post('/contract/new', (req, res) => {
	  try {
      console.log('/contract/new - Saving contract list')
			console.log('Request body: ' + JSON.stringify(req.body))
			contractList.push(req.body)
      console.log('/contract/new - body is getting saved')
			res.status(200).send('POST Contract address saved')
		} catch (error) {
			res.status(404).send('POST Contract address not saved')
		}
})

app.listen(port, () => {
    console.log("Listening on port " + port)
})
