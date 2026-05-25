# Banking App — ENDPOINTS Plan

מטרה: להגדיר בצורה ברורה ומסודרת את ה־REST API של מערכת הבנק לפני מימוש מלא של השרת וה־Swagger.

---

# 1. Authentication

## POST /auth/register

יצירת משתמש חדש (Register).

### Request Body

```json
{
  "email": "user@example.com",
  "password": "123456",
  "phone": "+972501234567"
}
```

### מה השרת עושה

- בודק ש־email תקין
- בודק ש־phone תקין
- בודק שאין כבר משתמש עם אותו email
- יוצר משתמש חדש במצב לא מאומת
- יוצר verification token
- שולח Email verification link

### Responses

#### 201 Created

```json
{
  "message": "Verification email sent"
}
```

#### 400 Bad Request

פורמט לא תקין / שדה חסר.

#### 409 Conflict

ה־email כבר קיים במערכת.

---

## GET /auth/verify

אימות משתמש דרך verification link.

### Query Params

```text
?token=<verificationToken>
```

### מה השרת עושה

- בודק שה־token קיים
- בודק שה־token תקין
- מוצא את המשתמש
- מסמן את המשתמש כמאומת
- יוצר JWT token
- מחזיר authentication response

### Responses

#### 200 OK

```json
{
  "token": "jwt_token",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "balance": 1000
  }
}
```

#### 400 Bad Request

Token חסר / לא תקין / פג תוקף.

#### 404 Not Found

לא נמצא משתמש עם token כזה.

---

## POST /auth/login

התחברות משתמש קיים.

### Request Body

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

### מה השרת עושה

- בודק שהמשתמש קיים
- בודק שהסיסמה נכונה
- בודק שהמשתמש מאומת
- יוצר JWT token

### Responses

#### 200 OK

```json
{
  "token": "jwt_token",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "balance": 1000
  }
}
```

#### 401 Unauthorized

אימייל או סיסמה שגויים.

#### 403 Forbidden

המשתמש עדיין לא מאומת.

---

# 2. Accounts

## GET /accounts/me

קבלת פרטי החשבון של המשתמש המחובר.

### Authorization

```text
Bearer Token Required
```

### Query Params

```text
page
limit
```

### מה השרת עושה

- מזהה משתמש לפי JWT
- מחזיר balance
- מחזיר recent transactions
- מחזיר pagination metadata

### Responses

#### 200 OK

```json
{
  "balance": 4250,
  "transactions": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

#### 401 Unauthorized

Token חסר או לא תקין.

---

# 3. Transactions

## GET /transactions

קבלת רשימת עסקאות של המשתמש המחובר.

### Authorization

```text
Bearer Token Required
```

### Query Params

```text
page
limit
counterparty
```

### מה השרת עושה

- מזהה משתמש לפי JWT
- מחזיר עסקאות שבהן המשתמש:
  - sender
  - recipient
- מחזיר מהחדש לישן
- תומך ב־pagination
- תומך ב־counterparty filter

### Responses

#### 200 OK

```json
{
  "transactions": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

#### 400 Bad Request

page / limit לא תקינים.

#### 401 Unauthorized

אין הרשאה.

---

## POST /transactions

יצירת העברת כסף חדשה.

### Authorization

```text
Bearer Token Required
```

### Request Body

```json
{
  "recipientEmail": "bob@example.com",
  "amount": 150,
  "reason": "Rent"
}
```

### מה השרת עושה

- מזהה את השולח לפי JWT
- בודק שהמקבל קיים
- בודק שסכום תקין
- בודק שיש מספיק balance
- מונע self transfer
- מוריד כסף מהשולח
- מוסיף כסף למקבל
- יוצר transaction אחת מרכזית
- מציג אותה שונה לכל משתמש:
  - sender → amount שלילי
  - recipient → amount חיובי

### Responses

#### 201 Created

```json
{
  "message": "Transaction successful",
  "newBalance": 850,
  "transaction": {}
}
```

#### 400 Bad Request

Amount / reason לא תקינים.

#### 401 Unauthorized

אין הרשאה.

#### 404 Not Found

Recipient לא נמצא.

#### 409 Conflict

אין מספיק balance.

---

## GET /transactions/:id

קבלת transaction ספציפית.

### Authorization

```text
Bearer Token Required
```

### מה השרת עושה

- בודק שהעסקה קיימת
- בודק שהמשתמש קשור לעסקה
- מחזיר transaction details

### Responses

#### 200 OK

Transaction details.

#### 401 Unauthorized

אין הרשאה.

#### 403 Forbidden

המשתמש לא קשור לעסקה.

#### 404 Not Found

Transaction לא נמצאה.

---

# 4. Real-Time Notifications (Future)

החלק הזה מתאים ל־WebSocket / Socket.IO ולא ל־REST API רגיל.

## Events

### transaction:received

נשלח למשתמש שקיבל כסף.

### transaction:sent

נשלח למשתמש ששלח כסף.

### balance:updated

נשלח כאשר היתרה מתעדכנת.

---

# 5. Support Chatbot (Future)

## POST /support/chat

שליחת הודעה לצ׳אט בוט.

### Authorization

```text
Bearer Token Recommended
```

### Request Body

```json
{
  "message": "I need help"
}
```

### Responses

#### 200 OK

```json
{
  "answer": "How can I help you?"
}
```

#### 400 Bad Request

הודעה לא תקינה.

#### 401 Unauthorized

אין הרשאה.

---

# 6. Video Calls (Future)

## POST /video-calls

יצירת שיחת וידאו.

### Authorization

```text
Bearer Token Required
```

### Request Body

```json
{
  "receiverEmail": "bob@example.com"
}
```

### מה השרת עושה

- יוצר room/link
- מחזיר video call link

### Responses

#### 201 Created

Video call created.

#### 401 Unauthorized

אין הרשאה.

#### 404 Not Found

User לא נמצא.

---

# MVP Endpoints

אלה ה־endpoints הבסיסיים של המערכת:

- POST /auth/register
- GET /auth/verify
- POST /auth/login
- GET /accounts/me
- GET /transactions
- POST /transactions

---

# Architecture Decisions

1. Authentication endpoints נמצאים תחת `/auth`
2. Account data נמצא תחת `/accounts`
3. Transactions מיוצגות כ־resource עצמאי
4. Transaction נשמרת פעם אחת במערכת
5. ה־API מציג amount חיובי/שלילי לפי המשתמש המחובר
6. Dashboard משתמש ב:
   - GET /accounts/me
   - GET /transactions
7. JWT משמש ל־authentication של protected routes