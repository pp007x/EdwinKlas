using LoginApi.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using UserContext = LoginApi.Data.UserContext;
public class DatabaseSeeder
{
    private readonly UserContext dbContext;

    public DatabaseSeeder(UserContext dbContext)
    {
        this.dbContext = dbContext;
    }

public void SeedData()
{
    SeedCompanies();
    SeedOnderwerpen();
    SeedQuestions();
    SeedUsers();
    SeedTotalScores();
    SeedQuestionOpen();
    SeedAnswerOpen();
    SeedLinks();
}

    private void SeedCompanies()
    {
        var companies = new List<Company>
        {
            new Company
            {
                Id = 1,
                Name = "Company 1",
                Description = "Description 1",
                Code = "1",
                CompanyType = 1
            },
            new Company
            {
                Id = 2,
                Name = "Company 2",
                Description = "Description 2",
                Code = "2",
                CompanyType = 1
            },
            new Company { Id = 3, Name = "Company 3", Description = "Description 3", Code = "3", CompanyType = 2 },
        };

        dbContext.Companies.AddRange(companies);
        dbContext.SaveChanges();
    }

private void SeedOnderwerpen()
{
    var onderwerpen = new List<Onderwerp>
    {
        new Onderwerp
        {
            Id = 1,
            Name = "Analyticus",
            Description = "Het Analyticus-profiel in de DISC-methodiek is gekenmerkt door zijn unieke sterke punten en potentiële uitdagingen. Aan de ene kant staan ze bekend om hun nauwgezetheid en detailgerichtheid, wat resulteert in werk van hoge kwaliteit. Ze worden ook geprezen voor hun grondige besluitvorming, gebaseerd op feiten en data, wat leidt tot weloverwogen en betrouwbare uitkomsten. Hun georganiseerde en gestructureerde aanpak draagt bij aan efficiëntie en consistentie in hun taken, en hun streven naar perfectie zorgt ervoor dat ze aan de hoogste standaarden voldoen. Bovendien zijn ze geduldig en volhardend, in staat om zich langdurig te concentreren en zich niet gemakkelijk te laten ontmoedigen door tegenslagen. <br><br> Echter, zoals elk DISC-profiel, heeft het Analyticus-profiel ook zijn uitdagingen. Ze hebben de neiging tot over-analyseren, wat kan leiden tot besluiteloosheid of vertragingen bij snelle beslissingen. Hun voorkeur voor structuur en regels kan soms resulteren in weerstand tegen verandering en aanpassingsproblemen aan nieuwe situaties. Daarnaast kunnen ze, vanwege hun hoge standaarden en detailgerichtheid, moeite hebben met het delegeren van taken. Hun gereserveerde en privé-aard kan hen soms minder sterk maken in sociale interacties, waardoor ze als afstandelijk of onpersoonlijk kunnen overkomen. Tot slot kan hun streven naar perfectie, hoewel het bijdraagt aan de kwaliteit van het werk, soms leiden tot onnodige stress en een onbalans tussen werk en privé. <br><br> Het is belangrijk om te benadrukken dat geen enkel DISC-profiel beter of slechter is dan een ander. Elk heeft zijn eigen sterke punten en uitdagingen. Het herkennen en op de juiste manier inzetten van deze verschillende stijlen is cruciaal voor effectieve samenwerking en persoonlijke groei."
        },
        new Onderwerp
        {
            Id = 2,
            Name = "Strateeg",
            Description = "Het Strateeg-profiel in de DISC-methodiek is een unieke combinatie van dominantie en consciëntieusheid. Strateeg-profielen zijn resultaatgericht en gedreven, en zetten hun analytische vaardigheden in om logisch en methodisch problemen te benaderen. Ze houden altijd het einddoel in gedachten, anticiperen op mogelijke uitdagingen, en maken doordachte beslissingen. Hun besluitvaardigheid en bereidheid om risico's te nemen als het waardevolle resultaten kan opleveren, maken hen tot sterke leiders. Bovendien waarderen ze hun onafhankelijkheid en hebben ze weinig begeleiding of goedkeuring van anderen nodig om hun werk te doen. <br><br> Maar zoals alle profielen, komt het Strateeg-profiel met zijn eigen reeks aandachtspunten. Hun vastberadenheid kan soms overkomen als onbuigzaamheid, omdat ze vasthouden aan hun plannen en methodes zelfs wanneer flexibiliteit gevraagd wordt. Hun sterke drang om resultaten te behalen kan dominant of controlerend overkomen, en hun zelfstandigheid kan het moeilijk maken om effectief samen te werken met anderen. Bovendien kunnen hun hoge verwachtingen en standaarden soms overweldigend zijn voor degenen om hen heen. Ten slotte lopen ze het risico op uitputting, omdat hun constante streven naar resultaten kan leiden tot overbelasting en stress. <br><br> Het is belangrijk om te benadrukken dat, hoewel het Strateeg-profiel uitdagingen met zich meebrengt, deze niet noodzakelijkerwijs negatief zijn. Ze zijn simpelweg gebieden waar bewustzijn en begrip kunnen leiden tot persoonlijke groei en effectievere interacties met anderen. Elk DISC-profiel heeft zijn unieke sterke punten en aandachtspunten, en het Strateeg-profiel is geen uitzondering. Met erkenning en beheersing van deze eigenschappen, kan het Strateeg-profiel enorm waardevol zijn in vele situaties."
        },
        new Onderwerp
        {
            Id = 3,
            Name = "Perfectionist",
            Description = "Het Perfectionist-profiel binnen de DISC-methodiek, vaak geassocieerd met de Consciëntieus-dimensie, biedt een unieke mix van eigenschappen. Perfectionisten zijn doorgaans nauwgezet, gedetailleerd en zorgvuldig, waarbij nauwkeurigheid een kernwaarde in hun werk is.<br><br>De kracht van Perfectionisten ligt in hun uitzonderlijke oog voor detail, waarbij ze streven naar perfectie in alles wat ze doen. Ze staan bekend om hun consistente levering van hoogwaardig werk en hebben de neiging om logische en methodische benaderingen te hanteren bij het oplossen van problemen en uitdagingen. Deze analytische mindset, gekoppeld aan hun betrouwbaarheid en consistentie, maakt hen een waardevolle schakel in elk team. Bovendien is hun doorzettingsvermogen bewonderenswaardig, ze zetten door totdat een taak volledig voldoet aan hun hoge normen.<br><br>Tegelijkertijd kan het streven naar perfectie leiden tot enkele uitdagingen. Perfectionisten kunnen moeite hebben met delegeren, uit angst dat het werk niet aan hun hoge standaarden voldoet. Ze lopen ook het risico verlamd te raken door analyse, waarbij ze te veel tijd besteden aan het in detail onderzoeken van problemen en uitdagingen, wat tot vertraging kan leiden. Hun voorkeur voor gevestigde routines en methoden kan weerstand tegen verandering veroorzaken, en hun hoge normen kunnen ertoe leiden dat ze overdreven kritisch zijn, zowel voor zichzelf als voor anderen. Bovendien kunnen ze door hun streven naar perfectie het risico lopen op overwerk en stress.<br><br>Hoewel deze uitdagingen potentieel belemmerend kunnen zijn, kunnen ze, wanneer ze worden herkend en goed beheerd, omgezet worden in gebieden van groei en verbetering. Het belangrijkste is om de sterke punten van het Perfectionist-profiel te waarderen en te benutten, terwijl men zich bewust is van de mogelijke valkuilen en deze proactief aanpakt. Zo kunnen Perfectionisten hun unieke vaardigheden optimaal benutten, terwijl ze werken aan hun ontwikkelingsgebieden."
        },

        new Onderwerp
        {
            Id = 4,
            Name = "Raadgever",
            Description = "Het Raadgever-profiel binnen de DISC-methodiek is nauw verbonden met de dimensies 'Invloed' en 'Stabiliteit'. De mensen die zich met dit profiel identificeren, zijn vaak sterk communicatief, sociaal ingesteld en richten zich op harmonie en samenwerking. Ze onderscheiden zich door hun uitmuntende communicatieve vaardigheden, die hen in staat stellen hun ideeën en gevoelens op een effectieve manier over te brengen. Als ware teamspelers koesteren ze de waarde van samenwerking en zijn ze bedreven in het creëren van harmonie binnen een groep. Hun empathische aard stelt hen in staat om zich diep in te leven in anderen, begrip te hebben voor hun gevoelens en behoeften. Daarbij zijn ze van nature ondersteunend en bieden ze graag hulp en advies aan degenen die dat nodig hebben. Raadgevers waarderen consistentie en stabiliteit, wat hen tot evenwichtige en betrouwbare individuen maakt. <br><br>Ondanks deze krachtige kwaliteiten heeft het Raadgever-profiel ook een aantal aandachtspunten. Zo hebben ze de neiging om conflicten te vermijden vanwege hun verlangen naar harmonie, wat kan resulteren in onopgeloste problemen. Vanwege hun sociale aard hechten ze soms te veel waarde aan de goedkeuring van anderen, wat hun zelfstandigheid kan beïnvloeden. Verder kunnen ze moeite hebben met veranderingen, omdat ze stabiliteit en routine waarderen. Besluiteloosheid kan ook een struikelblok zijn, vooral wanneer ze vrezen dat hun beslissing iemand anders zou kunnen kwetsen of van streek maken. Tot slot kunnen ze het moeilijk vinden om kritiek te ontvangen vanwege hun gevoelige aard.<br><br> Hoewel het Raadgever-profiel zijn uitdagingen kent, zijn de sterke punten ervan significant en waardevol. Het belangrijkste is om te leren hoe je de sterke punten van dit profiel kunt maximaliseren, terwijl je tegelijkertijd de potentiële valkuilen herkent en beheerst."
        },
        new Onderwerp
        {
            Id = 5,
            Name = "Pionier",
            Description = "Het Pioneer-profiel in de DISC-methodiek, geïdentificeerd door hoge scores op de Dominantie- en Invloed-dimensies, kenmerkt personen die energiek, avontuurlijk en innovatief zijn. Deze individuen zijn moedige leiders, altijd klaar om risico's te nemen als het resultaat de inzet waard lijkt. Hun enthousiasme en passie maken hen tot inspirerende figuren die anderen kunnen mobiliseren en motiveren. Flexibiliteit is een andere sterke eigenschap van de Pioneer, waardoor ze gemakkelijk kunnen navigeren in onzekere situaties en zich kunnen aanpassen aan veranderingen. Hun charisma helpt hen bij het opbouwen van relaties en het uitoefenen van invloed op anderen.<br><br> Toch heeft het Pioneer-profiel ook aandachtspunten die beheerd moeten worden. Hun hang naar actie kan hen soms impulsief maken, handelend zonder grondige overweging van mogelijke gevolgen. Terwijl ze gericht zijn op het grote geheel, kunnen ze de kleine, maar cruciale details over het hoofd zien, wat tot fouten kan leiden. Pioneers zijn ook geneigd om flexibiliteit en verandering te omarmen, waardoor ze voor anderen onvoorspelbaar kunnen overkomen. Routinematige taken of langdurige projecten kunnen hen frustreren of vervelen. Tenslotte kan hun bereidheid om risico's te nemen soms overgaan in overmoed, waardoor ze zich in potentieel gevaarlijke situaties kunnen bevinden. <br><br>Ondanks deze uitdagingen, biedt het Pioneer-profiel aanzienlijke sterke punten die, indien effectief benut, aanzienlijke voordelen kunnen bieden. Het is belangrijk om zowel de sterke punten als de mogelijke valkuilen van dit profiel te herkennen en te leren beheren, om zo optimaal te profiteren van de unieke capaciteiten van de Pioneer."
        },
        new Onderwerp
        {
            Id = 6,
            Name = "Beslisser",
            Description = "Het Beslisser-profiel, gekenmerkt binnen de DISC-methodiek, is een direct en gedreven archetype dat geassocieerd wordt met de Dominant-dimensie. Mensen met dit profiel staan bekend om hun vermogen om snel en effectief beslissingen te nemen, waardoor ze uitblinken in het doorhakken van knopen met een minimale hoeveelheid informatie. Met een sterk resultaatgerichte instelling werken Beslissers vastberaden naar hun doelen toe. Ze zijn zelfverzekerd en deinsen niet terug voor het aangaan van uitdagingen of het uiten van hun mening. Hun onafhankelijkheid stelt hen in staat om zelfstandig te werken zonder afhankelijk te zijn van de goedkeuring van anderen, terwijl hun natuurlijke leiderschapscapaciteiten hen in staat stellen om anderen te motiveren.<br><br> Echter, zoals elk profiel, heeft de Beslisser ook bepaalde uitdagingen te overwinnen. De snelheid waarmee ze beslissingen nemen, kan leiden tot impulsiviteit en haastige handelingen zonder voldoende overweging van de mogelijke gevolgen. Hun krachtige dominantie kan soms anderen afschrikken of intimideren. Het kan hen ook moeite kosten om empathie te tonen of de gevoelens van anderen te begrijpen. Hoewel hun bereidheid om risico's te nemen bewonderenswaardig kan zijn, kan dit ook leiden tot onverantwoord of roekeloos gedrag. Bovendien kunnen ze moeite hebben met het ontvangen van kritiek, wat soms defensieve reacties kan uitlokken.<br><br> Ondanks deze uitdagingen biedt het Beslisser-profiel aanzienlijke sterke punten die, indien correct benut en beheerd, kunnen bijdragen aan succesvolle individuele en teamresultaten. Het is cruciaal voor Beslissers om hun sterke punten te erkennen en te optimaliseren, en tegelijkertijd bewust te zijn van hun potentiele valkuilen om deze effectief te beheren."
        },
        new Onderwerp
        {
            Id = 7,
            Name = "Doorzetter",
            Description = "Het Doorzetter-profiel in de DISC-methodiek vertegenwoordigt individuen die bekend staan om hun betrouwbaarheid, systematiek, en geduld. Deze profielen scoren doorgaans hoog op de Steadiness (Stabiliteit)- en Conscientiousness (Consciëntieus)-dimensies. Ze zijn kenmerkend voor hun consistentie en gedegenheid in het werk, met een sterke focus op kwaliteit en aandacht voor detail. Doorzetters tonen een hoge tolerantie voor repetitief werk en zijn in staat lange periodes te besteden aan het voltooien van taken zonder tekenen van verveling of ongeduld. Dit is een weerspiegeling van hun toewijding en vasthoudendheid om door te gaan tot een taak volledig is voltooid, ongeacht de uitdagingen die ze tegenkomen.<br><br> Hun evenwichtige en rustige natuur, zelfs onder druk, samen met hun voorkeur voor routine en voorspelbaarheid, dragen verder bij aan hun betrouwbaarheid. Echter, deze sterke focus op stabiliteit kan leiden tot weerstand tegen verandering, wat een uitdaging kan zijn bij het aanpassen aan nieuwe situaties. Evenzo kan hun gedetailleerdheid en focus op kwaliteit het moeilijk maken voor hen om taken te delegeren. Doorzetters nemen vaak hun tijd om beslissingen te nemen, gedetailleerde analyses uit te voeren voordat ze handelen, wat kan leiden tot mogelijke vertragingen. Ze kunnen het ook moeilijk vinden om kritiek te accepteren en persoonlijk worden beïnvloed door negatieve feedback. En ten slotte, hun sterke toewijding aan het werk kan hen soms ertoe leiden zichzelf te overwerken.<br><br> Ondanks deze uitdagingen, bieden de sterke punten van de Doorzetter waardevolle en cruciale bijdragen aan vele professionele omgevingen. Door hun unieke talenten effectief te benutten en bewust te zijn van hun mogelijke valkuilen, kunnen Doorzetters optimaal bijdragen aan hun teams en organisaties. Met de juiste strategieën om hun uitdagingen te beheren, kunnen ze hun potentieel ten volle benutten en een betrouwbare, vasthoudende kracht blijven binnen hun werkomgeving."
        },
        new Onderwerp
        {
            Id = 8,
            Name = "Avonturier",
            Description = "Het Avonturier-profiel binnen de DISC-methodiek kenmerkt zich door hoge scores op de Dominantie- en Invloed-dimensies, wat zich uit in een energieke en enthousiaste persoonlijkheid die altijd klaarstaat voor de volgende uitdaging of het volgende avontuur. Avonturiers zijn van nature open voor nieuwe ervaringen. Ze zijn vaak de pioniers die nieuwe ideeën of activiteiten introduceren, aangedreven door hun hoge energieniveau dat hen in staat stelt anderen te motiveren en inspireren. Dankzij hun flexibiliteit zijn ze in staat zich snel aan te passen aan veranderingen en nieuwe situaties. Hun moed wordt weerspiegeld in hun bereidheid om risico's te nemen en buiten hun comfortzone te stappen, en hun sociale vaardigheden stellen hen in staat om gemakkelijk relaties met anderen op te bouwen.<br><br> Echter, deze impulsieve zucht naar avontuur kan soms leiden tot het nemen van beslissingen zonder volledige overweging van de gevolgen. Ze kunnen ook worstelen met routine of gestructureerd werk, waarbij ze zich kunnen gaan vervelen als ze zich niet voldoende uitgedaagd voelen. Een ander potentieel struikelblok is een gebrek aan focus; ze kunnen gemakkelijk worden afgeleid, vooral als ze iets spannender of interessanter waarnemen. Bovendien kunnen Avonturiers, omdat ze de neiging hebben om in het moment te leven, moeite hebben met langetermijnplanning. <br><br>Ondanks deze uitdagingen biedt het Avonturier-profiel vele sterke punten die, mits op de juiste manier benut en beheerd, kunnen bijdragen aan het succes van zowel het individu als het team. Door de positieve aspecten van dit profiel te omarmen en tegelijkertijd strategieën te ontwikkelen om de potentiële valkuilen te beheren, kunnen Avonturiers hun unieke kwaliteiten volledig benutten."
        },
        new Onderwerp
        {
            Id = 9,
            Name = "Specialist",
            Description = "Specialisten, zoals gedefinieerd in de DISC-methodiek, schitteren in hun unieke combinatie van analytisch inzicht, precisie en methodisch handelen. Hun toewijding aan hun expertisegebied weerspiegelt zich in een diepgaande kennis die vaak wordt gezocht voor technische of complexe vraagstukken. Met hun gerichtheid op details en consistent hoge kwaliteit van werk, winnen ze het vertrouwen van hun collega's. Ze tonen ook sterke analytische vaardigheden bij het ontleden van problemen en het vinden van oplossingen, en ze werken zelfstandig en zelfgemotiveerd, wat hun betrouwbaarheid verder versterkt.<br><br> Echter, zoals bij elk profiel, komen er met deze sterke punten ook bepaalde uitdagingen. Hun oog voor detail kan omslaan in perfectionisme, wat stress en vertragingen kan veroorzaken. Ze kunnen ook moeite hebben met het delegeren van taken, omdat ze willen dat dingen op een specifieke manier worden gedaan. Bovendien kunnen ze weerstand bieden tegen veranderingen die hun werkprocedures of routines verstoren. Het kan ook zijn dat sociale interacties of het opbouwen van relaties minder natuurlijk voor hen aanvoelen, omdat hun focus voornamelijk op hun werk en taken ligt.<br><br> Ondanks deze potentiële valkuilen, biedt het Specialist-profiel belangrijke voordelen. Door het erkennen van deze uitdagingen en het ontwikkelen van strategieën om deze aan te pakken, kunnen Specialisten hun unieke talenten effectief benutten en hun cruciale rol in hun teams en organisaties versterken. Hun inzicht, betrouwbaarheid en diepgaande kennis vormen een waardevol fundament voor elke professionele omgeving."
        },
        new Onderwerp
        {
            Id = 10,
            Name = "Doener",
            Description = "Binnen de DISC-methodiek staat het Doener-profiel bekend om zijn verbinding met de Dominant-dimensie. Als energieke, praktische en resultaatgerichte individuen, genieten Doeners ervan om doelen te bereiken en tastbare resultaten te zien. Ze zijn altijd klaar om in actie te komen, ze houden ervan om betrokken te zijn en zijn nooit bang om hun handen vuil te maken. Ze streven naar resultaten, werken hard en stoppen niet totdat hun doelen bereikt zijn. Daarnaast zijn ze zelfverzekerd en durven ze de leiding te nemen, terwijl hun flexibiliteit hen in staat stelt zich aan te passen en open te staan voor veranderingen die hen helpen hun doelen te bereiken. Hun energie en enthousiasme werken aanstekelijk, wat hen de kracht geeft om anderen te inspireren en te motiveren.<br><br> Echter, met deze sterke punten komen ook een aantal uitdagingen. Door hun actiegerichte aard kunnen Doeners soms impulsieve beslissingen nemen zonder grondig na te denken over de mogelijke gevolgen. Ze kunnen ongeduldig zijn, streven naar een snel resultaat, wat soms kan leiden tot overhaaste beslissingen. Bovendien kunnen ze de neiging hebben om over details heen te kijken, in plaats van zich te concentreren op het grotere geheel. Hun sterke wil en zelfvertrouwen kunnen soms als dominant of controlerend worden ervaren door anderen. Ondanks deze mogelijke valkuilen heeft het Doener-profiel veel te bieden. Hun energie, daadkracht en flexibiliteit maken hen een waardevolle toevoeging aan elk team of organisatie. Door bewust te zijn van hun uitdagingen en strategieën te ontwikkelen om deze te beheren, kunnen Doeners hun sterke punten optimaal benutten, terwijl ze hun zwakke punten minimaliseren."
        },
        new Onderwerp
        {
            Id = 11,
            Name = "Dienstverlener",
            Description = "In de DISC-methodiek is het Dienstverlener-profiel typisch verbonden aan de Steadiness (Stabiliteit) en Invloed-dimensies. De Dienstverlener kenmerkt zich als coöperatief, ondersteunend en gericht op de behoeften van anderen. Deze personen zijn vaak de ruggengraat van een team, betrouwbaar en consistent in hun werk. Ze hebben een natuurlijke gave om te zorgen voor anderen en zetten vaak de behoeften van anderen voor hun eigen behoeften. Met hun sterke communicatieve vaardigheden luisteren ze aandachtig en tonen begrip voor de zorgen en wensen van anderen.<br><br> Echter, de Dienstverlener kan soms moeite hebben met assertiviteit, aangezien hun focus op de behoeften van anderen hen kan belemmeren om voor hun eigen belangen op te komen. Ze neigen naar het vermijden van conflicten en kunnen confrontaties moeilijk vinden. Door hun sterke drang om anderen te dienen, kunnen ze zichzelf soms verwaarlozen en het risico lopen op burn-out. Bovendien kan hun overgevoeligheid voor kritiek een uitdaging zijn, aangezien ze de neiging hebben om kritiek persoonlijk op te vatten en moeite kunnen hebben met het omgaan met negatieve feedback.<br><br> Ondanks deze uitdagingen biedt het Dienstverlener-profiel waardevolle sterke punten. Dienstverleners zijn loyale en betrouwbare teamleden die in staat zijn om effectief te communiceren en anderen te ondersteunen. Bewustwording van mogelijke valkuilen, gecombineerd met strategieën om deze te beheren, kunnen hen helpen om hun unieke talenten optimaal te benutten en te floreren in hun rol."
        },
        new Onderwerp
        {
            Id = 12,
            Name = "Helper",
            Description = "Het Helper-profiel in de DISC-methodiek vertegenwoordigt warmte, ondersteuning en samenwerking. Helpers zijn empathisch en betrokken bij anderen, met een sterke focus op het creëren van harmonie en het bieden van ondersteuning.<br><br> Als Helpers hebben ze de unieke gave om de gevoelens van anderen te begrijpen en hier op een empathische manier op te reageren. Ze zijn betrouwbare teamleden die uitblinken in samenwerking en een sterke toewijding tonen aan hun werk en team. Helpers zijn vaak degenen die ervoor zorgen dat teams bij elkaar blijven en de sfeer harmonieus blijft.<br><br> Echter, Helpers moeten ook aandacht besteden aan enkele valkuilen. Ze kunnen moeite hebben met assertiviteit en kunnen het moeilijk vinden om voor zichzelf op te komen. Ze hebben de neiging om conflicten te vermijden en kunnen soms overweldigd worden door confrontaties. Bovendien moeten Helpers alert zijn op de mogelijkheid om uitgebuit te worden door anderen, aangezien hun behoefte om te helpen soms kan worden misbruikt.<br><br> Desondanks biedt het Helper-profiel talloze sterke punten. De empathie en betrouwbaarheid van Helpers maken hen waardevolle teamleden en hun vermogen om harmonie te creëren is van onschatbare waarde. Door zich bewust te zijn van hun valkuilen en actief te werken aan strategieën om hiermee om te gaan, kunnen Helpers hun unieke talenten ten volle benutten."
        },
        new Onderwerp
        {
            Id = 13,
            Name = "Diplomaat",
            Description = "Het Diplomaat-profiel in de DISC-methodiek belichaamt de eigenschappen van vriendelijkheid, geduld en harmoniegerichtheid. Diplomaten hebben een natuurlijke neiging om sterke relaties op te bouwen en samenwerking te bevorderen. Hun empathie stelt hen in staat om zich in anderen in te leven en begrip te tonen voor hun gevoelens en standpunten. Diplomaten zijn uitstekende luisteraars, waardoor ze anderen met oprechte aandacht kunnen horen en begrijpen.<br><br> Met een focus op harmonie streven Diplomaten naar een vreedzame omgeving waarin conflicten worden vermeden of opgelost. Ze zijn bereid zich aan te passen aan veranderende omstandigheden en staan open voor verschillende perspectieven en ideeën. Diplomaten worden gewaardeerd vanwege hun betrouwbaarheid, loyaal gedrag en vermogen om afspraken en verantwoordelijkheden na te komen.<br><br> Hoewel Diplomaten sterke punten hebben, zijn er ook aandachtspunten waar ze zich bewust van moeten zijn. Hun verlangen naar harmonie kan ertoe leiden dat ze conflicten vermijden, wat kan resulteren in onopgeloste problemen. Ze kunnen het moeilijk vinden om nee te zeggen of hun eigen behoeften uit te drukken, uit angst anderen teleur te stellen. Diplomaten hechten vaak waarde aan de mening en goedkeuring van anderen, wat invloed kan hebben op hun besluitvorming. Soms kunnen ze hun eigen behoeften opofferen om anderen tevreden te stellen, wat kan leiden tot onbalans en frustratie.<br><br> Desondanks biedt het Diplomaat-profiel belangrijke sterke punten die van onschatbare waarde zijn in teams en relaties. Met hun empathie, luistervaardigheden en focus op harmonie kunnen Diplomaten een positieve invloed uitoefenen op hun omgeving. Door zich bewust te zijn van hun mogelijke valkuilen en strategieën te ontwikkelen om deze te beheren, kunnen Diplomaten hun unieke talenten optimaal benutten en een sfeer van begrip, samenwerking en harmonie creëren."
        },
        new Onderwerp
        {
            Id = 14,
            Name = "Inspirator",
            Description = "Het Inspirator-profiel in de DISC-methodiek belichaamt de kracht van motivatie en inspiratie. Inspiratoren zijn geboren leiders met een natuurlijke charme en enthousiasme die anderen moeiteloos aantrekken. Ze hebben het vermogen om anderen te motiveren en te stimuleren om hun volledige potentieel te bereiken. Hun creatieve denkwijze en brede perspectieven brengen vernieuwende ideeën en frisse energie in elke situatie.<br><br> Als uitstekende communicatoren zijn Inspiratoren in staat om hun gedachten en ideeën helder en overtuigend over te brengen. Ze begrijpen dat succes afhankelijk is van effectieve samenwerking en moedigen anderen aan om als een hecht team te werken, waardoor de kans op gezamenlijke successen wordt vergroot. Bovendien zijn Inspiratoren teamspelers die anderen aanmoedigen en ondersteunen om hun doelen te bereiken.<br><br> Hoewel Inspiratoren veel sterke punten hebben, zijn er ook aandachtspunten om in gedachten te houden. Soms kunnen ze moeite hebben om zich op één specifiek doel of taak te concentreren, omdat hun enthousiasme hen naar verschillende interessante mogelijkheden trekt. Daarnaast is het belangrijk voor Inspiratoren om realistische verwachtingen te stellen en de juiste balans te vinden tussen enthousiasme en haalbaarheid.<br><br> Een andere uitdaging kan zijn dat Inspiratoren zich snel kunnen vervelen als ze niet genoeg uitdagingen ervaren. Daarom is het essentieel voor hen om zich voortdurend te laten inspireren en nieuwe doelen na te streven. Hoewel ze vaak de grote lijnen zien, kan het voor Inspiratoren een uitdaging zijn om zich op details te concentreren. Het is belangrijk voor hen om de juiste balans te vinden tussen het grotere geheel en de cruciale details.<br><br> Al met al biedt het Inspirator-profiel een waardevolle mix van motivatie, charisma en creativiteit. Met bewustzijn van hun sterke punten en aandacht voor mogelijke valkuilen kunnen Inspiratoren anderen inspireren en de positieve energie binnen een team versterken. Ze hebben de potentie om visionaire leiders te zijn die anderen inspireren om het beste uit zichzelf te halen en samen te werken aan buitengewone resultaten."
        },
        new Onderwerp
        {
            Id = 15,
            Name = "Bemiddelaar",
            Description = "Het Bemiddelaar-profiel binnen de DISC-methodiek wordt geassocieerd met vriendelijkheid, geduld en een natuurlijke vaardigheid om conflicten op te lossen en harmonie te bevorderen.<br><br> Bemiddelaars hebben een unieke gave om anderen te verbinden en positieve relaties op te bouwen. Ze streven naar harmonie en vreedzame oplossingen, waarbij ze in staat zijn om verschillende perspectieven en gevoelens te begrijpen en te respecteren. Met hun empathie en vermogen om te luisteren zonder te oordelen, kunnen ze anderen effectief ondersteunen.<br><br> Als teamspelers zijn Bemiddelaars in staat om samenwerking te stimuleren en anderen aan te moedigen om samen naar gemeenschappelijke doelen te streven. Ze brengen een diplomatieke en tactvolle benadering in complexe situaties, waarbij ze zoeken naar oplossingen die voor alle betrokken partijen acceptabel zijn.<br><br> Hoewel Bemiddelaars veel sterke punten hebben, zijn er ook uitdagingen waar ze bewust van moeten zijn. Ze kunnen de neiging hebben om conflicten te vermijden of confrontaties uit de weg te gaan, waardoor problemen onopgelost blijven. Het uiten van hun eigen behoeften en standpunten kan moeilijk zijn, omdat ze vaak de harmonie willen behouden. Soms gaan ze te ver in hun toegeeflijkheid en kunnen ze hun eigen belangen verwaarlozen. Het is belangrijk dat Bemiddelaars zichzelf niet overbelasten door voortdurend de behoeften van anderen boven die van henzelf te stellen.<br><br> Ondanks deze uitdagingen kunnen Bemiddelaars een waardevolle rol spelen in het oplossen van conflicten en het bevorderen van samenwerking. Met hun diplomatieke aanpak en focus op harmonie kunnen ze bijdragen aan een positieve en harmonieuze werkomgeving. Door zich bewust te zijn van hun valkuilen en strategieën te ontwikkelen om hiermee om te gaan, kunnen Bemiddelaars hun unieke talenten effectief benutten en een positieve impact hebben op anderen."
        },
        new Onderwerp
        {
            Id = 16,
            Name = "Entertainer",
            Description = "Entertainers zijn de sprankelende sterren die de wereld om hen heen verlichten. Met hun onuitputtelijke energie en natuurlijke charme weten ze anderen te betoveren en te inspireren. Als meesterlijke communicatoren brengen ze hun boodschap met flair en enthousiasme over, waardoor ze anderen in beweging kunnen brengen.<br><br> Met een creatieve geest en een levendige verbeelding zijn Entertainers in staat om unieke ideeën te bedenken die anderen verrassen en inspireren. Ze floreren in teamomgevingen, waar ze als teamspelers anderen betrekken en een gevoel van saamhorigheid creëren.<br><br> Hoewel Entertainers de sterren van de show zijn, zijn ze zich ook bewust van hun aandachtspunten. Ze streven soms te veel naar erkenning en goedkeuring van anderen, wat hun eigenwaarde kan beïnvloeden. Hun enthousiasme kan er ook voor zorgen dat ze moeite hebben om zich op één taak of doel te concentreren, en ze hebben soms moeite met het beheersen van details.<br><br> Ondanks deze uitdagingen biedt het Entertainer-profiel een unieke set sterke punten die anderen in vervoering brengen. Met hun energie, creativiteit en charisma kunnen Entertainers anderen vermaken en een positieve impact hebben op de sfeer en dynamiek binnen een team of organisatie. Door zich bewust te zijn van hun valkuilen en strategieën te ontwikkelen om deze te beheren, kunnen Entertainers hun unieke talenten optimaal benutten en blijven schitteren als de stralende sterren die ze zijn."
        },
        new Onderwerp {
            Id = 17,
            Name = "Welkom!",
            Description = "Welkom bij de ontdekkingsreis naar uw unieke DISC-profiel. DISC is een krachtig en breed erkend psychometrisch instrument dat u helpt bij het begrijpen van uw persoonlijke werkstijl, communicatievoorkeuren en gedragspatronen. Dit inzicht kan u helpen effectiever te worden in uw persoonlijke en professionele leven, door de manier waarop u omgaat met anderen te verbeteren en door uzelf beter te begrijpen.<br></br>Het DISC-model classificeert individuen op basis van vier primaire gedragsstijlen: Dominantie (D), Invloed (I), Stabiliteit (S) en Consciëntieusheid (C). Deze stijlen hebben elk unieke kenmerken en zijn gebaseerd op hoe u als individu reageert op uitdagingen, hoe u met anderen omgaat, hoe u veranderingen benadert en hoe u regels en procedures interpreteert.<br></br>Voordat u aan de vragenlijst begint, zijn er enkele belangrijke punten die u in gedachten moet houden. Ten eerste, er is geen 'goed' of 'fout' DISC-profiel. Elke stijl heeft zijn eigen sterke punten en mogelijkheden voor groei. Het is ook belangrijk om te begrijpen dat de meeste mensen een mix van stijlen hebben, met één of twee die meestal dominanter zijn.<br></br>Als u de vragenlijst invult, probeer dan eerlijk en authentiek te zijn. Antwoord op basis van hoe u zichzelf werkelijk ziet, niet hoe u zou willen zijn of hoe anderen u misschien zien. Denk aan uw gedrag en gevoelens in een verscheidenheid aan situaties. Houd er rekening mee dat deze vragenlijst geen volledig beeld van u als persoon zal geven. U bent complexer dan elk model kan beschrijven. Het doel hier is om een basisinzicht te bieden dat kan bijdragen aan persoonlijke groei en effectievere interacties met anderen.<br></br>Na het invullen van de vragenlijst krijgt u een gedetailleerd rapport over uw DISC-profiel. Dit rapport zal inzicht bieden in uw unieke sterktes en gedragstendensen, en zal ook suggesties geven over hoe u uw effectiviteit kunt verhogen. Het kan nuttig zijn om deze resultaten te bespreken met een coach of mentor, die u kan helpen de inzichten in uw gedrag te vertalen naar concrete stappen voor groei en verbetering.<br></br> Tot slot, weet dat uw DISC-profiel kan veranderen naarmate u groeit en verandert. Dit instrument is bedoeld om u te helpen bij het navigeren door die veranderingen en om uw bewustzijn van uw unieke benadering van werk en interactie te vergroten. We moedigen u aan om deze reis van zelfbewustzijn te omarmen en kijken uit naar uw ontdekkingen. Veel succes met het invullen van de vragenlijst!</b>"
        }
    };


    dbContext.Onderwerpen.AddRange(onderwerpen);
    dbContext.SaveChanges();
}


    private void SeedQuestions()
    {
        var questions = new List<Question>
        {
            new Question
            {
                Id = 1,
                QuestionText = "Question 1",
                Answers = new List<Answer>
                {
                    new Answer
                    {
                        Id = 1,
                        QuestionId = 1,
                        AnswerText = "Answer 1",
                        ScoreValueD = 1,
                        ScoreValueI = 2,
                        ScoreValueS = 3,
                        ScoreValueC = 4
                    },
                    new Answer
                    {
                        Id = 2,
                        QuestionId = 1,
                        AnswerText = "Answer 2",
                        ScoreValueD = 4,
                        ScoreValueI = 3,
                        ScoreValueS = 2,
                        ScoreValueC = 1
                    }
                }
            },
            new Question
            {
                Id = 2,
                QuestionText = "Question 2",
                Answers = new List<Answer>
                {
                    new Answer
                    {
                        Id = 3,
                        QuestionId = 2,
                        AnswerText = "Answer 3",
                        ScoreValueD = 2,
                        ScoreValueI = 1,
                        ScoreValueS = 4,
                        ScoreValueC = 3
                    },
                    new Answer
                    {
                        Id = 4,
                        QuestionId = 2,
                        AnswerText = "Answer 4",
                        ScoreValueD = 3,
                        ScoreValueI = 4,
                        ScoreValueS = 1,
                        ScoreValueC = 2
                    }
                }
            }
        };

        dbContext.Questions.AddRange(questions);
        dbContext.SaveChanges();
    }

    private void SeedUsers()
    {
        var random = new Random();

        var boxes = new List<string>
        {
            "C", "Cd", "Cs", "Ci","Dc", "D", "Ds", "Di","Sc", "Sd", "S", "Si", "Ic", "Id", "Is", "I"
        };

        var users = new List<User>
        {
            new User
            {
                Id = 1,
                Username = "user1",
                Password = "$2a$11$wZX5t0Iln2z3LMp93Z0dUeja6Mhkx2Tv7uKzcrAk3nsvYA3uTw8Dm",
                CompanyId = 1,
                IsAdmin = true,
                Box = "Ds"
            },
            new User
            {
                Id = 2,
                Username = "user2",
                Password = "$2a$11$wZX5t0Iln2z3LMp93Z0dUeja6Mhkx2Tv7uKzcrAk3nsvYA3uTw8Dm",
                CompanyId = 1,
                IsAdmin = false,
                Box = "Cs"
            },
            new User
            {
                Id = 39,
                Username = "user3",
                Password = "$2a$11$wZX5t0Iln2z3LMp93Z0dUeja6Mhkx2Tv7uKzcrAk3nsvYA3uTw8Dm",
                CompanyId = 3,
                IsAdmin = false,
                IsMod = true,
                Box = "Sd"
            },
            new User
            {
                Id = 3,
                Username = "John",
                Password = "password3",
                CompanyId = 1,
                IsAdmin = false,
                Box = boxes[random.Next(boxes.Count)]
            },
            new User
            {
                Id = 4,
                Username = "Jane",
                Password = "password4",
                CompanyId = 1,
                IsAdmin = false,
                Box = boxes[random.Next(boxes.Count)]
            },
            new User
            {
                Id = 5,
                Username = "Michael",
                Password = "password5",
                CompanyId = 1,
                IsAdmin = false,
                Box = boxes[random.Next(boxes.Count)]
            },
            new User
            {
                Id = 6,
                Username = "Emily",
                Password = "password6",
                CompanyId = 1,
                IsAdmin = false,
                Box = boxes[random.Next(boxes.Count)]
            },
            new User
            {
                Id = 7,
                Username = "David",
                Password = "password7",
                CompanyId = 1,
                IsAdmin = false,
                Box = boxes[random.Next(boxes.Count)]
            },
            new User
            {
                Id = 8,
                Username = "Sarah",
                Password = "password8",
                CompanyId = 1,
                IsAdmin = false,
                Box = boxes[random.Next(boxes.Count)]
            },
            new User
            {
                Id = 9,
                Username = "Matthew",
                Password = "password9",
                CompanyId = 1,
                IsAdmin = false,
                Box = boxes[random.Next(boxes.Count)]
            },
            new User
            {
                Id = 10,
                Username = "Olivia",
                Password = "password10",
                CompanyId = 1,
                IsAdmin = false,
                Box = boxes[random.Next(boxes.Count)]
            },
            new User
            {
                Id = 11,
                Username = "Daniel",
                Password = "password11",
                CompanyId = 1,
                IsAdmin = false,
                Box = boxes[random.Next(boxes.Count)]
            },
            new User
            {
                Id = 12,
                Username = "Sophia",
                Password = "password12",
                CompanyId = 1,
                IsAdmin = false,
                Box = boxes[random.Next(boxes.Count)]
            },
            new User
            {
                Id = 13,
                Username = "William",
                Password = "password13",
                CompanyId = 1,
                IsAdmin = false,
                Box = boxes[random.Next(boxes.Count)]
            },
            new User
            {
                Id = 14,
                Username = "Emma",
                Password = "password14",
                CompanyId = 1,
                IsAdmin = false,
                Box = boxes[random.Next(boxes.Count)]
            },
            new User
            {
                Id = 15,
                Username = "Liam",
                Password = "password15",
                CompanyId = 1,
                IsAdmin = false,
                Box = boxes[random.Next(boxes.Count)]
            },
            new User
            {
                Id = 16,
                Username = "Jacob",
                Password = "password16",
                CompanyId = 1,
                IsAdmin = false,
                Box = boxes[random.Next(boxes.Count)]
            },
            new User
            {
                Id = 17,
                Username = "Mia",
                Password = "password17",
                CompanyId = 1,
                IsAdmin = false,
                Box = boxes[random.Next(boxes.Count)]
            },
            new User
            {
                Id = 18,
                Username = "Ethan",
                Password = "password18",
                CompanyId = 1,
                IsAdmin = false,
                Box = boxes[random.Next(boxes.Count)]
            },
            new User
            {
                Id = 19,
                Username = "Ava",
                Password = "password19",
                CompanyId = 1,
                IsAdmin = false,
                Box = boxes[random.Next(boxes.Count)]
            },
            new User
            {
                Id = 20,
                Username = "Noah",
                Password = "password20",
                CompanyId = 1,
                IsAdmin = false,
                Box = boxes[random.Next(boxes.Count)]
            }
        };

        dbContext.Users.AddRange(users);
        dbContext.SaveChanges();
    }


private void SeedQuestionOpen()
{
    var questionOpen = new List<QuestionOpen>
    {
        new QuestionOpen
        {
            Id = 1,
            QuestionText = "Open Question 1",
            CompanyId = 3
        },
        new QuestionOpen
        {
            Id = 2,
            QuestionText = "Open Question 2",
            CompanyId = 3
        }
    };

    dbContext.QuestionOpen.AddRange(questionOpen);
    dbContext.SaveChanges();
}

private void SeedLinks()
{
    var links = new List<Link>
    {
        new Link
        {
            Id = 1,
            Webadress = "https://company1.com",
            Name = "Company 1 Link",
            CompanyId = 1
        },
        new Link
        {
            Id = 2,
            Webadress = "https://company2.com",
            Name = "Company 2 Link",
            CompanyId = 2
        },
        new Link
        {
            Id = 3,
            Webadress = "https://company3.com",
            Name = "Company 3 Link",
            CompanyId = 3
        },
        // Add more links here as needed
    };

    dbContext.Links.AddRange(links);
    dbContext.SaveChanges();
}



private void SeedAnswerOpen()
{
    var specificDate = new DateTime(2023, 7, 3, 10, 30, 0);  // Year, Month, Day, Hour, Minute, Second

    var answerOpen = new List<OpenAnswers>
    {
        new OpenAnswers
        {
            Id = 1,
            QuestionOpenId = 1,
            AnswerText = "Open Answer 1",
            UserId = 39,
            Session = 1,
            Date = specificDate  // set the date and time
        },
        new OpenAnswers
        {
            Id = 2,
            QuestionOpenId = 2,
            AnswerText = "Open Answer 2",
            UserId = 39,
            Session = 1,
            Date = specificDate  // set the date and time
        }
    };

    dbContext.OpenAnswers.AddRange(answerOpen);
    dbContext.SaveChanges();
}



private void SeedTotalScores()
{
    var users = dbContext.Users;
    var random = new Random();

    var totalScores = new List<TotalScore>();

    foreach (var user in users)
    {
        totalScores.Add(new TotalScore
        {
            UserId = user.Id,
            ScoreValueC = random.Next(1, 41),
            ScoreValueS = random.Next(1, 41),
            ScoreValueI = random.Next(1, 41),
            ScoreValueD = random.Next(1, 41),
            Date = RandomDay(random) // Added line
        });
    }

    dbContext.TotalScores.AddRange(totalScores);
    dbContext.SaveChanges();
}

// Method to generate random date
private DateOnly RandomDay(Random gen)
{
    DateTime start = DateTime.Today.AddYears(-2);
    int range = ((TimeSpan)(DateTime.Today - start)).Days;
    return DateOnly.FromDateTime(start.AddDays(gen.Next(range)));
}


}
