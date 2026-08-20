# PassKru - Project

# **PassKru**

*PassKru is an all-in-one AI-Powered Platform that helps students prepare to take the National Teacher Examination.*

---

# **1. Problem Statement**

### **1.1 Fragmented Information**

Official updates, eligibility rules, examination schedules, and deadlines are scattered across different sources, making it difficult for candidates to find reliable and up-to-date information.

### **1.2 Outdated & Static Materials**

Study resources mainly rely on unstructured PDFs and static materials that lack answer explanations, interactive practice, and a realistic digital test experience.

### **1.3 Inefficient Self-Study**

Without personalized guidance, study planning, and progress tracking, candidates may struggle to know what to study and which topics they need to improve.

---

# **2. Solution**

PassKru addresses these challenges through three core solutions:

### **2.1 Centralized Exam Information Hub**

Brings examination announcements, eligibility requirements, schedules, deadlines, and other important updates into one reliable platform.

### **2.2 Digital Learning & Practice Platform**

Transforms traditional study materials into an organized digital learning experience with previous exam papers, solutions, quizzes, flashcards, and realistic mock exams.

### **2.3 AI-Powered Personalized Preparation**

Creates personalized study plans and analyzes candidate performance to help them track their progress and focus on areas that need improvement.

---

# **3. Project Features**

| Solution | Features |
| --- | --- |
| **Centralized Exam Information Hub** | Exam Knowledge Hub, Announcements, Notifications, Requirements, Schedule |
| **Digital Learning & Practice Platform** | Past Papers, Solutions, Quizzes, Flashcards, Mock Exams |
| **AI-Powered Personalized Preparation** | AI Study Plan, Progress Tracking |
| **Additional Support** | Teacher & Mentor Connection |

### **3.1 Exam Knowledge Hub & Notification System**

- Official announcements
- Examination schedules
- Eligibility requirements
- Application deadlines
- Important updates
- Notifications

### **3.2 Archive of Past Papers & Solutions**

- Previous examination papers
- Questions and answers
- Answer explanations
- Subject/category organization
- Search and filtering
- Learning materials

### **3.3 AI-Generated Study Plan**

Candidates provide information such as their available study time, knowledge level, target examination, and subjects they want to improve.

The AI generates a personalized study plan based on their needs and progress.

### **3.4 Quizzes & Flashcards**

Interactive learning tools for:

- Topic-based practice
- Quick revision
- Memorization
- Self-assessment
- Immediate feedback

### **3.5 Mock Exams & Progress Tracking**

Candidates can simulate the examination experience through mock exams.

The platform tracks:

- Scores
- Subject performance
- Topic performance
- Progress over time
- Weak areas

### **3.6 Targeted Weakness Improvement**

PassKru analyzes quiz and mock exam performance to identify topics where candidates are struggling and recommends relevant questions and learning materials.

### **3.7 Teacher & Mentor Connection**

Candidates can discover and connect with teachers or mentors for:

- Academic guidance
- Study advice
- Questions and discussions
- Consultation
- Mentorship

---

**Functional Requirements**

1. **User Authentication & Account**

The system shall allow users to register an account.

The system shall allow users to log in and log out.

The system shall allow users to update their profile.

The system shall support different user roles:

- Candidate
- Admin
1. **Exam Information**

The system shall display available National Teacher Examinations.

The system shall display official examination information, including:

- Examination date
- Application period
- Eligibility requirements
- Required documents
- Examination subjects
- Important announcements

Admins shall be able to create, update, and remove examination information.

Users shall be able to search and filter examination information.

1. **Past Papers & Learning Materials**

Users shall be able to browse previous examination papers.

Users shall be able to filter papers by:

- Subject
- Examination types

Users shall be able to view or access available examination papers.

The system shall provide learning materials organized by subject/topic.

Admins shall be able to upload, update, and remove learning resources.

**Important:** Only materials that PassKru has permission to distribute should be uploaded.

1. **Questions, Quizzes & Flashcards**

Users shall be able to answer topic-based quizzes.

The system shall automatically calculate quiz scores.

The system shall provide correct answers and explanations after answering.

Users shall be able to practice flashcards by topic.

Admins shall be able to create and manage questions and flashcards.

1. **Mock Examination**

Users shall be able to start a mock examination.

The system shall provide a countdown timer during a mock examination.

Users shall be able to submit their answers.

The system shall automatically calculate the result.

The system shall display performance by subject/topic.

The system shall save the user's examination history.

1. **AI Study Plan**

Users shall provide:

- Target examination
- Available study time
- Exam date
- Current knowledge level
- Subjects they want to improve

The system shall generate a personalized study plan using AI.

The system shall display the study plan by day/week.

Users shall be able to mark study tasks as completed.

1. **Teacher & Mentor Connection**

Users shall be able to browse available teachers/mentors.

Users shall be able to view mentor profiles and expertise.

Users shall be able to contact or request consultation from mentors.

1. **Admin Management**

Admins shall have an administration dashboard.

Admins shall be able to manage:

- Users
- Exams
- Announcements
- Papers
- Questions
- Learning materials
- Mentors

Admins shall be able to verify and update official information.

**PassKru — Non-Functional Requirements**

Non-functional requirements describe **how well the system should work**.

1. **Performance**
2. **Security**
3. **Reliability**

The system should be available whenever candidates need to access examination information and learning materials.

1. **Usability**
2. **Accessibility & Responsiveness**

The website shall be responsive on:

- Desktop
- Tablet
- Mobile
1. **Scalability**

The system architecture should allow additional national examinations to be added in the future.

1. **Maintainability**
2. **AI Reliability**

AI-generated study plans shall be based on verified examination information and user-provided data.

# **4. Target Users**

### **Primary Users**

**National Teacher Examination Candidates**

Students and candidates who are preparing to take the National Teacher Examination and need reliable information, study resources, practice, and personalized preparation.

### **Secondary Users**

**Teachers & Mentors**

Experienced teachers who want to provide guidance, consultation, and mentorship to examination candidates.

**Training Centers**

Organizations that provide teacher examination preparation and training services.

---

# **5. Tech Stack**

| Category | Technology | Purpose |
| --- | --- | --- |
| **Frontend** | React.js + Vite | Build the website UI |
| **Styling** | Tailwind CSS | Responsive Khmer UI |
| **State Management** | React Context + useState | Auth, user state, study plan |
| **API Communication** | Axios | Frontend ↔ Backend |
| **Backend** | Node.js + Express.js | REST API & business logic |
| **Database** | Postgre SQL | Users, exams, papers, questions, plans, mentors |
| **Authentication** | JWT + bcrypt | Login, registration & security |
| **AI** | Gemini API | Study plans & explanations |
| **File Storage** | Cloudinary / ImageKit | PDFs, images & learning materials |
| **Frontend Hosting** | Vercel | Deploy React |
| **Backend Hosting** | Railway / Render | Deploy Express API |
| **MySQL Hosting** | Railway / Aiven | Production database |
| **Development** | Git + GitHub | Version control & teamwork |

---

# **6. Development Methodology**

PassKru will follow the **Agile Scrum methodology**.

The project will be developed through short development **sprints**, allowing the team to continuously plan, develop, test, review, and improve the platform.

### **Scrum Cycle**

> **Plan → Develop → Test → Review → Improve → Next Sprint**
> 

---

# **7. Sprint Plan**

| Sprint | Focus | Key Deliverables |
| --- | --- | --- |
| **Sprint 0** | Planning & Design | Requirements, user stories, UI wireframes, database schema, system architecture |
| **Sprint 1** | Project Foundation | React + Vite, Express.js, MySQL, REST API, project structure |
| **Sprint 2** | Authentication & Users | Register, login, JWT authentication, user profile |
| **Sprint 3** | Exam Information | Announcements, requirements, schedules, deadlines, notifications |
| **Sprint 4** | Learning Resources | Subjects, past papers, solutions, learning materials, search & filters |
| **Sprint 5** | Practice & Assessment | Quizzes, flashcards, practice questions, mock exams, scoring |
| **Sprint 6** | AI & Progress | AI study plans, progress tracking, weakness analysis, recommendations |
| **Sprint 7** | Mentorship | Teacher profiles, mentor search, contact / booking |
| **Sprint 8** | Testing & Deployment | Testing, bug fixing, security, performance, deployment |

---

# **8. Product Backlog**

The Product Backlog contains the features planned for PassKru. Items are prioritized based on their importance to the MVP.

| ID | Backlog Item | Priority | Sprint |
| --- | --- | --- | --- |
| **PB-01** | User registration & login | Must Have | 2 |
| **PB-02** | User profile | Must Have | 2 |
| **PB-03** | Exam requirements & eligibility | Must Have | 3 |
| **PB-04** | Examination schedule | Must Have | 3 |
| **PB-05** | Official announcements | Must Have | 3 |
| **PB-06** | Past examination papers | Must Have | 4 |
| **PB-07** | Answers & explanations | Must Have | 4 |
| **PB-08** | Subject & resource filtering | Should Have | 4 |
| **PB-09** | Practice questions | Must Have | 5 |
| **PB-10** | Quizzes | Must Have | 5 |
| **PB-11** | Flashcards | Should Have | 5 |
| **PB-12** | Mock examinations | Must Have | 5 |
| **PB-13** | Score & performance tracking | Must Have | 6 |
| **PB-14** | AI-generated study plan | Must Have | 6 |
| **PB-15** | Weakness analysis | Should Have | 6 |
| **PB-16** | Personalized recommendations | Should Have | 6 |
| **PB-17** | Teacher profiles | Could Have | 7 |
| **PB-18** | Mentor search & contact | Could Have | 7 |
| **PB-19** | Mentor booking | Could Have | 7 |
| **PB-20** | Deployment & production setup | Must Have | 8 |

---

# **9. User Stories**

| ID | User Story | Priority |
| --- | --- | --- |
| **US-01** | As a candidate, I want to create an account so that I can save my learning progress. | Must Have |
| **US-02** | As a candidate, I want to view examination requirements so that I know how to apply. | Must Have |
| **US-03** | As a candidate, I want to receive important exam updates so that I don't miss deadlines. | Must Have |
| **US-04** | As a candidate, I want to access previous exam papers so that I can practice real questions. | Must Have |
| **US-05** | As a candidate, I want to take quizzes and mock exams so that I can test my knowledge. | Must Have |
| **US-06** | As a candidate, I want to see my performance so that I know whether I am improving. | Must Have |
| **US-07** | As a candidate, I want an AI-generated study plan so that I know what to study and when. | Must Have |
| **US-08** | As a candidate, I want to know my weak topics so that I can focus on improving them. | Should Have |
| **US-09** | As a candidate, I want to find teachers or mentors so that I can get additional guidance. | Could Have |

---

# **10. Scrum Activities**

| Activity | When | Purpose |
| --- | --- | --- |
| **Sprint Planning** | Start of sprint | Select and plan backlog items |
| **Daily Stand-up** | Daily | Discuss progress, plans, and blockers |
| **Sprint Review** | End of sprint | Demonstrate completed work |
| **Sprint Retrospective** | End of sprint | Identify improvements for the next sprint |
| **Backlog Refinement** | During development | Review and prioritize upcoming work |

---

# **11. Definition of Done**

A feature is considered complete when:

- [ ]  Feature has been implemented
- [ ]  Frontend and backend are connected
- [ ]  Data is correctly stored in the database
- [ ]  Basic error handling is implemented
- [ ]  Feature has been tested
- [ ]  UI works on desktop and mobile
- [ ]  Code has been reviewed
- [ ]  Feature is merged into the main branch

---

# **12. MVP Scope**

The first version of PassKru will focus on solving the core problems before introducing additional features.

### **MVP**

- User registration & login
- Exam information hub
- Past papers & solutions
- Practice questions
- Mock exams
- Basic progress tracking
- AI-generated study plan

### **Post-MVP**

- Advanced AI recommendations
- Teacher/mentor marketplace
- Mentor booking
- Training center partnerships
- Advertisements
- Sponsored listings
- Additional learning features

---

# **13. Deployment**

| Component | Platform |
| --- | --- |
| **Frontend** | Vercel |
| **Backend** | Railway / Render |
| **Database** | Railway / Aiven |
| **File Storage** | Cloudinary / ImageKit |
| **Version Control** | GitHub |

---

# **14. Development Flow**

```
Planning & Design
       ↓
Foundation
       ↓
Authentication
       ↓
Exam Information
       ↓
Learning Resources
       ↓
Practice & Mock Exams
       ↓
AI & Progress Tracking
       ↓
Mentorship
       ↓
Testing
       ↓
Deployment
```

---

# **15. Project Goal**

PassKru aims to make National Teacher Examination preparation **more organized, accessible, personalized, and effective** by bringing reliable examination information, structured learning resources, interactive practice, AI-powered study guidance, progress tracking, and mentorship into one platform.
