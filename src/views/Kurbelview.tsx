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


    useEffect(() => {
        getServerStatus().then(setLaufing);

        if (!isLaufing) {
            getOnline().then(setTankVoll);
        }

        const timer = setInterval(() => {
            if (isTanking) {
                getOnline().then(oida => {
                    if (oida) { 
                        setTankVoll(true);
                        setTanking(false);
                    }
                })
            }

        }, 10000);

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

        setKurbling(true);
    }


    const getServerStatus = async () => {
        const {data} = await axios.get("https://api.mcsrvstat.us/3/jondietrich.ddns.net");
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

    const gifler = () => {
        if (isKurbling) return <img src={kurblGif}></img>;
        else if (isTanking) return <img src={tankGif}></img>;
        else if (isLaufing) return <img src={laftGif}></img>;
        else if (isTankVoll) return <img src={voll}></img>;
        else return <img src={forst}></img>;
    }

    return (<div>
        <h1>Ankurbler</h1>
        
        <br/>

        <button onClick={tankVoll}>Volltanken</button>
        
        <button onClick={kurbelAn}>ankurblen</button>
        
        {gifler()}

    </div>);
}
 
export default Kurbelview;