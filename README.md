# Dokumentacja aplikacji czatu typu Single Page Application (SPA)

## Opis projektu
Aplikacja jest czatem internetowym typu Single Page Application (SPA), który umożliwia komunikację w czasie rzeczywistym między dwoma użytkownikami. Technologia opiera się na **React** z **TypeScript** oraz **Vite** (frontend) i **Node.js** z WebSocketami zaimplementowanymi przy użyciu biblioteki **socket.io** (backend).

Użytkownicy mogą wymieniać teksty oraz obrazy w prostym, responsywnym interfejsie graficznym. Dane wymieniane są w czasie rzeczywistym dzięki technologii WebSocket.

---

## Użyte narzędzia i technologie

### Frontend:
- **React**: Framework do budowy interfejsów użytkownika oparty na komponentach.
- **TypeScript**: Superset języka JavaScript, który wprowadza statyczne typowanie.
- **Vite**: Narzędzie do szybkiego budowania i uruchamiania aplikacji frontendowych.
- **CSS**: Odpowiada za stylowanie interfejsu.

### Backend:
- **Node.js**: Środowisko wykonawcze JavaScript do budowy serwera.
- **Express.js**: Lekka biblioteka do tworzenia serwera HTTP.
- **Socket.io**: Narzędzie do obsługi WebSocketów, które pozwala na komunikację w czasie rzeczywistym.

---

## Architektura aplikacji

### Frontend:
#### Struktura:
- **main.tsx**: Punkt wejściowy aplikacji, renderuje główny komponent `App`.
- **App.tsx**: Główna logika interfejsu użytkownika, obsługuje:
  - Zarządzanie stanem wiadomości i połączenia z WebSocket.
  - Interakcje użytkownika, w tym wysyłanie tekstów i obrazów.
  - Automatyczne przewijanie okna czatu.
- **style.css**: Stylowanie komponentów interfejsu, w tym obsługa ciemnego motywu, animacji i responsywności.

#### Komunikacja:
- Aplikacja wykorzystuje **WebSocket** do komunikacji w czasie rzeczywistym.
- Przy połączeniu użytkownik podaje pseudonim, który jest wysyłany razem z wiadomościami.

### Backend:
#### Struktura:
- **index.js**:
  - Tworzy serwer HTTP przy użyciu **Express**.
  - Obsługuje połączenia WebSocket z wykorzystaniem **Socket.io**.
  - Nasłuchuje wiadomości od użytkowników i emituje je do wszystkich połączonych klientów.

---

## Sposób działania

### Uruchamianie aplikacji (komendy w terminalu):
1. **Backend:**
   ```bash
   node index.js
   ```
2. **Frontend:**
   ```bash
   npm run dev
   ```

### Proces komunikacji:
1. Po uruchomieniu, frontend łączy się z serwerem WebSocket (`http://localhost:3000`).
2. Użytkownicy mogą wysyłać:
   - **Teksty:** Przesyłane jako ciągi znaków.
   - **Obrazy:** Przesyłane w formacie Base64.

#### Przesyłanie wiadomości:
- Wiadomość jest emitowana z frontendu za pomocą:
  ```javascript
  socket.emit('message', { message, nick, type });
  ```
- Backend odbiera wiadomość i rozsyła ją wszystkim klientom:
  ```javascript
  io.emit('chat-message', { message, nick, userId: socket.id, type });
  ```

---

## Możliwe problemy i ich rozwiązania

### Brak połączenia z serwerem WebSocket:
- **Objaw:** Brak odpowiedzi serwera lub niemożność wysyłania wiadomości.
- **Rozwiązanie:**
  - Upewnić się, że backend działa i jest uruchomiony na poprawnym porcie (`3000`).
  - Sprawdzić konfigurację CORS:
    ```javascript
    cors: {
      origin: '*',
    }
    ```

### Duże obciążenie serwera przy wielu połączeniach:
- **Rozwiązanie:**
  - Wprowadzić ograniczenie liczby połączeń na użytkownika, np. używając middleware w **Socket.io**.

### Problemy z przesyłaniem obrazów:
- **Objaw:** Obraz się nie wyświetla lub nie jest przesyłany.
- **Rozwiązanie:**
  - Ograniczyć maksymalny rozmiar przesyłanych plików.
  - Dodać walidację obrazów przed wysyłką na frontendzie.

### Zarządzanie pamięcią na frontendzie:
- **Objaw:** Rosnące zużycie pamięci RAM.
- **Rozwiązanie:**
  - Usuwanie starszych wiadomości z pamięci po osiągnięciu określonego limitu.
