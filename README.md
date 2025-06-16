# 📚 Course Tracker

Course Tracker este o aplicație fullstack pentru urmărirea cursurilor online, construită cu **NestJS + TypeScript + PostgreSQL**.

## 🚀 Funcționalități

- Autentificare cu JWT (Login + Register)
- Roluri: `user` (doar cursurile proprii) și `admin` (toate cursurile)
- Operații cursuri:
  - Adăugare, ștergere, modificare
  - Filtrare după platformă
  - Marcarea cursurilor ca „completed”
  - Protejarea rutelor cu `AuthGuard` și `RolesGuard`

## 🛠️ Tehnologii folosite

- **Backend**: NestJS, TypeScript, PostgreSQL, TypeORM, JWT, Bcrypt
- **Autentificare**: `@nestjs/jwt`, `passport-jwt`
- **Altele**: GitHub

## 🗂️ Structura proiectului backend

```
src/
├── auth/            # Login, register, JWT guard & strategy
├── users/           # Entitate utilizator, service, roluri
├── courses/         # Entitate curs, service, controller
├── app.module.ts    # Modulul principal
├── main.ts          # Punctul de pornire al aplicației
```


## 📄 Proiect educațional, open-source – folosește-l liber pentru învățare și dezvoltare!
