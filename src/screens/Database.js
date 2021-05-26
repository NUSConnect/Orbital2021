import * as firebase from 'firebase';

class Fire {
    constructor() {
        this.init();
        this.checkAuth();
    }


    //initializing the firebase account with the api key and project id
    init = () =>{
        if(!firebase.apps.length){
            firebase.initializeApp({
                apiKey: "AIzaSyB0HAlRGcUkjeklySpSjXTnlWKlh26rEwk",
                authDomain: "orbital2021-a4766.firebaseapp.com",
                projectId: "orbital2021-a4766",
                storageBucket: "orbital2021-a4766.appspot.com",
                messagingSenderId: "323827934145",
                appId: "1:323827934145:web:ff5bbb2bec368bb5580540",
                measurementId: "G-2ESR4KWTG4"
            });
        }
    };

    checkAuth = () =>{
            firebase.auth().onAuthStateChanged(user =>{
                if(!user){
                    firebase.auth().signInAnonymously();
                }
            });
        };

    send = messages => {
        messages.forEach(item => {
            const message = {
                text : item.text,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                user: item.user
            };

            this.db.push(message);
        });
    };


    //obtaining the recorded or stored messages fro the fire base db
    parse = message => {
        const { user , text , timestamp } = message.val();
        const { key: _id} = message;
        const createdAt = new Date(timestamp);

        return{
            _id,
            createdAt,
            text,
            user
        };
    };

    get = callback =>{
        this.db.on("child_added", snapshot => callback(this.parse(snapshot)));
    };

    off(){
        this.db.off()
    }

    get db(){
        return firebase.database().ref("messages");
    }
    get uid(){
        return (firebase.auth().currentUser || {}).uid;
    }
}

export default new Fire();