Grab'n'Go - App Mobile

<!-- Sostituisci con un'immagine di copertina se vuoi -->

Grab'n'Go è un'applicazione mobile completa sviluppata in React Native che connette gli utenti a distributori automatici intelligenti, offrendo un'esperienza di acquisto fluida e moderna. Gli utenti possono localizzare distributori, sfogliare prodotti, effettuare acquisti e gestire il proprio profilo, tutto dal proprio smartphone.

📸 Screenshot
Home & Mappa

Ricerca & Filtri

Dettaglio Distributore

Selezione Quantità

Carrello

Pagamento & Conferma

Profilo & Cronologia

Offerte

Ricette

✨ Funzionalità Principali
Autenticazione Utente Completa: Registrazione, Login e gestione della sessione tramite Supabase Auth.

Completamento Profilo: Flusso guidato post-registrazione per l'inserimento dei dati utente.

Home Page Dinamica:

Mappa interattiva con localizzazione dei distributori.

Geolocalizzazione GPS per centrare la mappa sulla posizione dell'utente.

Sezioni "Prodotti in Evidenza" e "Offerte per Te" caricate dal database.

Ricerca Avanzata:

Ricerca testuale dei distributori in tempo reale.

Filtro per categoria di prodotti per affinare i risultati.

Flusso di Acquisto Completo:

Visualizzazione dei dettagli del distributore con prodotti e recensioni.

Aggiunta di prodotti al carrello con selezione della quantità.

Gestione del carrello (incremento, decremento e rimozione articoli).

Checkout con riepilogo ordine e schermata di pagamento.

Gestione dello stock in tempo reale al momento del pagamento.

Conferma dell'ordine con generazione di un QR Code univoco.

Area Utente:

Visualizzazione e gestione del profilo utente.

Cronologia degli ordini passati con dettaglio.

Sezioni Aggiuntive:

Schermata Offerte con promozioni generali e personalizzate.

Schermata Ricette con filtri interattivi.

🛠️ Tecnologie Utilizzate
Frontend: React Native (con Expo)

Backend & Database: Supabase (PostgreSQL, Auth, Storage, Functions)

Navigazione: React Navigation

Mappe: react-native-maps

Font: Space Grotesk

🚀 Guida all'Installazione
Segui questi passaggi per eseguire il progetto in locale.

1. Prerequisiti
   Node.js (versione 18 o superiore)

Expo Go installato sul tuo dispositivo mobile (iOS o Android)

Un account Supabase

2. Clonazione del Repository
   git clone https://github.com/pacoz03/grabngo.git
   cd grabngo

3. Installazione delle Dipendenze
   npm install

4. Configurazione di Supabase
   Crea un progetto Supabase: Vai su supabase.com e crea un nuovo progetto.

Imposta lo Schema del Database:

Vai nella sezione "SQL Editor" del tuo progetto Supabase.

Copia e incolla il contenuto dello script per la creazione delle tabelle e delle policy (fornito separatamente).

Esegui lo script per creare la struttura del database.

Successivamente, esegui lo script per il popolamento dei dati per avere un database di partenza.

Configura le Variabili d'Ambiente:

Crea un file .env nella root del progetto.

Vai su "Project Settings" > "API" nel tuo progetto Supabase.

Copia la tua URL e la tua chiave API anon (public) e incollale nel file .env:

EXPO_PUBLIC_SUPABASE_URL=LA_TUA_URL_SUPABASE
EXPO_PUBLIC_SUPABASE_ANON_KEY=LA_TUA_CHIAVE_ANON_PUBBLICA

5. Avvio dell'Applicazione
   npm start

Scansiona il QR code mostrato nel terminale con l'app Expo Go sul tuo telefono.

📁 Struttura del Progetto
Il codice sorgente si trova interamente nella cartella src, organizzato come segue:

src/
├── api/ # Configurazione del client Supabase
├── assets/ # Font, icone e altre risorse statiche
├── components/ # Componenti UI riutilizzabili
│ ├── app/ # Componenti specifici dell'app (es. Card)
│ ├── auth/ # Componenti per l'autenticazione
│ └── common/ # Componenti generici (es. SearchBar)
├── context/ # Context di React per la gestione dello stato globale (Auth, Cart)
├── data/ # Dati di esempio (progressivamente sostituiti da API calls)
├── navigation/ # Gestione della navigazione (Tab e Stack Navigators)
└── screens/ # Schermate complete dell'applicazione
├── App/ # Schermate accessibili dopo il login
└── Auth/ # Schermate di autenticazione

🤝 Contributi
I contributi sono sempre benvenuti! Sentiti libero di aprire una issue o una pull request.
