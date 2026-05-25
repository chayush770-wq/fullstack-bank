# 🌐 HTTP

## מה זה HTTP?

HTTP הוא פרוטוקול תקשורת בין Client לבין Server.

הוא מאפשר ללקוח (Client) לשלוח בקשות,
ולשרת (Server) להחזיר תגובות.

---

## Client / Server

### User (משתמש)
האדם שמשתמש במערכת

### Client
הדפדפן או האפליקציה שדרכה המשתמש עובד  
(למשל Chrome)

### Server
שרת שמקבל בקשות, מבצע לוגיקה ומחזיר תשובות

---

## Request (בקשה)

Request הוא בקשה שה־Client שולח ל־Server

## Request (בקשה)

Request הוא בקשה שה־Client שולח ל־Server

### Request כולל:

- Method (סוג פעולה)
- URL (נתיב)
- Headers (מידע נוסף)
- Body (נתונים - לא תמיד קיים)

---

## HTTP Methods (סוגי בקשות)

### GET
קבלת מידע מהשרת  
לא משנה נתונים

דוגמא:
GET /transactions

---

### POST
שליחת מידע לשרת / יצירת מידע חדש

דוגמא:
POST /auth/login  
POST /transactions

---

### PUT
עדכון מלא של משאב (מחליף את כולו)

דוגמא:
PUT /users/1

---

### PATCH
עדכון חלקי של משאב

דוגמא:
PATCH /users/me/password

---

### DELETE
מחיקת משאב

דוגמא:
DELETE /users/1

---

### (פחות נפוצים אבל טוב לדעת)

### OPTIONS
מבקש מהשרת איזה פעולות מותרות (בעיקר לדפדפן)

---

### HEAD
כמו GET אבל בלי body (רק לבדוק אם קיים)

---

## Headers (כותרות)

מידע נוסף שנשלח עם הבקשה

דוגמאות:

- Authorization → זיהוי משתמש (token)
- Content-Type → סוג המידע (JSON)

---

## Body (נתונים)

קיים בעיקר ב־POST / PUT / PATCH

דוגמא:

```json
{
  "email": "chaya@test.com",
  "password": "123456"
}

---

## Response (תגובה)

Response הוא מה שהשרת מחזיר ל־Client

### Response כולל:

- Status Code (קוד מצב)
  - 200 → הצלחה
  - 201 → נוצר
  - 400 → בקשה לא תקינה
  - 401 → לא מורשה
  - 404 → לא נמצא
  - 500 → שגיאת שרת

- Body (מידע)
  לדוגמה:
  הודעת הצלחה או שגיאה

---

## סיכום

הזרימה היא:

Client → שולח Request  
Server → מחזיר Response  
Client → מציג למשתמש