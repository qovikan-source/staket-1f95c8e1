# Utförda Åtgärder & Lösningar (Fixes & Workarounds)

Denna fil dokumenterar de utmaningar vi stötte på under utvecklingen, databasmigreringen samt integrationen av Supabase Auth, och hur de löstes.

---

## 1. Realtidssynkronisering för Filarkiv (Filer & Dokument)
*   **Utmaning:** Fillistan på webbplatsen var tidigare statisk efter den första laddningen. Om en administratör lade till eller tog bort dokument i bakgrunden (eller direkt via Supabase Dashboard) uppdaterades inte övriga användares sidor utan en fullständig omladdning av webbläsaren.
*   **Lösning:** Vi lade till en Postgres Real-time-kanal i `src/pages/Index.tsx` som lyssnar på händelser (`INSERT`, `DELETE`, `UPDATE`) i tabellen `public.files`. När databasen uppdateras triggar klienten en automatisk, smidig omladdning av fillistan i bakgrunden utan att störa användaren.

---

## 2. Lösenordskompatibilitet (Laravel Blowfish/Bcrypt till Supabase Auth)
*   **Utmaning:** Lösenorden från den gamla hemsidan exporterades som Laravel-krypterade Bcrypt-hashar. Laravel använder prefixet `$2y$` (en PHP-specifik Blowfish-buggfix), medan standard Bcrypt-bibliotek (inklusive Supabase/GoTrue) förväntar sig det traditionella `$2a$`- eller `$2b$`-prefixet.
*   **Lösning:** Vi skapade ett migreringsskript i Node.js (`generate_migration.js`) som läser av `old_db/users.csv`, översätter lösenordshasharna genom att ersätta prefixet `$2y$` med `$2a$`, och genererar färdiga SQL-kommandon. Algoritmen är i övrigt identisk, vilket gör att användarna kan logga in med sina befintliga uppgifter.

---

## 3. SQL-fel vid Unika Begränsningar (`ON CONFLICT`)
*   **Utmaning:** Det ursprungliga migreringsskriptet använde `ON CONFLICT (email) DO NOTHING`. Detta misslyckades med ett SQL-fel eftersom `auth.users` i Supabase inte har en explicit unik nyckel enbart på kolumnen `email`, utan använder ett sammansatt index eller unikt index beroende på inställningar.
*   **Lösning:** SQL-frågan skrevs om för att använda en villkorlig insättning:
    ```sql
    INSERT INTO auth.users (...)
    SELECT ...
    WHERE NOT EXISTS (
      SELECT 1 FROM auth.users WHERE email = 'anvandare@doman.se'
    );
    ```
    Detta gör skriptet helt oberoende av databasens unika index-strukturer och förhindrar dubbletter på ett säkert sätt.

---

## 4. Genererad Kolumnfel (`confirmed_at`)
*   **Utmaning:** Försök att sätta eller uppdatera kolumnen `confirmed_at` manuellt gav felmeddelandet:
    `ERROR: 428C9: column "confirmed_at" can only be updated to DEFAULT (Column "confirmed_at" is a generated column)`.
    I nyare versioner av Supabase är detta en genererad kolumn som räknas ut automatiskt baserat på `email_confirmed_at` och `phone_confirmed_at`.
*   **Lösning:** Vi exkluderade kolumnen `confirmed_at` helt från migreringsskriptet. Databasen sätter nu värdet automatiskt och korrekt baserat på `email_confirmed_at = NOW()`.

---

## 5. GoTrue 500-fel vid Inloggning (Tomma Kolumner i `auth.users`)
*   **Utmaning:** Användare som importerats via rå SQL kunde inte logga in och gav ett osynligt `500 Internal Server Error` mot Supabase API. Detta berodde på att GoTrue-inloggningsservern kräver att interna fält (som `confirmation_token`, `recovery_token`, `email_change`, `is_super_admin` och `is_sso_user`) är satta till tomma strängar (`''`) eller booleans (`false`) istället för att lämnas som `NULL`.
*   **Lösning:**
    1.  Vi uppdaterade migreringsskriptet så att det explicit sätter dessa fält till tomma strängar och booleans vid insättning.
    2.  Vi lade till ett självlänkande `UPDATE`-kommando högst upp i `migrate_users.sql` som automatiskt hittar och lagar redan importerade användare på följande sätt:
        ```sql
        UPDATE auth.users 
        SET 
          confirmation_token = COALESCE(confirmation_token, ''),
          recovery_token = COALESCE(recovery_token, ''),
          email_change_token_new = COALESCE(email_change_token_new, ''),
          email_change = COALESCE(email_change, ''),
          is_super_admin = COALESCE(is_super_admin, false),
          is_sso_user = COALESCE(is_sso_user, false)
        WHERE confirmation_token IS NULL OR is_super_admin IS NULL OR is_sso_user IS NULL;
        ```

---

## 6. Uppkoppling av Login-gränssnittet till Supabase
*   **Utmaning:** Inloggningsrutan i applikationen (`LoginView.tsx`) var tidigare en demo-simulering med statiska lösenord och fasta konton (`admin@staket.se`, `medlem@staket.se`, etc.).
*   **Lösning:** Vi kopplade inloggningsformuläret till Supabase Auth med hjälp av `supabase.auth.signInWithPassword`. När inloggningen lyckas hämtas den inloggade användarens profilroll (`Administrator`, `Styrelse`, eller `Medlem`) direkt från `public.profiles` för att omedelbart ge rätt behörigheter och navigering.

---

## 7. Mismatch vid kodändringar till följd av radbrytningstyper (CRLF vs LF)
*   **Utmaning:** Automatiska kodersättningar via `replace_file_content` misslyckades upprepade gånger med felmeddelandet `target content not found in file` trots att koden kopierats exakt. Detta berodde på att filerna i Windows-miljön sparats med CRLF-radbrytningar (`\r\n`), medan verktyget tolkade söksträngarna med LF-radbrytningar (`\n`).
*   **Lösning:** Vi begränsade `TargetContent` till att endast vara enskilda rader som inte innehåller några radbrytningstecken. Ersättningen gjordes därefter genom att byta ut den enskilda raden mot önskad multirad-kod. Detta kringgick helt kompabilitetsproblemen mellan CRLF och LF.

---

## 8. RPC-uppdateringar med Supabase GoTrue
*   **Utmaning:** Att uppdatera användarprofiler via en admin-RPC-funktion krävde synkronisering mellan `auth.users` (för lösenord och e-post) och `public.profiles` (för övriga fält). Om man inte angav lösenord eller roll i frontend skickades tomma strängar som kunde skriva över fälten med felaktiga eller tomma värden.
*   **Lösning:** Vi modifierade RPC-funktionerna (`admin_update_user` och `create_new_user`) till att ta emot valfria (optional) parametrar med standardvärde `NULL` och använda `COALESCE` för att behålla de gamla värdena om inga nya skickas in. Vi uppdaterade även frontend-koden för att endast skicka parametrar som faktiskt har ändrats.
