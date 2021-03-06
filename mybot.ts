import {Wechaty, Room} from 'wechaty'

const bot = Wechaty.instance()

const Gdax = require('gdax');
const publicClient = new Gdax.PublicClient('ETH-USD');

const apiai = require('apiai');
const app = apiai("5701b2d722654bc6867194ad6a42cace");

bot
.on('scan', (url, code)=>{
    let loginUrl = url.replace('qrcode', 'l')
    require('qrcode-terminal').generate(loginUrl)
    console.log(url)
})

.on('logout', user=>{
    console.log(`${user} logged out...`)
})

.on('login', user=>{
    console.log(`${user} logged in.`)
})

.on('friend', async function (contact, request){
    if(request){
        await request.accept()
        console.log(`Contact: ${contact.name()} send request ${request.hello}`)
    }
})

.on('message', async function(m){
    const contact = m.from()
    const content = m.content()
    const room = m.room()

    if(room){
        console.log(`Room: ${room.topic()} Contact: ${contact.name()} Content: ${content}`)
    } else{
        console.log(`Contact: ${contact.name()} Content: ${content}`)
    }

    if(m.self()){
        return
    }

    if(/^(hello|Hello|Hi|hi)$/.test(content)){
        m.say("Hi! I am wip727Bot. How you doing?")
        m.say("I am checking ether price ... ask me about it!")
    } else if(/^(Eth|eth|price|Price|Ether|ether)$/.test(content)){
	var callback = function(err, response, data) {
            if (data) console.log(data);
	    m.say(data.price);
	};

	publicClient.getProductTicker(callback);
    } else if(/^(Haha|haha|哈哈哈|哈哈)$/.test(content)){       
	m.say("[Facepalm]")
    } else {
    var request = app.textRequest(content,{
        sessionId: 'wechaty-English'
    });
        
    request.on("response", function (response) {
        m.say(response.result.fulfillment.speech);
    });

    request.on("error", function(error) {
        console.log("error: " + error);
    });

    request.end();
    }
 

    if(/room/.test(content)){
        let keyroom = await Room.find({topic: "test"})
        if(keyroom){
            await keyroom.add(contact)
            await keyroom.say("welcome!", contact)
        }
    }

    if(/out/.test(content)){
        let keyroom = await Room.find({topic: "test"})
        if(keyroom){
            await keyroom.say("Remove from the room", contact)
            await keyroom.del(contact)
        }
    }
})

.init()
