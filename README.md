# KvizHub – Live Quiz Arena

Ovaj projekat je realizovan kao predmetni projekat na FTN (Predmet: PWP).  
Aplikacija omogućava korisnicima da rešavaju kvizove, dok administratori mogu da kreiraju i upravljaju kvizovima.  
Dodata je i funkcionalnost **Live Quiz Arena** koja omogućava real-time takmičenje više korisnika


## Tehnologije
- **Frontend:** React (React Router, Axios)
- **Backend:** ASP.NET Core Web API (.NET 8), Entity Framework Core
- **Baza podataka:** SQL Server
- **Autentifikacija:** JWT (JSON Web Token)
- **Real-time komunikacija:** SignalR

## Arhitektura
Aplikacija je razvijena kao troslojna web aplikacija:

- **Frontend (React):** Podeljen na komponente, koristi servise za HTTP pozive, .env za konfiguraciju.
- **Backend (ASP.NET Core Web API):** Troslojna arhitektura (Controllers → Services → Repositories), sa Dependency Injection.
- **Baza podataka (SQL Server):** Definisana preko migracija.

## Pokretanje projekta

### Backend
1. Otvoriti folder `webproj1/`
2. Pokrenuti visual studio:
3. Pritisnuti run
### Frontend
1. npm start

### 5. Funkcionalnosti
### Korisnik
- Registracija i prijava
- Pregled i rešavanje kvizova
- Pregled ličnih rezultata
- Globalna rang lista
- Učešće u Live Quiz Areni

### Administrator
- CRUD nad kvizovima i pitanjima
- Pregled rezultata
- Kreiranje i upravljanje Live sobama

## Autor
Filip Mitrović, PR142/2021






