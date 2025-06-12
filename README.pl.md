# Social App

## Opis projektu

**Social App** to pełnoprawna aplikacja społecznościowa stworzona z wykorzystaniem technologii **MERN Stack**

Umożliwia użytkownikom:
- tworzenie kont,
- publikowanie postów,
- komentowanie, zostawienie polubienia pod komentarzem lub postem i obserwowanie innych użytkowników,
- przesyłanie zdjęć profilowych oraz zdjęć postów,
- odbieranie powiadomień dzięki wbudowanemu systemowi powiadomień.

Pliki zdjęć użytkownika są **przechowywane na serwerze Express**, a w bazie danych MongoDB zapisywana jest do nich ścieżka URL.

---

## Jak uruchomić aplikację (Docker compose)

### Wymagania

- Zainstalowany [Docker](https://www.docker.com/) i [Docker Compose](https://docs.docker.com/compose/)

1. Sklonuj repozytorium:
```bash```
git clone https://github.com/wintryquip/social-app.git
cd social-app
2. Uruchom kontenery
```bash```
docker compose up --build -d
3. Otwórz aplikację
http://localhost:3000

Serwer API działa pod adresem
http://localhost:8080

---

## Technologie
- **Frontend**: React + Bootstrap
- **Backend**: Node.js + Express
- **Baza danych**: MongoDB
- **Docker**: do uruchamiania całego środowiska
- **Przechowywanie plików**: Lokalny system plików serwera