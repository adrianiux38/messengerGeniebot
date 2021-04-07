/**
 * Copyright 2021-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger Platform Quick Start Tutorial
 *
 * This is the completed code for the Messenger Platform quick start tutorial
 *
 * https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start/
 *
 * To run this code, you must do the following:
 *
 * 1. Deploy this code to a server running Node.js
 * 2. Run `yarn install`
 * 3. Add your VERIFY_TOKEN and PAGE_ACCESS_TOKEN to your environment vars
 */

 'use strict';

 const mysql = require('mysql');
 
 var pool = mysql.createPool({
     host: '74.208.30.224',
     user: 'techsoft',
     password: 'Techsoft2020.',
     database: 'whatsapp_chatboot2',
     port: '3306'
 });

 var intent;
 var resultado;
 var edad;
 var pertenece_medico;
 var res_fecha;


 //si llega un mensaje, que lo agregue a la tabla de intents_messenger, y en sender que le ponda su psid 

 
 // Use dotenv to read .env vars into Node
 require('dotenv').config();
 
 /* definimos las funciones del chatbot de vacunación */

  function leerIntent(senderPsid){
    return new Promise(resolve => {
        pool.query(`SELECT * FROM whatsapp_chatboot2.intents_messenger WHERE sender_psid= '${senderPsid}'`, (error, result) => {
            if(!error){
                if (typeof(result[0]) != 'undefined'){
                    intent = result[0].intent;
                    resolve(intent);
                }
            }
        });
    });
  } 

  //cuando un usuario nos habla por primera vez, le ponemos 1 como intent
  function primerIntent(senderPsid){
    pool.query(`INSERT INTO whatsapp_chatboot2.intents_messenger (intent, sender_psid) values ('1','${senderPsid}')`);
  }

  function cambiarIntent(senderPsid, intent){
    pool.query(`UPDATE whatsapp_chatboot2.intents_messenger SET intent = '${intent}' WHERE sender_psid= '${senderPsid}'`);
  }

  //función para calcular la edad 
  async function calcularEdad(edad){
    return new Promise(resolve => {
        edad = edad.replace(/\D/g,'');
        if (edad<17){
            res_fecha = "La vacuna te tocará aproximadamente el *22 de Agosto del 2022*";
            resolve(res_fecha);
        } else if (17<=edad && edad<=20){
            res_fecha = "La vacuna te tocará aproximadamente el *25 de Junio del 2022*, estaremos actualizando las fechas de vacunación y lugares donde se aplicarán, seguimos en contacto!";
            resolve(res_fecha);
        } else if (21<=edad && edad<=25){
            res_fecha = "La vacuna te tocará aproximadamente el *14 de Marzo del 2022*, estaremos actualizando las fechas de vacunación y lugares donde se aplicarán, seguimos en contacto!";
            resolve(res_fecha);
        } else if (26<=edad && edad<=29){
            res_fecha = "La vacuna te tocará aproximadamente el *30 de Enero del 2022*, estaremos actualizando las fechas de vacunación y lugares donde se aplicarán, seguimos en contacto!";
            resolve(res_fecha);
        } else if (30<=edad && edad<=35){
            res_fecha = "La vacuna te tocará aproximadamente el *16 de Octubre del 2021*, estaremos actualizando las fechas de vacunación y lugares donde se aplicarán, seguimos en contacto!";
            resolve(res_fecha);
        } else if (36<=edad && edad<=39){
            res_fecha = "La vacuna te tocará aproximadamente el *21 de Agosto del 2021*, estaremos actualizando las fechas de vacunación y lugares donde se aplicarán, seguimos en contacto!";
            resolve(res_fecha);
        } else if (40<=edad && edad<=49){
            res_fecha = "La vacuna te tocará aproximadamente el *13 de Junio del 2021*, estaremos actualizando las fechas de vacunación y lugares donde se aplicarán, seguimos en contacto!";
            resolve(res_fecha);
        } else if (50<=edad && edad<=59){
            res_fecha = "La vacuna te tocará aproximadamente el *17 de Abril del 2021*, estaremos actualizando las fechas de vacunación y lugares donde se aplicarán, seguimos en contacto!";
            resolve(res_fecha);
        } else if (edad>60){
            res_fecha = "La vacuna te tocará aproximadamente el *3 de Abril del 2021*, estaremos actualizando las fechas de vacunación y lugares donde se aplicarán, seguimos en contacto!";
            resolve(res_fecha);
        }
    });
  }

  async function leerEdad(senderPsid){
    return new Promise(resolve => {
        pool.query(`SELECT * FROM registros_vacuna_msg WHERE sender_psid = '${senderPsid}'`, (error, result) => {
            if (!error){
                if(typeof(result[0]) != 'undefined'){
                    edad = result[0].edad //edad
                    resolve(edad);
                } 
            }
        });
    });
  }

  async function perteneceASalud(senderPsid){
    return new Promise(resolve => {
        pool.query(`SELECT * FROM registros_vacuna_msg WHERE sender_psid = '${senderPsid}'`, (error, result) => {
            if (!error){
                if(typeof(result[0]) != 'undefined'){
                    pertenece_medico = result[0].pertenece_medico //edad
                    resolve(pertenece_medico);
                } 
            } 
        });
    });
  }

  //función para insertar una variable a la tabla de registros_vacuna_msg
  async function crearVariableRegistros(nombre_variable, senderPsid, mensaje){
    return new Promise(resolve => {
        pool.query(`UPDATE registros_vacuna_msg SET ${nombre_variable} = '${mensaje}' WHERE sender_psid = '${senderPsid}'`, (error, result) => {
            if(!error){
                resultado = "true";
            } else if(error){
                resultado = "false";
            }
            resolve(resultado);
        });
    });
  }



















 // Imports dependencies and set up http server
 const
   request = require('request'),
   express = require('express'),
   { urlencoded, json } = require('body-parser'),
   app = express();
 
 // Parse application/x-www-form-urlencoded
 app.use(urlencoded({ extended: true }));
 
 // Parse application/json
 app.use(json());
 
 // Respond with 'Hello World' when a GET request is made to the homepage
 app.get('/', function (_req, res) {
   res.send('Hello World');
 });
 
 // Adds support for GET requests to our webhook
 app.get('/webhook', (req, res) => {
 
   // Your verify token. Should be a random string.
   const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
 
   // Parse the query params
   let mode = req.query['hub.mode'];
   let token = req.query['hub.verify_token'];
   let challenge = req.query['hub.challenge'];
 
   // Checks if a token and mode is in the query string of the request
   if (mode && token) {
 
     // Checks the mode and token sent is correct
     if (mode === 'subscribe' && token === VERIFY_TOKEN) {
 
       // Responds with the challenge token from the request
       console.log('WEBHOOK_VERIFIED');
       res.status(200).send(challenge);
 
     } else {
       // Responds with '403 Forbidden' if verify tokens do not match
       res.sendStatus(403);
     }
   }
 });
 
 // Creates the endpoint for your webhook
 app.post('/webhook', (req, res) => {
   let body = req.body;
 
   // Checks if this is an event from a page subscription
   if (body.object === 'page') {
 
     // Iterates over each entry - there may be multiple if batched
     body.entry.forEach(function(entry) {
 
       // Gets the body of the webhook event
       let webhookEvent = entry.messaging[0];
       console.log(webhookEvent);
 
       // Get the sender PSID
       let senderPsid = webhookEvent.sender.id;
       
       //vemos que ya tenga un intent 
       pool.query(`SELECT * FROM whatsapp_chatboot2.intents_messenger WHERE sender_psid= '${senderPsid}'`, (error, result) => {
          if(!error){
              //si aún no tenía ningun intent registrado, le ponemos un intent de 1
              if (typeof(result[0]) == 'undefined'){
                  primerIntent(`${senderPsid}`);
                  console.log("se ha agregado el senderpsid " + senderPsid)
              }
          } else if (error){
            console.log(error);
          }
        });
       console.log('Sender PSID: ' + senderPsid);
 
       // Check if the event is a message or postback and
       // pass the event to the appropriate handler function
       if (webhookEvent.message) {
         handleMessage(senderPsid, webhookEvent.message);
       } else if (webhookEvent.postback) {
         handlePostback(senderPsid, webhookEvent.postback);
       }
     });
 
     // Returns a '200 OK' response to all requests
     res.status(200).send('EVENT_RECEIVED');
   } else {
 
     // Returns a '404 Not Found' if event is not from a page subscription
     res.sendStatus(404);
   }
 });



 // Handles messages events
 async function handleMessage(senderPsid, receivedMessage) {
   let response;
   let mensaje = receivedMessage.text.toLowerCase();

   //primero vamos a leer el intent 
   intent = await leerIntent(`${senderPsid}`);
   console.log('ESTAMOS EN EL INTENT ' + intent);

   if(intent == 1){
    // Checks if the message contains text
    if (mensaje == "hola") {
      // Create the payload for a basic text message, which
      // will be added to the body of your request to the Send API
      response = {
        "text": "Hola, soy Medibot 🤖, Te ayudo a calcular la fecha de tu vacuna",
        "quick_replies":
        [
          {
          "content_type":"text",
          "title": "Empezar",
          "payload": "empezar"
          }
        ]
      };
    } else if (mensaje == 'empezar') {
      pool.query(`Insert into whatsapp_chatboot2.registros_vacuna_msg (sender_psid) values ('${senderPsid}')`);
      response = {
        'text': 'Vamos a calcular en base a nuestro inventario tu fecha estimada de vacuna ¿𝐂𝐮𝐚𝐥 𝐞𝐬 𝐭𝐮 𝐧𝐨𝐦𝐛𝐫𝐞 𝐜𝐨𝐦𝐩𝐥𝐞𝐭𝐨?'
      };
      cambiarIntent(`${senderPsid}`, '1.2');
    } else if (mensaje == "adrian") {
      //obtenemos su número de teléfono 
      response = {
        "text": "Dame tu número de teléfono",
        "quick_replies":
        [
          {
          "content_type":"user_phone_number",
          "payload": "phone"
          }
        ]
      };  
    } else if (receivedMessage.attachments) {
      // Get the URL of the message attachment
      let attachmentUrl = receivedMessage.attachments[0].payload.url;
      response = {
        'attachment': {
          'type': 'template',
          'payload': {
            'template_type': 'generic',
            'elements': [{
              'title': 'Is this the right picture?',
              'subtitle': 'Tap a button to answer.',
              'image_url': attachmentUrl,
              'buttons': [
                {
                  'type': 'postback',
                  'title': 'Yes!',
                  'payload': 'yes',
                },
                {
                  'type': 'postback',
                  'title': 'No!',
                  'payload': 'no',
                }
              ],
            }]
          }
        }
      };
    }
   } else if (intent == 1.2){
    resultado = await crearVariableRegistros('nombre', `${senderPsid}`, mensaje);
    if (resultado != 'false') {
      response = {
        'text': `¿𝐐𝐮𝐞 𝐞𝐝𝐚𝐝 𝐭𝐢𝐞𝐧𝐞𝐬? (escribir el número)`
      };  
      cambiarIntent(`${senderPsid}`, '1.3');
    } else if (resultado == 'false'){
      response = {
        'text': `Valor incorrecto, ¿cuál es tu nombre completo?`
      };  
    }
   } else if (intent == 1.3){
    resultado = await crearVariableRegistros('edad', `${senderPsid}`, mensaje);
    if (resultado != 'false'){
      response = {
        'text': `¿Cuál es tu código postal?`
      };  
      cambiarIntent(`${senderPsid}`, '1.4');
    } else if (resultado == 'false'){
      response = {
        'text': `Valor incorrecto, ingresa tu edad en número`
      };  
    }
   } else if (intent == 1.4){
    resultado = await crearVariableRegistros('cp', `${senderPsid}`, mensaje);
    if (resultado != 'false'){
      response = {
        "text": "¿Perteneces a personal médico y de salud?",
        "quick_replies":
        [
          {
          "content_type":"text",
          "title": "Si",
          "payload": "si"
          },
          {
            "content_type":"text",
            "title": "No",
            "payload": "no"
          }
        ]
      };
      cambiarIntent(`${senderPsid}`, '1.5');
    } else if (resultado == 'false'){
      response = {
        'text': `Valor incorrecto, ingresa un código postal correcto`
      };  
    }
   } else if (intent == 1.5){
    resultado = await crearVariableRegistros('pertenece_medico', `${senderPsid}`, mensaje);
    if (resultado != 'false'){
      response = {
        "text": "¿Cuál es tu número de teléfono, para enviarte actualizaciones?",
        "quick_replies":
        [
          {
          "content_type":"user_phone_number",
          "payload": "phone"
          }
        ]
      };
      cambiarIntent(`${senderPsid}`, '1.6');
    } else if (resultado == 'false'){
      response = {
        'text': `Valor incorrecto, ingresa sí o no`
      };  
    }
   } else if (intent == 1.6){
    resultado = await crearVariableRegistros('telefono', `${senderPsid}`, mensaje);
    if (resultado != 'false'){
      response = {
        "text": "¿Consideras que MORENA está haciendo un buen trabajo entregando la vacuna?",
        "quick_replies":
        [
          {
            "content_type":"text",
            "title": "Si",
            "payload": "si"
            },
            {
              "content_type":"text",
              "title": "No",
              "payload": "no"
            }
        ]
      };
      cambiarIntent(`${senderPsid}`, '1.7');
    } else if (resultado == 'false'){
      response = {
        'text': `Valor incorrecto, ingresa un número de teléfono correcto`
      };  
    }
   } else if (intent == 1.7){
    resultado = await crearVariableRegistros('apoya_morena', `${senderPsid}`, mensaje);
    if (resultado != 'false'){
      if (mensaje == 'no'){
        response = {
          "text": "¿Qué partido crees que lo haría mejor?",
          "quick_replies":
          [
            {
              "content_type":"text",
              "title": "1 - Pri",
              "payload": "1"
              },
              {
                "content_type":"text",
                "title": "2 - P. Verde",
                "payload": "2"
              },
              {
                "content_type":"text",
                "title": "3 - PAN",
                "payload": "3"
                },
                {
                  "content_type":"text",
                  "title": "4 - PRD",
                  "payload": "4"
                },
                {
                  "content_type":"text",
                  "title": "5 - PT",
                  "payload": "5"
                },
                {
                  "content_type":"text",
                  "title": "6 - MOV.Ciudadano",
                  "payload": "6"
                }
          ]
        };
        cambiarIntent(`${senderPsid}`, '1.8');
      } else if (mensaje == 'si' || mensaje == 'sí') {
        cambiarIntent(`${sender}`, '1.9');
      }
    } else if (resultado == 'false'){
      response = {
        'text': `Valor incorrecto, ingresa sí o no`
      };  
    }
   } else if (intent == 1.8) {
    mensaje = mensaje.replace(/\D/g,'');
    resultado = await crearVariableRegistros('partido_apoyado', `${senderPsid}`, mensaje);
    if (resultado != 'false'){
      try {
        edad = await leerEdad(`${senderPsid}`);
        console.log('leyendo edad');
        pertenece_medico = await perteneceASalud(`${senderPsid}`);
        /* leemos la edad y vemos a qué corresponde */
        if(pertenece_medico == 'si' || pertenece_medico == 'sí'){
          resultado= "La vacuna te tocará aproximadamente el *10 de Abril del 2021*";
        } else {
          //calculamos en base a la edad
          resultado = await calcularEdad(edad);
        }
        response = {
          'text': `${resultado}`
        };
        cambiarIntent(`${senderPsid}`, '1');
     } catch(error) {
        console.log(error);
     }
    } else if (resultado == 'false'){
      response = {
        'text': `Valor incorrecto, ingresa un número`
      };  
    }
   } else if (intent == 1.9){
     try {
        edad = await leerEdad(`${senderPsid}`);
        console.log('leyendo edad');
        pertenece_medico = await perteneceASalud(`${senderPsid}`);
        /* leemos la edad y vemos a qué corresponde */
        if(pertenece_medico == 'si' || pertenece_medico == 'sí'){
          resultado= "La vacuna te tocará aproximadamente el *10 de Abril del 2021*";
        } else {
          //calculamos en base a la edad
          resultado = await calcularEdad(edad);
        }
        response = {
          'text': `${resultado}`
        };
        cambiarIntent(`${senderPsid}`, '1');
     } catch(error) {
        console.log(error);
     }
   }
   // Send the response message
   callSendAPI(senderPsid, response);
 }
 
 // Handles messaging_postbacks events
 function handlePostback(senderPsid, receivedPostback) {
   let response;
 
   // Get the payload for the postback
   let payload = receivedPostback.payload;
 
   // Set the response based on the postback payload
   if (payload === 'yes') {
     response = { 'text': 'Thanks!' };
   } else if (payload === 'no') {
     response = { 'text': 'Oops, try sending another image.' };
   } else if (payload == 'phone'){

   }else if(payload == 'vacuna'){
     //que le cambie el intent del usuario a 1.2 
     response = { 'text': `Vamos a calcular en base a nuestro inventario tu fecha estimada de vacuna *¿Cuál es tu nombre completo?*`};
   }
   // Send the message to acknowledge the postback
   callSendAPI(senderPsid, response);
 }
 
 // Sends response messages via the Send API
 function callSendAPI(senderPsid, response) {
 
   // The page access token we have generated in your app settings
   const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
 
   // Construct the message body
   let requestBody = {
     'recipient': {
       'id': senderPsid
     },
     'message': response
   };
 
   // Send the HTTP request to the Messenger Platform
   request({
     'uri': 'https://graph.facebook.com/v2.6/me/messages',
     'qs': { 'access_token': PAGE_ACCESS_TOKEN },
     'method': 'POST',
     'json': requestBody
   }, (err, _res, _body) => {
     if (!err) {
       console.log('Message sent!');
     } else {
       console.error('Unable to send message:' + err);
     }
   });
 }
 
 /* PARA PRUEBAS
 // listen for requests :)
 var listener = app.listen(54932, function() {
   console.log('Your app is listening on port ' + listener.address().port);
 });
 */
 
 var listener = app.listen(process.env.PORT, function() {
   console.log('Your app is listening on port ' + listener.address().port);
 });
 