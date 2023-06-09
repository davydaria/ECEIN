import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import TextMsg from '../components/textMsg';
import EcrireMsg from '../components/EcrireMsg';
import withAuth from './withAuth';
import { useEffect, useState } from 'react';
import AlertComponent from '@/components/AlertePostule';
import { useRouter } from 'next/router';
import {BsCameraVideo} from 'react-icons/bs';


//fonction 
/*
function chargerMsgs(idamitie){
  //var retour;
  //const [retour, setRetour] = useState([]);

  //récuperer une discussion
    useEffect(() => { 
      const [retour, setRetour] = useState([]);
      //console.log("appel fonction");
      const fetchData = async () => {
        try {
          const me = JSON.parse(localStorage.getItem('user')).id;
          const users_raw = await fetch(`/api/getMsgs?IDENTIFIANT=${me}&FRIENDID=${idamitie}`); //requete SQL selon id co et friendID
          const users = await users_raw.json();
          const users_data = users.results || [];
         
          console.log("taille/ nb msg : "+users_data.length);
      
          // console.log(users_data);
          const updatedUsersData = users_data.map((obj) => {
        
              obj.target_msgid = obj.MESSAGEID;
              obj.target_nummsg = obj.NUMEROMSG;
              obj.target_txt = obj.TEXTE;
              obj.target_userid = obj.USERID;
              obj.target_nom = obj.NOM;
              obj.target_pren = obj.PRENOM;
              obj.target_pfp = obj.PHOTO;
              obj.target_friendid = obj.FRIENDID;
  
              //si le msg est envoyé par la personne connectée
              if(obj.target_userid === me){
                obj.target_sensmsg = 1;//le msg est envoyé par l'utilisateur 
              } else{
                obj.target_sensmsg = 0;//le msg est reçu par l'utilisateur 
              }
              return obj;
          });
          //retour=users_data;
          setRetour(updatedUsersData);
        } catch (error) {
          console.error(error);
        } 
      };
  
    fetchData(); 
    }, [idamitie]);
    console.log("retour "+retour);
    return(retour);
}*/


//****************************************************** page Messagerie *****************************************************************************
 function Messagerie(props) {
  const isAuthenticated = true;
  const router = useRouter(); //pour le zoom

 //pour les discussions
 const [discu, setDiscu] = useState([]);

  //pour une discussion :
  const [content, setContent] = useState([]);
  //console.log(content); 
  const [loading, setLoading] = useState(true);
  const [iduser, setIdUser] = useState(''); 
  const [compt, setCompt] = useState(0);
  const[sensMsg, setSensMsg] = useState(0); //0 ou 1 considere comme msg reçu par defaut

  //info pour envoyer un msg
  // pour --> friendid, nummsg, userid, texte
  const [idamitie, setIdamitie] = useState('');
  const [nummsg, setNummsg] = useState('');
  const [monId, setMonId ] = useState('');
  const [texte, setTexte] = useState('');

  //Pour envoyer un message ***************************************************
  const handleSubmit = async (e) => {
    e.preventDefault();
    //ideamitie, nummsg, userid, texte
    const formData = new FormData(); //genere un form (pas affiche sur la page)
    formData.append('IDamitie', idamitie);
    formData.append('numMsg', nummsg);
    formData.append('monID', monId);
    formData.append('texte', texte);
    const API_ENDPOINT = "/api/sendMsg";
    const request = new XMLHttpRequest();
    request.open("POST", API_ENDPOINT, true);
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        console.log(request.responseText);
        window.location.reload();
      }
    };
   
    console.log(formData);
    request.send(formData);
  };


  //récuperer l'id (numero) de la personne connectée : possible uniquemt pr navigateur (pas serveur)
  //la page s'execute donc cote navigateur 

  //recup une discussion ***************************************************
  var friendid=6;
  useEffect(() => { 
    const fetchData = async () => {
      try {
        const me = JSON.parse(localStorage.getItem('user')).id;
        const users_raw = await fetch(`/api/getMsgs?IDENTIFIANT=${me}&FRIENDID=${friendid}`); //requete SQL selon id co
        const users = await users_raw.json();
        const users_data = users.results || [];
        //console.log("nb users : "+users_data.length);
        setContent(users_data);
        setLoading(false);
        // console.log(users_data);
        users_data.map((obj) => {
      
            obj.target_msgid = obj.MESSAGEID;
            obj.target_nummsg = obj.NUMEROMSG;
            obj.target_txt = obj.TEXTE;
            obj.target_userid = obj.USERID;
            obj.target_nom = obj.NOM;
            obj.target_pren = obj.PRENOM;
            obj.target_pfp = obj.PHOTO;
            obj.target_friendid = obj.FRIENDID;

            //si le msg est envoyé par la personne connectée
            if(obj.target_userid === me){
              //le msg est envoyé par l'utilisateur (et non reçu)
              obj.target_sensmsg = 1;
              //console.log("msg envoye par util :"+obj.target_userid);
            }
            else{
              obj.target_sensmsg = 0;
            }
            setIdamitie(obj.target_friendid);
            setNummsg(obj.target_nummsg +1);
            setMonId(me);
            //et le txt sera ecrit apres
        });
        setContent(users_data);
        //console.log("taille sortie :"+users_data.length);
        //console.log("donneeeeeeeeeeeeeeeeeees :"+users_data);
        //console.log("fin log");
      } catch (error) {
        console.error(error);
      } 
    };

    fetchData(); 
  }, []); 


  console.log("AAA id amis"+idamitie);

  //récuperer les discussions *************************************************
  useEffect(() => { 
    const fetchData = async () => {
      try {
        const me = JSON.parse(localStorage.getItem('user')).id;
        const discs_raw = await fetch(`/api/getDiscussions?IDENTIFIANT=${me}`); //requete SQL selon id co
        const discs = await discs_raw.json();
        const discs_data = discs.results || [];
        //console.log("nb users : "+users_data.length);
        setDiscu(discs_data);
        setLoading(false);
        // console.log(users_data);
        discs_data.map((obj) => {

            obj.target_friendid = obj.FRIENDID;
            obj.target_us = obj.USERID1;
            //obj.target_us2 = obj.USERID2;
            obj.target_pseudo = obj.PSEUDO;
           
            if (obj.target_us === me) { //recup l'id de l'ami (et pas le sien)
              obj.target_us = obj.USERID2;
            }

        });
        setDiscu(discs_data);

      } catch (error) {
        console.error(error);
      } 
    };

    fetchData(); 
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <>
      <Head>
        <title> Messagerie | ECE In </title>
      </Head>

      <Layout>

        <h1 className="m-5 text-5xl font-bold mt-6">
          Messagerie
        </h1>
        
        <div className='my-9 grid grid-cols-3 gap-x-2 justify-items-center'>
          {/** Les discussions */}
          <div className='space-y-4 w-4/6 mx-auto bg-base-300 rounded-lg shadow-md'>
            <div className="mt-4 mx-2 rounded-md badge-primary"> <center> Vos discussions : </center> </div>
            <div className="mx-1">
              {/**afficher tous ses amis/discussions */}
              {discu.map((dis) => (
                   <div className="m-2 btn btn-outline flex" onClick={alert}> {dis.target_pseudo} </div> 
              ))}
             
            </div>
          </div>

          {/**  setContent( chargerMsgs(6) */ }

          {/** Zone d'une discussion  */}
           <div className='space-y-4 col-span-2 w-5/6 mx-auto bg-base-300 rounded-lg shadow-md'>
             
              {/* Fonction d'affichage remplie avec les résultats de la requete SQL dans api/getMsgs.js */}
              {content.map((msg) => (
                <TextMsg
                  texte = {msg.target_txt}
                  nomdest = {msg.target_pren +" "+ msg.target_nom}  
                  pfpdest = {msg.target_pfp}
                  recu0envoye1 = {msg.target_sensmsg} // 0 ou 1 
                />  
                ))} 

              {/**<EcrireMsg/>*/}
              {/* Zone envoi msg */}
              <div className="m-4 mt-4 max-w-lg mx-auto">
                <button  onClick={()=>router.push('https://us05web.zoom.us/j/86825653047?pwd=YzJiS0UvcXRGdTViUDNmM3V5OXB6Zz09')} className="btn btn-primary m-1"><BsCameraVideo/></button>
                <input type="text" placeholder="Type here" className="input input-bordered input-primary w-2/4 max-w-lg m-1" onChange={(e) => setTexte(e.target.value)} />
                <button className="btn btn-outline btn-primary m-1"  onClick={handleSubmit} >Envoyer</button>
              </div>

           </div>
            


        </div>


      

      </Layout>   
    </>
  ); 
}

export default withAuth(Messagerie)