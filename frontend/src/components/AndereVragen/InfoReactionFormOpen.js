import React, { useState } from 'react';
import styles from '../../Css/ReactionForm.module.css';
import { useNavigate } from 'react-router-dom';


  const IntroPageOpen = () => {
    const navigate = useNavigate();
  
    const handleIntroRead = () => {
      navigate('/reactionformopen');
    };

  return (
    <div className={styles["form-control"]}>
        <div>
          <h1>Wekom!</h1>

<p>U staat op het punt om een omgevingsanalyse van de huidige crisissituatie te maken. Deze analyse is een cruciaal instrument om de externe factoren en invloeden te begrijpen die een impact kunnen hebben op de huidige situatie.</p>

<p>Uw taak is om een systematische evaluatie uit te voeren van de omgevingsfactoren die van invloed kunnen zijn op uw trainingsprogramma. Deze analyse zal u helpen om de huidige stand van zaken te begrijpen en om beter geïnformeerde beslissingen te nemen.</p>

<p>Om u te ondersteunen in dit proces, kunt u gebruik maken van deze app. Deze app is ontworpen om u te begeleiden bij het verkennen van de verschillende elementen van de omgevingsanalyse en om u te helpen de belangrijkste kansen en uitdagingen te identificeren die de situatie kunnen beïnvloeden.</p> 

<p>Terwijl u de app gebruikt, moedigen we u aan om kritisch na te denken, uw aannames uit te dagen en zoveel mogelijk informatie te verzamelen om uw analyse te onderbouwen. Bedenk dat er geen juiste of foute antwoorden zijn. Het doel is om een holistisch en realistisch beeld te krijgen van de externe omgeving.</p>

<p>We wensen u succes en plezier bij het invullen van uw omgevingsanalyse. Mocht u vragen of bedenkingen hebben tijdens dit proces, aarzel dan niet om ons te contacteren. We staan klaar om u te ondersteunen.</p>

          <button className={styles["button"]} onClick={handleIntroRead}>Ga door naar de vragen</button>
        </div>
    </div>
  );
};

export default IntroPageOpen;
