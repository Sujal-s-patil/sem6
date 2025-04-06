# Criminal Record Management System (CRMS)

## **Aim**
The **Criminal Record Management System (CRMS)** aims to revolutionize the way law enforcement agencies handle crime-related data by modernizing and streamlining processes for better efficiency, security, and accessibility.

---

## **Abstract**
The CRMS is a **web-based application** designed to enhance crime reporting, investigation workflows, and record-keeping for police departments. By leveraging cutting-edge technology, it simplifies operations for law enforcement while empowering citizens to report incidents online.

---

## **Current Challenges**
Law enforcement agencies face several challenges with traditional systems:
- **Time-consuming manual processes** that hinder efficiency.
- **Inadequate system security**, leading to vulnerabilities.
- **Difficulty in retrieving old records**, slowing investigations.
- **Increased workload** for personnel due to outdated workflows.

---

## **Proposed Solutions**
To address these challenges, CRMS offers innovative solutions:
- An **online platform** for citizens to file complaints conveniently.
- A system for police officers to **manage and assign tickets** to team members.
- Progress tracking using intuitive boards (e.g., Kanban-style dashboards).

---

## **Technologies Used**

| Component          | Technology Used         |
|--------------------|-------------------------|
| **Language**       | JavaScript             |
| **Frontend Framework** | React.js           |
| **Backend Framework**  | Express.js         |
| **Database**       | MySQL                  |
| **Image Storage**  | Firebase (Google)      |

---

## **System Design**

### Key Design Features:
1. The **Frontend**, built with React.js, ensures a seamless user experience for both citizens and law enforcement personnel.
2. The **Backend**, powered by Express.js, handles API requests and communicates with the MySQL database for secure data storage and retrieval.
3. Integration of **Firebase** provides secure and scalable image storage capabilities.

![System Design](https://raw.githubusercontent.com/Sujal-s-patil/sem6/refs/heads/main/backend-main/system-design/Sys1png.png "System Design Diagram")

---

## **Required Software**

| Software  | Windows | Mac |
|-----------|------------------------|-------------------|
| Node.js   | [Download](https://nodejs.org/dist/v22.14.0/node-v22.14.0-x64.msi) | [Download](https://nodejs.org/dist/v22.14.0/node-v22.14.0.pkg) |
| MySQL     | [Download](https://dev.mysql.com/downloads/file/?id=536787)        | [Download](https://dev.mysql.com/downloads/mysql/) |
| VS Code   | [Download](https://code.visualstudio.com/sha/download?build=stable&os=win32-x64-user) | [Download](https://code.visualstudio.com/sha/download?build=stable&os=darwin-universal) |

---

## **Installation Steps**

Follow these simple steps to set up CRMS on your system:

1. Install the required software listed above.
2. Open a terminal in your desired directory.
3. Clone the repository from GitHub: ` git clone https://github.com/Sujal-s-patil/sem6.git `
4. Open ` MySql Installer → Add → Application → Workbench → Install `
5. Open MySQL Workbench, set up a connection, and execute (` ⚡︎ `) the SQL script located at: ` \backend-main\all.sql `
<<<<<<< HEAD
4. Navigate into each folder using: ` cd .\path\ `
=======
4. Now Open terminal and Navigate into each folder using: ` cd .\path\ `
>>>>>>> 281d18ef72e8816daee3312a4122a366e412506c
5. Install necessary npm packages: ` npm install `
6. Start the backend server: ` cd .\backend-main\ `
` node index `
7. Start the police frontend server: ` cd .\frontend-police-main\ `
` npm start `
8. Start the public frontend server: ` cd .\frontend-public-main\ `
` npm start `


Now your CRMS is up and running!

---

## Why Choose CRMS?
The Criminal Record Management System is designed to bring efficiency, transparency, and security to law enforcement agencies while empowering citizens with an easy-to-use platform for reporting crimes. Its modern design and robust technology stack ensure scalability and reliability.

---
