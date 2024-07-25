import { useEffect, useState } from "react";
import kurblGif from "../assets/crank.gif";
import tankGif from "../assets/fillfull.gif";
import laftGif from "../assets/laft.gif";
import forst from "../assets/forrest.jpg";
import voll from "../assets/tankvoll.jpg";
import axios from "axios";

const Kurbelview = () => {

    const [isKurbling, setKurbling] = useState<boolean>(false);
    const [isTanking, setTanking] = useState<boolean>(false);
    const [isTankVoll, setTankVoll] = useState<boolean>(false);
    const [isLaufing, setLaufing] = useState<boolean>(false);
    const [sinceWhen, setSinceWhen] = useState<Date | null>(null);


    useEffect(() => {
        getServerStatus().then( ans => {
            setLaufing(ans);

            console.log("Laufing: " + isLaufing);

        if (!ans) {

            statusMc().then(isKurbling => {

                if (isKurbling) {
                    setKurbling(true);
                } else {
                    getOnline().then(setTankVoll);
                }
            })
        }
        });

        

        const timer = setInterval(() => {
            if (isTanking) {
                console.log("checking for onness");
                getOnline().then(oida => {
                    if (oida) { 
                        setTankVoll(true);
                        setTanking(false);
                    }
                })
            }

        }, 10000);

        const longInterval = setInterval(() => {

            if (isKurbling) {
                console.log("checking for laufing");
                getServerStatus().then(setLaufing);;
                setKurbling(false);
            }

        }, 50000);

    }, []);



    const tankVoll = () => {
        if (isLaufing) {
            alert("Server läuft scho!");
            return;
        }
        if (isKurbling) {
            alert("Erklär ma amoi wiest bam Kurbln vulltonkst, donn los i des a zua");
            return;
        }
        if (isTanking) {
            alert("Hawi du tankst scho");
            return;
        }
        if (isTankVoll) {
            alert("Host an Schedlschodn, da Tonk is vull");
            return;
        }

        setTanking(true);

        sendMagic();
    }

    const kurbelAn = () => {
        if (isTanking) {
            alert("Beim Tanken kannst ned kurbeln");
            return;
        }
        if (isKurbling) {
            alert("Du bleda Wichsa kurblst eh scho");
            return;
        }
        if (isLaufing) {
            alert("Die Maschin läuft, da bringt si kurbln nix");
            return;
        }
        if (!isTankVoll) {
            alert("Ohne Tonk nur gstonk!"); 
            return;
        }

        startMinecraft();
        setSinceWhen(new Date);

        setKurbling(true);
    }

    const kurbelAb = () => {
        let willErWirkli = confirm("Hawi, bist da sicha? Zockt da ned no wer?");
        let wirkliwirkli = confirm("Gonz sicha? wonn da server no ned gonz on is kennat des desaströs san!");

        if (!willErWirkli || wirkliwirkli) {
            alert("Gott vagölts da.");
            return;
        }

        stopMinecraft();
        setKurbling(false);
        setLaufing(false);
        setTankVoll(false);
    }


    const getServerStatus = async () => {
        const {data} = await axios.get("https://api.mcsrvstat.us/3/ankurbler.ddns.net");
        console.log("is server running? : " + data.online);
        return data.online;
    }

    const getOnline = async () => {
        const {data} = await axios.get("http://ankurbler.ddns.net:3000/power");
        console.log("is online? : " + data.message);
        return data.message;
    }

    const sendMagic = async () => {
        const {data} = await axios.post("http://ankurbler.ddns.net:3000/start");
        return data.message;
    }

    const startMinecraft = async () => {
        const {data} = await axios.post("http://ankurbler.ddns.net:3000/startmc");
        return data.running;
    }

    const stopMinecraft = async () => {
        const {data} = await axios.post("http://ankurbler.ddns.net:3000/stopmc");
        return data.running;
    }

    const statusMc = async () => {
        const {data} = await axios.get("http://ankurbler.ddns.net:3000/mcstatus");

        return data.on;
    }

    const gifler = () => {
        if (isKurbling) return <img src={kurblGif}></img>;
        else if (isTanking) return <img src={tankGif}></img>;
        else if (isLaufing) return <img src={laftGif}></img>;
        else if (isTankVoll) return <img src={voll}></img>;
        else return <img src={forst}></img>;
    }

    const since = () => {
        if (since != null) {
            const currDate = new Date;
            const diff = currDate.getTime() - (sinceWhen?.getTime() as number);
            return `Kurbling for ${diff.valueOf} milliseconds.`;
        }
    }

    return (<div>
        <h1>Ankurbler</h1>
        
        <br/>

        <button onClick={tankVoll}>Volltanken</button>
        
        <button onClick={kurbelAn}>Ankurblen</button>
        
        {gifler()}

        <button onClick={kurbelAb}>Abkurbeln</button>



    </div>);
}
 
export default Kurbelview;