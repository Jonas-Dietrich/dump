import { useState } from "react";
import kurblGif from "../assets/crank.gif";
import tankGif from "../assets/fillfull.gif";
import laftGif from "../assets/laft.gif";
import forst from "../assets/forrest.jpg";
import axios from "axios";

const Kurbelview = () => {

    const [isKurbling, setKurbling] = useState<boolean>(false);
    const [isTanking, setTanking] = useState<boolean>(false);
    const [isLaufing, setLaufing] = useState<boolean>(false);

    const tankVoll = () => {
        if (isKurbling || isLaufing) alert("Server läuft scho!");
        if (isTanking) alert("Hawi du tankst scho");
        setTanking(true);
    }

    const kurbelAn = () => {
        if (isTanking) alert("Beim Tanken kannst ned kurbeln");
        if (isKurbling) alert("Du bleda Wichsa kurblst eh scho");
        if (isLaufing) alert("Die Maschin läuft, da bringt si kurbln nix");

        setKurbling(true);
    }


    const getServerStatus = () => {
        axios.get("https://api.mcsrvstat.us/3/jondietrich.ddns.net");
    }

    const gifler = () => {
        if (isKurbling) return <img src={kurblGif}></img>;
        else if (isTanking) return <img src={tankGif}></img>;
        else if (isLaufing) <img src={laftGif}></img>;
        else return <img src={forst}></img>
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