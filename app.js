const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const APP_TOKEN = 'EAAIZCdmfgCawBACCYZAjDsDhocORMNH3MwYkIp82rAVOl5xaKsnYKgsmNB7mL4YfuMoHVe3rCizUte1Yr5XJ1sgEQRsoV9u9CHBEXwQtAg5QUiWAm8vutyhN6WU7owHne5ozAdAtwgSTKFNTrMzxQs29yjtT228jYxliVpN3RvePl2ZC35DimJmftltjtQZD'

var app = express()

app.use(bodyParser.json())

var PORT = process.env.PORT || 3000;

app.listen(PORT,function(){
	console.log('Server listen localhost:3000')
})

app.get('/',function(req, res){
	res.send('Abriendo el puerto desde mi pc Local con http://ngrok.com')
})

app.get('/webhook',function(req, res){
	if(req.query['hub.verify_token'] === 'hello_token'){
		res.send(req.query['hub.challenge'])
	}else{
		res.send('Tu no tienes que entrar aqui')
	}
})

app.post('/webhook',function(req, res){
	var data = req.body
	if(data.object == 'page'){
		data.entry.forEach(function(pageEntry){
			pageEntry.messaging.forEach(function(messagingEvent){
				if(messagingEvent.message){					
					getMessage(messagingEvent)
				}
			})
		})
	}
	res.sendStatus(200)
})

function getMessage(event){
	var senderID = event.sender.id
	var messageText = event.message.text

	evaluarMensaje(senderID, messageText)
}

function evaluarMensaje(senderID, messageText){
	var mensaje = '';

	if(isContain(messageText,'ayuda')){
		mensaje = 'Por el momento no te puedo ayudar :('
	}else if(isContain(messageText,'info')){
		mensaje = 'Hola que tal nuestro numero de telefono es: XXX-5545\n mi correo es: esteban.programador@gmail.com'
	}else if(isContain(messageText,'perro')){
		enviarMensajeImagen(senderID)
	}else if(isContain(messageText,'perfil')){
		enviarMensajeTemplate(senderID)
	}else if(isContain(messageText,'clima') || isContain(messageText,'temperatura')){
		getClima(function(_temperatura){
			enviarMensajeTexto(senderID, getMessageCLima(_temperatura))
		})
	}else{
		mensaje = '[Heroku]solo se repetir las cosas T_T '+ messageText
	}

	enviarMensajeTexto(senderID, mensaje)
}

function enviarMensajeTemplate(senderID){
	var messageData = {
		recipient: {
			id : senderID
		},
		message: {
			attachment :{
				type: "template",
				payload: {
					template_type: 'generic',
					elements: [elementTemplate(),elementTemplate(),elementTemplate(),elementTemplate()]
				}
			}
		}
	}
