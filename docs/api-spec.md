PassKru API Documentation
This document describes all working API endpoints for the PassKru application.

Authentication (/api/auth)
1. Register User
Method & Path: POST /api/auth/register
Access: Public
Request Body:
json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phoneNumber": "+1234567890", // Optional
  "role": "candidate" // Optional ("candidate" or "admin")
}
2. Login User
Method & Path: POST /api/auth/login
Access: Public
Request Body:
json

{
  "email": "john.doe@example.com",
  "password": "password123"
}
Response Details: Returns a Bearer JWT token.
3. Get Current User profile
Method & Path: GET /api/auth/me
Access: Protected (Requires Authorization: Bearer <TOKEN>)
Announcements (/api/announcements)
1. Get Announcements
Method & Path: GET /api/announcements
Access: Protected
Query Parameters (Optional):
examId: integer (e.g. ?examId=1)
category: string (e.g. ?category=recruitment)
isUrgent: boolean (e.g. ?isUrgent=true)
2. Get Announcement by ID
Method & Path: GET /api/announcements/:id
Access: Protected
3. Create Announcement
Method & Path: POST /api/announcements
Access: Protected (Admin Only)
Request Body:
json

{
  "examId": 1,
  "title": "សេចក្តីជូនដំណឹង",
  "summary": "សេចក្តីសង្ខេប",
  "content": "ខ្លឹមសារ",
  "category": "recruitment", // recruitment, schedule, eligibility, result, guideline
  "isUrgent": true
}
4. Update Announcement
Method & Path: PUT /api/announcements/:id
Access: Protected (Admin Only)
5. Delete Announcement
Method & Path: DELETE /api/announcements/:id
Access: Protected (Admin Only)
Notifications (/api/notifications)
1. Get My Notifications
Method & Path: GET /api/notifications
Access: Protected (fetches notifications for the logged-in user)
2. Mark All as Read
Method & Path: PUT /api/notifications/read-all
Access: Protected
3. Mark Notification as Read
Method & Path: PUT /api/notifications/:id/read
Access: Protected
4. Delete Notification
Method & Path: DELETE /api/notifications/:id
Access: Protected
Exams (/api/exams)
1. Get Exams
Method & Path: GET /api/exams
Access: Protected
2. Get Exam by ID
Method & Path: GET /api/exams/:id
Access: Protected
3. Create Exam
Method & Path: POST /api/exams
Access: Protected (Admin Only)
Request Body:
json

{
  "examName": "ប្រឡងជ្រើសរើសគ្រូបង្រៀនថ្នាក់វិទ្យាល័យ",
  "examType": "វិទ្យាល័យ",
  "category": "គ្រូបង្រៀន",
  "description": "ការប្រឡងជ្រើសរើសគ្រូមធ្យមសិក្សាទុតិយភូមិ"
}
4. Update Exam
Method & Path: PUT /api/exams/:id
Access: Protected (Admin Only)
5. Delete Exam
Method & Path: DELETE /api/exams/:id
Access: Protected (Admin Only)
Subjects (/api/subjects)
1. Get Subjects
Method & Path: GET /api/subjects
Access: Protected
Query Parameters (Optional):
examId: integer (e.g. ?examId=1)
2. Get Subject by ID
Method & Path: GET /api/subjects/:id
Access: Protected (includes subject topics and past papers)
3. Create Subject
Method & Path: POST /api/subjects
Access: Protected (Admin Only)
Request Body:
json

{
  "examId": 1,
  "subjectName": "Mathematics",
  "description": "Mathematics core concepts"
}
4. Update Subject
Method & Path: PUT /api/subjects/:id
Access: Protected (Admin Only)
5. Delete Subject
Method & Path: DELETE /api/subjects/:id
Access: Protected (Admin Only)
Past Papers & Solutions (/api/papers)
1. Get Past Papers
Method & Path: GET /api/papers
Access: Protected
Query Parameters (Optional):
subjectId: integer (e.g. ?subjectId=1)
year: integer (e.g. ?year=2024)
hasAnswerKey: boolean (e.g. ?hasAnswerKey=true to find solutions)
search: string (performs partial title search, e.g. ?search=math)
2. Get Past Paper by ID
Method & Path: GET /api/papers/:id
Access: Protected
3. Create Past Paper
Method & Path: POST /api/papers
Access: Protected (Admin Only)
Request Body:
json

{
  "subjectId": 1,
  "year": 2024,
  "title": "Mathematics State Exam 2024 (With Solutions)",
  "session": "Morning",
  "fileUrl": "https://your-storage-url.com/math-2024.pdf",
  "fileSize": "2.4 MB",
  "hasAnswerKey": true,
  "totalQuestions": 50
}
4. Update Past Paper
Method & Path: PUT /api/papers/:id
Access: Protected (Admin Only)
5. Delete Past Paper
Method & Path: DELETE /api/papers/:id
Access: Protected (Admin Only)
Topics (/api/topics)
1. Get Topics
Method & Path: GET /api/topics
Access: Protected
Query Parameters (Optional):
subjectId: integer (e.g. ?subjectId=1)
2. Get Topic by ID
Method & Path: GET /api/topics/:id
Access: Protected
3. Create Topic
Method & Path: POST /api/topics
Access: Protected (Admin Only)
Request Body:
json

{
  "subjectId": 1,
  "topicName": "Algebra & Equations",
  "description": "Linear and quadratic equations"
}
4. Update Topic
Method & Path: PUT /api/topics/:id
Access: Protected (Admin Only)
5. Delete Topic
Method & Path: DELETE /api/topics/:id
Access: Protected (Admin Only)
