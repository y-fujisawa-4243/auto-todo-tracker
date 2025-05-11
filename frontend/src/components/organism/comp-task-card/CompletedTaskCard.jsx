import style from "./CompletedTaskCard.module.css";

import KebabMenu from "./KebabMenu";

/*MUI*/
import PlayArrowIcon from '@mui/icons-material/PlayArrow'; 
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';


const CompletedTaskCard = () =>{

    return(
        <>
            <div className={style.cardBox}>
                <p>藤澤藤澤藤澤藤澤藤澤藤澤藤澤藤澤藤澤藤澤</p>
                <ul>
                    <li>
                        <button className={style.icon}><PlayArrowIcon/></button>
                    </li>
                </ul>
                <p className={style.timerColor}>01:59:03</p>
                <KebabMenu />
            </div>
        
        </>
    )


}

export default CompletedTaskCard;